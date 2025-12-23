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
  // Initialize authentication state
  authStore.loadFromStorage()
  
  // Initialize tenant context
  tenantStore.loadTenantFromStorage()
  
  // Set mock tenant for demo purposes
  if (!tenantStore.currentTenant) {
    tenantStore.setCurrentTenant({
      id: 'tenant-1',
      name: 'Acme Corporation',
      slug: 'acme',
      settings: {},
      features: ['analytics', 'integrations', 'advanced_reporting'],
      limits: {
        maxUsers: 50,
        maxStorage: 100,
        maxApiCalls: 100000
      },
      theme: {},
      subscription: {
        plan: 'Professional',
        status: 'active'
      }
    })
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
