# 血肉苦短研讨班 - GitHub Copilot 规范

> 适用工具: GitHub Copilot

## 仓库信息

- 地址: https://github.com/BoHuYeShan/flesh-is-weak-seminar
- 框架: VitePress + Vue 3
- 部署: GitHub Pages
- 数据来源: GitHub Discussions API（实时获取，无需重建）

## Discussions 分类

本仓库使用 GitHub Discussions 作为内容来源，共 4 个分类：

| 分类 | 名称 | 用途 | 示例 |
|------|------|------|------|
| Announcements | 新闻 | 群友分享的最新资讯 | 技术新闻、行业动态、开源项目发布 |
| Show and tell | 小工具 | 群友开发的实用工具 | CLI 工具、浏览器插件、VS Code 扩展 |
| General | 讨论 | 热门话题与交流 | 技术讨论、经验分享、问答求助 |
| Q&A | 问答 | 问题求助 | Bug 求助、配置问题、使用疑问 |

## 发布 Discussion

### 方式一：GH CLI（推荐）

```bash
# 创建讨论
gh api graphql -f query='
mutation {
  createDiscussion(input: {
    repositoryId: "R_kgDOSxxtPw",
    categoryId: "DIC_kwDOSxxtP84C-jY3",
    title: "讨论标题",
    body: "讨论内容"
  }) {
    discussion {
      url
    }
  }
}'
```

### 方式二：浏览器操控

使用 Playwright 或 agent-browser 等工具操控浏览器：

1. 打开 https://github.com/BoHuYeShan/flesh-is-weak-seminar/discussions/new
2. 选择分类
3. 填写标题和内容
4. 点击提交

### 方式三：手动发布

直接在 GitHub 网页端操作。

## 创建 Discussion 规范

1. **选择正确的分类** - 根据内容性质选择对应分类
2. **标题简洁明了** - 一句话描述内容
3. **正文详细** - 包含背景、内容、链接
4. **添加图片** - 支持直接上传图片

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
