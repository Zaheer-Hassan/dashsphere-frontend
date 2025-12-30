<script setup>
/**
 * Root App Component
 */

import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import BaseSnackbar from './components/base/BaseSnackbar.vue'
import { useAuthStore } from './stores/auth'
import { useTenantStore } from './stores/tenant'

const authStore = useAuthStore()
const tenantStore = useTenantStore()

onMounted(() => {
  // Initialize authentication state first
  authStore.loadFromStorage()
  
  // Initialize tenant context from user's tenantId
  // For tenant users: Set tenant from user data
  // For super-admin: tenant remains null (can see all tenants)
  const user = authStore.user
  
  if (user?.tenantId) {
    // User belongs to a tenant - set tenant context
    tenantStore.setCurrentTenant({
      id: user.tenantId,
      name: user.tenantName || 'Current Tenant',
      slug: user.tenantSlug || user.tenantId,
      settings: user.tenantSettings || {},
      features: user.tenantFeatures || [],
      limits: user.tenantLimits || {},
      theme: user.tenantTheme || {},
      subscription: user.tenantSubscription || null
    })
  } else {
    // Super-admin or no tenant - clear tenant context
    tenantStore.clearTenant()
  }
})
</script>

<template>
  <div id="app">
    <RouterView />
    <BaseSnackbar />
  </div>
</template>

<style>
/* Global styles are in style.css */
</style>
