
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
  inviteToken?: string; // Current active invite token (8-digit code)
};

export type InviteToken = {
    id: string;
    token: string; // 8-character alphanumeric code
    spaceId: string;
    spaceName: string;
    ownerId: string;
    ownerName: string;
    used: boolean;
    usedBy?: string; // userId who used the token
    usedAt?: Timestamp;
    expiresAt: Timestamp;
    createdAt: Timestamp;
}

// Keep old Invite type for backward compatibility during migration
export type Invite = {
    id: string;
    spaceId: string;
    spaceName: string;
    fromUser: User;
    toEmail: string;
    status: 'pending' | 'accepted' | 'declined';
    createdAt: Timestamp;
}

export type Notification = {
  id: string;
  userId: string; // The user who should receive the notification
  message: string;
  link: string; // e.g., `/spaces/{spaceId}`
  read: boolean;
  createdAt: Timestamp | Date;
};
