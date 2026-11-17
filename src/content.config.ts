import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/index.md',
    generateId: ({ entry }) => entry.replace(/\/?index\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1, 'title 不能为空'),
      // 严格字符串日期：必须加引号，格式 YYYY-MM-DD
      // 不能用 z.coerce.date()——YAML 会把未加引号的非法日期解析溢出
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'date 必须是 "YYYY-MM-DD" 格式的字符串（加引号）')
        .refine(
          (s) => {
            const [y, m, d] = s.split('-').map(Number);
            const date = new Date(y, m - 1, d);
            // 回验：年月日都对得上才是合法日期（过滤 2026-13-45 这种溢出）
            return (
              date.getFullYear() === y &&
              date.getMonth() === m - 1 &&
              date.getDate() === d
            );
          },
          (s) => ({ message: `date "${s}" 不是合法日期` }),
        )
        // 统一转为东八区零点的 Date 对象
        .transform((s) => {
          const [y, m, d] = s.split('-').map(Number);
          return new Date(y, m - 1, d, 0, 0, 0);
        }),
      description: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      cover: image().optional(),
    }),
});

export const collections = { posts };
