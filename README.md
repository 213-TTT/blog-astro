# Featon Blog

基于 [Astro](https://astro.build/) 构建的个人博客，部署在 GitHub Pages 上。

线上地址：https://213-TTT.github.io/blog-astro/

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发
npm run dev
# 访问 http://localhost:4321/blog-astro/

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 写文章

```bash
# 新建草稿（默认 draft: true，线上不显示）
npm run new -- "我的文章标题"

# 新建并指定标签
npm run new -- "我的文章标题" --tags 前端,笔记

# 直接发布（draft: false）
npm run new -- "我的文章标题" --publish
```

生成的文章位于 `src/content/posts/<slug>/index.md`，配图放在同一目录下即可。

### 文章 frontmatter

```yaml
---
title: "文章标题"           # 必填
date: "2026-11-17"         # 必填，必须加引号，格式 YYYY-MM-DD
description: "文章摘要"     # 可选，显示在列表页
tags: ["标签1", "标签2"]    # 可选，默认空数组
draft: false                # 可选，默认 true（草稿不发布）
---
```

## 发布流程

```bash
git add .
git commit -m "feat: 新增文章 xxx"
git push
```

推送到 `main` 分支后，GitHub Actions 会自动构建并部署。

## 目录结构

```
src/
├── components/       # 组件（布局、导航、文章列表等）
├── content/
│   ├── posts/        # 文章（一篇文章一个目录）
│   │   └── hello-world/
│   │       ├── index.md
│   │       └── cover.jpg
│   └── pages/        # 独立页面（关于页等）
├── lib/              # 工具函数
├── pages/            # 路由页面
├── styles/           # 全局样式
└── consts.ts         # 站点常量（改文案只改这里）
```

## 重要规则

1. **草稿不会被发布** —— `draft: true` 的文章只在本地可见
2. **图片放同目录** —— 文章配图放在文章目录里，用相对路径引用：`![](./cover.jpg)`
3. **文章地址不可改** —— 目录名就是 URL 里的 slug，建好后不要改
4. **日期加引号** —— `date` 字段必须是加引号的字符串，如 `date: "2026-11-17"`
