const starterCode = `// Edit this C-like program, then step through its operations.
void main(void) {
    insertEnd(&head, 10);
    insertEnd(&head, 20);
    insertEnd(&head, 30);
    deleteFront(&head);
}`

function stripComments(source) {
  let output = ''
  let state = 'code'
  let quote = ''

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    const next = source[index + 1]

    if (state === 'line-comment') {
      if (character === '\n') {
        output += '\n'
        state = 'code'
      } else {
        output += ' '
      }
      continue
    }
    if (state === 'block-comment') {
      if (character === '*' && next === '/') {
        output += '  '
        index += 1
        state = 'code'
      } else {
        output += character === '\n' ? '\n' : ' '
      }
      continue
    }
    if (state === 'string') {
      output += character
      if (character === '\\') {
        output += next ?? ''
        index += 1
      } else if (character === quote) {
        state = 'code'
      }
      continue
    }
    if (character === '/' && next === '/') {
      output += '  '
      index += 1
      state = 'line-comment'
    } else if (character === '/' && next === '*') {
      output += '  '
      index += 1
      state = 'block-comment'
    } else if (character === '"' || character === "'") {
      output += character
      quote = character
      state = 'string'
    } else {
      output += character
    }
  }
  return output
}

function findMainBody(source) {
  const main = /\bmain\s*\([^)]*\)\s*\{/m.exec(source)
  if (!main) return null

  const openingBrace = main.index + main[0].lastIndexOf('{')
  let depth = 1
  let quote = ''
  for (let index = openingBrace + 1; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (character === '\\') index += 1
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '{') depth += 1
    if (character === '}') {
      depth -= 1
      if (depth === 0) return { start: openingBrace + 1, end: index }
    }
  }
  return { start: openingBrace + 1, end: source.length }
}

function splitStatements(source, offset = 0) {
  const statements = []
  let start = 0
  let parentheses = 0
  let quote = ''

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index]
    if (quote) {
      if (character === '\\') index += 1
      else if (character === quote) quote = ''
      continue
    }
    if (character === '"' || character === "'") {
      quote = character
      continue
    }
    if (character === '(') parentheses += 1
    if (character === ')') parentheses = Math.max(0, parentheses - 1)
    if (character === ';' && parentheses === 0) {
      const text = source.slice(start, index + 1).trim()
      if (text) {
        const line = source.slice(0, start).split('\n').length - 1
        statements.push({ text, line: source.slice(0, offset).split('\n').length - 1 + line })
      }
      start = index + 1
    }
  }
  return statements
}

function getProgramStatements(source) {
  const uncommented = stripComments(source)
  const mainBody = findMainBody(uncommented)
  const start = mainBody?.start ?? 0
  const end = mainBody?.end ?? uncommented.length
  return splitStatements(uncommented.slice(start, end), start)
}

function inferKind(source) {
  if (/\b(queue|enqueue|dequeue|circularqueue)\b/i.test(source)) return 'queue'
  if (/\b(linked.?list|list|node|insertEnd|insertFront|deleteFront|removeFront|addNode)\b/i.test(source)) return 'linked-list'
  if (/\b(stack|push|pop)\b/i.test(source)) return 'stack'
  return 'array'
}

