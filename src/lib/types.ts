
import type { Timestamp } from "firebase/firestore";

export type User = {
  id: string;
  name: string;
  avatarUrl: string;
  avatarColor?: string;
  avatarText?: string;
};

export type AppUser = {
  uid: string;
  email: string | null;
  name: string;
  avatarUrl: string;
  avatarColor?: string;
  avatarText?: string;
}

export type Platform = 'instagram' | 'x' | 'facebook' | 'linkedin' | 'threads' | 'tiktok' | 'snapchat' | 'email';

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
  id:string;
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledAt: Date | Timestamp; // Allow both for client and server
  createdBy: User;
  lastModifiedBy: User;
  imageUrl?: string;
  activityLog: ActivityLog[];
  spaceId?: string;
  spaceName?: string;
};

export type Space = {
  id: string;
  name: string;
  description: string;
  team: User[];
  memberIds: string[];
  posts: Post[];
  ideas: Idea[];
};

export type Notification = {
  id: string;
  userId: string; // The user who should receive the notification
  message: string;
  link: string; // e.g., `/spaces/{spaceId}`
  read: boolean;
  createdAt: Timestamp | Date;
};
