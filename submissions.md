# 群友投稿

群友提交的优质内容。

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { renderMarkdown, extractHeadings } from './.vitepress/theme/markdown.js'

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
  headings.value = extractHeadings(item.body)
  activeHeading.value = ''
}

function closeDetail() {
  showDetail.value = false
  selectedItem.value = null
}

function scrollToHeading(text) {
  activeHeading.value = text
  nextTick(() => {
    const body = document.querySelector('.modal-body')
    if (!body) return
    const hs = body.querySelectorAll('h1, h2, h3')
    for (const h of hs) {
      if (h.textContent === text) {
        h.scrollIntoView({ behavior: 'smooth', block: 'start' })
        break
      }
    }
  })
}

// 监听滚动，更新目录高亮
function onModalScroll() {
  const body = document.querySelector('.modal-body')
  if (!body) return
  const hs = body.querySelectorAll('h1, h2, h3')
  let current = ''
  for (const h of hs) {
    const rect = h.getBoundingClientRect()
    if (rect.top <= 120) {
      current = h.textContent
    }
  }
  if (current) activeHeading.value = current
}

function scrollToTop() {
  const content = document.querySelector('.modal-content')
  if (content) content.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToBottom() {
  const content = document.querySelector('.modal-content')
  if (content) content.scrollTo({ top: content.scrollHeight, behavior: 'smooth' })
}
</script>

<div v-if="loading" class="loading">加载中...</div>
<div v-else-if="items.length === 0" class="empty">暂无投稿，快来提交第一篇吧！</div>
<div v-else class="list">
  <div v-for="item in items" :key="item.folder" class="card" @click="openItem(item)">
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

<div v-if="showDetail && selectedItem" class="modal-overlay" @click.self="closeDetail">
  <div class="modal">
    <aside v-if="headings.length > 0" class="toc">
      <div class="toc-title">目录</div>
      <nav>
        <a v-for="(h, i) in headings" :key="i"
           :class="['toc-link', 'level-' + h.level, { active: activeHeading === h.text }]"
           @click.prevent="scrollToHeading(h.text)">
          {{ h.text }}
        </a>
      </nav>
    </aside>
    <div class="modal-content" @scroll="onModalScroll">
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
          在 GitHub 查看原始文件
        </a>
      </div>
    </div>
    
    <!-- 返回顶部/底部按钮 -->
    <div class="scroll-buttons">
      <button class="scroll-btn" @click="scrollToTop" title="返回顶部">↑</button>
      <button class="scroll-btn" @click="scrollToBottom" title="返回底部">↓</button>
    </div>
  </div>
</div>

<style>
.list { display: grid; gap: 16px; max-width: 800px; margin: 0 auto; padding: 40px 28px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; cursor: pointer; transition: all 0.2s; }
.card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.card-body { padding: 20px; }
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
.tag { font-family: var(--font-mono); font-size: 11px; padding: 3px 10px; background: var(--cyan-dim); color: var(--cyan); border-radius: 100px; }
.card h3 { margin: 0 0 8px; font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--text); }
.card p { margin: 0 0 12px; font-size: 14px; color: var(--muted); line-height: 1.6; }
.card-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); }
.loading, .empty { text-align: center; padding: 60px 28px; color: var(--faint); font-family: var(--font-mono); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: flex-start; justify-content: center; z-index: 100; padding: 40px 20px; overflow-y: auto; }
.modal { display: flex; max-width: 1000px; width: 100%; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.toc { width: 220px; min-width: 220px; border-right: 1px solid var(--border); padding: 20px 16px; position: sticky; top: 0; max-height: 80vh; overflow-y: auto; }
.toc-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--faint); margin-bottom: 12px; }
.toc-link { display: block; font-size: 13px; color: var(--muted); text-decoration: none; padding: 4px 8px; border-left: 2px solid transparent; transition: all 0.15s; cursor: pointer; line-height: 1.4; }
.toc-link:hover { color: var(--text); }
.toc-link.active { color: var(--cyan); border-left-color: var(--cyan); }
.toc-link.level-2 { padding-left: 16px; }
.toc-link.level-3 { padding-left: 24px; font-size: 12px; }
.modal-content { flex: 1; min-width: 0; }
.modal-header { padding: 24px 24px 0; }
.modal-header h2 { font-family: var(--font-display); font-size: 24px; font-weight: 700; color: var(--text); margin: 0 0 12px; }
.modal-meta { display: flex; gap: 16px; align-items: center; font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
.modal-tags { display: flex; gap: 6px; }
.modal-body { padding: 20px 24px 24px; font-size: 15px; line-height: 1.8; color: var(--text); }
.modal-body h1, .modal-body h2, .modal-body h3 { font-family: var(--font-display); color: var(--text); margin: 28px 0 12px; scroll-margin-top: 20px; }
.modal-body h1 { font-size: 24px; }
.modal-body h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
.modal-body h3 { font-size: 18px; }
.modal-body p { margin: 12px 0; }
.modal-body strong { color: var(--text); }
.modal-body code { font-family: var(--font-mono); font-size: 13px; background: var(--card); padding: 2px 6px; border-radius: 4px; color: var(--cyan); }
.modal-body pre { background: var(--card); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 16px 0; }
.modal-body pre code { background: none; padding: 0; color: var(--text); }
.modal-body a { color: var(--cyan); text-decoration: none; }
.modal-body a:hover { text-decoration: underline; }
.modal-body ul, .modal-body ol { margin: 12px 0; padding-left: 24px; }
.modal-body li { margin: 4px 0; }
.modal-body hr { border: none; border-top: 1px solid var(--border); margin: 24px 0; }
.modal-body table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 14px; }
.modal-body th, .modal-body td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; }
.modal-body th { background: var(--card); font-weight: 600; color: var(--text); }
.modal-body td { color: var(--muted); }
.modal-footer { padding: 16px 24px; border-top: 1px solid var(--border); text-align: right; }
.github-link { font-family: var(--font-mono); font-size: 13px; color: var(--cyan); text-decoration: none; }
.github-link:hover { color: var(--text); }

/* 滚动按钮 */
.scroll-buttons { position: fixed; right: 24px; bottom: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 101; }
.scroll-btn { width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 18px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; }
.scroll-btn:hover { border-color: var(--cyan); color: var(--cyan); }

/* 移动端适配 */
@media (max-width: 768px) {
  .toc { display: none; }
  .modal-overlay { padding: 0; align-items: flex-end; }
  .modal { border-radius: 16px 16px 0 0; max-height: 95vh; }
  .modal-header { padding: 16px 16px 0; }
  .modal-header h2 { font-size: 18px; }
  .modal-meta { flex-wrap: wrap; gap: 8px; font-size: 12px; padding: 8px 16px; }
  .modal-body { padding: 12px 16px 16px; font-size: 14px; line-height: 1.7; }
  .modal-body h1 { font-size: 20px; }
  .modal-body h2 { font-size: 18px; }
  .modal-body h3 { font-size: 16px; }
  .modal-body pre { padding: 12px; font-size: 12px; }
  .modal-body table { font-size: 12px; }
  .modal-body th, .modal-body td { padding: 6px 8px; }
  .modal-footer { padding: 12px 16px; }
  .scroll-buttons { right: 12px; bottom: 12px; }
  .scroll-btn { width: 36px; height: 36px; font-size: 16px; }
  .list { padding: 20px 16px; }
  .card-body { padding: 16px; }
  .card h3 { font-size: 16px; }
  .card p { font-size: 13px; }
}
</style>
