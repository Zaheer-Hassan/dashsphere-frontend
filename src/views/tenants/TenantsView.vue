<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSearch from '@/components/base/BaseSearch.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import IconBase from '@/components/base/IconBase.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'

const permissions = usePermissions()
const { showSuccess, showError } = useNotifications()

// Active tab
const activeTab = ref('tenants')

// Modals
const isAddTenantModalOpen = ref(false)
const isEditTenantModalOpen = ref(false)
const isDeleteTenantModalOpen = ref(false)
const isSettingsModalOpen = ref(false)
const selectedTenant = ref(null)

// Filters
const searchQuery = ref('')
const statusFilter = ref('all')
const planFilter = ref('all')

// Form states
const tenantForm = ref({
  name: '',
  domain: '',
  email: '',
  plan: 'professional',
  status: 'active',
  maxUsers: 50,
  maxStorage: 500,
  settings: {
    allowCustomDomain: true,
    allowSSO: false,
    allowAPI: true,
    enableAnalytics: true
  },
  errors: {}
})

// Global settings
const globalSettings = ref({
  allowNewTenants: true,
  requireEmailVerification: true,
  defaultPlan: 'professional',
  maxTenants: 1000,
  maintenanceMode: false
})

// Data
const tenants = ref([])
const currentPage = ref(1)
const itemsPerPage = 10

// Computed
const filteredTenants = computed(() => {
  let filtered = tenants.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(tenant => 
      tenant.name.toLowerCase().includes(query) ||
      tenant.domain.toLowerCase().includes(query) ||
      tenant.email.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(tenant => tenant.status === statusFilter.value)
  }

  // Plan filter
  if (planFilter.value !== 'all') {
    filtered = filtered.filter(tenant => tenant.plan === planFilter.value)
  }

  return filtered
})

const paginatedTenants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTenants.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredTenants.value.length / itemsPerPage)
})

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'secondary',
    suspended: 'error',
    trial: 'warning'
  }
  return colors[status] || 'secondary'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

const getPlanColor = (plan) => {
  const colors = {
    starter: 'secondary',
    professional: 'primary',
    enterprise: 'error'
  }
  return colors[plan] || 'secondary'
}

// Functions
const handleAddTenant = () => {
  tenantForm.value = {
    name: '',
    domain: '',
    email: '',
    plan: 'professional',
    status: 'active',
    maxUsers: 50,
    maxStorage: 500,
    settings: {
      allowCustomDomain: true,
      allowSSO: false,
      allowAPI: true,
      enableAnalytics: true
    },
    errors: {}
  }
  isAddTenantModalOpen.value = true
}

const handleEditTenant = (tenant) => {
  selectedTenant.value = tenant
  tenantForm.value = {
    name: tenant.name,
    domain: tenant.domain,
    email: tenant.email,
    plan: tenant.plan,
    status: tenant.status,
    maxUsers: tenant.maxUsers,
    maxStorage: tenant.maxStorage,
    settings: { ...tenant.settings },
    errors: {}
  }
  isEditTenantModalOpen.value = true
}

const handleDeleteTenant = (tenant) => {
  selectedTenant.value = tenant
  isDeleteTenantModalOpen.value = true
}

const saveTenant = async () => {
  // Validation
  tenantForm.value.errors = {}
  
  if (!tenantForm.value.name.trim()) {
    tenantForm.value.errors.name = 'Tenant name is required'
    return
  }
  
  if (!tenantForm.value.domain.trim()) {
    tenantForm.value.errors.domain = 'Domain is required'
    return
  }
  
  if (!tenantForm.value.email.trim()) {
    tenantForm.value.errors.email = 'Email is required'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (selectedTenant.value) {
      // Update existing tenant
      const index = tenants.value.findIndex(t => t.id === selectedTenant.value.id)
      if (index !== -1) {
        tenants.value[index] = {
          ...tenants.value[index],
          ...tenantForm.value
        }
      }
      showSuccess(`Tenant "${tenantForm.value.name}" updated successfully`)
    } else {
      // Create new tenant
      const newTenant = {
        id: Date.now(),
        ...tenantForm.value,
        createdAt: new Date().toISOString(),
        usersCount: 0,
        analytics: {
          totalUsers: 0,
          activeUsers: 0,
          storageUsed: 0,
          apiCalls: 0
        }
      }
      tenants.value.push(newTenant)
      showSuccess(`Tenant "${tenantForm.value.name}" created successfully`)
    }
    
    isAddTenantModalOpen.value = false
    isEditTenantModalOpen.value = false
    selectedTenant.value = null
  } catch (error) {
    showError('Failed to save tenant')
  }
}

