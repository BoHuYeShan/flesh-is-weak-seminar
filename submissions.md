# 群友投稿

群友提交的优质内容。

<script setup>
import { onMounted, ref, computed, nextTick } from 'vue'

const items = ref([])
const loading = ref(true)
const selectedItem = ref(null)
const showDetail = ref(false)
const headings = ref([])
const activeHeading = ref('')

onMounted(async () => {
  try {
    const res = await fetch('./data/discussions.json')
    const data = await res.json()
    items.value = data.submissions || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function openItem(item) {
  selectedItem.value = item
  showDetail.value = true
  headings.value = []
  activeHeading.value = ''
  nextTick(() => {
    extractHeadings()
  })
}

function closeDetail() {
  showDetail.value = false
  selectedItem.value = null
}

function extractHeadings() {
  const body = document.querySelector('.modal-body')
  if (!body) return
  const hs = body.querySelectorAll('h1, h2, h3')
  headings.value = Array.from(hs).map((h, i) => {
    const id = `heading-${i}`
    h.id = id
    return {
      id,
      text: h.textContent,
      level: parseInt(h.tagName.charAt(1))
    }
  })
}

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    activeHeading.value = id
  }
}

// markdown 转 HTML
function renderMarkdown(text) {
  if (!text) return ''
  
  // 按行处理
  const lines = text.split('\n')
  let html = ''
  let inList = false
  let inCode = false
  let codeContent = ''
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    
    // 代码块
    if (line.startsWith('```')) {
      if (inCode) {
        html += `<pre><code>${codeContent}</code></pre>`
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
    
    // 空行
    if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false }
      continue
    }
    
    // 标题
    if (line.startsWith('### ')) { html += `<h3>${line.slice(4)}</h3>`; continue }
    if (line.startsWith('## ')) { html += `<h2>${line.slice(3)}</h2>`; continue }
    if (line.startsWith('# ')) { html += `<h1>${line.slice(2)}</h1>`; continue }
    
    // 列表
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) { html += '<ul>'; inList = true }
      html += `<li>${processInline(line.slice(2))}</li>`
      continue
    }
    
    // 表格行
    if (line.includes('|') && line.trim().startsWith('|')) {
      // 跳过分隔行
      if (line.match(/^\|[\s-|]+\|$/)) continue
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
      if (html.endsWith('</tr>') || html.endsWith('</thead>')) {
        html += '<tr>' + cells.map(c => `<td>${processInline(c)}</td>`).join('') + '</tr>'
      } else {
        html += '<table><thead><tr>' + cells.map(c => `<th>${processInline(c)}</th>`).join('') + '</tr></thead><tbody>'
      }
      continue
    }
    
    // 分割线
    if (line.match(/^---+$/)) { html += '<hr>'; continue }
    
    // 普通段落
    if (inList) { html += '</ul>'; inList = false }
    html += `<p>${processInline(line)}</p>`
  }
  
  if (inList) html += '</ul>'
  if (inCode) html += `<pre><code>${codeContent}</code></pre>`
  
  // 关闭表格
  if (html.includes('<table>') && !html.includes('</table>')) {
    html += '</tbody></table>'
  }
  
  return html
}

function processInline(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
}
</script>

<div v-if="loading" class="loading">加载中...</div>
<div v-else-if="items.length === 0" class="empty">暂无投稿，快来提交第一篇吧！</div>
<div v-else class="list">
  <div v-for="item in items" :key="item.folder" class="card" @click="openItem(item)">
    <div v-if="item.cover" class="card-cover">
      <img :src="item.cover" :alt="item.title" />
    </div>
    <div class="card-body">
      <div class="card-tags">
        <span v-for="tag in item.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <h3>{{ item.title }}</h3>
      <p>{{ item.summary }}</p>
      <div class="card-meta">
        <span>{{ item.author }}</span>
        <span>{{ item.date }}</span>
      </div>
    </div>
  </div>
</div>

<!-- 详情弹窗 -->
<div v-if="showDetail && selectedItem" class="modal-overlay" @click.self="closeDetail">
  <div class="modal">
    <!-- 右侧目录 -->
    <aside v-if="headings.length > 0" class="toc">
      <div class="toc-title">目录</div>
      <nav>
        <a v-for="h in headings" :key="h.id" 
           :class="['toc-link', `level-${h.level}`, { active: activeHeading === h.id }]"
           @click.prevent="scrollToHeading(h.id)">
          {{ h.text }}
        </a>
      </nav>
    </aside>
    
    <!-- 主内容 -->
    <div class="modal-content">
      <div class="modal-header">
        <div>
          <h2>{{ selectedItem.title }}</h2>
          <div class="modal-meta">
            <span>{{ selectedItem.author }}</span>
            <span>{{ selectedItem.date }}</span>
            <div class="modal-tags">
              <span v-for="tag in selectedItem.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-body" v-html="renderMarkdown(selectedItem.body)"></div>
      <div class="modal-footer">
        <a :href="'https://github.com/BoHuYeShan/flesh-is-weak-seminar/blob/main/submissions/' + selectedItem.folder + '/index.md'" target="_blank" class="github-link">
          在 GitHub 查看原始文件 →
        </a>
      </div>
    </div>
  </div>
