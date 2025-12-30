/**
 * usePermissions Composable
 * Provides permission-based UI rendering helpers
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { PERMISSIONS } from '@/constants'

export function usePermissions() {
  const authStore = useAuthStore()
  
  // Check single permission
  const can = (permission) => {
    return authStore.hasPermission(permission)
  }
  
  // Check if user has any of the permissions
  const canAny = (permissions) => {
    return authStore.hasAnyPermission(permissions)
  }
  
  // Check if user has all permissions
  const canAll = (permissions) => {
    return authStore.hasAllPermissions(permissions)
  }
  
  // Specific permission checks (commonly used)
  const canViewUsers = computed(() => can(PERMISSIONS.USERS_VIEW))
  const canCreateUsers = computed(() => can(PERMISSIONS.USERS_CREATE))
  const canEditUsers = computed(() => can(PERMISSIONS.USERS_EDIT))
  const canDeleteUsers = computed(() => can(PERMISSIONS.USERS_DELETE))
  
  const canViewRoles = computed(() => can(PERMISSIONS.ROLES_VIEW))
  const canManageRoles = computed(() => canAny([
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    PERMISSIONS.ROLES_DELETE
  ]))
  
  const canViewTenants = computed(() => can(PERMISSIONS.TENANTS_VIEW))
  const canCreateTenants = computed(() => can(PERMISSIONS.TENANTS_CREATE))
  const canEditTenants = computed(() => can(PERMISSIONS.TENANTS_EDIT))
  const canDeleteTenants = computed(() => can(PERMISSIONS.TENANTS_DELETE))
  const canManageTenants = computed(() => canAny([
    PERMISSIONS.TENANTS_CREATE,
    PERMISSIONS.TENANTS_EDIT,
    PERMISSIONS.TENANTS_DELETE
  ]))
  
  const canViewSettings = computed(() => can(PERMISSIONS.SETTINGS_VIEW))
  const canEditSettings = computed(() => can(PERMISSIONS.SETTINGS_EDIT))
  
  const canViewBilling = computed(() => can(PERMISSIONS.BILLING_VIEW))
  const canManageBilling = computed(() => can(PERMISSIONS.BILLING_MANAGE))
  
  const canViewAnalytics = computed(() => can(PERMISSIONS.ANALYTICS_VIEW))
  const canExportAnalytics = computed(() => can(PERMISSIONS.ANALYTICS_EXPORT))
  
  const canViewIntegrations = computed(() => can(PERMISSIONS.INTEGRATIONS_VIEW))
  const canManageIntegrations = computed(() => can(PERMISSIONS.INTEGRATIONS_MANAGE))
  
  const canViewAuditLogs = computed(() => can(PERMISSIONS.AUDIT_LOGS_VIEW))
  const canExportAuditLogs = computed(() => can(PERMISSIONS.AUDIT_LOGS_EXPORT))
  
  const canViewProjects = computed(() => can(PERMISSIONS.PROJECTS_VIEW))
  const canManageProjects = computed(() => can(PERMISSIONS.PROJECTS_MANAGE))
  
  return {
    // Generic permission checks
    can,
    canAny,
    canAll,
    
    // User permissions
    canViewUsers,
    canCreateUsers,
    canEditUsers,
    canDeleteUsers,
    
    // Role permissions
    canViewRoles,
    canManageRoles,
    
    // Tenant permissions
    canViewTenants,
    canCreateTenants,
    canEditTenants,
    canDeleteTenants,
    canManageTenants,
    
    // Settings permissions
    canViewSettings,
    canEditSettings,
    
    // Billing permissions
    canViewBilling,
    canManageBilling,
    
    // Analytics permissions
    canViewAnalytics,
    canExportAnalytics,
    
    // Integration permissions
    canViewIntegrations,
    canManageIntegrations,
    
    // Audit permissions
    canViewAuditLogs,
    canExportAuditLogs,
    
    // Projects / Modules permissions
    canViewProjects,
    canManageProjects,
    
    // Constants
    PERMISSIONS
  }
}