const deleteTenant = async () => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    tenants.value = tenants.value.filter(t => t.id !== selectedTenant.value.id)
    showSuccess(`Tenant "${selectedTenant.value.name}" deleted successfully`)
    isDeleteTenantModalOpen.value = false
    selectedTenant.value = null
  } catch (error) {
    showError('Failed to delete tenant')
  }
}

const toggleTenantStatus = async (tenant) => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = tenants.value.findIndex(t => t.id === tenant.id)
    if (index !== -1) {
      tenants.value[index].status = tenant.status === 'active' ? 'inactive' : 'active'
    }
    
    showSuccess(`Tenant ${tenants.value[index].status === 'active' ? 'activated' : 'deactivated'}`)
  } catch (error) {
    showError('Failed to update tenant status')
  }
}

const saveGlobalSettings = async () => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    showSuccess('Global settings saved successfully')
    isSettingsModalOpen.value = false
  } catch (error) {
    showError('Failed to save global settings')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Load data
const loadTenants = () => {
  tenants.value = [
    {
      id: 1,
      name: 'Acme Corporation',
      domain: 'acme.example.com',
      email: 'admin@acme.com',
      plan: 'enterprise',
      status: 'active',
      maxUsers: -1,
      maxStorage: -1,
      usersCount: 245,
      createdAt: '2023-01-15T00:00:00Z',
      settings: {
        allowCustomDomain: true,
        allowSSO: true,
        allowAPI: true,
        enableAnalytics: true
      },
      analytics: {
        totalUsers: 245,
        activeUsers: 189,
        storageUsed: 1250,
        apiCalls: 245000
      }
    },
    {
      id: 2,
      name: 'TechStart Inc',
      domain: 'techstart.example.com',
      email: 'contact@techstart.com',
      plan: 'professional',
      status: 'active',
      maxUsers: 50,
      maxStorage: 500,
      usersCount: 32,
      createdAt: '2023-06-20T00:00:00Z',
      settings: {
        allowCustomDomain: false,
        allowSSO: false,
        allowAPI: true,
        enableAnalytics: true
      },
      analytics: {
        totalUsers: 32,
        activeUsers: 28,
        storageUsed: 245,
        apiCalls: 67890
      }
    },
    {
      id: 3,
      name: 'SmallBiz Solutions',
      domain: 'smallbiz.example.com',
      email: 'hello@smallbiz.com',
      plan: 'starter',
      status: 'active',
      maxUsers: 10,
      maxStorage: 100,
      usersCount: 8,
      createdAt: '2023-09-10T00:00:00Z',
      settings: {
        allowCustomDomain: false,
        allowSSO: false,
        allowAPI: false,
        enableAnalytics: false
      },
      analytics: {
        totalUsers: 8,
        activeUsers: 6,
        storageUsed: 45,
        apiCalls: 12000
      }
    },
    {
      id: 4,
      name: 'Global Enterprises',
      domain: 'global.example.com',
      email: 'admin@global.com',
      plan: 'enterprise',
      status: 'inactive',
      maxUsers: -1,
      maxStorage: -1,
      usersCount: 0,
      createdAt: '2023-11-05T00:00:00Z',
      settings: {
        allowCustomDomain: true,
        allowSSO: true,
        allowAPI: true,
        enableAnalytics: true
      },
      analytics: {
        totalUsers: 0,
        activeUsers: 0,
        storageUsed: 0,
        apiCalls: 0
      }
    },
    {
      id: 5,
      name: 'StartupHub',
      domain: 'startuphub.example.com',
      email: 'info@startuphub.com',
      plan: 'professional',
      status: 'trial',
      maxUsers: 50,
      maxStorage: 500,
      usersCount: 15,
      createdAt: '2024-01-01T00:00:00Z',
      settings: {
        allowCustomDomain: false,
        allowSSO: false,
        allowAPI: true,
        enableAnalytics: true
      },
      analytics: {
        totalUsers: 15,
        activeUsers: 12,
        storageUsed: 89,
        apiCalls: 34500
      }
    }
  ]
}

onMounted(() => {
  loadTenants()
})
</script>

<template>
  <AppLayout>
    <div class="tenants-view">
      <!-- Header -->
      <div class="tenants-view__header">
        <div>
          <h1 class="tenants-view__title">Tenant / Organization Management</h1>
          <p class="tenants-view__subtitle">
            Manage tenants, organizations, and global platform settings
          </p>
        </div>
      </div>
      
      <!-- Tabs -->
      <div class="tenants-view__tabs">
        <button
          :class="[
            'tenants-view__tab',
            { 'tenants-view__tab--active': activeTab === 'tenants' }
          ]"
          @click="activeTab = 'tenants'"
        >
          <IconBase name="folder" :size="20" />
          <span>Tenants</span>
        </button>
        <button
          :class="[
            'tenants-view__tab',
            { 'tenants-view__tab--active': activeTab === 'settings' }
          ]"
          @click="activeTab = 'settings'"
        >
          <IconBase name="settings" :size="20" />
          <span>Global Settings</span>
        </button>
      </div>

      <!-- Content Panel -->
      <div class="tenants-view__content">
          <!-- Tenants Tab -->
          <div v-if="activeTab === 'tenants'" class="tenants-view__section">
            <div class="tenants-view__section-header">
              <div class="tenants-view__section-header-content">
                <div>
                  <h2 class="tenants-view__section-title">Tenants</h2>
                  <p class="tenants-view__section-subtitle">
                    Manage all tenant organizations on the platform
                  </p>
                </div>
                <BaseButton
                  v-if="permissions.canCreateTenants.value"
                  icon="plus"
                  @click="handleAddTenant"
                >
                  Add Tenant
                </BaseButton>
              </div>
            </div>

            <!-- Filters -->
            <div class="tenants-view__filters">
              <div class="tenants-view__search">
                <BaseSearch
                  v-model="searchQuery"
                  placeholder="Search tenants by name, domain, or email..."
                />
              </div>
              <div class="tenants-view__filter-group">
                <BaseSelect
                  v-model="statusFilter"
                  :options="[
                    { label: 'All Status', value: 'all' },
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                    { label: 'Trial', value: 'trial' },
                    { label: 'Suspended', value: 'suspended' }
                  ]"
                  placeholder="Status"
                  size="sm"
                />
                <BaseSelect
                  v-model="planFilter"
                  :options="[
                    { label: 'All Plans', value: 'all' },
                    { label: 'Starter', value: 'starter' },
                    { label: 'Professional', value: 'professional' },
                    { label: 'Enterprise', value: 'enterprise' }
                  ]"
                  placeholder="Plan"
                  size="sm"
                />
              </div>
            </div>

            <!-- Tenants Table -->
            <div class="tenants-view__table-container">
              <table class="tenants-view__table">
                <thead>
                  <tr>
                    <th>Tenant</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Users</th>
                    <th>Analytics</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="paginatedTenants.length > 0">
                    <tr v-for="tenant in paginatedTenants" :key="tenant.id">
                      <td>
                        <div class="tenants-view__tenant-info">
                          <div class="tenants-view__tenant-icon">
                            <IconBase name="folder" :size="24" />
                          </div>
                          <div>
                            <div class="tenants-view__tenant-name">{{ tenant.name }}</div>
                            <div class="tenants-view__tenant-domain">{{ tenant.domain }}</div>
                            <div class="tenants-view__tenant-email">{{ tenant.email }}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          :class="['tenants-view__badge', `tenants-view__badge--${getPlanColor(tenant.plan)}`]"
                        >
                          {{ tenant.plan.charAt(0).toUpperCase() + tenant.plan.slice(1) }}
                        </span>
                      </td>
                      <td>
                        <span
                          :class="['tenants-view__badge', `tenants-view__badge--${getStatusColor(tenant.status)}`]"
                        >
                          {{ getStatusLabel(tenant.status) }}
                        </span>
                      </td>
                      <td>
                        <span class="tenants-view__users-count">
                          {{ tenant.usersCount }} / {{ tenant.maxUsers === -1 ? '∞' : tenant.maxUsers }}
                        </span>
                      </td>
                      <td>
                        <BaseButton
                          variant="ghost"
                          size="sm"
                          icon="chart"
                          @click="activeTab = 'analytics'; selectedTenant = tenant"
                        >
                          View
                        </BaseButton>
                      </td>
                      <td>
                        <span class="tenants-view__date">{{ formatDate(tenant.createdAt) }}</span>
                      </td>
                      <td>
                        <BaseDropdown placement="bottom-end">
                          <template #trigger>
                            <button class="tenants-view__action-button">
                              <IconBase name="more-vertical" :size="18" />
                            </button>
                          </template>
                          <div class="tenants-view__dropdown-menu">
                            <button
                              class="tenants-view__dropdown-item"
                              @click="handleEditTenant(tenant)"
                            >
                              <IconBase name="edit" :size="16" />
                              <span>Edit</span>
                            </button>
                            <button
                              class="tenants-view__dropdown-item"
                              @click="toggleTenantStatus(tenant)"
                            >
                              <IconBase :name="tenant.status === 'active' ? 'ban' : 'check'" :size="16" />
                              <span>{{ tenant.status === 'active' ? 'Deactivate' : 'Activate' }}</span>
                            </button>
                            <button
                              class="tenants-view__dropdown-item tenants-view__dropdown-item--danger"
                              @click="handleDeleteTenant(tenant)"
                            >
                              <IconBase name="delete" :size="16" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </BaseDropdown>
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td colspan="7" class="tenants-view__empty">
                        <IconBase name="folder" :size="48" />
                        <p>No tenants found</p>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="tenants-view__pagination">
              <BasePagination
                :current-page="currentPage"
                :total-pages="totalPages"
                @update:current-page="currentPage = $event"
              />
            </div>
          </div>

          <!-- Global Settings Tab -->
          <div v-if="activeTab === 'settings'" class="tenants-view__section">
            <div class="tenants-view__section-header">
              <div class="tenants-view__section-header-content">
                <div>
                  <h2 class="tenants-view__section-title">Global Settings</h2>
                  <p class="tenants-view__section-subtitle">
                    Configure platform-wide settings for all tenants
                  </p>
                </div>
                <BaseButton @click="isSettingsModalOpen = true">
                  Edit Settings
                </BaseButton>
              </div>
            </div>

            <div class="tenants-view__settings-grid">
              <div class="tenants-view__setting-card">
                <div class="tenants-view__setting-header">
                  <h3 class="tenants-view__setting-title">Tenant Registration</h3>
                  <BaseToggle
                    :model-value="globalSettings.allowNewTenants"
                    disabled
                  />
                </div>
                <p class="tenants-view__setting-description">
                  Allow new tenants to register on the platform
                </p>
              </div>

              <div class="tenants-view__setting-card">
                <div class="tenants-view__setting-header">
                  <h3 class="tenants-view__setting-title">Email Verification</h3>
                  <BaseToggle
                    :model-value="globalSettings.requireEmailVerification"
                    disabled
                  />
                </div>
                <p class="tenants-view__setting-description">
                  Require email verification for new tenant accounts
                </p>
              </div>

              <div class="tenants-view__setting-card">
                <div class="tenants-view__setting-header">
                  <h3 class="tenants-view__setting-title">Default Plan</h3>
                  <span class="tenants-view__setting-value">{{ globalSettings.defaultPlan }}</span>
                </div>
                <p class="tenants-view__setting-description">
                  Default subscription plan for new tenants
                </p>
              </div>

              <div class="tenants-view__setting-card">
                <div class="tenants-view__setting-header">
                  <h3 class="tenants-view__setting-title">Max Tenants</h3>
                  <span class="tenants-view__setting-value">{{ globalSettings.maxTenants }}</span>
                </div>
                <p class="tenants-view__setting-description">
                  Maximum number of tenants allowed on the platform
                </p>
              </div>

              <div class="tenants-view__setting-card">
                <div class="tenants-view__setting-header">
                  <h3 class="tenants-view__setting-title">Maintenance Mode</h3>
                  <BaseToggle
                    :model-value="globalSettings.maintenanceMode"
                    disabled
                  />
                </div>
                <p class="tenants-view__setting-description">
                  Enable maintenance mode for all tenants
                </p>
              </div>
            </div>
          </div>
      </div>

      <!-- Add Tenant Modal -->
      <BaseModal
        v-model="isAddTenantModalOpen"
        title="Add Tenant"
        size="md"
      >
        <div class="tenants-view__modal-content">
          <BaseInput
            v-model="tenantForm.name"
            label="Tenant Name"
            placeholder="Acme Corporation"
            :error="tenantForm.errors.name"
            size="sm"
            required
          />
          <BaseInput
            v-model="tenantForm.domain"
            label="Domain"
            placeholder="acme.example.com"
            :error="tenantForm.errors.domain"
            size="sm"
            required
          />
          <BaseInput
            v-model="tenantForm.email"
            label="Contact Email"
            type="email"
            placeholder="admin@acme.com"
            :error="tenantForm.errors.email"
            size="sm"
            required
          />
          <div class="tenants-view__form-grid">
            <BaseSelect
              v-model="tenantForm.plan"
              label="Plan"
              size="sm"
              :options="[
                { label: 'Starter', value: 'starter' },
                { label: 'Professional', value: 'professional' },
                { label: 'Enterprise', value: 'enterprise' }
              ]"
              required
            />
            <BaseSelect
              v-model="tenantForm.status"
              label="Status"
              size="sm"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Trial', value: 'trial' },
                { label: 'Suspended', value: 'suspended' }
              ]"
              required
            />
          </div>
          <div class="tenants-view__form-grid">
            <BaseInput
              v-model.number="tenantForm.maxUsers"
              label="Max Users"
              type="number"
              placeholder="50"
              size="sm"
            />
            <BaseInput
              v-model.number="tenantForm.maxStorage"
              label="Max Storage (GB)"
              type="number"
              placeholder="500"
              size="sm"
            />
          </div>
          <div class="tenants-view__settings-section">
            <h4 class="tenants-view__settings-section-title">Tenant Settings</h4>
            <div class="tenants-view__settings-list">
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowCustomDomain"
                  label="Allow Custom Domain"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowSSO"
                  label="Allow SSO"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowAPI"
                  label="Allow API Access"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.enableAnalytics"
                  label="Enable Analytics"
                />
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isAddTenantModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveTenant">
            Create Tenant
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Edit Tenant Modal -->
      <BaseModal
        v-model="isEditTenantModalOpen"
        title="Edit Tenant"
        size="md"
      >
        <div class="tenants-view__modal-content">
          <BaseInput
            v-model="tenantForm.name"
            label="Tenant Name"
            placeholder="Acme Corporation"
            :error="tenantForm.errors.name"
            size="sm"
            required
          />
          <BaseInput
            v-model="tenantForm.domain"
            label="Domain"
            placeholder="acme.example.com"
            :error="tenantForm.errors.domain"
            size="sm"
            required
          />
          <BaseInput
            v-model="tenantForm.email"
            label="Contact Email"
            type="email"
            placeholder="admin@acme.com"
            :error="tenantForm.errors.email"
            size="sm"
            required
          />
          <div class="tenants-view__form-grid">
            <BaseSelect
              v-model="tenantForm.plan"
              label="Plan"
              size="sm"
              :options="[
                { label: 'Starter', value: 'starter' },
                { label: 'Professional', value: 'professional' },
                { label: 'Enterprise', value: 'enterprise' }
              ]"
              required
            />
            <BaseSelect
              v-model="tenantForm.status"
              label="Status"
              size="sm"
              :options="[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Trial', value: 'trial' },
                { label: 'Suspended', value: 'suspended' }
              ]"
              required
            />
          </div>
          <div class="tenants-view__form-grid">
            <BaseInput
              v-model.number="tenantForm.maxUsers"
              label="Max Users"
              type="number"
              placeholder="50"
              size="sm"
            />
            <BaseInput
              v-model.number="tenantForm.maxStorage"
              label="Max Storage (GB)"
              type="number"
              placeholder="500"
              size="sm"
            />
          </div>
          <div class="tenants-view__settings-section">
            <h4 class="tenants-view__settings-section-title">Tenant Settings</h4>
            <div class="tenants-view__settings-list">
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowCustomDomain"
                  label="Allow Custom Domain"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowSSO"
                  label="Allow SSO"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.allowAPI"
                  label="Allow API Access"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="tenantForm.settings.enableAnalytics"
                  label="Enable Analytics"
                />
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isEditTenantModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveTenant">
            Update Tenant
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Delete Tenant Modal -->
      <BaseModal
        v-model="isDeleteTenantModalOpen"
        title="Delete Tenant"
        size="md"
      >
        <div class="tenants-view__modal-content">
          <p class="tenants-view__modal-text">
            Are you sure you want to delete <strong>{{ selectedTenant?.name }}</strong>?
          </p>
          <p class="tenants-view__modal-warning">
            This action cannot be undone. All tenant data, users, and settings will be permanently deleted.
          </p>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isDeleteTenantModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton variant="error" @click="deleteTenant">
            Delete Tenant
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Global Settings Modal -->
      <BaseModal
        v-model="isSettingsModalOpen"
        title="Global Settings"
        size="md"
      >
        <div class="tenants-view__modal-content">
          <div class="tenants-view__settings-section">
            <h4 class="tenants-view__settings-section-title">Platform Settings</h4>
            <div class="tenants-view__settings-list">
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="globalSettings.allowNewTenants"
                  label="Allow New Tenant Registration"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="globalSettings.requireEmailVerification"
                  label="Require Email Verification"
                />
              </div>
              <div class="tenants-view__setting-item">
                <BaseToggle
                  v-model="globalSettings.maintenanceMode"
                  label="Maintenance Mode"
                />
              </div>
            </div>
          </div>
          <div class="tenants-view__form-grid">
            <BaseSelect
              v-model="globalSettings.defaultPlan"
              label="Default Plan"
              size="sm"
              :options="[
                { label: 'Starter', value: 'starter' },
                { label: 'Professional', value: 'professional' },
                { label: 'Enterprise', value: 'enterprise' }
              ]"
            />
            <BaseInput
              v-model.number="globalSettings.maxTenants"
              label="Max Tenants"
              type="number"
              placeholder="1000"
              size="sm"
            />
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isSettingsModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveGlobalSettings">
            Save Settings
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style scoped>
.tenants-view {
  padding: var(--spacing-xl);
}

