import type { Space, User, Post, Idea } from './types';
import { subDays, addDays } from 'date-fns';

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=AD' },
  { id: 'user-2', name: 'Samira Khan', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=SK' },
  { id: 'user-3', name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=CL' },
];

const fashionIdeas: Idea[] = [
    { id: 'idea-1', content: 'Behind the scenes of our new photoshoot.', createdBy: users[0], createdAt: '2023-10-25' },
    { id: 'idea-2', content: 'Spotlight on our sustainable materials.', createdBy: users[1], createdAt: '2023-10-26' },
];

const fashionPosts: Post[] = [
  {
    id: 'post-1',
    title: 'New Fall Collection Launch',
    content: '🍂 Our new fall collection is here! Discover earthy tones and cozy fabrics. Link in bio! #FallFashion #NewCollection',
    platform: 'instagram',
    status: 'published',
    scheduledAt: subDays(new Date(), 2),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'Created', date: '3 days ago' },
      { user: users[0], action: 'Marked as Published', date: '2 days ago' },
    ]
  },
  {
    id: 'post-2',
    title: 'Styling Tips Video',
    content: 'Get ready with us! Watch our latest video on 3 ways to style our classic white tee. #StyleTips #OOTD',
    platform: 'threads',
    status: 'ready',
    scheduledAt: addDays(new Date(), 1),
    createdBy: users[1],
    lastModifiedBy: users[2],
    imageUrl: 'https://placehold.co/400x600.png',
    activityLog: [
      { user: users[1], action: 'Created', date: '2 days ago' },
      { user: users[2], action: 'Updated content', date: '1 day ago' },
    ]
  },
  {
    id: 'post-3',
    title: 'Weekend Flash Sale',
    content: '⚡️FLASH SALE! Get 25% off all weekend. Use code WEEKEND25. Don\'t miss out! #FlashSale #WeekendVibes',
    platform: 'x',
    status: 'draft',
    scheduledAt: addDays(new Date(), 3),
    createdBy: users[2],
    lastModifiedBy: users[2],
    activityLog: [{ user: users[2], action: 'Created', date: '1 hour ago' }]
  },
];

const techIdeas: Idea[] = [
    { id: 'idea-3', content: 'Tutorial on our new API endpoint.', createdBy: users[0], createdAt: '2023-10-27' },
];

const techPosts: Post[] = [
  {
    id: 'post-4',
    title: 'v2.5 Product Update',
    content: '🚀 We\'ve just shipped v2.5! Featuring a redesigned dashboard and faster performance. Read the changelog here: [link] #ProductUpdate #SaaS',
    platform: 'linkedin',
    status: 'published',
    scheduledAt: subDays(new Date(), 5),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'Created', date: '6 days ago' },
      { user: users[0], action: 'Marked as Published', date: '5 days ago' },
    ]
  },
];


export const spaces: Space[] = [
  {
    id: 'space-1',
    name: 'Azure Fashion Store',
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
