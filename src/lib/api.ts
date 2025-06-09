
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
  async login(credentials: { username: string; password: string }) {
    return this.request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request('/admin/auth/logout');
  }

  // Flower Messages APIs
  async getFlowerMessages() {
    return this.request('/admin/flower-messages');
  }

  async updateFlowerMessage(messageId: number, data: any) {
    return this.request(`/admin/flower-messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteFlowerMessage(messageId: number) {
    return this.request(`/admin/flower-messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Leaf Messages APIs
  async getLeafMessages() {
    return this.request('/admin/leaf-messages');
  }

  async deleteLeafMessage(messageId: number) {
    return this.request(`/admin/leaf-messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  // Excel Download
  async downloadMessagesExcel() {
    const response = await fetch(`${this.baseUrl}/admin/messages/excel`, {
      credentials: 'include',
    });
    return response.blob();
  }

  // Admin Accounts APIs
  async getAdminAccounts() {
    return this.request('/admin/accounts');
  }

  async createAdminAccount(data: any) {
    return this.request('/admin/accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAdminAccount(adminIndex: number, data: any) {
    return this.request(`/admin/accounts/${adminIndex}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAdminAccount(adminIndex: number) {
    return this.request(`/admin/accounts/${adminIndex}`, {
      method: 'DELETE',
    });
  }

  async resetAdminPassword(adminIndex: number) {
    return this.request(`/admin/accounts/${adminIndex}/password-reset`, {
      method: 'POST',
    });
  }

  async updateMyInfo(data: any) {
    return this.request('/admin/accounts/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async updateMyPassword(data: any) {
    return this.request('/admin/accounts/me/password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Logs APIs
  async getLoginLogs() {
    return this.request('/admin/logs/logins');
  }

  async getActivityLogs() {
    return this.request('/admin/logs/activities');
  }
}

export const apiClient = new ApiClient(BASE_URL);