.tenants-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.tenants-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.tenants-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.tenants-view__tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid rgb(var(--color-border));
}

.tenants-view__content {
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-xl);
  border: 1px solid rgb(var(--color-border));
  padding: var(--spacing-xl);
}

.tenants-view__tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: rgb(var(--color-text-secondary));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.tenants-view__tab:hover {
  color: rgb(var(--color-text-primary));
  background-color: rgb(var(--color-surface-hover));
}

.tenants-view__tab--active {
  color: rgb(var(--color-primary));
  border-bottom-color: rgb(var(--color-primary));
}


.tenants-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.tenants-view__section-header {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
}

.tenants-view__section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tenants-view__section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.tenants-view__section-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.tenants-view__filters {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-md);
  align-items: start;
}

.tenants-view__search {
  max-width: 100%;
}

.tenants-view__filter-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.tenants-view__table-container {
  overflow-x: auto;
  margin-bottom: var(--spacing-xl);
  width: 100%;
  -webkit-overflow-scrolling: touch;
}

.tenants-view__table {
  width: 100%;
  min-width: 1000px;
  border-collapse: collapse;
}

.tenants-view__table thead {
  background-color: rgb(var(--color-surface-secondary));
}

.tenants-view__table th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgb(var(--color-border));
}

.tenants-view__table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.tenants-view__tenant-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.tenants-view__tenant-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.tenants-view__tenant-name {
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin-bottom: var(--spacing-xs);
}

