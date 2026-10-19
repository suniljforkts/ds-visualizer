import { useEffect, useRef, useState } from 'react'
import { Icon } from './Icon.jsx'

function Editor({
  structure,
  structures,
  step,
  onSelect,
  onStep,
  onBack,
  onReset,
  customSource,
  onCustomSourceChange,
  saveStatus,
  currentLine,
  savedCodes,
  selectedCodeId,
  programType,
  onSavedCodeSelect,
  onNewCode,
}) {
  const customEditorRef = useRef(null)
  const [customScroll, setCustomScroll] = useState({ top: 0, left: 0 })
  const currentFrame = structure.frames[step]
  const isCustom = structure.id === 'custom'
  const complete = isCustom
    ? Boolean(structure.error) || step === structure.frames.length - 1
    : step === structure.frames.length - 1
  const programName = {
    array: 'Array',
    stack: 'Stack',
    queue: 'Queue',
    'linked-list': 'Linked list',
  }[programType] ?? 'Array'

  useEffect(() => {
    const editor = customEditorRef.current
    if (!isCustom || !editor || currentLine < 0) return

    const lineTop = currentLine * 21 + 4
    const lineBottom = lineTop + 21
    if (lineTop < editor.scrollTop) {
      editor.scrollTop = Math.max(0, lineTop - 42)
    } else if (lineBottom > editor.scrollTop + editor.clientHeight) {
      editor.scrollTop = lineBottom - editor.clientHeight + 42
    }
  }, [currentLine, isCustom])

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
        {isCustom && (
          <div className="saved-code-picker">
            <label htmlFor="saved-code-select">SAVED CUSTOM PROGRAM</label>
            <div className="saved-code-controls">
              <div className="select-wrap">
                <select
                  id="saved-code-select"
                  value={selectedCodeId ?? ''}
                  onChange={(event) => onSavedCodeSelect(event.target.value)}
                >
                  {selectedCodeId === null && <option value="">Unsaved code</option>}
                  {savedCodes.map((code) => (
                    <option key={code.code_id} value={code.code_id}>Code #{code.code_id}</option>
                  ))}
                </select>
                <Icon name="chevron" size={15} />
              </div>
              <button className="new-code-button" type="button" onClick={onNewCode}>New code</button>
            </div>
          </div>
        )}
      </div>
      <div className="code-toolbar">
        <span className="file-label"><span className="file-dot" /> {isCustom ? `code_${selectedCodeId ?? 'new'}.c` : `${structure.id.replaceAll('-', '_')}.c`}</span>
        {isCustom ? (
          <span className="custom-code-meta">
            <span className="program-type-badge">{programName} program</span>
            <span className={`code-length ${Array.from(customSource).length > 4096 ? 'over-limit' : ''}`}>
              {Array.from(customSource).length}/4096
            </span>
            <span className={`code-toolbar-meta save-indicator ${saveStatus.state}`} role="status" title={saveStatus.message}>
              <span className="status-dot" /> {saveStatus.message}
            </span>
          </span>
        ) : (
          <span className="code-toolbar-meta"><span className="status-dot" /> C99</span>
        )}
      </div>
      <div className="code-scroll" aria-label="Source code">
        {isCustom ? (
          <div className="custom-code-editor-wrap">
            <pre
              className="custom-code-highlight"
              aria-hidden="true"
              style={{ transform: `translate(${-customScroll.left}px, ${-customScroll.top}px)` }}
            >
              {customSource.split(/\r?\n/).map((line, index) => (
                <span className={`custom-code-highlight-line ${currentLine === index ? 'active' : ''}`} key={index}>
                  {line || ' '}
                </span>
              ))}
            </pre>
            <textarea
              ref={customEditorRef}
              className="custom-code-editor"
              aria-label="Custom C-like source code"
              spellCheck="false"
              wrap="off"
              value={customSource}
              onChange={(event) => onCustomSourceChange(event.target.value)}
              onScroll={(event) => setCustomScroll({
                top: event.currentTarget.scrollTop,
                left: event.currentTarget.scrollLeft,
              })}
            />
          </div>
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
