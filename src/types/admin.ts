
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminAccount {
  adminIndex: number;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLoginAt?: string;
}

export interface FlowerMessage {
  messageId: number;
  content: string;
  authorName: string;
  createdAt: string;
  isVisible: boolean;
}

export interface LeafMessage {
  messageId: number;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface LoginLog {
  logId: number;
  adminIndex: number;
  adminName: string;
  loginTime: string;
  ipAddress: string;
  userAgent: string;
}

export interface ActivityLog {
  logId: number;
  adminIndex: number;
  adminName: string;
  action: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface DashboardStats {
  totalFlowerMessages: number;
  totalLeafMessages: number;
  totalAdmins: number;
  todayLogins: number;
}
