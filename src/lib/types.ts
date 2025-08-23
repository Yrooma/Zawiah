import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

export type Platform = 'instagram' | 'x' | 'facebook' | 'linkedin' | 'threads';

export type PostStatus = 'draft' | 'ready' | 'published';

export type Idea = {
  id: string;
  content: string;
  createdBy: User;
  createdAt: string; // Keep as ISO string for simplicity, or use Firestore Timestamp
};

export type ActivityLog = {
  user: User;
  action: string;
  date: string; // Keep as string for simplicity
};

export type Post = {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledAt: Date | Timestamp; // Allow both for client and server
  createdBy: User;
  lastModifiedBy: User;
  imageUrl?: string;
  activityLog: ActivityLog[];
};

export type Space = {
  id: string;
  name: string;
  team: User[];
  posts: Post[];
  ideas: Idea[];
  inviteToken?: string;
};
