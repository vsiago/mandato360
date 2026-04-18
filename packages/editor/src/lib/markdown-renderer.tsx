import React from 'react'

/**
 * A ultra-lightweight markdown-to-JSX renderer.
 * Supports:
 * **text** -> <strong>text</strong>
 * *text* -> <em>text</em>
 * <sm>text</sm> -> small text
 * <md>text</md> -> medium text
 * <lg>text</lg> -> large text
 */
export function renderMarkdown(text: string = ''): React.ReactNode {
  if (!text) return null

  // 1. Process sizes first
  const sizeParts = text.split(/(<(?:sm|md|lg)>.*?<\/(?:sm|md|lg)>)/g)
  
  return sizeParts.map((part, i) => {
    let content = part
    let fontSizeClass = ""

    if (part.startsWith('<sm>') && part.endsWith('</sm>')) {
      content = part.slice(4, -5)
      fontSizeClass = "text-[0.75em]"
    } else if (part.startsWith('<md>') && part.endsWith('</md>')) {
      content = part.slice(4, -5)
      fontSizeClass = "text-[1em]"
    } else if (part.startsWith('<lg>') && part.endsWith('</lg>')) {
      content = part.slice(4, -5)
      fontSizeClass = "text-[1.25em]"
    }

    if (fontSizeClass) {
      return (
        <span key={i} className={fontSizeClass}>
          {processBold(content)}
        </span>
      )
    }

    return <React.Fragment key={i}>{processBold(part)}</React.Fragment>
  })
}

function processBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldText = part.slice(2, -2)
      return <strong key={i}>{processItalics(boldText)}</strong>
    }
    return <React.Fragment key={i}>{processItalics(part)}</React.Fragment>
  })
}

function processItalics(text: string): React.ReactNode {
  const parts = text.split(/(\*.*?\*)/g)
  
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      return <em key={i}>{part.slice(1, -1)}</em>
    }
    return part
  })
}
