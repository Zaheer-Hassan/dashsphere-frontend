<script setup>
/**
 * AppLayout - Main Application Layout
 * Responsive sidebar + header layout
 */

import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useTheme } from '@/composables/useTheme'
import { useTenant } from '@/composables/useTenant'
import { useNotifications } from '@/composables/useNotifications'
import { usePermissions } from '@/composables/usePermissions'
import IconBase from '../base/IconBase.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseDropdown from '../base/BaseDropdown.vue'
import NotificationDropdown from '../notifications/NotificationDropdown.vue'

const router = useRouter()
const route = useRoute()
const { user, logout, userName, userEmail, userRole } = useAuth()
const { toggleTheme, isDark } = useTheme()
const { tenantName, tenants, switchTenant } = useTenant()
const { unreadCount } = useNotifications()
const permissions = usePermissions()

const sidebarOpen = ref(true)
const mobileSidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleMobileSidebar = () => {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

const closeMobileSidebar = () => {
  mobileSidebarOpen.value = false
}

// Navigation items with permission checks
const navigationItems = computed(() => {
  const items = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: 'dashboard',
      show: true
    },
    {
      name: 'Analytics',
      path: '/analytics',
      icon: 'chart',
      show: permissions.canViewAnalytics.value
    },
    {
      name: 'User Management',
      path: '/users',
      icon: 'users',
      show: permissions.canViewUsers.value
    },
    {
      name: 'Tenants',
      path: '/tenants',
      icon: 'folder',
      show: permissions.canViewTenants.value
    },
    {
      name: 'Billing',
      path: '/billing',
      icon: 'credit-card',
      show: permissions.canViewBilling.value
    },
    {
      name: 'Integrations',
      path: '/integrations',
      icon: 'link',
      show: permissions.canViewIntegrations.value
    },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: 'bell',
      show: true
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: 'settings',
      show: permissions.canViewSettings.value
    }
  ]
  
  return items.filter(item => item.show)
})

const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const navigateTo = (path) => {
  router.push(path)
  closeMobileSidebar()
}

const handleLogout = () => {
  logout()
}
</script>

<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside
      :class="[
        'app-layout__sidebar',
        { 'app-layout__sidebar--collapsed': !sidebarOpen },
        { 'app-layout__sidebar--mobile-open': mobileSidebarOpen }
      ]"
    >
      <!-- Logo -->
      <div class="app-layout__logo">
        <div class="app-layout__logo-icon">
          <IconBase name="dashboard" :size="32" color="rgb(var(--color-primary))" />
        </div>
        <span v-if="sidebarOpen" class="app-layout__logo-text">DashSphere</span>
      </div>
      
      <!-- Tenant Selector -->
      <div v-if="sidebarOpen && tenants.length > 1" class="app-layout__tenant">
        <BaseDropdown placement="bottom-start">
          <template #trigger>
            <button class="app-layout__tenant-button">
              <IconBase name="folder" :size="18" />
              <span>{{ tenantName }}</span>
              <IconBase name="chevron-down" :size="16" />
            </button>
          </template>
          
          <div class="app-layout__tenant-menu">
            <button
              v-for="tenant in tenants"
              :key="tenant.id"
              class="app-layout__tenant-item"
              @click="switchTenant(tenant)"
            >
              {{ tenant.name }}
            </button>
          </div>
        </BaseDropdown>
      </div>
      
      <!-- Navigation -->
      <nav class="app-layout__nav">
        <button
          v-for="item in navigationItems"
          :key="item.path"
          :class="[
            'app-layout__nav-item',
            { 'app-layout__nav-item--active': isActiveRoute(item.path) }
          ]"
          @click="navigateTo(item.path)"
        >
          <IconBase :name="item.icon" :size="20" />
          <span v-if="sidebarOpen">{{ item.name }}</span>
        </button>
      </nav>
      
      <!-- Sidebar Footer -->
      <div class="app-layout__sidebar-footer">
        <button
          class="app-layout__toggle"
          @click="toggleSidebar"
        >
          <IconBase :name="sidebarOpen ? 'chevron-left' : 'chevron-right'" :size="20" />
        </button>
      </div>
    </aside>
    
    <!-- Mobile Sidebar Backdrop -->
    <div
      v-if="mobileSidebarOpen"
      class="app-layout__backdrop"
      @click="closeMobileSidebar"
    />
    
    <!-- Main Content Area -->
    <div class="app-layout__main">
      <!-- Header -->
      <header class="app-layout__header">
        <div class="app-layout__header-left">
          <button
            class="app-layout__mobile-toggle"
            @click="toggleMobileSidebar"
          >
            <IconBase name="menu" :size="24" />
          </button>
          
          <h1 class="app-layout__page-title">{{ route.meta.title || 'Dashboard' }}</h1>
        </div>
        
        <div class="app-layout__header-right">
          <!-- Theme Toggle -->
          <button
            class="app-layout__header-action"
            @click="toggleTheme"
          >
            <IconBase :name="isDark ? 'sun' : 'moon'" :size="20" />
          </button>
          
          <!-- Notifications -->
          <div class="app-layout__notifications-wrapper">
            <BaseDropdown placement="bottom-end" trigger="click">
              <template #trigger>
                <button class="app-layout__header-action">
                  <IconBase name="bell" :size="20" />
                  <span v-if="unreadCount > 0" class="app-layout__badge">
                    {{ unreadCount > 99 ? '99+' : unreadCount }}
                  </span>
                </button>
              </template>
              
              <template #default>
                <NotificationDropdown />
              </template>
            </BaseDropdown>
          </div>
          
          <!-- User Menu -->
          <BaseDropdown placement="bottom-end">
            <template #trigger>
              <button class="app-layout__user">
                <div class="app-layout__avatar">
                  <IconBase name="user" :size="20" />
                </div>
                <div class="app-layout__user-info">
                  <span class="app-layout__user-name">{{ userName }}</span>
                  <span class="app-layout__user-role">{{ userRole }}</span>
                </div>
              </button>
            </template>
            
            <div class="app-layout__user-menu">
              <div class="app-layout__user-menu-header">
                <p class="app-layout__user-menu-name">{{ userName }}</p>
                <p class="app-layout__user-menu-email">{{ userEmail }}</p>
              </div>
              
              <button
                class="app-layout__user-menu-item"
                @click="navigateTo('/profile')"
              >
                <IconBase name="user" :size="18" />
                <span>Profile</span>
              </button>
              
              <button
                class="app-layout__user-menu-item"
                @click="navigateTo('/settings')"
              >
                <IconBase name="settings" :size="18" />
                <span>Settings</span>
              </button>
              
              <div class="app-layout__user-menu-divider" />
              
              <button
                class="app-layout__user-menu-item app-layout__user-menu-item--danger"
                @click="handleLogout"
              >
                <IconBase name="logout" :size="18" />
                <span>Logout</span>
              </button>
            </div>
          </BaseDropdown>
        </div>
      </header>
      
      <!-- Content -->
      <main class="app-layout__content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background-color: rgb(var(--color-background));
}

