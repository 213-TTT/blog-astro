import { getCollection } from 'astro:content';
import { TIME_ZONE } from '@/consts';

export type Post = Awaited<ReturnType<typeof getCollection<'posts'>>>[number];

/**
 * 获取所有已发布文章（过滤草稿），按日期倒序
 * 全站任何出口只用它，禁止直接调用 getCollection('posts')
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);
  return allPosts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 获取所有标签及其文章数量
 */
export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getPublishedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
    }
  }
  return tagMap;
}

/**
 * 按标签筛选文章
 */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((post) => post.data.tags.includes(tag));
}

/**
 * 按年份分组文章
 */
export async function getPostsByYear(): Promise<Map<number, Post[]>> {
  const posts = await getPublishedPosts();
  const yearMap = new Map<number, Post[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    const list = yearMap.get(year) ?? [];
    list.push(post);
    yearMap.set(year, list);
  }
  return yearMap;
}

/**
 * 获取上一篇 / 下一篇
 */
export async function getAdjacentPosts(id: string): Promise<{
  prev: Post | null;
  next: Post | null;
}> {
  const posts = await getPublishedPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? posts[idx - 1] : null,
    next: idx < posts.length - 1 ? posts[idx + 1] : null,
  };
}

/**
 * 格式化日期为中文可读格式
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TIME_ZONE,
  }).format(date);
}

/**
 * 格式化为 ISO 日期（用于 meta 等机器可读场景）
 * 用本地年月日拼，避免时区偏差
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
