import type { User } from './types';

// This file now only contains mock user data.
// Spaces, Posts, and Ideas are now fetched from Firestore.

export const users: User[] = [
  { id: 'user-1', name: 'Alex Doe', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=AD' },
  { id: 'user-2', name: 'Sarah Khan', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=SK' },
  { id: 'user-3', name: 'Chris Lee', avatarUrl: 'https://placehold.co/100x100/EFEFEFF/333333?text=CL' },
];
