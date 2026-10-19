export default function Stack({ frame }) {
  const values = frame.values
  const top = frame.pointers.top
  return (
    <div className="stack-layout">
      <div className={`stack-pointer ${top < 0 ? 'is-empty' : ''}`}><span>top</span><i />{top < 0 && <small>empty</small>}</div>
      <div className="stack-items">
        {[...values].reverse().map((value, index) => (
          <div className={`stack-cell ${index === 0 ? 'stack-top-cell' : ''}`} key={`${value}-${index}`}>
            <span className="cell-index">{values.length - index - 1}</span><strong>{value}</strong>
            {index === 0 && <span className="top-chip">TOP</span>}
          </div>
        ))}
        {values.length === 0 && <div className="empty-stack">No items yet</div>}
        <div className="stack-base"><span /> <span /> <span /></div>
      </div>
      <span className="stack-direction">PUSH ? &nbsp; ? &nbsp; POP ?</span>
    </div>
  )
}
