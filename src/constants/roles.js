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
  // User Management (CRUD)
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  
  // Role Management (CRUD)
  ROLES_VIEW: 'roles:view',
  ROLES_CREATE: 'roles:create',
  ROLES_EDIT: 'roles:edit',
  ROLES_DELETE: 'roles:delete',
  
  // Tenant Management (CRUD) - Super Admin only
  TENANTS_VIEW: 'tenants:view',
  TENANTS_CREATE: 'tenants:create',
  TENANTS_EDIT: 'tenants:edit',
  TENANTS_DELETE: 'tenants:delete',
  
  // Dashboard (CRUD)
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_CREATE: 'dashboard:create',
  DASHBOARD_EDIT: 'dashboard:edit',
  DASHBOARD_DELETE: 'dashboard:delete',
  
  // Analytics & Reports (CRUD)
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_CREATE: 'analytics:create',
  ANALYTICS_EDIT: 'analytics:edit',
  ANALYTICS_DELETE: 'analytics:delete',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Billing & Subscription (CRUD)
  BILLING_VIEW: 'billing:view',
  BILLING_CREATE: 'billing:create',
  BILLING_EDIT: 'billing:edit',
  BILLING_DELETE: 'billing:delete',
  BILLING_MANAGE: 'billing:manage',
  
  // Integrations (CRUD)
  INTEGRATIONS_VIEW: 'integrations:view',
  INTEGRATIONS_CREATE: 'integrations:create',
  INTEGRATIONS_EDIT: 'integrations:edit',
  INTEGRATIONS_DELETE: 'integrations:delete',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  
  // Settings (CRUD)
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_CREATE: 'settings:create',
  SETTINGS_EDIT: 'settings:edit',
  SETTINGS_DELETE: 'settings:delete',
  
  // Notifications (CRUD)
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_CREATE: 'notifications:create',
  NOTIFICATIONS_EDIT: 'notifications:edit',
  NOTIFICATIONS_DELETE: 'notifications:delete',
  NOTIFICATIONS_MANAGE: 'notifications:manage',
  
  // Audit Logs (CRUD)
  AUDIT_LOGS_VIEW: 'audit_logs:view',
  AUDIT_LOGS_CREATE: 'audit_logs:create',
  AUDIT_LOGS_EDIT: 'audit_logs:edit',
  AUDIT_LOGS_DELETE: 'audit_logs:delete',
  AUDIT_LOGS_EXPORT: 'audit_logs:export'
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
    // User Management (CRUD)
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    // Role Management (View only, can create custom roles)
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.DASHBOARD_CREATE,
    PERMISSIONS.DASHBOARD_EDIT,
    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    // Billing
    PERMISSIONS.BILLING_VIEW,
    PERMISSIONS.BILLING_MANAGE,
    // Integrations
    PERMISSIONS.INTEGRATIONS_VIEW,
    PERMISSIONS.INTEGRATIONS_MANAGE,
    // Settings
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_EDIT,
    // Notifications
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_MANAGE,
    // Audit Logs
    PERMISSIONS.AUDIT_LOGS_VIEW
  ],
  
  [USER_ROLES.MANAGER]: [
    // User Management (View only)
    PERMISSIONS.USERS_VIEW,
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,
    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    // Settings (View only)
    PERMISSIONS.SETTINGS_VIEW,
    // Notifications
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_CREATE
  ],
  
  [USER_ROLES.USER]: [
    // Dashboard
    PERMISSIONS.DASHBOARD_VIEW,
    // Analytics (View only)
    PERMISSIONS.ANALYTICS_VIEW,
    // Settings (View only)
    PERMISSIONS.SETTINGS_VIEW,
    // Notifications
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.VIEWER]: [
    // Dashboard (View only)
    PERMISSIONS.DASHBOARD_VIEW,
    // Analytics (View only)
    PERMISSIONS.ANALYTICS_VIEW,
    // Notifications (View only)
    PERMISSIONS.NOTIFICATIONS_VIEW
  ],
  
  [USER_ROLES.GUEST]: [
    PERMISSIONS.NOTIFICATIONS_VIEW
  ]
}

