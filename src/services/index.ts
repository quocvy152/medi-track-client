// Export all services
export { api, apiClient, createApiClient } from './apiClient';
export { authService } from './authService';
export { BaseService } from './baseService';
export { uploadService } from './uploadService';

// Export types
export type {
    ApiEndpoint, ApiError, ApiResponse, ApiState, ApiStatus, HttpMethod, PaginatedResponse, PaginationParams, RequestConfig
} from '@/types/api';

export type {
    AuthResponse, LoginCredentials, RefreshTokenRequest, RegisterData, User
} from './authService';

export type {
    FileAnalysisResult, FileUploadResponse, UploadOptions, UploadProgress
} from './uploadService';