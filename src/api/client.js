/**
 * Axios API Client with Tenant-Aware Interceptors
 * CRITICAL: Every request must include tenant context
 */

import axios from 'axios'
import { API_BASE_URL, HTTP_STATUS, STORAGE_KEYS } from '@/constants'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { useNotificationsStore } from '@/stores/notifications'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request Interceptor - Add auth token and tenant context
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add tenant context (CRITICAL for multi-tenancy)
    const tenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID)
    if (tenantId) {
      config.headers['X-Tenant-ID'] = tenantId
    }
    
    // Alternative: Add tenant from subdomain
    const hostname = window.location.hostname
    const parts = hostname.split('.')
    if (parts.length >= 3) {
      config.headers['X-Tenant-Subdomain'] = parts[0]
    }
    
    // Add request timestamp for tracking
    config.headers['X-Request-Time'] = new Date().toISOString()
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Successful response
    return response
  },
  async (error) => {
    const authStore = useAuthStore()
    const notificationStore = useNotificationsStore()
    
    if (!error.response) {
      // Network error
      notificationStore.showError('Network error. Please check your connection.')
      return Promise.reject(error)
    }
    
    const { status, data } = error.response
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Token expired or invalid
        if (error.config.url !== '/auth/refresh') {
          // Try to refresh token
          const refreshed = await authStore.refreshAuthToken()
          if (refreshed) {
            // Retry the original request
            return apiClient(error.config)
          }
        }
        
        // Logout and redirect to login
        authStore.logout()
        window.location.href = '/login'
        break
        
      case HTTP_STATUS.FORBIDDEN:
        // No permission
        notificationStore.showError('You do not have permission to perform this action.')
        break
        
      case HTTP_STATUS.NOT_FOUND:
        notificationStore.showError('Resource not found.')
        break
        
      case HTTP_STATUS.CONFLICT:
        notificationStore.showError(data?.message || 'A conflict occurred.')
        break
        
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        // Validation errors
        if (data?.errors) {
          const firstError = Object.values(data.errors)[0]
          notificationStore.showError(firstError)
        }
        break
        
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        notificationStore.showError('Server error. Please try again later.')
        break
        
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        notificationStore.showError('Service temporarily unavailable.')
        break
        
      default:
        notificationStore.showError(data?.message || 'An error occurred.')
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

