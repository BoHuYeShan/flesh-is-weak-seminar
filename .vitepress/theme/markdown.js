export function renderMarkdown(text) {
  if (!text) return ''
  
  const lines = text.split('\n')
  let html = ''
  let inList = false
  let inCode = false
  let codeContent = ''
  let inTable = false
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    if (line.startsWith('```')) {
      if (inCode) {
        html += '<pre><code>' + escapeHtml(codeContent) + '</code></pre>'
        codeContent = ''
        inCode = false
      } else {
        inCode = true
      }
      continue
    }
    if (inCode) {
      codeContent += line + '\n'
      continue
    }
    
    if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false }
      if (inTable) { html += '</tbody></table>'; inTable = false }
      continue
    }
    
    if (line.startsWith('### ')) { html += '<h3>' + processInline(line.slice(4)) + '</h3>'; continue }
    if (line.startsWith('## ')) { html += '<h2>' + processInline(line.slice(3)) + '</h2>'; continue }
    if (line.startsWith('# ')) { html += '<h1>' + processInline(line.slice(2)) + '</h1>'; continue }
    
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true }
      html += '<li>' + processInline(line.slice(2)) + '</li>'
      continue
    }
    
    if (line.includes('|') && line.trim().startsWith('|')) {
      if (line.match(/^\|[\s\-:|]+\|$/)) continue
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
      if (!inTable) {
        html += '<table><thead><tr>' + cells.map(c => '<th>' + processInline(c) + '</th>').join('') + '</tr></thead><tbody>'
        inTable = true
      } else {
        html += '<tr>' + cells.map(c => '<td>' + processInline(c) + '</td>').join('') + '</tr>'
      }
      continue
    }
    
    if (line.match(/^---+$/)) { html += '<hr>'; continue }
    
    if (inList) { html += '</ul>'; inList = false }
    if (inTable) { html += '</tbody></table>'; inTable = false }
    html += '<p>' + processInline(line) + '</p>'
  }
  
  if (inList) html += '</ul>'
  if (inTable) html += '</tbody></table>'
  if (inCode) html += '<pre><code>' + escapeHtml(codeContent) + '</code></pre>'
  
  return html
}

function processInline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
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
