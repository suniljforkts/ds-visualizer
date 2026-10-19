import { useEffect, useMemo, useRef, useState } from 'react'
import '../App.css'
import { createCustomTrace, starterCode } from '../utils/customTrace.js'
import Header from './Header.jsx'
import { Icon } from './Icon.jsx'
import Editor from './Editor.jsx'
import Visualizer from './Visualizer.jsx'

const stackCode = [
  '#include <stdio.h>',
  '#define CAPACITY 5',
  '',
  'int stack[CAPACITY];',
  'int top = -1;',
  '',
  'void push(int value) {',
  '    if (top == CAPACITY - 1) return;',
  '    stack[++top] = value;',
  '}',
  '',
  'int pop(void) {',
  '    if (top == -1) return -1;',
  '    return stack[top--];',
  '}',
  '',
  'int main(void) {',
  '    push(10);',
  '    push(20);',
  '    push(30);',
  '    pop();',
  '    return 0;',
  '}',
]

const queueCode = [
  '#include <stdio.h>',
  '#define CAPACITY 5',
  '',
  'int queue[CAPACITY];',
  'int front = 0;',
  'int rear = -1;',
  '',
  'void enqueue(int value) {',
  '    if (rear == CAPACITY - 1) return;',
  '    queue[++rear] = value;',
  '}',
  '',
  'int dequeue(void) {',
  '    if (front > rear) return -1;',
  '    return queue[front++];',
  '}',
  '',
  'int main(void) {',
  '    enqueue(10);',
  '    enqueue(20);',
  '    enqueue(30);',
  '    dequeue();',
  '    return 0;',
  '}',
]

const linkedListCode = [
  '#include <stdlib.h>',
  '',
  'typedef struct Node {',
  '    int value;',
  '    struct Node *next;',
  '} Node;',
  '',
  'void insertEnd(Node **head, int value) {',
  '    Node *node = malloc(sizeof(Node));',
  '    node->value = value;',
  '    node->next = NULL;',
  '    if (*head == NULL) { *head = node; return; }',
  '    Node *current = *head;',
  '    while (current->next != NULL) current = current->next;',
  '    current->next = node;',
  '}',
  '',
  'void deleteFront(Node **head) {',
  '    if (*head == NULL) return;',
  '    Node *oldHead = *head;',
  '    *head = oldHead->next;',
  '    free(oldHead);',
  '}',
  '',
  'int main(void) {',
  '    Node *head = NULL;',
  '    insertEnd(&head, 10);',
  '    insertEnd(&head, 20);',
  '    insertEnd(&head, 30);',
  '    deleteFront(&head);',
  '    return 0;',
  '}',
]

const circularQueueCode = [
  '#include <stdio.h>',
  '#define CAPACITY 4',
  '',
  'int queue[CAPACITY];',
  'int front = 0, rear = -1, count = 0;',
  '',
  'void enqueue(int value) {',
  '    if (count == CAPACITY) return;',
  '    rear = (rear + 1) % CAPACITY;',
  '    queue[rear] = value;',
  '    count++;',
  '}',
  '',
  'int dequeue(void) {',
  '    if (count == 0) return -1;',
  '    int value = queue[front];',
  '    queue[front] = 0;',
  '    front = (front + 1) % CAPACITY;',
  '    count--;',
  '    return value;',
  '}',
  '',
  'int main(void) {',
  '    enqueue(10); enqueue(20); enqueue(30);',
  '    dequeue();',
  '    enqueue(40);',
  '    dequeue(); dequeue();',
  '    enqueue(50);',
  '    return 0;',
  '}',
]

const circularListCode = [
  '#include <stdlib.h>',
  '',
  'typedef struct Node {',
  '    int value;',
  '    struct Node *next;',
  '} Node;',
  '',
  'Node *insertEnd(Node *tail, int value) {',
  '    Node *node = malloc(sizeof(Node));',
  '    node->value = value;',
  '    if (tail == NULL) {',
  '        node->next = node;',
  '        return node;',
  '    }',
  '    node->next = tail->next;',
  '    tail->next = node;',
  '    return node;',
  '}',
  '',
  'Node *deleteFront(Node *tail) {',
  '    if (tail == NULL) return NULL;',
  '    Node *head = tail->next;',
  '    if (head == tail) { free(head); return NULL; }',
  '    tail->next = head->next;',
  '    free(head);',
  '    return tail;',
  '}',
  '',
  'int main(void) {',
  '    Node *tail = NULL;',
  '    tail = insertEnd(tail, 10);',
  '    tail = insertEnd(tail, 20);',
  '    tail = insertEnd(tail, 30);',
  '    tail = deleteFront(tail);',
  '    return 0;',
  '}',
]

