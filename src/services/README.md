# API Services Documentation

## Tổng quan

Dự án này sử dụng Axios để giao tiếp với Backend API. Cấu trúc được thiết kế để clean, có thể tái sử dụng và dễ bảo trì.

## Cấu trúc thư mục

```
src/services/
├── apiClient.ts          # Axios instance và interceptors
├── baseService.ts        # Base class cho tất cả services
├── healthService.ts      # Health check service
├── authService.ts        # Authentication service
├── uploadService.ts      # File upload service
├── index.ts             # Export tất cả services
└── README.md            # Documentation này
```

## Cách sử dụng

### 1. Sử dụng trực tiếp API Client

```typescript
import { apiClient, api } from '@/services';

// Sử dụng apiClient trực tiếp
const response = await apiClient.get('/users');
const users = response.data.data;

// Sử dụng helper functions
const users = await api.get<User[]>('/users');
const newUser = await api.post<User>('/users', userData);
```

### 2. Sử dụng Services

```typescript
import { authService, uploadService, healthService } from '@/services';

// Authentication
const user = await authService.login({ email, password });
const profile = await authService.getProfile();

// File Upload
const result = await uploadService.uploadSingleFile(file, {
  onProgress: (progress) => console.log(`Upload: ${progress}%`),
  onSuccess: (response) => console.log('Upload successful'),
  onError: (error) => console.error('Upload failed:', error)
});

// Health Check
const health = await healthService.checkHealth();
```

### 3. Sử dụng React Hooks

```typescript
import { useApi, useFileUpload } from '@/hooks/useApi';
import { authService, uploadService } from '@/services';

function LoginForm() {
  const login = usePost(authService.login.bind(authService), {
    onSuccess: (data) => {
      console.log('Login successful:', data);
      // Redirect or update state
    },
    onError: (error) => {
      console.error('Login failed:', error);
      // Show error message
    }
  });

  const handleSubmit = async (credentials) => {
    await login.execute(credentials);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={login.isLoading}>
        {login.isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}

function FileUpload() {
  const upload = useFileUpload(uploadService.uploadSingleFile.bind(uploadService), {
    onSuccess: (result) => console.log('Upload successful:', result),
    onError: (error) => console.error('Upload failed:', error)
  });

  const handleFileSelect = (file) => {
    upload.execute(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleFileSelect(e.target.files[0])} />
      {upload.isLoading && (
        <div>
          Uploading... {upload.uploadProgress}%
          <button onClick={upload.cancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

## Tạo Service mới

### 1. Tạo interface cho data

```typescript
// src/services/userService.ts
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}
```

### 2. Tạo service class

```typescript
import { BaseService } from './baseService';
import type { User, CreateUserData } from './userService';

export class UserService extends BaseService {
  constructor() {
    super('/users');
  }

  async getUsers(): Promise<User[]> {
    return this.get<User[]>('');
  }

  async getUserById(id: string): Promise<User> {
    return this.get<User>(`/${id}`);
  }

  async createUser(data: CreateUserData): Promise<User> {
    return this.post<User>('', data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.put<User>(`/${id}`, data);
  }

  async deleteUser(id: string): Promise<void> {
    return this.delete(`/${id}`);
  }
}

export const userService = new UserService();
```

### 3. Export từ index.ts

```typescript
// src/services/index.ts
export { userService } from './userService';
export type { User, CreateUserData } from './userService';
```

## Error Handling

Tất cả services đều có error handling tự động:

- **401 Unauthorized**: Tự động redirect về login page
- **403 Forbidden**: Log error và reject promise
- **404 Not Found**: Log error và reject promise  
- **500 Internal Server Error**: Log error và reject promise
- **Network Error**: Tạo standardized error object

## Configuration

API base URL được cấu hình trong `src/lib/config.ts`:

```typescript
export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001",
};
```

Đặt environment variable `NEXT_PUBLIC_API_BASE_URL` trong file `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```

## Interceptors

### Request Interceptor
- Tự động thêm Authorization header nếu có token
- Thêm timestamp cho caching

### Response Interceptor
- Transform response data nếu cần
- Handle common response patterns

### Error Interceptor
- Standardize error objects
- Handle HTTP status codes
- Auto-logout khi token hết hạn

## Best Practices

1. **Luôn sử dụng TypeScript interfaces** cho request/response data
2. **Kế thừa từ BaseService** để có các methods cơ bản
3. **Sử dụng React hooks** cho state management
4. **Handle errors gracefully** với try-catch
5. **Sử dụng singleton pattern** cho service instances
6. **Export types** để có thể sử dụng ở components khác

## Testing

Services có thể được test dễ dàng:

```typescript
import { userService } from '@/services';

// Mock API responses
jest.mock('@/services/apiClient');

describe('UserService', () => {
  it('should fetch users', async () => {
    const users = await userService.getUsers();
    expect(users).toBeDefined();
  });
});
``` 