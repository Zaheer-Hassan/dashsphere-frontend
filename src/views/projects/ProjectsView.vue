<script setup>
/**
 * ProjectsView - Projects / Modules Management
 * Manage and configure SaaS modules (Inventory, CRM, Tasks, Documents, Tickets, etc.)
 */

import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSearch from '@/components/base/BaseSearch.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import IconBase from '@/components/base/IconBase.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'
import { useAuthStore } from '@/stores/auth'
import { USER_ROLES } from '@/constants'

const permissions = usePermissions()
const { showSuccess, showError } = useNotifications()
const authStore = useAuthStore()

// Check if current user is super-admin
const isSuperAdmin = computed(() => authStore.userRole === USER_ROLES.SUPER_ADMIN)

// Modal states
const isConfigModalOpen = ref(false)
const selectedModule = ref(null)

// Data
const modules = ref([])
const searchQuery = ref('')
const statusFilter = ref('all')
const categoryFilter = ref('all')

// Module categories
const MODULE_CATEGORIES = {
  BUSINESS: 'business',
  PRODUCTIVITY: 'productivity',
  COMMUNICATION: 'communication',
  ANALYTICS: 'analytics',
  INTEGRATION: 'integration'
}

// Module status
const MODULE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CONFIGURING: 'configuring',
  ERROR: 'error'
}

// Computed properties
const filteredModules = computed(() => {
  let filtered = modules.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(module =>
      module.name.toLowerCase().includes(query) ||
      module.description.toLowerCase().includes(query) ||
      module.category.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(module => module.status === statusFilter.value)
  }

  // Category filter
  if (categoryFilter.value !== 'all') {
    filtered = filtered.filter(module => module.category === categoryFilter.value)
  }

  return filtered
})

const modulesByCategory = computed(() => {
  const grouped = {}
  filteredModules.value.forEach(module => {
    if (!grouped[module.category]) {
      grouped[module.category] = []
    }
    grouped[module.category].push(module)
  })
  return grouped
})

// Functions
const loadModules = () => {
  // In a real app, this would be an API call filtered by tenant
  modules.value = [
    // Business Modules
    {
      id: 'module-inventory',
      name: 'Inventory',
      description: 'Manage stock levels, warehouses, and product inventory',
      category: MODULE_CATEGORIES.BUSINESS,
      icon: 'package',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '2.1.0',
      lastUpdated: '2024-01-10T00:00:00Z',
      settings: {
        allowNegativeStock: false,
        autoReorder: true,
        lowStockThreshold: 10
      },
      features: ['Stock Management', 'Warehouse Tracking', 'Product Catalog', 'Reorder Points'],
      usage: {
        totalItems: 1250,
        warehouses: 3,
        lowStockItems: 15
      }
    },
    {
      id: 'module-crm',
      name: 'CRM',
      description: 'Customer relationship management and sales pipeline tracking',
      category: MODULE_CATEGORIES.BUSINESS,
      icon: 'users',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '3.2.1',
      lastUpdated: '2024-01-12T00:00:00Z',
      settings: {
        autoAssignLeads: true,
        emailIntegration: true,
        pipelineStages: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed']
      },
      features: ['Contact Management', 'Sales Pipeline', 'Lead Tracking', 'Email Integration'],
      usage: {
        totalContacts: 5420,
        activeDeals: 89,
        wonThisMonth: 23
      }
    },
    {
      id: 'module-tasks',
      name: 'Tasks',
      description: 'Project and task management with team collaboration',
      category: MODULE_CATEGORIES.PRODUCTIVITY,
      icon: 'check-circle',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '1.8.5',
      lastUpdated: '2024-01-08T00:00:00Z',
      settings: {
        allowSubtasks: true,
        timeTracking: true,
        dueDateReminders: true
      },
      features: ['Task Lists', 'Project Boards', 'Time Tracking', 'Team Collaboration'],
      usage: {
        totalTasks: 3420,
        activeProjects: 45,
        completedThisWeek: 156
      }
    },
    {
      id: 'module-documents',
      name: 'Documents',
      description: 'Document management, storage, and collaboration',
      category: MODULE_CATEGORIES.PRODUCTIVITY,
      icon: 'document',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '2.0.3',
      lastUpdated: '2024-01-11T00:00:00Z',
      settings: {
        maxFileSize: 100, // MB
        allowedFormats: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
        versionControl: true
      },
      features: ['File Storage', 'Version Control', 'Document Sharing', 'Search'],
      usage: {
        totalDocuments: 8920,
        storageUsed: 45.2, // GB
        sharedDocuments: 234
      }
    },
    {
      id: 'module-tickets',
      name: 'Tickets',
      description: 'Support ticket system and customer service management',
      category: MODULE_CATEGORIES.COMMUNICATION,
      icon: 'mail',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '1.5.2',
      lastUpdated: '2024-01-09T00:00:00Z',
      settings: {
        autoAssign: true,
        slaEnabled: true,
        defaultPriority: 'medium'
      },
      features: ['Ticket Management', 'SLA Tracking', 'Knowledge Base', 'Customer Portal'],
      usage: {
        openTickets: 67,
        resolvedToday: 23,
        avgResponseTime: '2.5 hours'
      }
    },
    {
      id: 'module-analytics',
      name: 'Analytics',
      description: 'Advanced analytics and reporting dashboard',
      category: MODULE_CATEGORIES.ANALYTICS,
      icon: 'chart',
      status: MODULE_STATUS.ACTIVE,
      enabled: true,
      version: '4.1.0',
      lastUpdated: '2024-01-13T00:00:00Z',
      settings: {
        dataRetention: 365, // days
        realTimeUpdates: true,
        exportFormats: ['csv', 'pdf', 'excel']
      },
      features: ['Custom Reports', 'Data Visualization', 'Export', 'Scheduled Reports'],
      usage: {
        totalReports: 45,
        scheduledReports: 12,
        dataPoints: 125000
      }
    },
    {
      id: 'module-invoicing',
      name: 'Invoicing',
      description: 'Invoice creation, billing, and payment tracking',
      category: MODULE_CATEGORIES.BUSINESS,
      icon: 'credit-card',
      status: MODULE_STATUS.INACTIVE,
      enabled: false,
      version: '1.2.0',
      lastUpdated: '2024-01-05T00:00:00Z',
      settings: {
        currency: 'USD',
        taxEnabled: true,
        paymentTerms: 30
      },
      features: ['Invoice Creation', 'Payment Tracking', 'Recurring Invoices', 'Payment Reminders'],
      usage: null
    },
    {
      id: 'module-calendar',
      name: 'Calendar',
      description: 'Calendar and scheduling management',
      category: MODULE_CATEGORIES.PRODUCTIVITY,
      icon: 'calendar',
      status: MODULE_STATUS.CONFIGURING,
      enabled: false,
      version: '1.0.0',
      lastUpdated: '2024-01-14T00:00:00Z',
      settings: {
        timezone: 'UTC',
        workingHours: { start: '09:00', end: '17:00' },
        reminders: true
      },
      features: ['Event Scheduling', 'Calendar Sync', 'Reminders', 'Team Calendar'],
      usage: null
    }
  ]
}

