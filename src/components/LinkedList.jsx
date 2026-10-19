import { Icon } from './Icon.jsx'
import PointerTag from './PointerTag.jsx'

function LinkedList({ structure, frame }) {
  const circular = structure.shape === 'circular-linked-list'
  const values = frame.values
  if (circular) {
    return (
      <div className="circular-list-layout">
        {values.length === 0 ? (
          <div className="empty-list">No nodes in the circle yet</div>
        ) : (
          <div className="circular-nodes">
            {values.map((value, index) => (
              <div className="circular-node-wrap" key={`${value}-${index}`}>
                <div className={`node-card list-node ${index === 0 ? 'head-node' : ''} ${index === values.length - 1 ? 'tail-node' : ''}`}>
                  {index === 0 && <PointerTag>HEAD</PointerTag>}
                  <span className="node-data"><small>DATA</small><strong>{value}</strong></span>
                  <span className="node-next"><small>NEXT</small><Icon name="arrow" size={12} /></span>
                  {index === values.length - 1 && <PointerTag>TAIL</PointerTag>}
                </div>
                {index < values.length - 1 && <span className="node-connector"><Icon name="arrow" size={16} /></span>}
              </div>
            ))}
            <div
              className={`loop-back ${values.length === 1 ? 'single-node-loop' : ''}`}
              style={{
                left: `calc(50% - ${(values.length - 1) * 84}px)`,
                right: `calc(50% - ${(values.length - 1) * 84}px)`,
              }}
              aria-label="Tail next pointer loops back to the head"
            >
              <span className="loop-back-label">tail.next → head</span>
              <span className="loop-head-arrow"><Icon name="arrow" size={12} /></span>
            </div>
          </div>
        )}
        <p className="visual-hint">The tail’s next pointer reconnects to the head.</p>
      </div>
    )
  }
  return (
    <div className="linked-list-layout">
      {values.length === 0 ? <div className="empty-list">No nodes yet — add the first value</div> : (
        <div className="linked-nodes">
          {values.map((value, index) => (
            <div className="node-sequence" key={`${value}-${index}`}>
              <div className={`node-card list-node ${index === 0 ? 'head-node' : ''} ${index === values.length - 1 ? 'tail-node' : ''}`}>
                {index === 0 && <PointerTag>HEAD</PointerTag>}
                <span className="node-data"><small>DATA</small><strong>{value}</strong></span>
                <span className="node-next">
                  <small>{index === values.length - 1 ? 'NULL' : 'NEXT'}</small>
                  {index === values.length - 1 ? <b>-|</b> : <Icon name="arrow" size={12} />}
                </span>
                {index === values.length - 1 && <PointerTag muted>TAIL</PointerTag>}
              </div>
              {index < values.length - 1 && <span className="node-connector"><Icon name="arrow" size={17} /></span>}
            </div>
          ))}
        </div>
      )}
      <p className="visual-hint">Each node stores a value and a pointer to the next node.</p>
    </div>
  )
}

export default LinkedList