const binaryTreeCode = [
  '#include <stdlib.h>',
  '',
  'typedef struct Node {',
  '    int value;',
  '    struct Node *left, *right;',
  '} Node;',
  '',
  'Node *insert(Node *root, int value) {',
  '    if (root == NULL) return newNode(value);',
  '    if (value < root->value)',
  '        root->left = insert(root->left, value);',
  '    else if (value > root->value)',
  '        root->right = insert(root->right, value);',
  '    return root;',
  '}',
  '',
  'Node *deleteNode(Node *root, int value) {',
  '    if (root == NULL) return root;',
  '    if (value < root->value)',
  '        root->left = deleteNode(root->left, value);',
  '    else if (value > root->value)',
  '        root->right = deleteNode(root->right, value);',
  '    else if (root->left == NULL) return root->right;',
  '    else if (root->right == NULL) return root->left;',
  '    else {',
  '        Node *successor = minValueNode(root->right);',
  '        root->value = successor->value;',
  '        root->right = deleteNode(root->right, successor->value);',
  '    }',
  '    return root;',
  '}',
  '',
  'int main(void) {',
  '    Node *root = NULL;',
  '    root = insert(root, 50);',
  '    root = insert(root, 30);',
  '    root = insert(root, 70);',
  '    root = insert(root, 20);',
  '    root = insert(root, 40);',
  '    root = insert(root, 60);',
  '    root = insert(root, 80);',
  '    root = deleteNode(root, 30);',
  '    return 0;',
  '}',
]

function lineNumber(code, text) {
  return code.findIndex((line) => line.includes(text))
}

function createFrame(code, match, title, description, values, pointers = {}) {
  return {
    line: lineNumber(code, match),
    title,
    description,
    values,
    pointers,
  }
}

function makeLinearFrames(code, type) {
  const frames = []
  const isStack = type === 'stack'
  let values = []
  const queueSlots = Array(5).fill(null)
  let queueFront = 0
  let queueRear = -1
  const snapshot = () => isStack
    ? { values: [...values], pointers: { top: values.length - 1 } }
    : { values: [...queueSlots], pointers: { front: queueFront, rear: queueRear } }
  const operations = isStack
    ? [
        { call: 'push(10)', action: 'push', value: 10, active: 'stack[++top]' },
        { call: 'push(20)', action: 'push', value: 20, active: 'stack[++top]' },
        { call: 'push(30)', action: 'push', value: 30, active: 'stack[++top]' },
        { call: 'pop();', action: 'pop', value: null, active: 'return stack[top--]' },
      ]
    : [
        { call: 'enqueue(10)', action: 'enqueue', value: 10, active: 'queue[++rear]' },
        { call: 'enqueue(20)', action: 'enqueue', value: 20, active: 'queue[++rear]' },
        { call: 'enqueue(30)', action: 'enqueue', value: 30, active: 'queue[++rear]' },
        { call: 'dequeue();', action: 'dequeue', value: null, active: 'return queue[front++]' },
      ]

  const initial = snapshot()
  frames.push(createFrame(
    code,
    isStack ? 'int top = -1' : 'int rear = -1',
    'Ready to run',
    isStack ? 'The stack is empty. top starts at -1, just below the first slot.' : 'The queue is empty. front starts at 0 and rear starts before the first slot.',
    initial.values,
    initial.pointers,
  ))

  for (const operation of operations) {
    const isInsert = operation.action === 'push' || operation.action === 'enqueue'
    const name = isStack ? (isInsert ? 'Push' : 'Pop') : (isInsert ? 'Enqueue' : 'Dequeue')
    const before = snapshot()
    frames.push(createFrame(
      code,
      operation.call,
      `${name} ${isInsert ? operation.value : values[0] ?? values.at(-1) ?? ''}`.trim(),
      `Execution enters ${operation.action} from main().`,
      before.values,
      before.pointers,
    ))
    const check = snapshot()
    frames.push(createFrame(
      code,
      isStack ? 'if (top ==' : (isInsert ? 'if (rear ==' : 'if (front >'),
      'Check boundary',
      isStack
        ? 'Check that the stack still has room before writing.'
        : isInsert
          ? 'Check that the rear has not reached the final array slot.'
          : 'Check that at least one queued value remains.',
      check.values,
      check.pointers,
    ))

    if (isInsert) {
      values = [...values, operation.value]
      if (!isStack) {
        queueRear += 1
        queueSlots[queueRear] = operation.value
      }
      const after = snapshot()
      frames.push(createFrame(
        code,
        operation.active,
        `${name} ${operation.value}`,
        isStack
          ? `${operation.value} is written into the next slot; top moves up to the new item.`
          : `${operation.value} is written after the current rear; the queue grows at the back.`,
        after.values,
        after.pointers,
      ))
    } else {
      const removed = isStack ? values.at(-1) : values[0]
      values = isStack ? values.slice(0, -1) : values.slice(1)
      if (!isStack) {
        queueSlots[queueFront] = null
        queueFront += 1
      }
      const after = snapshot()
      frames.push(createFrame(
        code,
        operation.active,
        `${name} ${removed}`,
        isStack
          ? `${removed} leaves from the top. The next item becomes the new top.`
          : `${removed} leaves from the front. The next item is now first in line.`,
        after.values,
        after.pointers,
      ))
    }
  }

  return frames
}

