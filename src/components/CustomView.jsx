import { Icon } from './Icon.jsx'
import PointerTag from './PointerTag.jsx'

function CustomView({ structure, frame }) {
  const { kind } = structure
  const values = frame.values
  return (
    <div className={`custom-view custom-view-${kind}`}>
      {kind === 'queue' && <div className="custom-direction"><span>FRONT</span><Icon name="arrow" size={15} /><span>REAR</span></div>}
      {values.length === 0 ? (
        <div className="empty-list">No items yet</div>
      ) : (
        <div className={`custom-nodes ${kind === 'stack' ? 'custom-stack-nodes' : ''}`}>
          {values.map((value, index) => (
            <div className="custom-node-wrap" key={`${index}-${value}`}>
              {kind === 'queue' && index === 0 && <PointerTag className="custom-front-tag">FRONT</PointerTag>}
              {kind === 'linked-list' && index === 0 && <PointerTag className="custom-head-tag">HEAD</PointerTag>}
              {kind === 'stack' && index === values.length - 1 && <PointerTag className="custom-top-tag">TOP</PointerTag>}
              <div className={`custom-node ${kind === 'linked-list' ? 'custom-list-node' : ''}`}>
                {kind === 'linked-list' ? (
                  <>
                    <span className="node-data"><small>DATA</small><strong>{value ?? '—'}</strong></span>
                    <span className="node-next">
                      <small>{index === values.length - 1 ? 'NULL' : 'NEXT'}</small>
                      {index === values.length - 1 ? <b>-|</b> : <Icon name="arrow" size={12} />}
                    </span>
                  </>
                ) : (
                  <>
                    <strong>{value ?? '—'}</strong>
                    <small>{`[${index}]`}</small>
                  </>
                )}
              </div>
              {kind === 'queue' && index === values.length - 1 && <PointerTag className="custom-rear-tag">REAR</PointerTag>}
              {kind === 'linked-list' && index < values.length - 1 && <span className="node-connector"><Icon name="arrow" size={16} /></span>}
            </div>
          ))}
        </div>
      )}
      <p className="visual-hint">Values update as each recognized operation is stepped through.</p>
    </div>
  )
}

export default CustomView