.tenants-view__tenant-domain {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin-bottom: var(--spacing-xs);
}

.tenants-view__tenant-email {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-tertiary));
}

.tenants-view__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.tenants-view__badge--primary {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: rgb(var(--color-primary));
}

.tenants-view__badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

.tenants-view__badge--warning {
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: rgb(var(--color-warning));
}

.tenants-view__badge--error {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: rgb(var(--color-error));
}

.tenants-view__badge--secondary {
  background-color: rgb(var(--color-surface-secondary));
  color: rgb(var(--color-text-secondary));
}

.tenants-view__users-count {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
  font-weight: var(--font-weight-medium);
}

.tenants-view__date {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.tenants-view__action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.tenants-view__action-button:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.tenants-view__dropdown-menu {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xs);
}

.tenants-view__dropdown-item {
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

.tenants-view__dropdown-item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.tenants-view__dropdown-item--danger {
  color: rgb(var(--color-error));
}

.tenants-view__dropdown-item--danger:hover {
  background-color: rgba(var(--color-error-rgb), 0.1);
}

.tenants-view__empty {
  text-align: center;
  padding: var(--spacing-2xl) !important;
  color: rgb(var(--color-text-secondary));
}

.tenants-view__empty svg {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.tenants-view__pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.tenants-view__settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.tenants-view__setting-card {
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
}

.tenants-view__setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.tenants-view__setting-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.tenants-view__setting-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
}

.tenants-view__setting-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.tenants-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tenants-view__modal-text {
  margin: 0;
  color: rgb(var(--color-text-primary));
}

.tenants-view__modal-warning {
  margin: 0;
  padding: var(--spacing-md);
  background-color: rgba(var(--color-warning-rgb), 0.1);
  border: 1px solid rgba(var(--color-warning-rgb), 0.2);
  border-radius: var(--radius-md);
  color: rgb(var(--color-warning));
  font-size: var(--font-size-sm);
}

.tenants-view__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.tenants-view__settings-section {
  margin-top: var(--spacing-md);
}

.tenants-view__settings-section-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-md) 0;
}

.tenants-view__settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tenants-view__setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 768px) {
  .tenants-view {
    padding: var(--spacing-md);
  }

  .tenants-view__tabs {
    overflow-x: auto;
  }

  .tenants-view__filters {
    grid-template-columns: 1fr;
  }

  .tenants-view__filter-group {
    grid-template-columns: 1fr;
  }

  .tenants-view__settings-grid {
    grid-template-columns: 1fr;
  }

  .tenants-view__form-grid {
    grid-template-columns: 1fr;
  }

  .tenants-view__section-header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