const toggleModule = async (module) => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    module.enabled = !module.enabled
    module.status = module.enabled ? MODULE_STATUS.ACTIVE : MODULE_STATUS.INACTIVE
    
    showSuccess(`${module.name} ${module.enabled ? 'enabled' : 'disabled'} successfully`)
  } catch (error) {
    showError(`Failed to ${module.enabled ? 'disable' : 'enable'} module`)
  }
}

const handleConfigureModule = (module) => {
  selectedModule.value = { ...module }
  isConfigModalOpen.value = true
}

const saveModuleConfig = async () => {
  try {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const moduleIndex = modules.value.findIndex(m => m.id === selectedModule.value.id)
    if (moduleIndex !== -1) {
      modules.value[moduleIndex] = { ...selectedModule.value }
    }
    
    showSuccess('Module configuration saved successfully')
    isConfigModalOpen.value = false
  } catch (error) {
    showError('Failed to save module configuration')
  }
}

const getCategoryLabel = (category) => {
  const labels = {
    [MODULE_CATEGORIES.BUSINESS]: 'Business',
    [MODULE_CATEGORIES.PRODUCTIVITY]: 'Productivity',
    [MODULE_CATEGORIES.COMMUNICATION]: 'Communication',
    [MODULE_CATEGORIES.ANALYTICS]: 'Analytics',
    [MODULE_CATEGORIES.INTEGRATION]: 'Integration'
  }
  return labels[category] || category
}

const getStatusColor = (status) => {
  const colors = {
    [MODULE_STATUS.ACTIVE]: 'success',
    [MODULE_STATUS.INACTIVE]: 'secondary',
    [MODULE_STATUS.CONFIGURING]: 'warning',
    [MODULE_STATUS.ERROR]: 'error'
  }
  return colors[status] || 'secondary'
}

const getStatusLabel = (status) => {
  const labels = {
    [MODULE_STATUS.ACTIVE]: 'Active',
    [MODULE_STATUS.INACTIVE]: 'Inactive',
    [MODULE_STATUS.CONFIGURING]: 'Configuring',
    [MODULE_STATUS.ERROR]: 'Error'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  loadModules()
})
</script>