function makeLinkedListFrames(code, circular = false) {
  const frames = []
  let values = []
  const insertCalls = circular ? ['tail = insertEnd(tail, 10)', 'tail = insertEnd(tail, 20)', 'tail = insertEnd(tail, 30)'] : ['insertEnd(&head, 10)', 'insertEnd(&head, 20)', 'insertEnd(&head, 30)']
  const insertActive = circular ? ['node->next = node', 'tail->next = node', 'tail->next = node'] : ['*head = node', 'current->next = node', 'current->next = node']

  frames.push(createFrame(
    code,
    circular ? 'Node *insertEnd' : 'void insertEnd',
    'Ready to run',
    circular ? 'tail is NULL. The first node will point back to itself.' : 'head is NULL. The first node will become the list head.',
    values,
    circular ? { head: null, tail: null } : { head: null },
  ))

  for (let index = 0; index < insertCalls.length; index += 1) {
    const value = (index + 1) * 10
    const isFirst = values.length === 0
    frames.push(createFrame(
      code,
      insertCalls[index],
      `Insert ${value}`,
      'main() calls insertEnd to add a newly allocated node.',
      values,
      circular ? { head: values.length ? 0 : null, tail: values.length - 1 } : { head: values.length ? 0 : null },
    ))
    frames.push(createFrame(code, 'malloc(sizeof(Node))', 'Allocate a node', 'Reserve memory for the new node.', values, circular ? { head: values.length ? 0 : null, tail: values.length - 1 } : { head: values.length ? 0 : null }))
    frames.push(createFrame(code, 'node->value = value', `Set value to ${value}`, `Store ${value} in the new node.`, values, circular ? { head: values.length ? 0 : null, tail: values.length - 1 } : { head: values.length ? 0 : null }))
    if (circular && isFirst) {
      frames.push(createFrame(code, 'if (tail == NULL)', 'First node check', 'There is no tail yet, so initialize a one-node circle.', values, { head: null, tail: null }))
      values = [value]
      frames.push(createFrame(code, 'node->next = node', 'Close the circle', 'The first node points to itself. Both head and tail refer to this node.', values, { head: 0, tail: 0 }))
    } else if (!circular && isFirst) {
      frames.push(createFrame(code, 'if (*head == NULL)', 'Empty list check', 'The head is NULL, so this node becomes the first node.', values, { head: null }))
      values = [value]
      frames.push(createFrame(code, '*head = node', 'Set the head', `${value} is now the first node in the list.`, values, { head: 0 }))
    } else if (circular) {
      frames.push(createFrame(code, 'node->next = tail->next', 'Link to the head', 'The new node points to the current head to preserve the loop.', values, { head: 0, tail: values.length - 1 }))
      values = [...values, value]
      frames.push(createFrame(code, insertActive[index], 'Append at the tail', `${value} is linked after the old tail; it becomes the new tail.`, values, { head: 0, tail: values.length - 1 }))
    } else {
      frames.push(createFrame(code, 'while (current->next', 'Find the tail', 'Walk next pointers until the last node is reached.', values, { head: 0 }))
      values = [...values, value]
      frames.push(createFrame(code, insertActive[index], 'Append at the tail', `${value} is linked after the current last node.`, values, { head: 0 }))
    }
  }

  frames.push(createFrame(
    code,
    circular ? 'tail = deleteFront(tail);' : 'deleteFront(&head);',
    'Delete the front node',
    'main() calls deleteFront to remove the first value.',
    values,
    circular ? { head: 0, tail: values.length - 1 } : { head: values.length ? 0 : null },
  ))
  frames.push(createFrame(
    code,
    circular ? 'Node *head = tail->next' : 'Node *oldHead = *head',
    'Locate the head',
    circular ? 'The head is the node immediately after tail.' : 'Keep a reference to the current head before unlinking it.',
    values,
    circular ? { head: 0, tail: values.length - 1 } : { head: 0 },
  ))
  values = values.slice(1)
  frames.push(createFrame(
    code,
    circular ? 'tail->next = head->next' : '*head = oldHead->next',
    'Unlink the head',
    circular
      ? 'tail now points to the second node, closing the circle around the remaining nodes.'
      : 'head advances to the second node. The remaining list stays connected.',
    values,
    circular ? { head: values.length ? 0 : null, tail: values.length - 1 } : { head: values.length ? 0 : null },
  ))
  frames.push(createFrame(
    code,
    circular ? 'free(head)' : 'free(oldHead)',
    'Release the node',
    'The removed node is freed. The list now contains only the remaining values.',
    values,
    circular ? { head: values.length ? 0 : null, tail: values.length - 1 } : { head: values.length ? 0 : null },
  ))
  return frames
}

