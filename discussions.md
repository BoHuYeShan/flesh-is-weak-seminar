# 讨论

热门话题与交流。[发新讨论 →](https://github.com/BoHuYeShan/flesh-is-weak-seminar/discussions/new/choose)

<script setup>
import { onMounted, ref, computed } from 'vue'

const allItems = ref([])
const loading = ref(true)
const activeFilter = ref('all')

// 置顶讨论（按标题匹配）
const pinnedKeywords = ['省 token', '免费 token', 'token 技巧', '情报', '入门', '教程', '指南']

const items = computed(() => {
  let list = allItems.value
  if (activeFilter.value !== 'all') {
    list = list.filter(d => d.category === activeFilter.value)
  }
  // 置顶：匹配关键词的排前面
  const pinned = []
  const normal = []
  for (const item of list) {
    const isPinned = pinnedKeywords.some(kw => item.title.includes(kw))
    if (isPinned) pinned.push(item)
    else normal.push(item)
  }
  return [...pinned, ...normal]
})

const categories = computed(() => {
  const cats = new Map()
  for (const d of allItems.value) {
    const name = d.category || 'General'
    cats.set(name, (cats.get(name) || 0) + 1)
  }
  return [...cats.entries()].sort((a, b) => b[1] - a[1])
})

function isPinned(item) {
  return pinnedKeywords.some(kw => item.title.includes(kw))
}

onMounted(async () => {
  try {
    const res = await fetch('/flesh-is-weak-seminar/data/discussions.json')
    const data = await res.json()
    allItems.value = data.discussions || []
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<div v-if="loading" class="loading">加载中...</div>
<div v-else>
  <!-- 分类筛选 -->
  <div class="disc-filters">
    <button :class="['filter-btn', { active: activeFilter === 'all' }]" @click="activeFilter = 'all'">
      全部 ({{ allItems.length }})
    </button>
    <button v-for="[cat, count] in categories" :key="cat"
            :class="['filter-btn', { active: activeFilter === cat }]" @click="activeFilter = cat">
      {{ cat }} ({{ count }})
    </button>
  </div>

  <div v-if="items.length === 0" class="empty">暂无讨论</div>
  <div v-else class="disc-list">
    <a v-for="item in items" :key="item.id" :href="item.url" target="_blank" class="disc-card" :class="{ pinned: isPinned(item) }">
      <div class="disc-card-header">
        <img v-if="item.avatar" :src="item.avatar" :alt="item.author" class="disc-avatar" />
        <div class="disc-card-main">
          <div class="disc-card-title-row">
            <span v-if="isPinned(item)" class="pin-badge">📌</span>
            <h3>{{ item.title }}</h3>
          </div>
          <p class="disc-card-body">{{ item.body }}</p>
        </div>
      </div>
      <div class="disc-card-footer">
        <span class="disc-cat-badge">{{ item.categoryEmoji }} {{ item.category }}</span>
        <span class="disc-author">{{ item.author }}</span>
        <span class="disc-date">{{ item.dateFormatted }}</span>
        <span v-if="item.comments" class="disc-comments">💬 {{ item.comments }}</span>
      </div>
    </a>
  </div>
</div>

<style>
.disc-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto 24px;
  padding: 28px 28px 0;
}

.filter-btn {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--muted);
  padding: 6px 14px;
  border-radius: 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.filter-btn:hover { border-color: var(--cyan); color: var(--cyan); }
.filter-btn.active { border-color: var(--cyan); color: var(--cyan); background: var(--cyan-dim); }

.disc-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 28px 40px;
}

.disc-card {
  display: block;
  padding: 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.disc-card:hover { border-color: var(--cyan); transform: translateY(-2px); }
.disc-card.pinned { border-left: 3px solid var(--cyan); }

.disc-card-header { display: flex; gap: 14px; margin-bottom: 12px; }
.disc-avatar { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; }
.disc-card-main { flex: 1; min-width: 0; }
.disc-card-title-row { display: flex; align-items: flex-start; gap: 6px; margin-bottom: 6px; }
.pin-badge { font-size: 14px; flex-shrink: 0; margin-top: 2px; }
.disc-card-title-row h3 { margin: 0; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); line-height: 1.3; }
.disc-card-body {
  margin: 0;
  font-size: 13px;
  color: var(--muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.disc-card-footer {
  display: flex;
  gap: 12px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--faint);
  flex-wrap: wrap;
}

.disc-cat-badge {
  padding: 2px 8px;
  background: var(--cyan-dim);
  color: var(--cyan);
  border-radius: 4px;
  font-size: 10px;
}

.disc-comments { color: var(--cyan); }
.loading, .empty { text-align: center; padding: 40px; color: var(--faint); font-family: var(--font-mono); }
</style>