<template>
  <AppLayout>
    <div class="projects-view">
      <!-- Header -->
      <div class="projects-view__header">
        <div>
          <h1 class="projects-view__title">Projects / Modules</h1>
          <p class="projects-view__subtitle">
            <span v-if="isSuperAdmin">Manage and configure modules across all organizations</span>
            <span v-else>Manage and configure modules for your organization</span>
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="projects-view__filters">
        <div class="projects-view__search">
          <BaseSearch
            v-model="searchQuery"
            placeholder="Search modules by name or description..."
          />
        </div>
        <div class="projects-view__filter-group">
          <BaseSelect
            v-model="statusFilter"
            :options="[
              { label: 'All Status', value: 'all' },
              { label: 'Active', value: MODULE_STATUS.ACTIVE },
              { label: 'Inactive', value: MODULE_STATUS.INACTIVE },
              { label: 'Configuring', value: MODULE_STATUS.CONFIGURING },
              { label: 'Error', value: MODULE_STATUS.ERROR }
            ]"
            placeholder="Status"
            size="sm"
          />
          <BaseSelect
            v-model="categoryFilter"
            :options="[
              { label: 'All Categories', value: 'all' },
              { label: 'Business', value: MODULE_CATEGORIES.BUSINESS },
              { label: 'Productivity', value: MODULE_CATEGORIES.PRODUCTIVITY },
              { label: 'Communication', value: MODULE_CATEGORIES.COMMUNICATION },
              { label: 'Analytics', value: MODULE_CATEGORIES.ANALYTICS },
              { label: 'Integration', value: MODULE_CATEGORIES.INTEGRATION }
            ]"
            placeholder="Category"
            size="sm"
          />
        </div>
      </div>

      <!-- Modules Grid -->
      <div class="projects-view__modules-grid">
        <div
          v-for="module in filteredModules"
          :key="module.id"
          class="projects-view__module-card"
        >
          <div class="projects-view__module-header">
            <div class="projects-view__module-icon-wrapper">
              <IconBase :name="module.icon" :size="24" />
            </div>
            <div class="projects-view__module-info">
              <h3 class="projects-view__module-name">{{ module.name }}</h3>
              <p class="projects-view__module-description">{{ module.description }}</p>
            </div>
            <div class="projects-view__module-actions">
              <span
                :class="['projects-view__badge', `projects-view__badge--${getStatusColor(module.status)}`]"
              >
                {{ getStatusLabel(module.status) }}
              </span>
              <BaseToggle
                :model-value="module.enabled"
                @update:model-value="toggleModule(module)"
              />
            </div>
          </div>

          <div class="projects-view__module-body">
            <div class="projects-view__module-meta">
              <div class="projects-view__meta-item">
                <IconBase name="tag" :size="14" />
                <span>{{ getCategoryLabel(module.category) }}</span>
              </div>
              <div class="projects-view__meta-item">
                <IconBase name="clock" :size="14" />
                <span>v{{ module.version }}</span>
              </div>
              <div class="projects-view__meta-item">
                <IconBase name="calendar" :size="14" />
                <span>Updated {{ formatDate(module.lastUpdated) }}</span>
              </div>
            </div>

            <div v-if="module.enabled && module.usage" class="projects-view__module-usage">
              <h4 class="projects-view__usage-title">Usage Statistics</h4>
              <div class="projects-view__usage-grid">
                <div
                  v-for="(value, key) in module.usage"
                  :key="key"
                  class="projects-view__usage-item"
                >
                  <span class="projects-view__usage-label">{{ key.replace(/([A-Z])/g, ' $1').trim() }}</span>
                  <span class="projects-view__usage-value">{{ value }}</span>
                </div>
              </div>
            </div>

            <div class="projects-view__module-features">
              <h4 class="projects-view__features-title">Features</h4>
              <div class="projects-view__features-list">
                <span
                  v-for="feature in module.features"
                  :key="feature"
                  class="projects-view__feature-tag"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>

          <div class="projects-view__module-footer">
            <BaseButton
              variant="outline"
              size="sm"
              @click="handleConfigureModule(module)"
            >
              <IconBase name="settings" :size="16" />
              Configure
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredModules.length === 0" class="projects-view__empty">
        <IconBase name="package" :size="48" />
        <p>No modules found</p>
      </div>

      <!-- Module Configuration Modal -->
      <BaseModal
        v-model="isConfigModalOpen"
        :title="selectedModule ? `Configure ${selectedModule.name}` : 'Configure Module'"
        size="lg"
      >
        <div v-if="selectedModule" class="projects-view__modal-content">
          <div class="projects-view__config-section">
            <h3 class="projects-view__config-title">Module Settings</h3>
            <div class="projects-view__config-grid">
              <div
                v-for="(value, key) in selectedModule.settings"
                :key="key"
                class="projects-view__config-item"
              >
                <label class="projects-view__config-label">
                  {{ key.replace(/([A-Z])/g, ' $1').trim() }}
                </label>
                <BaseInput
                  v-if="typeof value === 'string' || typeof value === 'number'"
                  v-model="selectedModule.settings[key]"
                  :type="typeof value === 'number' ? 'number' : 'text'"
                  size="sm"
                />
                <BaseToggle
                  v-else-if="typeof value === 'boolean'"
                  v-model="selectedModule.settings[key]"
                />
                <BaseSelect
                  v-else-if="Array.isArray(value)"
                  v-model="selectedModule.settings[key]"
                  :options="value.map(item => ({ label: item, value: item }))"
                  size="sm"
                  multiple
                />
              </div>
            </div>
          </div>

          <div class="projects-view__config-section">
            <h3 class="projects-view__config-title">Module Information</h3>
            <div class="projects-view__info-grid">
              <div class="projects-view__info-item">
                <span class="projects-view__info-label">Version</span>
                <span class="projects-view__info-value">{{ selectedModule.version }}</span>
              </div>
              <div class="projects-view__info-item">
                <span class="projects-view__info-label">Category</span>
                <span class="projects-view__info-value">{{ getCategoryLabel(selectedModule.category) }}</span>
              </div>
              <div class="projects-view__info-item">
                <span class="projects-view__info-label">Status</span>
                <span
                  :class="['projects-view__badge', `projects-view__badge--${getStatusColor(selectedModule.status)}`]"
                >
                  {{ getStatusLabel(selectedModule.status) }}
                </span>
              </div>
              <div class="projects-view__info-item">
                <span class="projects-view__info-label">Last Updated</span>
                <span class="projects-view__info-value">{{ formatDate(selectedModule.lastUpdated) }}</span>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isConfigModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveModuleConfig">
            Save Configuration
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style scoped>
.projects-view {
  padding: var(--spacing-xl);
}

