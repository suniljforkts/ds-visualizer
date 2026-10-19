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
                <div className={`node-card ${index === 0 ? 'head-node' : ''} ${index === values.length - 1 ? 'tail-node' : ''}`}>
                  {index === 0 && <PointerTag>HEAD</PointerTag>}
                  <strong>{value}</strong>
                  <span className="node-next">next <Icon name="arrow" size={12} /></span>
                  {index === values.length - 1 && <PointerTag>TAIL</PointerTag>}
                </div>
                <span className="node-connector"><Icon name="arrow" size={16} /></span>
              </div>
            ))}
            <div className="loop-back"><span>tail.next → head</span></div>
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
              <div className={`node-card ${index === 0 ? 'head-node' : ''} ${index === values.length - 1 ? 'tail-node' : ''}`}>
                {index === 0 && <PointerTag>HEAD</PointerTag>}
                <strong>{value}</strong>
                <span className="node-next">{index === values.length - 1 ? 'NULL' : 'next'}{index !== values.length - 1 && <Icon name="arrow" size={12} />}</span>
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