function makeCircularQueueFrames(code) {
  const frames = []
  const capacity = 4
  let values = Array(capacity).fill(null)
  let front = 0
  let rear = -1
  let count = 0

  frames.push(createFrame(code, 'int front = 0', 'Ready to run', 'The ring has four empty slots. front is 0, rear is -1, and count is 0.', values, { front, rear, count }))

  const enqueue = (value, mainCall) => {
    frames.push(createFrame(code, mainCall, `Enqueue ${value}`, 'main() calls enqueue to add a value at the rear.', values, { front, rear, count }))
    frames.push(createFrame(code, 'if (count == CAPACITY)', 'Check capacity', 'There is room in the ring because count is less than CAPACITY.', values, { front, rear, count }))
    rear = (rear + 1) % capacity
    frames.push(createFrame(code, 'rear = (rear + 1)', 'Advance rear', `rear wraps with modulo arithmetic to slot ${rear}.`, values, { front, rear, count }))
    values = values.map((item, index) => index === rear ? value : item)
    frames.push(createFrame(code, 'queue[rear] = value', `Write ${value}`, `${value} is stored at slot ${rear}.`, values, { front, rear, count }))
    count += 1
    frames.push(createFrame(code, 'count++;', 'Update count', `There are now ${count} value${count === 1 ? '' : 's'} in the circular queue.`, values, { front, rear, count }))
  }

  const dequeue = (mainCall) => {
    const removed = values[front]
    frames.push(createFrame(code, mainCall, `Dequeue ${removed}`, 'main() removes the value at the front.', values, { front, rear, count }))
    frames.push(createFrame(code, 'if (count == 0)', 'Check empty', 'The queue contains values, so it is safe to remove the front item.', values, { front, rear, count }))
    frames.push(createFrame(code, 'int value = queue[front]', `Read ${removed}`, `${removed} is captured before its slot is cleared.`, values, { front, rear, count }))
    values = values.map((item, index) => index === front ? null : item)
    frames.push(createFrame(code, 'queue[front] = 0', 'Clear the slot', `Slot ${front} is available again.`, values, { front, rear, count }))
    front = (front + 1) % capacity
    frames.push(createFrame(code, 'front = (front + 1)', 'Advance front', `front wraps with modulo arithmetic to slot ${front}.`, values, { front, rear, count }))
    count -= 1
    frames.push(createFrame(code, 'count--;', 'Update count', `There are now ${count} value${count === 1 ? '' : 's'} in the circular queue.`, values, { front, rear, count }))
  }

  enqueue(10, 'enqueue(10); enqueue(20); enqueue(30);')
  enqueue(20, 'enqueue(10); enqueue(20); enqueue(30);')
  enqueue(30, 'enqueue(10); enqueue(20); enqueue(30);')
  dequeue('dequeue();')
  enqueue(40, 'enqueue(40);')
  dequeue('dequeue(); dequeue();')
  dequeue('dequeue(); dequeue();')
  enqueue(50, 'enqueue(50);')
  return frames
}

