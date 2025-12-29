/**
 * Auth Store - Authentication & Authorization
 * Handles user authentication, roles, and permissions
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS, USER_ROLES, ROLE_PERMISSIONS, ROLE_HIERARCHY } from '@/constants'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const refreshToken = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const userId = computed(() => user.value?.id || null)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')
  const userRole = computed(() => user.value?.role || USER_ROLES.GUEST)
  const userPermissions = computed(() => user.value?.permissions || [])
  const userAvatar = computed(() => user.value?.avatar || null)
  const userTenantId = computed(() => user.value?.tenantId || null)
  
  // Check if user has a specific role
  const hasRole = (role) => {
    if (!user.value) return false
    
    const currentRole = user.value.role
    
    // Check direct role match
    if (currentRole === role) return true
    
    // Check role hierarchy
    const inheritsFrom = ROLE_HIERARCHY[currentRole] || []
    return inheritsFrom.includes(role)
  }
  
  // Check if user has a specific permission
  const hasPermission = (permission) => {
    if (!user.value) return false
    
    // Super admin has all permissions
    if (user.value.role === USER_ROLES.SUPER_ADMIN) return true
    
    // Check user's custom permissions
    if (userPermissions.value.includes(permission)) return true
    
    // Check role-based permissions
    const rolePerms = ROLE_PERMISSIONS[user.value.role] || []
    return rolePerms.includes(permission)
  }
  
  // Check if user has any of the specified permissions
  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission))
  }
  
  // Check if user has all specified permissions
  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission))
  }
  
  // Check if user is in their own tenant
  const isOwnTenant = (tenantId) => {
    return userTenantId.value === tenantId
  }
  
  // Actions
  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = !!userData
  }
  
  const setTokens = (accessToken, refreshTokenValue) => {
    token.value = accessToken
    refreshToken.value = refreshTokenValue
    
    if (accessToken) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, accessToken)
    }
    if (refreshTokenValue) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshTokenValue)
    }
  }
  
  const loadFromStorage = () => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    
    if (storedToken) {
      token.value = storedToken
      refreshToken.value = storedRefreshToken
    }
    
    // TEMPORARILY: Always set default user for development (no redirect on refresh)
    // This allows the app to work without authentication during development
    // In a real app, you'd validate the token and fetch user data from API
    if (!user.value) {
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: USER_ROLES.TENANT_ADMIN,
        permissions: [],
        tenantId: 'tenant-1',
        avatar: null
      })
      // Set token if not already set
      if (!token.value) {
        token.value = 'dev-token'
      }
    }
  }
  
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      // This would be replaced with actual API call
      // const response = await authAPI.login(credentials)
      
      // Mock response for demonstration
      const mockUser = {
        id: '1',
        name: 'John Doe',
        email: credentials.email,
        role: USER_ROLES.TENANT_ADMIN,
        permissions: [],
        tenantId: 'tenant-1',
        avatar: null
      }
      
      const mockToken = 'mock-jwt-token'
      const mockRefreshToken = 'mock-refresh-token'
      
      setUser(mockUser)
      setTokens(mockToken, mockRefreshToken)
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }
  
  const logout = () => {
    user.value = null
    token.value = null
    refreshToken.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
  }
  
  const updateUser = (userData) => {
    if (user.value) {
      user.value = {
        ...user.value,
        ...userData
      }
    }
  }
  
  const refreshAuthToken = async () => {
    if (!refreshToken.value) return false
    
    try {
      // This would be replaced with actual API call
      // const response = await authAPI.refreshToken(refreshToken.value)
      
      // Mock implementation
      const newToken = 'new-mock-jwt-token'
      setTokens(newToken, refreshToken.value)
      
      return true
    } catch (err) {
      error.value = err.message
      logout()
      return false
    }
  }
  
  return {
    // State
    user,
    token,
    refreshToken,
    isAuthenticated,
    loading,
    error,
    
    // Getters
    userId,
    userName,
    userEmail,
    userRole,
    userPermissions,
    userAvatar,
    userTenantId,
    
    // Methods
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isOwnTenant,
    
    // Actions
    setUser,
    setTokens,
    loadFromStorage,
    login,
    logout,
    updateUser,
    refreshAuthToken
  }
})

