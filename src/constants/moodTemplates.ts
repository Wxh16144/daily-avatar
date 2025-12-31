export interface MoodTemplate {
  id: string;
  path: string;
  name: string;
  description: string;
  copyright: string;
}

export const MOOD_TEMPLATES: MoodTemplate[] = [
  // 默认模板
  {
    id: 'default',
    path: '/mood-avatars',
    name: '默认风格',
    description: '默认的心情头像风格',
    copyright: '作者自制'
  },
  {
    id: 'notion-style',
    path: '/mood-avatars/templates/cat-style',
    name: '打工猫风格',
    description: '抽象风格，适合表达多样心情',
    copyright: '小红书用户：呼噜噜^'
  },
  // more templates can be added here
];
