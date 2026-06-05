# 血肉苦短研讨班 - Claude Code 规范

> 适用工具: Claude Code

## 仓库信息

- 地址: https://github.com/BoHuYeShan/flesh-is-weak-seminar
- 框架: VitePress + Vue 3
- 部署: GitHub Pages

## 目录结构

```
submissions/              # 投稿内容（PR 提交）
├── _template/            # 模板
├── YYYY-MM-DD-title/     # 每篇投稿一个文件夹
│   ├── index.md          # 主要内容（必须）
│   ├── images/           # 图片（可选）
│   └── assets/           # 其他附件（可选）
.vitepress/               # VitePress 配置
*.md                      # 页面文件
```

## 投稿规范

### 文件夹命名

- 格式：`YYYY-MM-DD-简短描述`
- 小写字母和连字符
- 示例：`2024-01-15-ai-tools`

### index.md 格式

```markdown
---
title: 投稿标题
author: 你的昵称
date: 2024-01-15
tags: [标签1, 标签2]
summary: 一句话简介
cover: images/cover.png
---

正文内容...
```

### 图片引用

- 图片放在 `images/` 目录
- 正文中用相对路径：`![描述](images/xxx.png)`

## Discussions 分类

| 分类 | 名称 | 用途 |
|------|------|------|
| Announcements | 新闻 | 最新资讯 |
| Show and tell | 小工具 | 工具分享 |
| General | 讨论 | 话题交流 |
| Q&A | 问答 | 问题求助 |

## 禁止操作

- 删除 submissions/ 目录下的任何文件
- 删除 .vitepress/ 目录
- 删除 .github/ 目录
- 执行 git push --force

## 本地开发

```bash
npm install
npm run dev
```
