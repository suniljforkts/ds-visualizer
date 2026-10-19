import { Icon } from './Icon.jsx'
import PointerTag from './PointerTag.jsx'

export default function Queue({ frame }) {
  const values = frame.values
  const queueItems = Array.from({ length: 5 }, (_, index) => values[index] ?? null)
  const queueHasItems = values.some((value) => value !== null)
  return (
    <div className="linear-queue-layout">
      <div className="queue-direction"><span>REMOVE</span><Icon name="arrow" size={15} /><span>ADD</span></div>
      <div className="queue-slots">
        {queueItems.map((value, index) => {
          const front = frame.pointers.front === index && queueHasItems
          const rear = frame.pointers.rear === index && queueHasItems
          return (
            <div className={`queue-slot ${value !== null ? 'filled' : ''} ${front ? 'front-slot' : ''}`} key={`slot-${index}`}>
              {front && <PointerTag>FRONT</PointerTag>}
              <div className="queue-value">{value ?? <span>—</span>}</div>
              {rear && <PointerTag>REAR</PointerTag>}
              <span className="slot-index">[{index}]</span>
            </div>
          )
        })}
      </div>
      <p className="visual-hint">Items leave from the front and join at the rear.</p>
    </div>
  )
}