/* Sidebar */
.app-layout__sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: rgb(var(--color-surface));
  border-right: 1px solid rgb(var(--color-border));
  display: flex;
  flex-direction: column;
  transition: width var(--transition-base) ease, transform var(--transition-base) ease;
  z-index: var(--z-fixed);
}

.app-layout__sidebar--collapsed {
  width: 80px;
}

.app-layout__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
}

.app-layout__logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  white-space: nowrap;
}

.app-layout__tenant {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.app-layout__tenant-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgb(var(--color-background-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-primary));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.app-layout__tenant-button:hover {
  border-color: rgb(var(--color-primary));
}

.app-layout__tenant-menu {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}

.app-layout__tenant-item {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  text-align: left;
  color: rgb(var(--color-text-primary));
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast) ease;
}

.app-layout__tenant-item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.app-layout__nav {
  flex: 1;
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  overflow-y: auto;
}

.app-layout__nav-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  white-space: nowrap;
}

.app-layout__nav-item:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.app-layout__nav-item--active {
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
}

.app-layout__sidebar--collapsed .app-layout__nav-item {
  justify-content: center;
}

.app-layout__sidebar-footer {
  padding: var(--spacing-md);
  border-top: 1px solid rgb(var(--color-border));
}

.app-layout__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm);
  background: none;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.app-layout__toggle:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

/* Main Area */
.app-layout__main {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
  transition: margin-left var(--transition-base) ease;
}

.app-layout__sidebar--collapsed + * .app-layout__main {
  margin-left: 80px;
}

.app-layout__header {
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: rgb(var(--color-surface));
  border-bottom: 1px solid rgb(var(--color-border));
  backdrop-filter: blur(8px);
}

.app-layout__header-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.app-layout__mobile-toggle {
  display: none;
  padding: var(--spacing-sm);
  background: none;
  border: none;
  color: rgb(var(--color-text-primary));
  cursor: pointer;
}

.app-layout__page-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.app-layout__header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.app-layout__header-action {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.app-layout__header-action:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.app-layout__badge {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  background-color: rgb(var(--color-error));
  color: white;
  font-size: 10px;
  font-weight: var(--font-weight-bold);
  border-radius: var(--radius-full);
}

.app-layout__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.app-layout__user:hover {
  border-color: rgb(var(--color-primary));
}

.app-layout__avatar {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
  border-radius: var(--radius-full);
}

.app-layout__user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.app-layout__user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
}

.app-layout__user-role {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-tertiary));
  text-transform: capitalize;
}

.app-layout__user-menu {
  min-width: 220px;
  display: flex;
  flex-direction: column;
}

.app-layout__user-menu-header {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.app-layout__user-menu-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.app-layout__user-menu-email {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.app-layout__user-menu-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  text-align: left;
  color: rgb(var(--color-text-primary));
  font-size: var(--font-size-sm);
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast) ease;
}

.app-layout__user-menu-item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.app-layout__user-menu-item--danger {
  color: rgb(var(--color-error));
}

.app-layout__user-menu-divider {
  height: 1px;
  background-color: rgb(var(--color-border));
  margin: var(--spacing-xs) 0;
}

.app-layout__notifications-wrapper :deep(.base-dropdown__menu) {
  padding: 0;
  border: none;
  box-shadow: none;
  background: transparent;
}

.app-layout__content {
  flex: 1;
  padding: var(--spacing-lg);
  overflow-y: auto;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .app-layout__sidebar {
    transform: translateX(-100%);
  }
  
  .app-layout__sidebar--mobile-open {
    transform: translateX(0);
  }
  
  .app-layout__main {
    margin-left: 0;
  }
  
  .app-layout__mobile-toggle {
    display: flex;
  }
  
  .app-layout__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: calc(var(--z-fixed) - 1);
  }
  
  .app-layout__user-info {
    display: none;
  }
}

@media (max-width: 640px) {
  .app-layout__page-title {
    font-size: var(--font-size-lg);
  }
  
  .app-layout__content {
    padding: var(--spacing-md);
  }
}
</style>

