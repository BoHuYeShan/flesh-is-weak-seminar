# 群友投稿

群友提交的优质内容。

<script setup>
import { onMounted, ref } from 'vue'

const items = ref([])
const loading = ref(true)

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
</script>

<div v-if="loading" class="loading">加载中...</div>
<div v-else-if="items.length === 0" class="empty">暂无投稿，快来提交第一篇吧！</div>
<div v-else class="list">
  <a v-for="item in items" :key="item.folder" :href="'https://github.com/BoHuYeShan/flesh-is-weak-seminar/blob/main/submissions/' + item.folder + '/index.md'" target="_blank" class="card">
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
  </a>
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
  text-decoration: none;
  color: inherit;
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
</style>
