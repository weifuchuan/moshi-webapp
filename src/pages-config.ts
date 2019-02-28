export interface Page {
  name: string; // 页面名，需与目录名相同
  entry?: string; // 入口js|jsx|ts|tsx文件，默认index.tsx
  template?: string; // .html模板文件名，如有，应为相对于该页面目录的html文件路径；否则为 public/index.html
  filename?: string; // 输出文件名，默认 <name>.html
  title?: string; // html的title, 默认 name
  inlineSource?: string; // 正则表达式，代表内联到html中的资源，如：'.(js|css)$'
}

export default [
  {
    name: 'article',
    entry: 'index.ts',
    template: 'index.html',
    inlineSource: '.(js|css)$'
  },
  {
    name: 'content',
    entry: 'index.ts',
    template: 'index.html',
    inlineSource: '.(js|css)$'
  },
  {
    name: 'article-comment-editor',
    inlineSource: '.(js|css)$'
  },
  {
    name: 'issue-editor',
    inlineSource: '.(js|css)$'
  },
  {
    name: 'issue-list',
    entry: 'index.ts',
    template: 'index.html',
    inlineSource: '.(js|css)$'
  },
  {
    name: 'issue',
    entry: 'index.ts',
    template: 'index.html',
    inlineSource: '.(js|css)$'
  }
] as Page[];