function makeBinaryTreeFrames(code) {
  const frames = []
  let root = null

  const cloneTree = (node) => node
    ? { value: node.value, left: cloneTree(node.left), right: cloneTree(node.right) }
    : null
  const inOrderValues = (node) => node
    ? [...inOrderValues(node.left), node.value, ...inOrderValues(node.right)]
    : []
  const addFrame = (match, title, description, highlighted = []) => {
    const frame = createFrame(code, match, title, description, inOrderValues(root))
    frames.push({ ...frame, tree: cloneTree(root), highlighted })
  }

  addFrame('Node *root = NULL', 'Ready to run', 'The binary search tree is empty. Smaller values go left; larger values go right.')

  const insert = (value) => {
    addFrame(`root = insert(root, ${value})`, `Insert ${value}`, `main() calls insert to place ${value} in its ordered position.`)
    if (!root) {
      addFrame('if (root == NULL)', 'Find empty position', 'The root is NULL, so this value becomes the root.')
      root = { value, left: null, right: null }
      addFrame('return newNode(value)', `Create node ${value}`, `${value} is stored in the new root node.`, [value])
      return
    }

    let current = root
    while (true) {
      addFrame('if (value < root->value)', `Compare ${value} with ${current.value}`, `${value} is ${value < current.value ? 'smaller' : 'larger'} than ${current.value}; follow the ${value < current.value ? 'left' : 'right'} branch.`, [current.value])
      const direction = value < current.value ? 'left' : 'right'
      if (!current[direction]) {
        addFrame(`root->${direction} = insert(root->${direction}, value)`, `Find empty ${direction} child`, `The ${direction} child of ${current.value} is empty, so ${value} can be inserted here.`, [current.value])
        current[direction] = { value, left: null, right: null }
        addFrame('return root;', `Insert ${value}`, `${value} is now linked as the ${direction} child of ${current.value}.`, [value])
        return
      }
      current = current[direction]
    }
  }

  ;[50, 30, 70, 20, 40, 60, 80].forEach(insert)

  addFrame('root = deleteNode(root, 30)', 'Delete 30', 'main() calls deleteNode to remove 30 while preserving the search-tree ordering.')
  let target = root
  while (target && target.value !== 30) {
    const direction = 30 < target.value ? 'left' : 'right'
    addFrame(`if (value ${direction === 'left' ? '<' : '>'} root->value)`, `Search for 30`, `Compare 30 with ${target.value} and move ${direction}.`, [target.value])
    target = target[direction]
  }

  addFrame('else {', 'Found 30', 'This node has two children, so replace it with its in-order successor.')
  let successor = target.right
  while (successor.left) successor = successor.left
  addFrame('Node *successor = minValueNode(root->right)', `Find successor ${successor.value}`, `${successor.value} is the smallest value in the right subtree.`, [30, successor.value])
  target.value = successor.value
  addFrame('root->value = successor->value', `Replace 30 with ${successor.value}`, `Copy ${successor.value} into the deleted node's position.`, [successor.value])
  const removeSuccessor = (node, value) => {
    if (value < node.value) node.left = removeSuccessor(node.left, value)
    else if (value > node.value) node.right = removeSuccessor(node.right, value)
    else return node.right
    return node
  }
  target.right = removeSuccessor(target.right, successor.value)
  addFrame('root->right = deleteNode(root->right, successor->value)', `Remove duplicate ${successor.value}`, `Remove the successor from its old position. The tree now contains ${inOrderValues(root).length} nodes.`, [successor.value])

  return frames
}

