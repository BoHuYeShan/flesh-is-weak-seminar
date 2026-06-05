# 新闻

群友分享的最新资讯。

<script setup>
import { onMounted, ref } from 'vue'

const items = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const query = `
      query {
        repository(owner: "BoHuYeShan", name: "flesh-is-weak-seminar") {
          discussions(first: 20, categoryId: "DIC_kwDOSxxtP84C-jY2", orderBy: {field: CREATED_AT, direction: DESC}) {
            nodes {
              number
              title
              body
              createdAt
              comments { totalCount }
              author { login avatarUrl }
              url
            }
          }
        }
      }
    `
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
    const data = await res.json()
    items.value = data.data.repository.discussions.nodes.map(d => ({
      id: d.number,
      title: d.title,
      body: d.body?.substring(0, 200) + '...',
      author: d.author?.login || 'Unknown',
      avatar: d.author?.avatarUrl || '',
      date: new Date(d.createdAt).toLocaleDateString('zh-CN'),
      comments: d.comments?.totalCount || 0,
      url: d.url
    }))
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
      <span>{{ item.date }}</span>
      <span v-if="item.comments">💬 {{ item.comments }}</span>
    </div>
  </a>
</div>

<style>
.list { display: grid; gap: 12px; max-width: 800px; margin: 0 auto; padding: 40px 28px; }
.card {
  display: block;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
.card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.card-header { display: flex; gap: 16px; margin-bottom: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; }
.card h3 { margin: 0 0 6px; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); }
.card p { margin: 0; font-size: 14px; color: var(--muted); }
.card-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); }
.loading, .empty { text-align: center; padding: 40px; color: var(--faint); font-family: var(--font-mono); }
</style>
