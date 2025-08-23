import type { Space, User, Post, Idea } from './types';
import { subDays, addDays } from 'date-fns';

export const users: User[] = [
  { id: 'user-1', name: 'أحمد عبدالله', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=أع' },
  { id: 'user-2', name: 'سميرة خان', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=سخ' },
  { id: 'user-3', name: 'كريس لي', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=كل' },
];

const fashionIdeas: Idea[] = [
    { id: 'idea-1', content: 'خلف كواليس جلسة التصوير الجديدة.', createdBy: users[0], createdAt: '2023-10-25' },
    { id: 'idea-2', content: 'تسليط الضوء على موادنا المستدامة.', createdBy: users[1], createdAt: '2023-10-26' },
];

const fashionPosts: Post[] = [
  {
    id: 'post-1',
    title: 'إطلاق مجموعة الخريف الجديدة',
    content: '🍂 مجموعة الخريف الجديدة وصلت! اكتشفوا الألوان الترابية والأقمشة المريحة. الرابط في البايو! #موضة_الخريف #مجموعة_جديدة',
    platform: 'instagram',
    status: 'published',
    scheduledAt: subDays(new Date(), 2),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'أنشأ', date: 'منذ ٣ أيام' },
      { user: users[0], action: 'وضع علامة "تم النشر"', date: 'منذ يومين' },
    ]
  },
  {
    id: 'post-2',
    title: 'فيديو نصائح لتنسيق الملابس',
    content: 'استعدوا معنا! شاهدوا أحدث فيديوهاتنا عن ٣ طرق لتنسيق تيشيرت أبيض كلاسيكي. #نصائح_موضة #إطلالة_اليوم',
    platform: 'threads',
    status: 'ready',
    scheduledAt: addDays(new Date(), 1),
    createdBy: users[1],
    lastModifiedBy: users[2],
    imageUrl: 'https://placehold.co/400x600.png',
    activityLog: [
      { user: users[1], action: 'أنشأ', date: 'منذ يومين' },
      { user: users[2], action: 'حدّث المحتوى', date: 'منذ يوم واحد' },
    ]
  },
  {
    id: 'post-3',
    title: 'تخفيضات نهاية الأسبوع',
    content: '⚡️ تخفيضات مفاجئة! خصم 25% طوال نهاية الأسبوع. استخدموا كود WEEKEND25. لا تفوتوا الفرصة! #تخفيضات #أجواء_الويكند',
    platform: 'x',
    status: 'draft',
    scheduledAt: addDays(new Date(), 3),
    createdBy: users[2],
    lastModifiedBy: users[2],
    activityLog: [{ user: users[2], action: 'أنشأ', date: 'منذ ساعة' }]
  },
];

const techIdeas: Idea[] = [
    { id: 'idea-3', content: 'درس تعليمي حول نقطة النهاية الجديدة لواجهة برمجة التطبيقات.', createdBy: users[0], createdAt: '2023-10-27' },
];

const techPosts: Post[] = [
  {
    id: 'post-4',
    title: 'تحديث المنتج الإصدار 2.5',
    content: '🚀 أطلقنا للتو الإصدار 2.5! يتميز بلوحة تحكم معاد تصميمها وأداء أسرع. اقرأ سجل التغييرات هنا: [رابط] #تحديث_المنتج #SaaS',
    platform: 'linkedin',
    status: 'published',
    scheduledAt: subDays(new Date(), 5),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'أنشأ', date: 'منذ ٦ أيام' },
      { user: users[0], action: 'وضع علامة "تم النشر"', date: 'منذ ٥ أيام' },
    ]
  },
];


export const spaces: Space[] = [
  {
    id: 'space-1',
    name: 'متجر أزياء أزور',
    team: [users[0], users[1], users[2]],
    posts: fashionPosts,
    ideas: fashionIdeas
  },
  {
    id: 'space-2',
    name: 'Innovatech SaaS',
    team: [users[0], users[2]],
    posts: techPosts,
    ideas: techIdeas
  },
];

export const teamMembers = [users[0], users[1]];
export const teamInviteToken = 'a1b2c3d4e5';
