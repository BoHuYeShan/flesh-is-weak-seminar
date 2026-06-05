export function renderMarkdown(text) {
  if (!text) return ''
  
  // 先处理 block 级元素，再处理 inline 元素
  const blocks = text.split(/\n\n+/)
  let html = ''
  
  for (const block of blocks) {
    const trimmed = block.trim()
    if (!trimmed) continue
    
    // 代码块
    if (trimmed.startsWith('```')) {
      const match = trimmed.match(/^```(\w*)\n([\s\S]*?)```$/)
      if (match) {
        html += '<pre><code>' + escapeHtml(match[2].trim()) + '</code></pre>'
        continue
      }
    }
    
    // 标题
    if (trimmed.startsWith('### ')) {
      html += '<h3>' + processInline(trimmed.slice(4)) + '</h3>'
      continue
    }
    if (trimmed.startsWith('## ')) {
      html += '<h2>' + processInline(trimmed.slice(3)) + '</h2>'
      continue
    }
    if (trimmed.startsWith('# ')) {
      html += '<h1>' + processInline(trimmed.slice(2)) + '</h1>'
      continue
    }
    
    // 分割线
    if (trimmed.match(/^---+$/)) {
      html += '<hr>'
      continue
    }
    
    // 表格
    if (trimmed.includes('|') && trimmed.includes('\n')) {
      const tableLines = trimmed.split('\n').filter(l => l.trim())
      const hasSeparator = tableLines.some(l => l.match(/^\|[\s\-:|]+\|$/))
      
      if (hasSeparator && tableLines.length >= 2) {
        html += '<table>'
        for (let i = 0; i < tableLines.length; i++) {
          const line = tableLines[i]
          if (line.match(/^\|[\s\-:|]+\|$/)) continue
          
          const cells = line.split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim())
          
          if (i === 0) {
            html += '<thead><tr>' + cells.map(c => '<th>' + processInline(c) + '</th>').join('') + '</tr></thead><tbody>'
          } else {
            html += '<tr>' + cells.map(c => '<td>' + processInline(c) + '</td>').join('') + '</tr>'
          }
        }
        html += '</tbody></table>'
        continue
      }
    }
    
    // 列表
    const listLines = trimmed.split('\n').filter(l => l.trim().startsWith('- ') || l.trim().startsWith('* '))
    if (listLines.length > 0 && listLines.length === trimmed.split('\n').filter(l => l.trim()).length) {
      html += '<ul>'
      for (const line of listLines) {
        const content = line.replace(/^\s*[-*]\s+/, '')
        html += '<li>' + processInline(content) + '</li>'
      }
      html += '</ul>'
      continue
    }
    
    // 引用
    if (trimmed.startsWith('> ')) {
      html += '<blockquote>' + processInline(trimmed.slice(2)) + '</blockquote>'
      continue
    }
    
    // 普通段落
    html += '<p>' + processInline(trimmed) + '</p>'
  }
  
  return html
}

function processInline(text) {
  // 先转义 HTML
  let result = escapeHtml(text)
  
  // 再处理 markdown 语法
  result = result
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  
  // 处理段落内的换行
  result = result.replace(/\n/g, '<br>')
  
  return result
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function extractHeadings(text) {
  if (!text) return []
  const headings = []
  const lines = text.split('\n')
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/)
    if (match) {
      headings.push({
        level: match[1].length,
        text: match[2]
      })
    }
  }
  return headings
}