const structures = [
  { id: 'stack', name: 'Stack', category: 'LINEAR', description: 'Last in, first out', code: stackCode, frames: makeLinearFrames(stackCode, 'stack'), shape: 'stack', complexity: 'O(1)' },
  { id: 'queue', name: 'Queue', category: 'LINEAR', description: 'First in, first out', code: queueCode, frames: makeLinearFrames(queueCode, 'queue'), shape: 'queue', complexity: 'O(1)' },
  { id: 'linked-list', name: 'Linked List', category: 'LINKED', description: 'A chain of connected nodes', code: linkedListCode, frames: makeLinkedListFrames(linkedListCode), shape: 'linked-list', complexity: 'O(n)' },
  { id: 'circular-queue', name: 'Circular Queue', category: 'CIRCULAR', description: 'A queue backed by a circular buffer', code: circularQueueCode, frames: makeCircularQueueFrames(circularQueueCode), shape: 'circular-queue', complexity: 'O(1)' },
  { id: 'circular-linked-list', name: 'Circular Linked List', category: 'CIRCULAR', description: 'A linked list that loops back to its head', code: circularListCode, frames: makeLinkedListFrames(circularListCode, true), shape: 'circular-linked-list', complexity: 'O(n)' },
  { id: 'binary-tree', name: 'Binary Tree', category: 'TREES', description: 'A binary search tree with ordered insert and delete', code: binaryTreeCode, frames: makeBinaryTreeFrames(binaryTreeCode), shape: 'binary-tree', complexity: 'O(log n) average' },
]

