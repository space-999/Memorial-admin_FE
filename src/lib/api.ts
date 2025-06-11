
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
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new ApiError(response.status, `API Error: ${response.status}`);
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

  // Flower Messages APIs
  async getFlowerMessages(condition: AdminMessageSearchCondition = {}, pageable: Pageable = { page: 0, size: 20 }): Promise<FlowerMessagePageResponse> {
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
