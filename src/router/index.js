/**
 * Vue Router Configuration
 * With permission-based route guards
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { PERMISSIONS } from '@/constants'

// Lazy-loaded route components
const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPasswordView.vue'),
    meta: { requiresAuth: false, layout: 'auth' }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/dashboard/DashboardView.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' }
  },
  {
    path: '/analytics',
    name: 'Analytics',
    component: () => import('@/views/analytics/AnalyticsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.ANALYTICS_VIEW],
      title: 'Analytics'
    }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/notifications/NotificationsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Notifications'
    }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/views/users/UsersView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.USERS_VIEW],
      title: 'Users'
    }
  },
  {
    path: '/tenants',
    name: 'Tenants',
    component: () => import('@/views/tenants/TenantsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.TENANTS_VIEW],
      title: 'Tenants'
    }
  },
  {
    path: '/billing',
    name: 'Billing',
    component: () => import('@/views/billing/BillingView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.BILLING_VIEW],
      title: 'Billing & Subscription'
    }
  },
  {
    path: '/integrations',
    name: 'Integrations',
    component: () => import('@/views/integrations/IntegrationsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.INTEGRATIONS_VIEW],
      title: 'Integrations'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/settings/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profile'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/settings/SettingsView.vue'),
    meta: {
      requiresAuth: true,
      permissions: [PERMISSIONS.SETTINGS_VIEW],
      title: 'Settings'
    }
  },
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/views/error/UnauthorizedView.vue'),
    meta: { requiresAuth: false, layout: 'error' }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { requiresAuth: false, layout: 'error' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

// Global navigation guard - Authentication & Permissions
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  
  // Set page title
  document.title = to.meta.title 
    ? `${to.meta.title} - DashSphere` 
    : 'DashSphere - Enterprise SaaS Platform'
  
  // Check authentication requirement
  const requiresAuth = to.meta.requiresAuth !== false
  const isAuthenticated = authStore.isAuthenticated
  
  // Initialize stores on first load
  if (requiresAuth && !authStore.user) {
    authStore.loadFromStorage()
  }
  
  if (!tenantStore.currentTenant) {
    tenantStore.loadTenantFromStorage()
  }
  
  // Redirect to login if not authenticated
  if (requiresAuth && !isAuthenticated) {
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Redirect to dashboard if authenticated and trying to access auth pages
  if (!requiresAuth && isAuthenticated && ['Login', 'Register'].includes(to.name)) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Check permissions
  if (requiresAuth && to.meta.permissions) {
    const hasPermission = to.meta.permissions.some(permission => 
      authStore.hasPermission(permission)
    )
    
    if (!hasPermission) {
      next({ name: 'Unauthorized' })
      return
    }
  }
  
  // Check tenant context for tenant-specific routes
  if (requiresAuth && to.meta.requiresTenant && !tenantStore.tenantId) {
    // Redirect to tenant selection or error page
    next({ name: 'Dashboard' })
    return
  }
  
  next()
})

// Global after hook - Analytics, logging, etc.
router.afterEach((to, from) => {
  // Track page views
  // Example: analytics.track('page_view', { path: to.path })
})

export default router

