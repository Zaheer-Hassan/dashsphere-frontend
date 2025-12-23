/**
 * API Configuration Constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // Users
  USERS: '/users',
  USER_BY_ID: (id) => `/users/${id}`,
  USER_PROFILE: '/users/profile',
  
  // Tenants
  TENANTS: '/tenants',
  TENANT_BY_ID: (id) => `/tenants/${id}`,
  TENANT_USERS: (id) => `/tenants/${id}/users`,
  TENANT_SETTINGS: (id) => `/tenants/${id}/settings`,
  
  // Roles & Permissions
  ROLES: '/roles',
  ROLE_BY_ID: (id) => `/roles/${id}`,
  PERMISSIONS: '/permissions',
  
  // Billing & Subscription
  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_BY_ID: (id) => `/subscriptions/${id}`,
  INVOICES: '/invoices',
  PAYMENT_METHODS: '/payment-methods',
  
  // Analytics
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_USERS: '/analytics/users',
  ANALYTICS_REVENUE: '/analytics/revenue',
  ANALYTICS_ACTIVITY: '/analytics/activity',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  NOTIFICATION_BY_ID: (id) => `/notifications/${id}`,
  MARK_AS_READ: (id) => `/notifications/${id}/read`,
  MARK_ALL_READ: '/notifications/read-all',
  
  // Integrations
  INTEGRATIONS: '/integrations',
  INTEGRATION_BY_ID: (id) => `/integrations/${id}`,
  
  // Audit Logs
  AUDIT_LOGS: '/audit-logs'
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
}

