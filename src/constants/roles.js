/**
 * User Roles & Permissions Constants
 * Multi-tenant role system with hierarchical permissions
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin', // Platform-level access
  TENANT_OWNER: 'tenant_owner', // Full tenant access
  TENANT_ADMIN: 'tenant_admin', // Admin within tenant
  MANAGER: 'manager', // Department/team manager
  USER: 'user', // Standard user
  VIEWER: 'viewer', // Read-only access
  GUEST: 'guest' // Limited guest access
}

export const PERMISSIONS = {
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Role Management
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_EDIT: 'roles:edit',
  ROLES_DELETE: 'roles:delete',
  
  // Tenant Management
  TENANTS_VIEW: 'tenants:view',
  TENANTS_CREATE: 'tenants:create',
  TENANTS_EDIT: 'tenants:edit',
  TENANTS_DELETE: 'tenants:delete',
  
  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  
  // Billing & Subscription
  BILLING_VIEW: 'billing:view',
  BILLING_MANAGE: 'billing:manage',
  
  // Analytics & Reports
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Integrations
  INTEGRATIONS_VIEW: 'integrations:view',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  
  // Audit Logs
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  
  // Notifications
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_MANAGE: 'notifications:manage'
}

// Role hierarchy - defines which roles inherit permissions from others
export const ROLE_HIERARCHY = {
  [USER_ROLES.SUPER_ADMIN]: [USER_ROLES.TENANT_OWNER],
  [USER_ROLES.TENANT_OWNER]: [USER_ROLES.TENANT_ADMIN],
  [USER_ROLES.TENANT_ADMIN]: [USER_ROLES.MANAGER],
  [USER_ROLES.MANAGER]: [USER_ROLES.USER],
  [USER_ROLES.USER]: [USER_ROLES.VIEWER],
  [USER_ROLES.VIEWER]: [],
  [USER_ROLES.GUEST]: []
}

// Default permissions per role
export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
  
  [USER_ROLES.TENANT_OWNER]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_MANAGE,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_MANAGE
  ],
  
  [USER_ROLES.TENANT_ADMIN]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.AUDIT_LOGS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.USER]: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.GUEST]: [
    PERMISSIONS.NOTIFICATIONS_VIEW
  ]
}

