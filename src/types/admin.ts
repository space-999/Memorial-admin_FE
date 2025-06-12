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

// API 명세서와 동일한 DTO 인터페이스 추가
export interface AdminMessageSearchConditionDto {
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

// API 명세서와 동일한 DTO 인터페이스 추가
export interface AdminLogSearchConditionDto {
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

// API 명세서와 일치하는 응답 DTO 타입들
export interface AdminLoginResponseDto {
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
  loginFailCnt: string;
  adminCreateTime: string;
  adminPwdChgTime?: string;
}

// API 명세서와 일치하는 응답 DTO 타입 추가
export interface AdminAccountResponseDto {
  adminIndex: number;
  adminId: string;
  adminNickName: string;
  adminGrade: number;
  adminPhone?: string;
  accountNonLocked: boolean;
  lastLoginTime?: string;
  loginFailCnt: string;
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

// API 명세서와 일치하는 응답 DTO 타입 추가
export interface AdminFlowerMessageResponseDto {
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

// API 명세서와 일치하는 응답 DTO 타입 추가
export interface AdminLeafMessageResponseDto {
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

// API 명세서와 일치하는 응답 DTO 타입 추가
export interface AdminLoginHistResponseDto {
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

// API 명세서와 일치하는 응답 DTO 타입 추가
export interface AdminActHistResponseDto {
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

// API 명세서에 맞는 꽃 메시지 응답 타입 (ApiResponse로 감싸진 형태)
export interface FlowerMessagePageResponse {
  content: AdminFlowerMessageResponseDto[];
  totalPages: number;
  totalElements: number;
  pageNumber: number;
  size: number;
}

// 대시보드용 통계 (기존 유지)
export interface DashboardStats {
  totalFlowerMessages: number;
  totalLeafMessages: number;
  totalAdmins: number;
  todayLogins: number;
}
