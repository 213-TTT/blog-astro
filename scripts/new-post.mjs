#!/usr/bin/env node
/**
 * 新建文章脚本
 * 用法：npm run new -- "文章标题" [--tags 标签1,标签2] [--publish]
 *
 * 默认生成草稿（draft: true），加 --publish 直接发布
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.resolve(__dirname, '../src/content/posts');

// 解析参数
const args = process.argv.slice(2);
let title = '';
let tags = [];
let draft = true;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--tags' && args[i + 1]) {
    tags = args[i + 1].split(',').map((t) => t.trim()).filter(Boolean);
    i++;
  } else if (arg === '--publish') {
    draft = false;
  } else if (!arg.startsWith('--')) {
    title = arg;
  }
}

if (!title) {
  console.error('❌ 请提供文章标题');
  console.error('用法：npm run new -- "文章标题" [--tags 标签1,标签2] [--publish]');
  process.exit(1);
}

// 生成 slug：中文保留，转小写，空格/特殊字符转短横线
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const slug = slugify(title);
if (!slug) {
  console.error('❌ 标题无法生成有效 slug');
  process.exit(1);
}

const postDir = path.join(postsDir, slug);
if (fs.existsSync(postDir)) {
  console.error(`❌ 文章已存在：${slug}`);
  process.exit(1);
}

// 生成日期（东八区）
function getToday() {
  const now = new Date();
  const tzOffset = 8 * 60; // 东八区分钟数
  const localOffset = now.getTimezoneOffset();
  const diff = (tzOffset + localOffset) * 60 * 1000;
  const d = new Date(now.getTime() + diff);
  return d.toISOString().slice(0, 10);
}

const date = getToday();

// 创建目录
fs.mkdirSync(postDir, { recursive: true });

// 生成 frontmatter
const tagsStr = tags.length > 0 ? `[${tags.map((t) => `"${t}"`).join(', ')}]` : '[]';
const frontmatter = `---
title: "${title}"
date: "${date}"
description: ""
tags: ${tagsStr}
draft: ${draft}
---

`;

const indexPath = path.join(postDir, 'index.md');
fs.writeFileSync(indexPath, frontmatter, 'utf-8');

console.log(`✅ 文章已创建：${slug}`);
console.log(`   文件：${indexPath}`);
console.log(`   状态：${draft ? '草稿（draft: true）' : '已发布'}`);
console.log('');
console.log('写完后，git add . && git commit && git push 即可上线');
