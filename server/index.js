import 'dotenv/config'
import { createHash } from 'node:crypto'
import express from 'express'
import mysql from 'mysql2/promise'
import process from 'node:process'

const app = express()
const port = Number(process.env.API_PORT || 3001)
const sourceLimit = 4096

const requiredSettings = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_DATABASE']
const missingSettings = requiredSettings.filter((name) => !process.env[name])
if (process.env.MYSQL_PASSWORD === undefined) missingSettings.push('MYSQL_PASSWORD')
if (missingSettings.length) {
  throw new Error(`Missing MySQL environment settings: ${missingSettings.join(', ')}`)
}

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 5,
})

console.log("Connected to MySQL database:", process.env.MYSQL_DATABASE, "on", process.env.MYSQL_HOST, "as user", process.env.MYSQL_USER)

app.use(express.json({ limit: '128kb' }))

app.get('/api/custom-code', async (_request, response) => {
  try {
    const [rows] = await pool.execute('SELECT code_id, code FROM code ORDER BY code_id DESC')
    response.json({ codes: rows.map(({ code_id, code }) => ({ code_id, code })) })
  } catch (error) {
    console.error('Failed to load custom code from MySQL:', error)
    response.status(500).json({ error: 'Unable to load saved code from MySQL.' })
  }
})

app.post('/api/custom-code', async (request, response) => {
  const { source } = request.body ?? {}
  if (typeof source !== 'string') {
    response.status(400).json({ error: 'The source field must be a string.' })
    return
  }
  if ([...source].length > sourceLimit) {
    response.status(413).json({ error: `Source code must be at most ${sourceLimit} characters.` })
    return
  }

  let connection
  let lockAcquired = false
  try {
    connection = await pool.getConnection()
    const lockName = createHash('sha256').update(source).digest('hex')
    const [lockRows] = await connection.execute('SELECT GET_LOCK(?, 5) AS acquired', [lockName])
    if (lockRows[0]?.acquired !== 1) {
      response.status(503).json({ error: 'Could not check for duplicate code. Please try again.' })
      return
    }
    lockAcquired = true

    const [existing] = await connection.execute(
      'SELECT code_id FROM code WHERE BINARY code = BINARY ? ORDER BY code_id DESC LIMIT 1',
      [source],
    )
    if (existing.length) {
      response.status(409).json({ duplicate: true, code_id: existing[0].code_id })
      return
    }

    const [result] = await connection.execute('INSERT INTO code (code) VALUES (?)', [source])
    response.status(201).json({ saved: true, code_id: result.insertId })
  } catch (error) {
    console.error('Failed to save custom code as a new MySQL entry:', error)
    response.status(500).json({ error: 'Unable to save code to MySQL.' })
  } finally {
    if (connection) {
      if (lockAcquired) {
        try {
          await connection.execute('SELECT RELEASE_LOCK(?)', [createHash('sha256').update(source).digest('hex')])
        } catch (error) {
          console.error('Failed to release custom-code duplicate lock:', error)
        }
      }
      connection.release()
    }
  }
})

async function start() {
  const [columns] = await pool.execute(
    `SELECT CHARACTER_MAXIMUM_LENGTH, CHARACTER_SET_NAME, COLLATION_NAME,
            IS_NULLABLE, COLUMN_DEFAULT
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'code' AND COLUMN_NAME = 'code'`,
  )
  const codeColumn = columns[0]
  if (!codeColumn) throw new Error('The codevision.code table must contain a code column.')
  if (codeColumn.CHARACTER_MAXIMUM_LENGTH < sourceLimit) {
    const charset = codeColumn.CHARACTER_SET_NAME
    const collation = codeColumn.COLLATION_NAME
    if (!/^[A-Za-z0-9_]+$/.test(charset) || !/^[A-Za-z0-9_]+$/.test(collation)) {
      throw new Error('Unable to safely preserve the existing code column character set.')
    }
    const nullable = codeColumn.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'
    const defaultValue = codeColumn.COLUMN_DEFAULT === null
      ? (codeColumn.IS_NULLABLE === 'YES' ? ' DEFAULT NULL' : '')
      : ` DEFAULT ${pool.escape(codeColumn.COLUMN_DEFAULT)}`
    await pool.execute(
      `ALTER TABLE code MODIFY COLUMN code VARCHAR(${sourceLimit})
       CHARACTER SET ${charset} COLLATE ${collation} ${nullable}${defaultValue}`,
    )
  }
  await pool.execute('SELECT code_id, code FROM code LIMIT 0')
  app.listen(port, () => {
    console.log(`Custom-code API listening on http://localhost:${port}`)
  })
}

start().catch((error) => {
  console.error('Unable to start the custom-code API:', error)
  process.exitCode = 1
})
