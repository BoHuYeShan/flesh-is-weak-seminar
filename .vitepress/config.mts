import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '血肉苦短研讨班',
  description: '群友讨论与分享',
  base: '/flesh-is-weak-seminar/',
  
  srcExclude: ['submissions/**'],
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/flesh-is-weak-seminar/favicon.svg' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=JetBrains+Mono:wght@300;400;500;700&family=LXGW+WenKai:wght@300;400;700&display=swap', rel: 'stylesheet' }]
  ],
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '投稿', link: '/submissions' },
      { text: '新闻', link: '/news' },
      { text: '小工具', link: '/tools' },
      { text: '讨论', link: '/discussions' },
      { text: '贡献者', link: '/contributors' },
      { text: 'GitHub', link: 'https://github.com/BoHuYeShan/flesh-is-weak-seminar' }
    ],
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/BoHuYeShan/flesh-is-weak-seminar' }
    ],
    
    footer: {
      message: '由血肉苦短研讨班群友共同维护',
      copyright: 'MIT License'
    }
  }
})
