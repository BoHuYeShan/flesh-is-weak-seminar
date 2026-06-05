# 血肉苦短研讨班 - AI 操作规范

> 适用工具: Codex, OpenCode, Pi

## 仓库信息

- 地址: https://github.com/BoHuYeShan/flesh-is-weak-seminar
- 框架: VitePress + Vue 3
- 部署: GitHub Pages
- 数据来源: GitHub Discussions API + submissions 目录

## 目录结构

```
submissions/              # 投稿内容（PR 提交）
├── _template/            # 模板（不要删除）
├── YYYY-MM-DD-title/     # 每篇投稿一个文件夹
│   ├── index.md          # 主要内容（必须）
│   ├── images/           # 图片（可选）
│   └── assets/           # 其他附件（可选）
.vitepress/               # VitePress 配置和主题
*.md                      # 页面文件
.github/workflows/        # GitHub Actions
```

## 内容来源

| 来源 | 提交方式 | 展示位置 | 更新机制 |
|------|----------|----------|----------|
| Discussions | GitHub 发帖 | 讨论区（新闻/小工具/讨论） | 每2小时自动 |
| Submissions | PR 提交 | 群友投稿 | 推送时触发构建 |

## 投稿规范（PR 提交）

### 文件夹命名

- 格式：`YYYY-MM-DD-简短描述`
- 使用小写字母和连字符
- 示例：`2024-01-15-ai-tools`、`2024-01-16-python-guide`

### index.md 格式

```markdown
---
title: 投稿标题
author: 你的昵称
date: 2024-01-15
tags: [标签1, 标签2]
summary: 一句话简介
cover: images/cover.png  # 可选
---

## 主要内容

正文...

![截图](images/screenshot.png)
```

### Frontmatter 字段

| 字段 | 必须 | 说明 |
|------|------|------|
| title | ✅ | 投稿标题 |
| author | ✅ | 作者昵称 |
| date | ✅ | 发布日期（YYYY-MM-DD） |
| tags | ✅ | 标签数组 |
| summary | ✅ | 一句话简介 |
| cover | ❌ | 封面图路径 |

### 图片和附件

- 图片放在 `images/` 目录
- 附件放在 `assets/` 目录
- 图片名使用小写字母和连字符
- 正文中用相对路径引用：`![描述](images/xxx.png)`

## Discussions 分类

| 分类 | 名称 | 用途 |
|------|------|------|
| Announcements | 新闻 | 最新资讯 |
| Show and tell | 小工具 | 工具分享 |
| General | 讨论 | 话题交流 |
| Q&A | 问答 | 问题求助 |

### 发布 Discussion（GH CLI 推荐）

```bash
gh api graphql -f query='
mutation {
  createDiscussion(input: {
    repositoryId: "R_kgDOSxxtPw",
    categoryId: "DIC_kwDOSxxtP84C-jY2",
    title: "标题",
    body: "内容"
  }) {
    discussion { url }
  }
}'
```

### 获取分类 ID

```bash
gh api graphql -f query='
query {
  repository(owner: "BoHuYeShan", name: "flesh-is-weak-seminar") {
    discussionCategories(first: 10) {
      nodes { id name }
    }
  }
}'
```

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