</div>

<style>
.list { display: grid; gap: 16px; max-width: 800px; margin: 0 auto; padding: 40px 28px; }
.card {
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}
.card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.card-cover { width: 100%; height: 200px; overflow: hidden; }
.card-cover img { width: 100%; height: 100%; object-fit: cover; }
.card-body { padding: 20px; }
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.tag {
  font-family: var(--font-mono);
  font-size: 11px;
  padding: 3px 10px;
  background: var(--cyan-dim);
  color: var(--cyan);
  border-radius: 100px;
}
.card h3 { margin: 0 0 8px; font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
.card p { margin: 0 0 12px; font-size: 14px; color: var(--muted); line-height: 1.6; }
.card-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); }
.loading, .empty { text-align: center; padding: 60px 28px; color: var(--faint); font-family: var(--font-mono); }

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 100;
  padding: 40px 20px;
  overflow-y: auto;
}
.modal {
  display: flex;
  gap: 0;
  max-width: 1000px;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  overflow: hidden;
}

/* 右侧目录 */
.toc {
  width: 220px;
  min-width: 220px;
  border-right: 1px solid var(--border);
  padding: 20px 16px;
  position: sticky;
  top: 0;
  max-height: 80vh;
  overflow-y: auto;
}
.toc-title {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--faint);
  margin-bottom: 12px;
}
.toc-link {
  display: block;
  font-size: 13px;
  color: var(--muted);
  text-decoration: none;
  padding: 4px 8px;
  border-left: 2px solid transparent;
  transition: all 0.15s;
  cursor: pointer;
  line-height: 1.4;
}
.toc-link:hover { color: var(--text); }
.toc-link.active { color: var(--cyan); border-left-color: var(--cyan); }
.toc-link.level-2 { padding-left: 16px; }
.toc-link.level-3 { padding-left: 24px; font-size: 12px; }

/* 主内容 */
.modal-content {
  flex: 1;
  min-width: 0;
}
.modal-header {
  padding: 24px 24px 0;
}
.modal-header h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 12px;
}
.modal-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}
.modal-tags { display: flex; gap: 6px; }
.modal-body {
  padding: 20px 24px 24px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text);
}
.modal-body h1, .modal-body h2, .modal-body h3 {
  font-family: var(--font-display);
  color: var(--text);
  margin: 28px 0 12px;
  scroll-margin-top: 20px;
}
.modal-body h1 { font-size: 24px; }
.modal-body h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.modal-body h3 { font-size: 18px; }
.modal-body p { margin: 12px 0; }
.modal-body strong { color: var(--text); }
.modal-body code {
  font-family: var(--font-mono);
  font-size: 13px;
  background: var(--card);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--cyan);
}
.modal-body pre {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
  margin: 16px 0;
}
.modal-body pre code {
  background: none;
  padding: 0;
  color: var(--text);
}
.modal-body a {
  color: var(--cyan);
  text-decoration: none;
}
.modal-body a:hover { text-decoration: underline; }
.modal-body img {
  max-width: 100%;
  border-radius: 8px;
  margin: 12px 0;
}
.modal-body ul, .modal-body ol {
  margin: 12px 0;
  padding-left: 24px;
}
.modal-body li { margin: 4px 0; }
.modal-body hr {
  border: none;
  border-top: 1px solid var(--border);
  margin: 24px 0;
}
.modal-body blockquote {
  border-left: 3px solid var(--cyan);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--muted);
}
.modal-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}
.modal-body th, .modal-body td {
  border: 1px solid var(--border);
  padding: 8px 12px;
  text-align: left;
}
.modal-body th {
  background: var(--card);
  font-weight: 600;
  color: var(--text);
}
.modal-body td {
  color: var(--muted);
}
.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  text-align: right;
}
.github-link {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--cyan);
  text-decoration: none;
  transition: color 0.15s;
}
.github-link:hover { color: var(--text); }

@media (max-width: 768px) {
  .toc { display: none; }
  .modal-overlay { padding: 20px 10px; }
}
</style>
