/**
 * Centralized Constants Export
 */

export * from './roles'
export * from './plans'
export * from './notifications'
export * from './api'

export const APP_NAME = 'DashSphere'
export const APP_VERSION = '1.0.0'

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  TENANT_ID: 'tenant_id',
  THEME: 'theme',
  USER_PREFERENCES: 'user_preferences'
}

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

export const DATE_FORMATS = {
  SHORT: 'MMM DD, YYYY',
  LONG: 'MMMM DD, YYYY',
  FULL: 'MMMM DD, YYYY HH:mm:ss',
  TIME: 'HH:mm:ss'
}

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
}

