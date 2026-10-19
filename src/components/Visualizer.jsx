import { Icon } from './Icon.jsx'
import Stack from './Stack.jsx'
import Queue from './Queue.jsx'
import CircularQueue from './CircularQueue.jsx'
import LinkedList from './LinkedList.jsx'
import CustomView from './CustomView.jsx'
import BinTree from './BinTree.jsx'

function Visualizer({ structure, frame, step, totalSteps }) {
  const itemCount = structure.shape === 'custom'
    ? frame.values.length
    : structure.shape === 'circular-queue'
    ? frame.pointers.count
    : structure.shape === 'queue'
      ? frame.values.filter((value) => value !== null).length
    : frame.values.length

  return (
    <section className="panel visual-panel" aria-label="Data structure visualization">
      <div className="panel-heading visual-heading">
        <div className="panel-title-group">
          <span className="panel-icon visual-icon"><Icon name="layers" size={17} /></span>
          <div>
            <h2>Live visualization</h2>
            <p>{structure.description}</p>
          </div>
        </div>
        <span className="running-badge"><i /> {structure.shape === 'custom' ? 'CUSTOM TRACE' : 'LIVE'}</span>
      </div>
      <div className="visual-status">
        <div>
          <span className="eyebrow">CURRENT OPERATION</span>
          <strong>{frame.title}</strong>
        </div>
        <span className="operation-counter">{String(step + 1).padStart(2, '0')} <i>/</i> {String(totalSteps).padStart(2, '0')}</span>
      </div>
      <div className={`visual-canvas ${structure.shape}`}>
        <div className="canvas-grid" />
        {structure.shape === 'custom'
          ? <CustomView structure={structure} frame={frame} />
          : structure.shape === 'binary-tree'
            ? <BinTree frame={frame} />
          : structure.shape === 'stack'
            ? <Stack frame={frame} />
            : structure.shape === 'queue'
              ? <Queue frame={frame} />
              : structure.shape === 'circular-queue'
            ? <CircularQueue frame={frame} />
            : <LinkedList structure={structure} frame={frame} />}
      </div>
      <div className="visual-footer">
        <div className="metric">
          <span className="metric-icon"><Icon name="layers" size={15} /></span>
          <span><small>ELEMENTS</small><strong>{itemCount}</strong></span>
        </div>
        <span className="metric-separator" />
        <div className="metric">
          <span className="complexity-icon">⌁</span>
          <span><small>OPERATION COST</small><strong>{structure.complexity}</strong></span>
        </div>
        <div className="progress-block">
          <div className="progress-label"><span>TRACE PROGRESS</span><strong>{Math.round(((step + 1) / totalSteps) * 100)}%</strong></div>
          <div className="progress-track"><i style={{ width: `${((step + 1) / totalSteps) * 100}%` }} /></div>
        </div>
      </div>
    </section>
  )
}

export default Visualizer
