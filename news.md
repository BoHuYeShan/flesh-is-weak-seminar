# 新闻

群友分享的最新资讯。

<script setup>
import { onMounted, ref } from 'vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await fetch('/flesh-is-weak-seminar/data/discussions.json')
    const data = await res.json()
    items.value = data.discussions.filter(d => d.category === 'Announcements')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<div v-if="loading" class="loading">加载中...</div>
<div v-else-if="items.length === 0" class="empty">暂无新闻</div>
<div v-else class="list">
  <a v-for="item in items" :key="item.id" :href="item.url" target="_blank" class="card">
    <div class="card-header">
      <img :src="item.avatar" :alt="item.author" class="avatar" />
      <div>
        <h3>{{ item.title }}</h3>
        <p>{{ item.body }}</p>
      </div>
    </div>
    <div class="card-meta">
      <span>{{ item.author }}</span>
      <span>{{ item.dateFormatted }}</span>
      <span v-if="item.comments">💬 {{ item.comments }}</span>
    </div>
  </a>
</div>

<style>
.list { display: grid; gap: 12px; max-width: 800px; margin: 0 auto; padding: 40px 28px; }
.card { display: block; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
.card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.card-header { display: flex; gap: 16px; margin-bottom: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; }
.card h3 { margin: 0 0 6px; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); }
.card p { margin: 0; font-size: 14px; color: var(--muted); }
.card-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); }
.loading, .empty { text-align: center; padding: 40px; color: var(--faint); font-family: var(--font-mono); }

/* 扩展资源区 */
.resources { max-width: 800px; margin: 0 auto; padding: 0 28px 60px; }
.resources-toggle {
  display: flex; align-items: center; gap: 10px;
  cursor: pointer; user-select: none;
  font-family: var(--font-mono); font-size: 13px; color: var(--muted);
  padding: 16px 0; border-top: 1px solid var(--border);
}
.resources-toggle:hover { color: var(--cyan); }
.resources-toggle .arrow { transition: transform 0.2s; }
.resources-toggle .arrow.open { transform: rotate(90deg); }
.resources-content { padding: 0 0 20px; }
.resources-content h2 {
  font-family: var(--font-display); font-size: 20px; font-weight: 700;
  color: var(--text); margin: 28px 0 12px;
}
.resources-content h3 {
  font-family: var(--font-display); font-size: 16px; font-weight: 700;
  color: var(--text); margin: 20px 0 10px;
}
.resources-content p { font-size: 14px; color: var(--muted); line-height: 1.7; margin: 8px 0; }
.resources-content table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px; }
.resources-content th, .resources-content td {
  border: 1px solid var(--border); padding: 8px 12px; text-align: left;
}
.resources-content th { background: var(--card); font-weight: 600; color: var(--text); }
.resources-content td { color: var(--muted); }
.resources-content a { color: var(--cyan); text-decoration: none; }
.resources-content a:hover { text-decoration: underline; }
.resources-content code {
  font-family: var(--font-mono); font-size: 12px;
  background: var(--card); padding: 2px 6px; border-radius: 4px; color: var(--cyan);
}
.resources-content pre {
  background: var(--card); border: 1px solid var(--border);
  border-radius: 8px; padding: 16px; overflow-x: auto; margin: 12px 0;
}
.resources-content pre code { background: none; padding: 0; color: var(--text); }
.resources-content blockquote {
  border-left: 3px solid var(--cyan); padding-left: 16px;
  margin: 16px 0; color: var(--muted); font-size: 14px;
}
.resources-note {
  background: var(--cyan-dim); border: 1px solid var(--cyan);
  border-radius: 8px; padding: 16px; margin: 20px 0;
  font-size: 13px; color: var(--text); line-height: 1.7;
}
.resources-note strong { color: var(--cyan); }
</style>