.projects-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.projects-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.projects-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.projects-view__filters {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.projects-view__search {
  margin-bottom: var(--spacing-md);
}

.projects-view__filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.projects-view__modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
}

.projects-view__module-card {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--transition-fast) ease;
}

.projects-view__module-card:hover {
  box-shadow: var(--shadow-md);
  border-color: rgb(var(--color-primary));
}

.projects-view__module-header {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.projects-view__module-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background-color: rgb(var(--color-primary-light));
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--color-primary));
  flex-shrink: 0;
}

.projects-view__module-info {
  flex: 1;
  min-width: 0;
}

.projects-view__module-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.projects-view__module-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
  line-height: 1.5;
}

.projects-view__module-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--spacing-sm);
}

.projects-view__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.projects-view__badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

.projects-view__badge--warning {
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: rgb(var(--color-warning));
}

.projects-view__badge--error {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: rgb(var(--color-error));
}

.projects-view__badge--secondary {
  background-color: rgb(var(--color-surface-secondary));
  color: rgb(var(--color-text-secondary));
}

.projects-view__module-body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.projects-view__module-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgb(var(--color-border));
}

.projects-view__meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-secondary));
}

.projects-view__module-usage {
  padding: var(--spacing-md);
  background-color: rgb(var(--color-surface-secondary));
  border-radius: var(--radius-md);
}

.projects-view__usage-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.projects-view__usage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-sm);
}

.projects-view__usage-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.projects-view__usage-label {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-secondary));
  text-transform: capitalize;
}

.projects-view__usage-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
}

.projects-view__module-features {
  padding-top: var(--spacing-md);
  border-top: 1px solid rgb(var(--color-border));
}

.projects-view__features-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.projects-view__features-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.projects-view__feature-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-primary));
}

.projects-view__module-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: var(--spacing-md);
  border-top: 1px solid rgb(var(--color-border));
}

.projects-view__empty {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  color: rgb(var(--color-text-secondary));
}

.projects-view__empty svg {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.projects-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.projects-view__config-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.projects-view__config-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgb(var(--color-border));
}

.projects-view__config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.projects-view__config-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.projects-view__config-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
}

.projects-view__info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.projects-view__info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.projects-view__info-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.projects-view__info-value {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
}

@media (max-width: 768px) {
  .projects-view {
    padding: var(--spacing-md);
  }

  .projects-view__modules-grid {
    grid-template-columns: 1fr;
  }

  .projects-view__filter-group {
    grid-template-columns: 1fr;
  }

  .projects-view__config-grid {
    grid-template-columns: 1fr;
  }
}
</style>

