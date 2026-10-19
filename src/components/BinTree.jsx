function flattenTree(node, depth = 0, index = 0, parent = null, nodes = []) {
  if (!node) return nodes
  const current = { value: node.value, depth, index, parent }
  nodes.push(current)
  flattenTree(node.left, depth + 1, index * 2, current, nodes)
  flattenTree(node.right, depth + 1, index * 2 + 1, current, nodes)
  return nodes
}

function nodePosition(node, maxDepth) {
  const slotSize = 2 ** (maxDepth - node.depth)
  return ((node.index * slotSize + slotSize / 2) / 2 ** maxDepth) * 1000
}

function BinTree({ frame }) {
  const nodes = flattenTree(frame.tree)
  const maxDepth = nodes.reduce((depth, node) => Math.max(depth, node.depth), 0)
  const height = Math.max(180, (maxDepth + 1) * 82 + 24)

  return (
    <div className="binary-tree-layout">
      {nodes.length === 0 ? (
        <div className="empty-list">The tree is empty — insert the root node</div>
      ) : (
        <div className="binary-tree-stage" style={{ height }}>
          <svg className="binary-tree-edges" viewBox={`0 0 1000 ${height}`} preserveAspectRatio="none" aria-hidden="true">
            {nodes.filter((node) => node.parent).map((node) => {
              const x = nodePosition(node, maxDepth)
              const parentX = nodePosition(node.parent, maxDepth)
              const y = 18 + node.depth * 82
              const parentY = 18 + node.parent.depth * 82 + 54
              return <line key={`edge-${node.value}`} x1={parentX} y1={parentY} x2={x} y2={y} />
            })}
          </svg>
          {nodes.map((node) => (
            <div
              className={`binary-tree-node ${frame.highlighted.includes(node.value) ? 'active-tree-node' : ''} ${node.depth === 0 ? 'tree-root-node' : ''}`}
              key={`node-${node.value}`}
              style={{ left: `${nodePosition(node, maxDepth) / 10}%`, top: 18 + node.depth * 82 }}
              aria-label={`Node ${node.value}${frame.highlighted.includes(node.value) ? ', current operation' : ''}`}
            >
              <strong>{node.value}</strong>
              <small>{node.depth === 0 ? 'ROOT' : 'NODE'}</small>
            </div>
          ))}
        </div>
      )}
      <p className="visual-hint">Smaller values branch left; larger values branch right.</p>
    </div>
  )
}

export default BinTree
