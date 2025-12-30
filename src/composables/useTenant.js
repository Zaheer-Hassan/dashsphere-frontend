/**
 * useTenant Composable
 * Provides tenant context functionality
 */

import { computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'

export function useTenant() {
  const tenantStore = useTenantStore()
  
  // Computed properties
  const currentTenant = computed(() => tenantStore.currentTenant)
  const tenantId = computed(() => tenantStore.tenantId)
  const tenantName = computed(() => tenantStore.tenantName)
  const tenantSlug = computed(() => tenantStore.tenantSlug)
  const tenantSettings = computed(() => tenantStore.tenantSettings)
  const tenantFeatures = computed(() => tenantStore.tenantFeatures)
  const tenantLimits = computed(() => tenantStore.tenantLimits)
  const tenantSubscription = computed(() => tenantStore.tenantSubscription)
  const tenants = computed(() => tenantStore.tenants)
  
  // Methods
  const hasFeature = (feature) => {
    return tenantStore.hasFeature(feature)
  }
  
  const isWithinLimit = (limitType, currentValue) => {
    return tenantStore.isWithinLimit(limitType, currentValue)
  }
  
  const switchTenant = (tenant) => {
    tenantStore.switchTenant(tenant)
  }
  
  const updateSettings = (settings) => {
    tenantStore.updateTenantSettings(settings)
  }
  
  // Check if a feature is enabled for current tenant
  const canAccessFeature = (feature) => {
    // Check subscription plan features
    const subscription = tenantSubscription.value
    if (!subscription) return false
    
    return hasFeature(feature)
  }
  
  // Get usage percentage for a limit
  const getUsagePercentage = (limitType, currentValue) => {
    const limit = tenantLimits.value[limitType]
    if (limit === -1) return 0 // Unlimited
    return Math.round((currentValue / limit) * 100)
  }
  
  // Check if approaching limit (80% threshold)
  const isApproachingLimit = (limitType, currentValue) => {
    return getUsagePercentage(limitType, currentValue) >= 80
  }
  
  return {
    // State
    currentTenant,
    tenantId,
    tenantName,
    tenantSlug,
    tenantSettings,
    tenantFeatures,
    tenantLimits,
    tenantSubscription,
    tenants,
    
    // Methods
    hasFeature,
    isWithinLimit,
    switchTenant,
    updateSettings,
    canAccessFeature,
    getUsagePercentage,
    isApproachingLimit
  }
}

