# 血肉苦短研讨班 - AI 操作规范

> 适用工具: Codex, OpenCode, Pi

## 仓库信息

- 地址: https://github.com/BoHuYeShan/flesh-is-weak-seminar
- 框架: VitePress + Vue 3
- 部署: GitHub Pages

## 目录结构

```
.vitepress/          # VitePress 配置和主题
*.md                 # 页面文件（首页、新闻、工具、讨论、贡献者）
.github/workflows/   # GitHub Actions
```

## 禁止操作

- 删除任何 .md 文件
- 删除 .vitepress/ 目录
- 删除 .github/ 目录
- 执行 git push --force

## 本地开发

```bash
npm install
npm run dev
```

## 讨论内容

内容通过 GitHub Discussions API 实时获取，无需手动维护文件。
