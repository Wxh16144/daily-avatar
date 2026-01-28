export interface MoodTemplate {
  id: string;
  path: string;
  name: string;
  description: string;
  copyright: string;
  url?: string;
}

export const MOOD_TEMPLATES: MoodTemplate[] = [
  // 默认模板
  {
    id: 'default',
    path: '/mood-avatars',
    name: '默认风格',
    description: '默认的心情头像风格',
    copyright: '默认',
    url: 'https://github.com/Wxh16144/daily-avatar'
  },
  {
    id: 'notion-style',
    path: '/mood-avatars/templates/cat-style',
    name: '打工猫风格',
    description: '抽象风格，适合表达多样心情',
    copyright: '小红书用户：呼噜噜^',
    url: 'http://xhslink.com/o/3IpDqAMBT3o'
  },
  {
    id:'line-dog',
    path: '/mood-avatars/templates/line-dog',
    name:"线条小狗",
    description:"线条小狗的一周精神状态",
    copyright:"小红书用户：RH",
    url: 'http://xhslink.com/o/7WdVDuLOhNC'
  },
  {
    id:'wangzai-weekly',
    path:'/mood-avatars/templates/wangzai-weekly',
    name:'旺仔一周头像',
    description:'超可爱的旺仔一周头像快快换起来吧！',
    copyright:"小红书用户：旺仔俱乐部",
    url: 'http://xhslink.com/o/1MR3rhW37dA'
  }
  // more templates can be added here
];
