/**
 * useAuth Composable
 * Provides authentication functionality
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  // Computed properties
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const loading = computed(() => authStore.loading)
  const userRole = computed(() => authStore.userRole)
  const userName = computed(() => authStore.userName)
  const userEmail = computed(() => authStore.userEmail)
  
  // Methods
  const login = async (credentials) => {
    const result = await authStore.login(credentials)
    if (result.success) {
      router.push('/dashboard')
    }
    return result
  }
  
  const logout = () => {
    authStore.logout()
    router.push('/login')
  }
  
  const hasRole = (role) => {
    return authStore.hasRole(role)
  }
  
  const hasPermission = (permission) => {
    return authStore.hasPermission(permission)
  }
  
  const hasAnyPermission = (permissions) => {
    return authStore.hasAnyPermission(permissions)
  }
  
  const hasAllPermissions = (permissions) => {
    return authStore.hasAllPermissions(permissions)
  }
  
  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push('/login')
      return false
    }
    return true
  }
  
  const requirePermission = (permission) => {
    if (!hasPermission(permission)) {
      router.push('/unauthorized')
      return false
    }
    return true
  }
  
  return {
    // State
    user,
    isAuthenticated,
    loading,
    userRole,
    userName,
    userEmail,
    
    // Actions
    login,
    logout,
    
    // Checks
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    requireAuth,
    requirePermission
  }
}