function parseValue(value) {
  const trimmed = value.trim()
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (/^(true|false|null|NULL)$/i.test(trimmed)) return trimmed.toLowerCase() === 'true' ? 'true' : trimmed.toLowerCase() === 'false' ? 'false' : null
  const quoted = trimmed.match(/^(['"])(.*)\1$/)
  if (quoted) return quoted[2]
  return trimmed.replace(/^[&*]+\s*/, '') || '?'
}

function operationCalls(statement) {
  const calls = []
  const pattern = /(?:->|\.)?\s*([A-Za-z_$][\w$]*)\s*\(([^()]*)\)/g
  for (const match of statement.matchAll(pattern)) {
    const name = match[1]
    if (/^(if|while|for|switch|sizeof|main|printf|scanf|malloc|free|return)$/i.test(name)) continue
    if (/^(push(?:_\w+)?|pop(?:_\w+)?|enqueue|dequeue|insert\w*|delete\w*|remove\w*|append\w*|add\w*|extract\w*|erase\w*)$/i.test(name)) {
      calls.push({ name, args: match[2].split(',').map((argument) => argument.trim()).filter(Boolean) })
    }
  }
  return calls
}

function makeFrame(code, line, title, description, values, kind) {
  const pointers = kind === 'queue'
    ? { front: values.length ? 0 : null, rear: values.length ? values.length - 1 : null }
    : kind === 'stack'
      ? { top: values.length - 1 }
      : kind === 'linked-list'
        ? { head: values.length ? 0 : null, tail: values.length ? values.length - 1 : null }
        : {}
  return { line, title, description, values: [...values], pointers }
}

export function createCustomTrace(source) {
  const code = source.split(/\r?\n/)
  const kind = inferKind(source)
  const values = []
  const frames = [makeFrame(code, -1, 'Ready to trace', 'Step through the statements in main() to watch the structure change.', values, kind)]
  const statements = getProgramStatements(source)

  for (const { text, line } of statements) {
    if (text.startsWith('#') || /^(?:else\s*)?\{\s*$/.test(text)) continue
    const arrayInitializer = text.match(/=\s*\{\s*([^}]*)\}/)
    if (arrayInitializer) {
      values.splice(0, values.length, ...arrayInitializer[1].split(',').map(parseValue).filter((value) => value !== null))
      frames.push(makeFrame(code, line, 'Initialize values', `The collection starts with ${values.length} value${values.length === 1 ? '' : 's'}.`, values, kind))
      continue
    }

    const calls = operationCalls(text)
    if (calls.length) {
      for (const { name, args } of calls) {
        const lowerName = name.toLowerCase()
        const removes = /^(pop|dequeue|delete|remove|extract)/.test(lowerName)
        if (removes) {
          const fromFront = kind === 'queue' || /front|first|begin/.test(lowerName)
          const removed = fromFront ? values.shift() : values.pop()
          frames.push(makeFrame(
            code,
            line,
            `${name}()${removed === undefined ? '' : ` — ${removed}`}`,
            removed === undefined ? 'The structure is empty, so there is no value to remove.' : `${removed} is removed from the ${fromFront ? 'front' : 'end'} of the structure.`,
            values,
            kind,
          ))
        } else {
          const value = parseValue(args.at(-1) ?? '?')
          const atFront = /front|first|begin/.test(lowerName)
          if (atFront) values.unshift(value)
          else values.push(value)
          frames.push(makeFrame(
            code,
            line,
            `${name} ${value}`,
            `${value} is added ${atFront ? 'at the front' : 'to the end'} of the ${kind === 'linked-list' ? 'list' : kind}.`,
            values,
            kind,
          ))
        }
      }
      continue
    }

    const assignment = text.match(/\b([A-Za-z_$]\w*)\s*\[\s*(\d+)\s*\]\s*=\s*(.+?)\s*;?$/)
    if (assignment) {
      const index = Number(assignment[2])
      while (values.length <= index) values.push(null)
      values[index] = parseValue(assignment[3].replace(/;$/, ''))
      frames.push(makeFrame(code, line, `Set item ${index}`, `The value at index ${index} is updated.`, values, kind))
      continue
    }

    if (!/^(?:if|else|while|for|switch)\b/.test(text)) {
      frames.push(makeFrame(code, line, `Step through line ${line + 1}`, text.replace(/;$/, '').trim(), values, kind))
    }
  }

  if (frames.length === 1) {
    return { code, kind, frames, error: 'No traceable statements found. Add operation calls such as push(5), enqueue(5), insertEnd(&head, 5), or pop().' }
  }

  return { code, kind, frames, error: '' }
}

export { starterCode }
