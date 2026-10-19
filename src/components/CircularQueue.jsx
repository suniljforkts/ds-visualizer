import PointerTag from './PointerTag.jsx'

function CircularQueue({ frame }) {
  const slots = frame.values
  return (
    <div className="ring-layout">
      <div className="ring">
        <span className="ring-center">CIRCULAR<br />BUFFER</span>
        {slots.map((value, index) => {
          const angle = -90 + index * 90
          const front = frame.pointers.front === index && frame.pointers.count > 0
          const rear = frame.pointers.rear === index && frame.pointers.count > 0
          return (
            <div className={`ring-slot ring-slot-${index} ${value !== null ? 'filled' : ''} ${front ? 'front-slot' : ''}`} key={`ring-${index}`}>
              <span className="slot-index">[{index}]</span>
              <strong>{value ?? '—'}</strong>
              <div className="ring-tags">
                {front && <PointerTag>F</PointerTag>}
                {rear && <PointerTag>R</PointerTag>}
              </div>
              <span className="ring-orbit" style={{ transform: `rotate(${angle}deg)` }} />
            </div>
          )
        })}
      </div>
      <div className="pointer-legend">
        <span><i className="legend-front" /> FRONT <b>{frame.pointers.front}</b></span>
        <span><i className="legend-rear" /> REAR <b>{frame.pointers.rear}</b></span>
        <span><i className="legend-count" /> COUNT <b>{frame.pointers.count}</b></span>
      </div>
      <p className="visual-hint">Modulo arithmetic wraps the pointers back to slot 0.</p>
    </div>
  )
}

export default CircularQueue
