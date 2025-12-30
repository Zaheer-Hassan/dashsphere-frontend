/**
 * Tenant Store - Multi-Tenant Context Management
 * CRITICAL: All API calls and data must be tenant-scoped
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { STORAGE_KEYS } from '@/constants'

export const useTenantStore = defineStore('tenant', () => {
  // State
  const currentTenant = ref(null)
  const tenants = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const tenantId = computed(() => currentTenant.value?.id || null)
  const tenantName = computed(() => currentTenant.value?.name || '')
  const tenantSlug = computed(() => currentTenant.value?.slug || '')
  const tenantSettings = computed(() => currentTenant.value?.settings || {})
  const tenantFeatures = computed(() => currentTenant.value?.features || [])
  const tenantLimits = computed(() => currentTenant.value?.limits || {})
  const tenantTheme = computed(() => currentTenant.value?.theme || {})
  const tenantSubscription = computed(() => currentTenant.value?.subscription || null)
  
  // Check if tenant has a specific feature
  const hasFeature = (feature) => {
    return tenantFeatures.value.includes(feature)
  }
  
  // Check if tenant is within limits
  const isWithinLimit = (limitType, currentValue) => {
    const limit = tenantLimits.value[limitType]
    if (limit === -1) return true // Unlimited
    return currentValue < limit
  }
  
  // Actions
  const setCurrentTenant = (tenant) => {
    currentTenant.value = tenant
    if (tenant?.id) {
      localStorage.setItem(STORAGE_KEYS.TENANT_ID, tenant.id)
    }
  }
  
  const loadTenantFromStorage = () => {
    const storedTenantId = localStorage.getItem(STORAGE_KEYS.TENANT_ID)
    if (storedTenantId && tenants.value.length > 0) {
      const tenant = tenants.value.find(t => t.id === storedTenantId)
      if (tenant) {
        currentTenant.value = tenant
      }
    }
  }
  
  const loadTenantFromSubdomain = () => {
    // Extract tenant from subdomain
    // Example: acme.dashsphere.com -> acme
    const hostname = window.location.hostname
    const parts = hostname.split('.')
    
    if (parts.length >= 3) {
      const subdomain = parts[0]
      // In a real app, you'd fetch tenant by subdomain from API
      return subdomain
    }
    
    return null
  }
  
  const setTenants = (tenantList) => {
    tenants.value = tenantList
  }
  
  const switchTenant = (tenant) => {
    setCurrentTenant(tenant)
    // Trigger app reload or redirect to refresh tenant context
    window.location.reload()
  }
  
  const clearTenant = () => {
    currentTenant.value = null
    localStorage.removeItem(STORAGE_KEYS.TENANT_ID)
  }
  
  const updateTenantSettings = (settings) => {
    if (currentTenant.value) {
      currentTenant.value.settings = {
        ...currentTenant.value.settings,
        ...settings
      }
    }
  }
  
  return {
    // State
    currentTenant,
    tenants,
    loading,
    error,
    
    // Getters
    tenantId,
    tenantName,
    tenantSlug,
    tenantSettings,
    tenantFeatures,
    tenantLimits,
    tenantTheme,
    tenantSubscription,
    
    // Methods
    hasFeature,
    isWithinLimit,
    
    // Actions
    setCurrentTenant,
    loadTenantFromStorage,
    loadTenantFromSubdomain,
    setTenants,
    switchTenant,
    clearTenant,
    updateTenantSettings
  }
})

