# 血肉苦短研讨班 - AI 操作规范

> 适用工具: Codex, OpenCode, Pi

## 核心逻辑

**投稿只需要传一个 markdown 文件，其他代码都不用改。**

## 仓库信息

- 地址: https://github.com/BoHuYeShan/flesh-is-weak-seminar
- 框架: VitePress + Vue 3
- 部署: GitHub Pages

## 两种内容来源

### 1. 投稿（PR 提交）

**操作：在 `submissions/` 下创建文件夹，放入 `index.md`，提交 PR。**

```
submissions/
└── YYYY-MM-DD-简短描述/
    └── index.md              ← 唯一必须的文件
```

index.md 格式：
```markdown
---
title: 标题
author: 作者
date: 2026-06-05
tags: [标签1, 标签2]
summary: 一句话简介
license: CC BY 4.0
---

正文内容...
```

**关于 `license` 字段：**
- AI 撰写投稿时，根据内容性质自动选择合适的协议，默认填 `CC BY 4.0`
- 常用选项：`CC BY 4.0`（署名）、`CC BY-SA 4.0`（署名-相同方式共享）、`CC BY-NC 4.0`（署名-非商业性使用）、`MIT`（代码示例）
- 如原项目有明确协议，优先标注原项目协议

### 2. 讨论（Discussions）

**操作：用 GH CLI 或浏览器在 GitHub Discussions 发帖。**

分类：
- Announcements（新闻）
- Show and tell（小工具）
- General（讨论）
- Q&A（问答）

GH CLI 发帖：
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

## 图片使用

投稿需要图片时：
1. 在文件夹里创建 `images/` 目录
2. 把图片放进去
3. 正文中引用：`![描述](images/xxx.png)`

## 禁止操作

- 删除 submissions/ 目录下的文件
- 删除 .vitepress/ 目录
- 删除 .github/ 目录
- 执行 git push --force
- 修改其他代码文件（投稿不需要）

## 本地开发

```bash
npm install
npm run dev
```
