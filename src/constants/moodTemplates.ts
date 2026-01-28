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
    copyright: '默认'
  },
  {
    id: 'notion-style',
    path: '/mood-avatars/templates/cat-style',
    name: '打工猫风格',
    description: '抽象风格，适合表达多样心情',
    copyright: '小红书用户：呼噜噜^'
  },
  {
    id:'line-dog',
    path: '/mood-avatars/templates/line-dog',
    name:"线条小狗",
    description:"线条小狗的一周精神状态",
    copyright:"小红书用户：RH",
  },
  {
    id:'wangzai-weekly',
    path:'/mood-avatars/templates/wangzai-weekly',
    name:'旺仔一周头像',
    description:'超可爱的旺仔一周头像快快换起来吧！',
    copyright:"小红书用户：旺仔俱乐部",
  }
  // more templates can be added here
];
