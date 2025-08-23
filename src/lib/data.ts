import type { Space, User, Post, Idea } from './types';
import { subDays, addDays } from 'date-fns';

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=AD' },
  { id: 'user-2', name: 'Sarah Khan', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=SK' },
  { id: 'user-3', name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=CL' },
];

const fashionIdeas: Idea[] = [
    { id: 'idea-1', content: 'Behind the scenes of the new photoshoot.', createdBy: users[0], createdAt: '2023-10-25' },
    { id: 'idea-2', content: 'Highlight our sustainable materials.', createdBy: users[1], createdAt: '2023-10-26' },
];

const fashionPosts: Post[] = [
  {
    id: 'post-1',
    title: 'New Autumn Collection Launch',
    content: '🍂 Our new Autumn collection has arrived! Discover earthy tones and cozy fabrics. Link in bio! #fallfashion #newcollection',
    platform: 'instagram',
    status: 'published',
    scheduledAt: subDays(new Date(), 2),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'created', date: '3 days ago' },
      { user: users[0], action: 'marked as published', date: '2 days ago' },
    ]
  },
  {
    id: 'post-2',
    title: 'Styling Tips Video',
    content: 'Get ready with us! Check out our latest reel on 3 ways to style a classic white tee. #styletips #ootd',
    platform: 'threads',
    status: 'ready',
    scheduledAt: addDays(new Date(), 1),
    createdBy: users[1],
    lastModifiedBy: users[2],
    imageUrl: 'https://placehold.co/400x600.png',
    activityLog: [
      { user: users[1], action: 'created', date: '2 days ago' },
      { user: users[2], action: 'updated content', date: '1 day ago' },
    ]
  },
  {
    id: 'post-3',
    title: 'Weekend Flash Sale',
    content: '⚡️ Flash Sale! 25% off all weekend. Use code WEEKEND25. Don\'t miss out! #sale #weekendvibes',
    platform: 'x',
    status: 'draft',
    scheduledAt: addDays(new Date(), 3),
    createdBy: users[2],
    lastModifiedBy: users[2],
    activityLog: [{ user: users[2], action: 'created', date: '1 hour ago' }]
  },
];

const techIdeas: Idea[] = [
    { id: 'idea-3', content: 'Tutorial on the new API endpoint.', createdBy: users[0], createdAt: '2023-10-27' },
];

const techPosts: Post[] = [
  {
    id: 'post-4',
    title: 'Product Update v2.5',
    content: '🚀 We just launched v2.5! Featuring a redesigned dashboard and faster performance. Read the changelog here: [link] #productupdate #SaaS',
    platform: 'linkedin',
    status: 'published',
    scheduledAt: subDays(new Date(), 5),
    createdBy: users[0],
    lastModifiedBy: users[0],
    imageUrl: 'https://placehold.co/600x400.png',
    activityLog: [
      { user: users[0], action: 'created', date: '6 days ago' },
      { user: users[0], action: 'marked as published', date: '5 days ago' },
    ]
  },
];


export let spaces: Space[] = [
  {
    id: 'space-1',
    name: 'Azure Fashion Store',
    team: [users[0], users[1], users[2]],
    posts: fashionPosts,
    ideas: fashionIdeas,
    inviteToken: 'AZRFSHN-A4B1'
  },
  {
    id: 'space-2',
    name: 'Innovatech SaaS',
    team: [users[0], users[2]],
    posts: techPosts,
    ideas: techIdeas,
    inviteToken: 'INVTCH-C8D9'
  },
];
