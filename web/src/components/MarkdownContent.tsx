import { useMemo } from 'react'
import { renderMarkdown } from '../lib/markdown'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div
      className={`lug-markdown ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
