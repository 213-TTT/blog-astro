/**
 * 统一处理带 base 的内部链接
 * 所有页面、组件的内部链接必须走这个函数，避免项目站点 404
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : '/' + path;
  return base + normalized;
}
