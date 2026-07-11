export interface Statute {
  id: string;
  title: string;
  citation: string;
  category: string;
  description: string;
  keyPoints: string[];
  relevance: string;
}

export interface LayoutBlock {
  id: string;
  title: string;
  visible: boolean;
  order: number;
  customData: {
    heroTitle?: string;
    heroSubtitle?: string;
    heroAlertText?: string;
    pillars?: Array<{
      title: string;
      description: string;
      iconName: string;
    }>;
    timeline?: Array<{
      date: string;
      title: string;
      description: string;
      completed: boolean;
    }>;
    metrics?: Array<{
      label: string;
      value: number;
    }>;
    primaryColor?: string; // CSS-compatible class or hex
    accentColor?: string;
    basicLaws?: any[];
    legalMyths?: any[];
    libraryStatutes?: Statute[];
  };
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  comments: Array<{
    id: string;
    author: string;
    text: string;
    date: string;
  }>;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'spreadsheet' | 'text' | 'image';
  fileName: string;
  fileUrl: string; // Dynamic local endpoint or base64 data
  uploadedAt: string;
  fileSize: string;
  verifiedBy: string;
}

export interface AnonymousQuestion {
  id: string;
  text: string;
  timestamp: string;
  answered: boolean;
  answer?: string;
  isPublic: boolean;
  repliedBy?: string;
}

export interface NewsletterSub {
  id: string;
  email: string;
  subscribedAt: string;
}

export interface SocialPost {
  id: string;
  platform: "twitter" | "facebook" | "linkedin" | "instagram" | "youtube";
  username: string;
  handle: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  shares: number;
  comments: number;
}

export interface SentNewsletter {
  id: string;
  subject: string;
  badge: string;
  body: string;
  sentAt: string;
  recipientCount: number;
}

export interface CivicShieldData {
  blocks: LayoutBlock[];
  posts: BlogPost[];
  evidence: EvidenceItem[];
  questions: AnonymousQuestion[];
  subscribers: NewsletterSub[];
  socialFeed?: SocialPost[];
  newsletters?: SentNewsletter[];
  notificationLogs?: NotificationLog[];
  lastUpdated?: number;
}

export interface NotificationLog {
  id: string;
  timestamp: string;
  recipient: string;
  subject: string;
  body: string;
  status: 'sent' | 'failed' | 'simulated';
  previewUrl?: string;
}
