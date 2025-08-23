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
  createdAt: string;
};

export type ActivityLog = {
  user: User;
  action: string;
  date: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  platform: Platform;
  status: PostStatus;
  scheduledAt: Date;
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
};
