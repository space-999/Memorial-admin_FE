
import { 
  AdminLoginRequest, 
  AdminLoginResponse,
  AdminAccount, 
  FlowerMessage, 
  LeafMessage,
  AdminLoginHistory,
  AdminActivityHistory,
  AdminFlowerMessageUpdateRequest,
  AdminAccountCreateRequest,
  AdminAccountUpdateRequest,
  AdminProfileUpdateRequest,
  AdminPasswordUpdateRequest,
  AdminMessageSearchCondition,
  AdminLogSearchCondition,
  Pageable,
  ApiResponse,
  PageResponse,
  PageResponseWithSpring,
  FlowerMessagePageResponse
} from '@/types/admin';
import { promises } from 'dns';

const BASE_URL = 'http://localhost:8081';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      credentials: 'include', // 세션 쿠키 주고받기 위해 필수
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // 1. 에러 응답의 상세 내용을 먼저 추출 시도
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // 응답 본문이 비어있거나 JSON 형식이 아닐 경우 대비
        errorData = { message: `서버 오류: ${response.statusText || response.status}` };
      }
      
      const errorMessage = errorData.message || '알 수 없는 오류가 발생했습니다.';

      // 2. '세션 만료' 케이스를 전역에서 처리
      // 상태 코드가 401이고, 메시지에 특정 키워드가 포함된 경우에만 해당
      if (response.status === 401 && (errorMessage.includes('세션') || errorMessage.includes('만료') || errorMessage.includes('유효하지 않음'))) {
        alert('세션이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.');
        window.location.replace('/login'); // 프론트엔드 로그인 페이지 경로
        return new Promise(() => {}); // 다른 코드 실행 중단
      }
      
      // 3. 그 외 모든 에러는 구체적인 메시지와 함께 상위로 전달
      // (예: 비밀번호 불일치, 존재하지 않는 ID 등)
      throw new ApiError(response.status, errorMessage);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  // Auth APIs
  async login(credentials: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> {
    return this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request('/admin/auth/logout', {
      method: 'POST',
    });
  }

  // Flower Messages APIs - API 명세서에 맞게 ApiResponse로 감싸진 형태 반환
  async getFlowerMessages(condition: AdminMessageSearchCondition = {}, pageable: Pageable = { page: 0, size: 20 }): Promise<ApiResponse<FlowerMessagePageResponse>> {
    const params = new URLSearchParams();
    
    // 검색 조건을 쿼리 파라미터로 직접 추가 (condition. 접두사 제거)
    if (condition.searchKeyword) params.append('searchKeyword', condition.searchKeyword);
    if (condition.startDate) params.append('startDate', condition.startDate);
    if (condition.endDate) params.append('endDate', condition.endDate);
    if (condition.messageType) params.append('messageType', condition.messageType);
    if (condition.deleteFlag) params.append('deleteFlag', condition.deleteFlag);
    
    // 페이징 정보 추가
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(s => params.append('sort', s));
    }

    return this.request(`/admin/flower-messages?${params.toString()}`);
  }

  async updateFlowerMessage(messageId: number, data: AdminFlowerMessageUpdateRequest): Promise<ApiResponse<FlowerMessage>> {
    return this.request(`/admin/flower-messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFlowerMessage(messageId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/flower-messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Leaf Messages APIs
  async getLeafMessages(condition: AdminMessageSearchCondition = {}, pageable: Pageable = { page: 0, size: 20 }): Promise<ApiResponse<PageResponse<LeafMessage>>> {
    const params = new URLSearchParams();
    
    // 검색 조건을 쿼리 파라미터로 직접 추가 (condition. 접두사 제거)
    if (condition.searchKeyword) params.append('searchKeyword', condition.searchKeyword);
    if (condition.startDate) params.append('startDate', condition.startDate);
    if (condition.endDate) params.append('endDate', condition.endDate);
    if (condition.messageType) params.append('messageType', condition.messageType);
    if (condition.deleteFlag) params.append('deleteFlag', condition.deleteFlag);
    
    // 페이징 정보 추가
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(s => params.append('sort', s));
    }

    return this.request(`/admin/leaf-messages?${params.toString()}`);
  }

  async deleteLeafMessage(messageId: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/leaf-messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Excel Download
  async downloadMessagesExcel(condition: AdminMessageSearchCondition = {}): Promise<Blob> {
    const params = new URLSearchParams();
    
    // 검색 조건을 쿼리 파라미터로 직접 추가 (condition. 접두사 제거)
    if (condition.searchKeyword) params.append('searchKeyword', condition.searchKeyword);
    if (condition.startDate) params.append('startDate', condition.startDate);
    if (condition.endDate) params.append('endDate', condition.endDate);
    if (condition.messageType) params.append('messageType', condition.messageType);
    if (condition.deleteFlag) params.append('deleteFlag', condition.deleteFlag);

    const response = await fetch(`${this.baseUrl}/admin/messages/excel?${params.toString()}`, {
      credentials: 'include',
    });
    return response.blob();
  }

  // Admin Accounts APIs
  async getAdminAccounts(): Promise<ApiResponse<AdminAccount[]>> {
    return this.request('/admin/accounts');
  }

  async createAdminAccount(data: AdminAccountCreateRequest): Promise<ApiResponse<AdminAccount>> {
    return this.request('/admin/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdminAccount(adminIndex: number, data: AdminAccountUpdateRequest): Promise<ApiResponse<AdminAccount>> {
    return this.request(`/admin/accounts/${adminIndex}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminAccount(adminIndex: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/accounts/${adminIndex}`, {
      method: 'DELETE',
    });
  }

  async resetAdminPassword(adminIndex: number): Promise<ApiResponse<string>> {
    return this.request(`/admin/accounts/${adminIndex}/password-reset`, {
      method: 'POST',
    });
  }

  async unlockAdminAccount(adminIndex: number): Promise<ApiResponse<void>> {
    return this.request(`/admin/accounts/${adminIndex}/unlock`, {
      method: 'PUT',
    });
  }

  async updateMyProfile(data: AdminProfileUpdateRequest): Promise<ApiResponse<AdminAccount>> {
    return this.request('/admin/accounts/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateMyPassword(data: AdminPasswordUpdateRequest): Promise<ApiResponse<void>> {
    return this.request('/admin/accounts/me/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Logs APIs
  async getLoginLogs(condition: AdminLogSearchCondition = {}, pageable: Pageable = { page: 0, size: 20 }): Promise<ApiResponse<PageResponseWithSpring<AdminLoginHistory>>> {
    const params = new URLSearchParams();
    
    // 검색 조건을 쿼리 파라미터로 직접 추가 (condition. 접두사 제거)
    if (condition.adminId) params.append('adminId', condition.adminId);
    if (condition.startDate) params.append('startDate', condition.startDate);
    if (condition.endDate) params.append('endDate', condition.endDate);
    if (condition.ipAddress) params.append('ipAddress', condition.ipAddress);
    
    // 페이징 정보 추가
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(s => params.append('sort', s));
    }

    return this.request(`/admin/logs/logins?${params.toString()}`);
  }

  async getActivityLogs(condition: AdminLogSearchCondition = {}, pageable: Pageable = { page: 0, size: 20 }): Promise<ApiResponse<PageResponseWithSpring<AdminActivityHistory>>> {
    const params = new URLSearchParams();
    
    // 검색 조건을 쿼리 파라미터로 직접 추가 (condition. 접두사 제거)
    if (condition.adminId) params.append('adminId', condition.adminId);
    if (condition.startDate) params.append('startDate', condition.startDate);
    if (condition.endDate) params.append('endDate', condition.endDate);
    if (condition.ipAddress) params.append('ipAddress', condition.ipAddress);
    if (condition.actType) params.append('actType', condition.actType);
    
    // 페이징 정보 추가
    params.append('page', pageable.page.toString());
    params.append('size', pageable.size.toString());
    if (pageable.sort) {
      pageable.sort.forEach(s => params.append('sort', s));
    }

    return this.request(`/admin/logs/activites?${params.toString()}`);
  }
}

export const apiClient = new ApiClient(BASE_URL);
