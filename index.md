---
layout: home

hero:
  name: "血肉苦短研讨班"
  text: "👽"
  tagline: 群友讨论与分享 · 收集精彩内容
  actions:
    - theme: brand
      text: 浏览讨论
      link: /discussions
    - theme: alt
      text: GitHub
      link: https://github.com/BoHuYeShan/flesh-is-weak-seminar

features:
  - icon: ✍️
    title: 群友投稿
    details: PR 提交的优质文章和资源
  - icon: 📰
    title: 新闻
    details: 群友分享的最新资讯
  - icon: 🔧
    title: 小工具
    details: 群友开发的实用工具
  - icon: 💬
    title: 讨论
    details: 热门话题与交流
---

<script setup>
import { onMounted, ref, computed } from 'vue'

const discussions = ref([])
const contributors = ref([])
const stats = ref({ total: 0, news: 0, tools: 0, discussions: 0, contributors: 0 })
const loading = ref(true)
const activeCategory = ref('all')

const categories = [
  { id: 'all', name: '全部', emoji: '🔥' },
  { id: 'Announcements', name: '新闻', emoji: '📰' },
  { id: 'Show and tell', name: '小工具', emoji: '🔧' },
  { id: 'General', name: '讨论', emoji: '💬' }
]

const filtered = computed(() => {
  if (activeCategory.value === 'all') return discussions.value
  return discussions.value.filter(d => d.category === activeCategory.value)
})

onMounted(async () => {
  try {
    const res = await fetch('./data/discussions.json')
    const data = await res.json()
    discussions.value = data.discussions
    contributors.value = data.contributors
    stats.value = data.stats
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

function setCategory(id) { activeCategory.value = id }
</script>

<section class="sec">
  <div class="sec-head">
    <span class="lab">Discussions</span>
    <h2>最新讨论</h2>
  </div>
  <div class="cats">
    <button v-for="cat in categories" :key="cat.id" :class="{ on: activeCategory === cat.id }" @click="setCategory(cat.id)">
      {{ cat.emoji }} {{ cat.name }}
    </button>
  </div>
  <div v-if="loading" class="empty">加载中...</div>
  <div v-else-if="filtered.length === 0" class="empty">暂无讨论</div>
  <div v-else class="dlist">
    <a v-for="item in filtered" :key="item.id" :href="item.url" target="_blank" class="dcard">
      <div class="dcard-top">
        <img :src="item.avatar" :alt="item.author" class="avatar" />
        <div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.body }}</p>
        </div>
      </div>
      <div class="dcard-meta">
        <span>{{ item.author }}</span>
        <span>{{ item.dateFormatted }}</span>
        <span v-if="item.comments">💬 {{ item.comments }}</span>
      </div>
    </a>
  </div>
</section>

<section class="sec">
  <div class="sec-head">
    <span class="lab">Contributors</span>
    <h2>贡献者</h2>
  </div>
  <div v-if="loading" class="empty">加载中...</div>
  <div v-else class="contribs">
    <a v-for="c in contributors" :key="c.login" :href="c.url" target="_blank" class="contrib">
      <img :src="c.avatar" :alt="c.login" />
      <span>{{ c.login }}</span>
      <span class="count">{{ c.contributions }} commits</span>
    </a>
  </div>
</section>

<style>
.sec { max-width: 1080px; margin: 0 auto; padding: 80px 28px; }
.sec-head { margin-bottom: 40px; }
.lab { font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cyan); margin-bottom: 12px; display: block; }
.sec h2 { font-family: var(--font-display); font-size: clamp(28px, 4vw, 40px); line-height: 1.15; letter-spacing: -0.03em; font-weight: 700; color: var(--text); }
.cats { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.cats button { font-family: var(--font-mono); font-size: 13px; font-weight: 500; color: var(--muted); background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 8px 16px; cursor: pointer; transition: all 0.15s; }
.cats button.on { background: var(--cyan); border-color: var(--cyan); color: var(--bg); }
.cats button:hover:not(.on) { border-color: var(--cyan); color: var(--cyan); }
.dlist { display: grid; gap: 12px; }
.dcard { display: block; padding: 20px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
.dcard:hover { border-color: var(--cyan); transform: translateY(-2px); box-shadow: 0 4px 20px rgba(0, 229, 176, 0.1); }
.dcard-top { display: flex; gap: 16px; margin-bottom: 12px; }
.avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border); }
.dcard h3 { margin: 0 0 6px; font-family: var(--font-display); font-size: 16px; font-weight: 700; color: var(--text); }
.dcard p { margin: 0; font-size: 14px; color: var(--muted); line-height: 1.5; }
.dcard-meta { display: flex; gap: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--faint); }
.contribs { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 16px; }
.contrib { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; text-decoration: none; color: inherit; transition: all 0.2s; }
.contrib:hover { border-color: var(--cyan); transform: translateY(-2px); }
.contrib img { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid var(--border); }
.contrib span { font-family: var(--font-mono); font-size: 14px; font-weight: 600; color: var(--text); }
.contrib .count { font-size: 11px; color: var(--faint); font-weight: 400; }
.empty { padding: 40px 24px; text-align: center; color: var(--faint); font-family: var(--font-mono); font-size: 14px; }
@media (max-width: 768px) { .contribs { grid-template-columns: repeat(2, 1fr); } }
</style>
