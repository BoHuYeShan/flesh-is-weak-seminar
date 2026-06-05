# 群友投稿

群友提交的优质内容。

<script setup>
import { onMounted, ref, computed } from 'vue'

const items = ref([])
const loading = ref(true)
const selectedItem = ref(null)
const showDetail = ref(false)

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
}

function closeDetail() {
  showDetail.value = false
  selectedItem.value = null
}

// 简单的 markdown 转 HTML
function renderMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^/, '<p>')
    .replace(/$/, '</p>')
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
    <div class="modal-header">
      <h2>{{ selectedItem.title }}</h2>
      <button class="close-btn" @click="closeDetail">✕</button>
    </div>
    <div class="modal-meta">
      <span>{{ selectedItem.author }}</span>
      <span>{{ selectedItem.date }}</span>
      <div class="modal-tags">
        <span v-for="tag in selectedItem.tags" :key="tag" class="tag">{{ tag }}</span>
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 0;
}
.modal-header h2 {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s;
}
.close-btn:hover { background: var(--card); color: var(--text); }
.modal-meta {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 12px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}
.modal-tags { display: flex; gap: 6px; }
.modal-body {
  padding: 0 24px 24px;
  font-size: 15px;
  line-height: 1.8;
  color: var(--text);
}
.modal-body h1, .modal-body h2, .modal-body h3 {
  font-family: var(--font-display);
  color: var(--text);
  margin: 24px 0 12px;
}
.modal-body h1 { font-size: 24px; }
.modal-body h2 { font-size: 20px; }
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
.modal-body li {
  margin: 4px 0 4px 20px;
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
</style>
