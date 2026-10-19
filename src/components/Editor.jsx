import { Icon } from './Icon.jsx'

function Editor({ structure, structures, step, onSelect, onStep, onBack, onReset, customSource, onCustomSourceChange }) {
  const currentFrame = structure.frames[step]
  const isCustom = structure.id === 'custom'
  const complete = isCustom
    ? Boolean(structure.error) || step === structure.frames.length - 1
    : step === structure.frames.length - 1

  return (
    <section className="panel code-panel" aria-label="C code and controls">
      <div className="panel-heading code-heading">
        <div className="panel-title-group">
          <span className="panel-icon code-icon"><Icon name="code" size={17} /></span>
          <div>
            <h2>{isCustom ? 'Custom code' : 'Code walkthrough'}</h2>
            <p>{isCustom ? 'Edit a C-like program and trace common operations' : 'Follow the C implementation'}</p>
          </div>
        </div>
        <span className="language-badge">{isCustom ? 'C-LIKE' : 'C'}</span>
      </div>
      <div className="structure-picker">
        <label htmlFor="structure-select">DATA STRUCTURE</label>
        <div className="select-wrap">
          <select id="structure-select" value={structure.id} onChange={(event) => onSelect(event.target.value)}>
            {structures.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            <option value="custom">Custom code</option>
          </select>
          <Icon name="chevron" size={15} />
        </div>
      </div>
      <div className="code-toolbar">
        <span className="file-label"><span className="file-dot" /> {isCustom ? 'custom.c' : `${structure.id.replaceAll('-', '_')}.c`}</span>
        <span className="code-toolbar-meta"><span className="status-dot" /> {isCustom ? 'EDITABLE' : 'C99'}</span>
      </div>
      <div className="code-scroll" aria-label="Source code">
        {isCustom ? (
          <textarea
            className="custom-code-editor"
            aria-label="Custom C-like source code"
            spellCheck="false"
            value={customSource}
            onChange={(event) => onCustomSourceChange(event.target.value)}
          />
        ) : (
          <pre className="code-block">
            {structure.code.map((line, index) => (
              <div className={`code-line ${currentFrame.line === index ? 'active' : ''}`} key={`${index}-${line}`}>
                <span className="line-number">{String(index + 1).padStart(2, '0')}</span>
                <code>{line || ' '}</code>
              </div>
            ))}
          </pre>
        )}
      </div>
      {isCustom && structure.error && <p className="trace-error" role="status">{structure.error}</p>}
      <div className="step-caption" aria-live="polite">
        <span className="step-caption-label">{isCustom && currentFrame.line >= 0 ? `CURRENT STEP · LINE ${currentFrame.line + 1}` : 'CURRENT STEP'}</span>
        <strong>{currentFrame.title}</strong>
        <p>{currentFrame.description}</p>
      </div>
      <div className="code-controls">
        <button className="icon-button reset-button" type="button" onClick={onReset} aria-label="Reset walkthrough" title="Reset walkthrough">
          <Icon name="reset" size={16} />
        </button>
        <button className="back-button" type="button" onClick={onBack} disabled={step === 0}>Previous</button>
        <button className="step-button" type="button" onClick={onStep} disabled={complete}>
          <span>{isCustom && structure.error ? 'No trace available' : complete ? 'Walkthrough complete' : 'Step through'}</span>
          {complete && !structure.error ? <Icon name="check" size={16} /> : <Icon name="chevrons" size={17} />}
        </button>
      </div>
    </section>
  )
}

export default Editor