function App() {
  const [selectedId, setSelectedId] = useState('stack')
  const [step, setStep] = useState(0)
  const [customSource, setCustomSource] = useState(starterCode)
  const [customCodeLoaded, setCustomCodeLoaded] = useState(false)
  const [savedCodes, setSavedCodes] = useState([])
  const [selectedCodeId, setSelectedCodeId] = useState(null)
  const [customCodeDirty, setCustomCodeDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState({ state: 'loading', message: 'Loading saved code…' })
  const saveQueue = useRef(Promise.resolve())
  const latestSource = useRef(customSource)
  const latestCodeId = useRef(null)
  const customCodeTouched = useRef(false)

  useEffect(() => {
    let active = true
    fetch('/api/custom-code')
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || 'Unable to load saved code from MySQL.')
        return body
      })
      .then(({ codes }) => {
        if (!active) return
        const latestCode = codes[0] ?? null
        setSavedCodes(codes)
        if (latestCode && !customCodeTouched.current) {
          latestSource.current = latestCode.code
          latestCodeId.current = latestCode.code_id
          setSelectedCodeId(latestCode.code_id)
          setCustomSource(latestCode.code)
        }
        setCustomCodeLoaded(true)
        setSaveStatus(latestCode
          ? { state: 'saved', message: `Loaded code #${latestCode.code_id}` }
          : { state: 'saved', message: 'New code · not saved' })
      })
      .catch((error) => {
        if (!active) return
        setCustomCodeLoaded(true)
        setSaveStatus({ state: 'error', message: error.message })
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!customCodeLoaded || !customCodeDirty) return undefined
    const sourceToSave = customSource
    const codeIdAtSchedule = selectedCodeId
    const timeout = window.setTimeout(() => {
      if ([...sourceToSave].length > 4096) {
        setSaveStatus({ state: 'error', message: 'Code exceeds the 4,096-character MySQL limit.' })
        return
      }
      setSaveStatus({ state: 'saving', message: 'Saving to MySQL…' })
      saveQueue.current = saveQueue.current
        .then(async () => {
          if (latestSource.current !== sourceToSave || latestCodeId.current !== codeIdAtSchedule) return
          const response = await fetch('/api/custom-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ source: sourceToSave }),
          })
          const body = await response.json()
          if (response.ok) {
            setSavedCodes((codes) => [
              { code_id: body.code_id, code: sourceToSave },
              ...codes.filter((code) => code.code_id !== body.code_id),
            ].sort((left, right) => right.code_id - left.code_id))
          }
          if (response.status === 409 && body.duplicate) {
            if (latestSource.current === sourceToSave && latestCodeId.current === codeIdAtSchedule) {
              const duplicateId = Number(body.code_id)
              latestCodeId.current = duplicateId
              setSelectedCodeId(duplicateId)
              setCustomCodeDirty(false)
              setSaveStatus({ state: 'duplicate', message: `Duplicate of code #${duplicateId}` })
              window.alert(`This code already exists as Code #${duplicateId}. It was not saved again.`)
            }
            return
          }
          if (!response.ok) throw new Error(body.error || 'Unable to save code to MySQL.')
          if (latestSource.current === sourceToSave && latestCodeId.current === codeIdAtSchedule) {
            latestCodeId.current = body.code_id
            setSelectedCodeId(body.code_id)
            setCustomCodeDirty(false)
            setSaveStatus({ state: 'saved', message: `Saved code #${body.code_id}` })
          }
        })
        .catch((error) => {
          if (latestSource.current === sourceToSave && latestCodeId.current === codeIdAtSchedule) {
            setSaveStatus({ state: 'error', message: error.message })
          }
        })
    }, 500)
    return () => window.clearTimeout(timeout)
  }, [customCodeDirty, customCodeLoaded, customSource, selectedCodeId])

  const customTrace = useMemo(() => createCustomTrace(customSource), [customSource])
  const customStructure = useMemo(() => ({
    id: 'custom',
    name: 'Custom code',
    description: `Custom ${customTrace.kind === 'linked-list' ? 'linked list' : customTrace.kind} visualization`,
    code: customTrace.code,
    frames: customTrace.frames,
    shape: 'custom',
    kind: customTrace.kind,
    complexity: 'Varies',
    error: customTrace.error,
  }), [customTrace])
  const selectedStructure = useMemo(() => structures.find((item) => item.id === selectedId) ?? structures[0], [selectedId])
  const structure = selectedId === 'custom' ? customStructure : selectedStructure
  const frame = structure.frames[step]

  const selectStructure = (id) => {
    setSelectedId(id)
    setStep(0)
  }

  const selectSavedCode = (codeId) => {
    const savedCode = savedCodes.find((code) => String(code.code_id) === codeId)
    if (!savedCode) return
    customCodeTouched.current = true
    latestSource.current = savedCode.code
    latestCodeId.current = savedCode.code_id
    setSelectedCodeId(savedCode.code_id)
    setCustomSource(savedCode.code)
    setCustomCodeDirty(false)
    setSaveStatus({ state: 'saved', message: `Loaded code #${savedCode.code_id}` })
    setStep(0)
  }

  const createNewCode = () => {
    customCodeTouched.current = true
    latestSource.current = ''
    latestCodeId.current = null
    setSelectedCodeId(null)
    setCustomSource('')
    setCustomCodeDirty(false)
    setSaveStatus({ state: 'saved', message: 'New code · not saved' })
    setStep(0)
  }

  return (
    <div className="app-shell" id="top">
      <Header />
      <main>
        <section className="intro">
          <div className="intro-copy">
            <div className="intro-kicker"><span /> DATA STRUCTURES, MADE VISIBLE</div>
            <h1>See how it <span>works.</span></h1>
            <p>Step through classic data structures, one line at a time. Watch every pointer, value, and operation come to life.</p>
          </div>
          <div className="intro-note"><Icon name="spark" size={17} /><span>Learn by doing</span><i>·</i><span>One step at a time</span></div>
        </section>
        <div className="workspace">
          <Editor
            structure={structure}
            structures={structures}
            step={step}
            onSelect={selectStructure}
            onStep={() => setStep((current) => Math.min(current + 1, structure.frames.length - 1))}
            onBack={() => setStep((current) => Math.max(current - 1, 0))}
            onReset={() => setStep(0)}
            customSource={customSource}
            saveStatus={saveStatus}
            currentLine={structure.id === 'custom' ? frame.line : -1}
            savedCodes={savedCodes}
            selectedCodeId={selectedCodeId}
            programType={customTrace.kind}
            onSavedCodeSelect={selectSavedCode}
            onNewCode={createNewCode}
            onCustomSourceChange={(source) => {
              customCodeTouched.current = true
              latestSource.current = source
              latestCodeId.current = selectedCodeId
              setCustomSource(source)
              setCustomCodeDirty(true)
              setSaveStatus({ state: 'saving', message: 'Changes not saved yet' })
              setStep(0)
            }}
          />
          <Visualizer structure={structure} frame={frame} step={step} totalSteps={structure.frames.length} />
        </div>
      </main>
      <footer className="app-footer">
        <span>ALGO STUDIO <i>·</i> DATA STRUCTURE VISUALIZER</span>
        <span>Built for the curious <Icon name="spark" size={13} /></span>
      </footer>
    </div>
  )
}

export default App
