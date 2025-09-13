
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

export type ContentType = 'educational' | 'entertainment' | 'inspirational' | 'interactive' | 'promotional';

export type TargetMix = {
  educational: number;
  entertainment: number;
  inspirational: number;
  interactive: number;
  promotional: number;
};

export type Idea = {
  id: string;
  content: string;
  createdBy: User;
  createdAt: string; // Keep as ISO string for simplicity, or use Firestore Timestamp
  pillar?: {
    id: string;
    name: string;
    color: string;
  };
  contentType: ContentType;
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
  postType?: string; // e.g., 'text', 'image', 'poll'
  status: PostStatus;
  scheduledAt: Date | Timestamp; // Allow both for client and server
  createdBy: User;
  lastModifiedBy: User;
  imageUrl?: string;
  activityLog: ActivityLog[];
  spaceId?: string;
  spaceName?: string;
  pillar?: {
    id: string;
    name: string;
    color: string;
  };
  contentType: ContentType;
  fields?: { [key: string]: any }; // For dynamic fields like poll options
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
  compass?: Compass;
};

export type KPI = {
  id: string;
  metric: string;
  target: string;
};

export type Goal = {
  objective: string;
  kpis: KPI[];
};

export type Persona = {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  jobTitle: string;
  goals: string;
  challenges: string;
  preferredPlatforms: string;
};

export type ContentPillar = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type ToneOfVoice = {
  description: string;
  dos: string[];
  donts: string[];
};

export type PostType = {
  id: string; // e.g., 'linkedin-document'
  name: string; // e.g., 'Document Post'
  description: string;
  fields: {
    id: string; // e.g., 'documentTitle'
    name: string; // e.g., 'Document Title'
    type: 'text' | 'textarea' | 'options';
    placeholder?: string;
  }[];
  strategicNote?: string;
  systemReminder?: string;
};

export type ChannelStrategy = {
  platform: Platform;
  strategicGoal: string;
  // Array of PostType IDs, ordered by preference
  preferredPostTypes: string[];
  publishingChecklist: { id: string; task: string; completed: boolean }[];
};

export type Compass = {
  goals: Goal;
  personas: Persona[];
  pillars: ContentPillar[];
  tone: ToneOfVoice;
  targetMix?: TargetMix;
  channelStrategies?: ChannelStrategy[];
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
