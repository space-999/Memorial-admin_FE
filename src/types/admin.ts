
// API 요청 타입들
export interface AdminLoginRequest {
  adminId: string;
  adminPwd: string;
}

export interface AdminFlowerMessageUpdateRequest {
  content: string;
}

export interface AdminAccountCreateRequest {
  adminId: string;
  adminPwd: string;
  adminNickName: string;
  adminGrade: number;
  adminPhone?: string;
}

export interface AdminAccountUpdateRequest {
  adminNickName?: string;
  adminGrade?: number;
  adminPhone?: string;
}

export interface AdminProfileUpdateRequest {
  adminNickName?: string;
  adminPhone?: string;
}

export interface AdminPasswordUpdateRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AdminMessageSearchCondition {
  searchKeyword?: string;
  startDate?: string;
  endDate?: string;
  messageType?: 'FLOWER' | 'LEAF';
  deleteFlag?: 'Y' | 'N';
}

export interface AdminLogSearchCondition {
  adminId?: string;
  startDate?: string;
  endDate?: string;
  ipAddress?: string;
  actType?: string;
}

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

// API 응답 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface AdminLoginResponse {
  sessionId: string;
  adminId: string;
  adminNickName: string;
  adminGrade: number;
  lastLoginTime: string;
}

export interface AdminAccount {
  adminIndex: number;
  adminId: string;
  adminNickName: string;
  adminGrade: number;
  adminPhone?: string;
  accountNonLocked: boolean;
  lastLoginTime?: string;
  loginFailCnt: number;
  adminCreateTime: string;
  adminPwdChgTime?: string;
}

export interface FlowerMessage {
  id: number;
  content: string;
  createdAt: string;
  deleteFlag: string;
  updatedAt?: string;
  messageType: 'FLOWER' | 'LEAF';
}

export interface LeafMessage {
  id: number;
  content: string;
  createdAt: string;
  deleteFlag: string;
  updatedAt?: string;
  messageType: 'FLOWER' | 'LEAF';
}

export interface AdminLoginHistory {
  loginIndex: number;
  adminIndex: number;
  adminId: string;
  adminNickname: string;
  loginIp: string;
  loginTime: string;
}

export interface AdminActivityHistory {
  actIndex: number;
  adminIndex: number;
  adminId: string;
  adminNickName: string;
  actType: string;
  actUrl: string;
  actDetail: string;
  actIp: string;
  actTime: string;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  size: number;
}

export interface PageResponseWithSpring<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  content: T[];
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// 대시보드용 통계 (기존 유지)
export interface DashboardStats {
  totalFlowerMessages: number;
  totalLeafMessages: number;
  totalAdmins: number;
  todayLogins: number;
}
