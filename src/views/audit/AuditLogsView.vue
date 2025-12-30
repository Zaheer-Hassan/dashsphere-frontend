<script setup>
/**
 * AuditLogsView - Activity & Audit Logs
 * Track user activity, changes, and security/compliance events
 */

import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSearch from '@/components/base/BaseSearch.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
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
const isDetailsModalOpen = ref(false)
const selectedLog = ref(null)

// Data
const auditLogs = ref([])
const searchQuery = ref('')
const userFilter = ref('all')
const actionTypeFilter = ref('all')
const severityFilter = ref('all')
const dateRangeFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 20

// Action types
const ACTION_TYPES = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  ROLE_CREATE: 'role_create',
  ROLE_UPDATE: 'role_update',
  ROLE_DELETE: 'role_delete',
  SETTINGS_UPDATE: 'settings_update',
  DATA_EXPORT: 'data_export',
  DATA_ACCESS: 'data_access',
  PERMISSION_CHANGE: 'permission_change',
  FAILED_LOGIN: 'failed_login',
  SECURITY_EVENT: 'security_event',
  INTEGRATION_CHANGE: 'integration_change',
  BILLING_CHANGE: 'billing_change'
}

// Severity levels
const SEVERITY_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'critical'
}

// Computed properties
const filteredLogs = computed(() => {
  let filtered = auditLogs.value

  // Tenant isolation: Filter by tenant if not super-admin
  if (!isSuperAdmin.value && authStore.userTenantId) {
    filtered = filtered.filter(log => log.tenantId === authStore.userTenantId)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(log =>
      log.userName.toLowerCase().includes(query) ||
      log.userEmail.toLowerCase().includes(query) ||
      log.action.toLowerCase().includes(query) ||
      log.description.toLowerCase().includes(query) ||
      (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
      (log.resourceType && log.resourceType.toLowerCase().includes(query))
    )
  }

  // User filter
  if (userFilter.value !== 'all') {
    filtered = filtered.filter(log => log.userId === userFilter.value)
  }

  // Action type filter
  if (actionTypeFilter.value !== 'all') {
    filtered = filtered.filter(log => log.actionType === actionTypeFilter.value)
  }

  // Severity filter
  if (severityFilter.value !== 'all') {
    filtered = filtered.filter(log => log.severity === severityFilter.value)
  }

  // Date range filter
  if (dateRangeFilter.value === 'custom' && startDate.value && endDate.value) {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    end.setHours(23, 59, 59, 999) // End of day
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= end
    })
  } else if (dateRangeFilter.value !== 'all' && dateRangeFilter.value !== 'custom') {
    const now = new Date()
    let start = new Date()
    
    switch (dateRangeFilter.value) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        break
      case 'yesterday':
        start.setDate(start.getDate() - 1)
        start.setHours(0, 0, 0, 0)
        break
      case 'week':
        start.setDate(start.getDate() - 7)
        break
      case 'month':
        start.setMonth(start.getMonth() - 1)
        break
      case 'year':
        start.setFullYear(start.getFullYear() - 1)
        break
    }
    
    filtered = filtered.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= start && logDate <= now
    })
  }

  // Sort by timestamp (newest first)
  return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredLogs.value.length / itemsPerPage)
})

const uniqueUsers = computed(() => {
  const users = new Map()
  auditLogs.value.forEach(log => {
    if (!users.has(log.userId)) {
      users.set(log.userId, {
        id: log.userId,
        name: log.userName,
        email: log.userEmail
      })
    }
  })
  return Array.from(users.values())
})

// Functions
const loadAuditLogs = () => {
  // In a real app, this would be an API call filtered by tenant
  // For super-admin: fetch all logs
  // For tenant admin: fetch only logs from their tenant
  
  const currentTenantId = authStore.userTenantId || 'tenant-1'
  
  auditLogs.value = [
    // User Activity Logs
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'User Login',
      actionType: ACTION_TYPES.USER_LOGIN,
      description: 'User logged in successfully',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'authentication',
      resourceId: null,
      changes: null,
      metadata: { method: 'email', rememberMe: true }
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'User Created',
      actionType: ACTION_TYPES.USER_CREATE,
      description: 'Created new user: bob.johnson@acme.com',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      resourceType: 'user',
      resourceId: '3',
      changes: {
        before: null,
        after: {
          name: 'Bob Johnson',
          email: 'bob.johnson@acme.com',
          role: 'user',
          status: 'pending'
        }
      },
      metadata: { invitedBy: 'Jane Smith' }
    },
    {
      id: 'log-3',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'User Updated',
      actionType: ACTION_TYPES.USER_UPDATE,
      description: 'Updated user: jane.smith@acme.com',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'user',
      resourceId: '2',
      changes: {
        before: { role: 'user', status: 'active' },
        after: { role: 'manager', status: 'active' }
      },
      metadata: { reason: 'Promoted to manager' }
    },
    {
      id: 'log-4',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Role Created',
      actionType: ACTION_TYPES.ROLE_CREATE,
      description: 'Created custom role: Content Manager',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'role',
      resourceId: 'custom-1',
      changes: {
        before: null,
        after: {
          name: 'Content Manager',
          permissions: ['analytics:view', 'settings:view']
        }
      },
      metadata: {}
    },
    {
      id: 'log-5',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Data Export',
      actionType: ACTION_TYPES.DATA_EXPORT,
      description: 'Exported user data to CSV',
      severity: SEVERITY_LEVELS.WARNING,
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      resourceType: 'export',
      resourceId: 'export-123',
      changes: null,
      metadata: { format: 'CSV', recordCount: 150 }
    },
    {
      id: 'log-6',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
      userId: 'unknown',
      userName: 'Unknown User',
      userEmail: 'attacker@example.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Failed Login Attempt',
      actionType: ACTION_TYPES.FAILED_LOGIN,
      description: 'Failed login attempt with invalid credentials',
      severity: SEVERITY_LEVELS.WARNING,
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      resourceType: 'authentication',
      resourceId: null,
      changes: null,
      metadata: { attempts: 3, locked: false }
    },
    {
      id: 'log-7',
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Settings Updated',
      actionType: ACTION_TYPES.SETTINGS_UPDATE,
      description: 'Updated organization settings',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'settings',
      resourceId: 'settings-1',
      changes: {
        before: { allowPublicRegistration: false, requireEmailVerification: true },
        after: { allowPublicRegistration: true, requireEmailVerification: true }
      },
      metadata: {}
    },
    {
      id: 'log-8',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), // 1 day ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Permission Changed',
      actionType: ACTION_TYPES.PERMISSION_CHANGE,
      description: 'Changed permissions for role: Manager',
      severity: SEVERITY_LEVELS.WARNING,
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'role',
      resourceId: 'role-manager',
      changes: {
        before: { permissions: ['users:view', 'analytics:view'] },
        after: { permissions: ['users:view', 'users:edit', 'analytics:view', 'analytics:export'] }
      },
      metadata: {}
    },
    {
      id: 'log-9',
      timestamp: new Date(Date.now() - 2 * 24 * 3600000).toISOString(), // 2 days ago
      userId: '2',
      userName: 'Jane Smith',
      userEmail: 'jane.smith@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'User Deleted',
      actionType: ACTION_TYPES.USER_DELETE,
      description: 'Deleted user: inactive.user@acme.com',
      severity: SEVERITY_LEVELS.ERROR,
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      resourceType: 'user',
      resourceId: 'user-deleted-123',
      changes: {
        before: { name: 'Inactive User', email: 'inactive.user@acme.com', status: 'inactive' },
        after: null
      },
      metadata: { reason: 'Account cleanup' }
    },
    {
      id: 'log-10',
      timestamp: new Date(Date.now() - 3 * 24 * 3600000).toISOString(), // 3 days ago
      userId: '1',
      userName: 'John Doe',
      userEmail: 'john.doe@acme.com',
      tenantId: 'tenant-1',
      tenantName: 'Acme Corporation',
      action: 'Security Event',
      actionType: ACTION_TYPES.SECURITY_EVENT,
      description: 'Suspicious activity detected: Multiple failed login attempts',
      severity: SEVERITY_LEVELS.CRITICAL,
      ipAddress: '203.0.113.42',
      userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
      resourceType: 'security',
      resourceId: 'security-event-1',
      changes: null,
      metadata: { blocked: true, reason: 'Brute force attempt' }
    },
    // Tenant 2 Logs (visible to super-admin only)
    {
      id: 'log-11',
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(), // 1 hour ago
      userId: '9',
      userName: 'Sarah Connor',
      userEmail: 'sarah.connor@techcorp.com',
      tenantId: 'tenant-2',
      tenantName: 'TechCorp Inc',
      action: 'User Login',
      actionType: ACTION_TYPES.USER_LOGIN,
      description: 'User logged in successfully',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.2.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'authentication',
      resourceId: null,
      changes: null,
      metadata: { method: 'email' }
    },
    {
      id: 'log-12',
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
      userId: '9',
      userName: 'Sarah Connor',
      userEmail: 'sarah.connor@techcorp.com',
      tenantId: 'tenant-2',
      tenantName: 'TechCorp Inc',
      action: 'Integration Changed',
      actionType: ACTION_TYPES.INTEGRATION_CHANGE,
      description: 'Enabled Google OAuth integration',
      severity: SEVERITY_LEVELS.INFO,
      ipAddress: '192.168.2.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      resourceType: 'integration',
      resourceId: 'integration-google',
      changes: {
        before: { enabled: false },
        after: { enabled: true }
      },
      metadata: {}
    }
  ]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getSeverityColor = (severity) => {
  const colors = {
    [SEVERITY_LEVELS.INFO]: 'primary',
    [SEVERITY_LEVELS.WARNING]: 'warning',
    [SEVERITY_LEVELS.ERROR]: 'error',
    [SEVERITY_LEVELS.CRITICAL]: 'error'
  }
  return colors[severity] || 'secondary'
}

const getActionIcon = (actionType) => {
  const icons = {
    [ACTION_TYPES.USER_LOGIN]: 'log-in',
    [ACTION_TYPES.USER_LOGOUT]: 'log-out',
    [ACTION_TYPES.USER_CREATE]: 'user-plus',
    [ACTION_TYPES.USER_UPDATE]: 'edit',
    [ACTION_TYPES.USER_DELETE]: 'user-minus',
    [ACTION_TYPES.ROLE_CREATE]: 'shield-plus',
    [ACTION_TYPES.ROLE_UPDATE]: 'shield',
    [ACTION_TYPES.ROLE_DELETE]: 'shield-minus',
    [ACTION_TYPES.SETTINGS_UPDATE]: 'settings',
    [ACTION_TYPES.DATA_EXPORT]: 'download',
    [ACTION_TYPES.DATA_ACCESS]: 'eye',
    [ACTION_TYPES.PERMISSION_CHANGE]: 'key',
    [ACTION_TYPES.FAILED_LOGIN]: 'alert-circle',
    [ACTION_TYPES.SECURITY_EVENT]: 'shield-alert',
    [ACTION_TYPES.INTEGRATION_CHANGE]: 'plug',
    [ACTION_TYPES.BILLING_CHANGE]: 'credit-card'
  }
  return icons[actionType] || 'activity'
}

const exportLogs = () => {
  try {
    // In a real app, this would call an API endpoint
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Description', 'Severity', 'IP Address', 'Tenant'].join(','),
      ...filteredLogs.value.map(log => [
        new Date(log.timestamp).toISOString(),
        log.userName,
        log.action,
        log.description,
        log.severity,
        log.ipAddress || '',
        log.tenantName || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    showSuccess('Audit logs exported successfully')
  } catch (error) {
    showError('Failed to export audit logs')
  }
}

const viewLogDetails = (log) => {
  selectedLog.value = log
  isDetailsModalOpen.value = true
}

const formatFullDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  loadAuditLogs()
})
</script>

<template>
  <AppLayout>
    <div class="audit-logs-view">
      <!-- Header -->
      <div class="audit-logs-view__header">
        <div>
          <h1 class="audit-logs-view__title">Activity / Audit Logs</h1>
          <p class="audit-logs-view__subtitle">
            <span v-if="isSuperAdmin">Track user activity and changes across all organizations</span>
            <span v-else>Track user activity and changes in your organization</span>
          </p>
        </div>
        <BaseButton
          v-if="permissions.canExportAuditLogs?.value"
          icon="download"
          variant="outline"
          @click="exportLogs"
        >
          Export Logs
        </BaseButton>
      </div>

      <!-- Filters -->
      <div class="audit-logs-view__filters">
        <div class="audit-logs-view__search">
          <BaseSearch
            v-model="searchQuery"
            placeholder="Search by user, action, IP address..."
          />
        </div>
        <div class="audit-logs-view__filter-group">
          <BaseSelect
            v-model="userFilter"
            :options="[
              { label: 'All Users', value: 'all' },
              ...uniqueUsers.map(user => ({ label: user.name, value: user.id }))
            ]"
            placeholder="User"
            size="sm"
          />
          <BaseSelect
            v-model="actionTypeFilter"
            :options="[
              { label: 'All Actions', value: 'all' },
              { label: 'User Login', value: ACTION_TYPES.USER_LOGIN },
              { label: 'User Logout', value: ACTION_TYPES.USER_LOGOUT },
              { label: 'User Created', value: ACTION_TYPES.USER_CREATE },
              { label: 'User Updated', value: ACTION_TYPES.USER_UPDATE },
              { label: 'User Deleted', value: ACTION_TYPES.USER_DELETE },
              { label: 'Role Created', value: ACTION_TYPES.ROLE_CREATE },
              { label: 'Role Updated', value: ACTION_TYPES.ROLE_UPDATE },
              { label: 'Role Deleted', value: ACTION_TYPES.ROLE_DELETE },
              { label: 'Settings Updated', value: ACTION_TYPES.SETTINGS_UPDATE },
              { label: 'Data Export', value: ACTION_TYPES.DATA_EXPORT },
              { label: 'Permission Changed', value: ACTION_TYPES.PERMISSION_CHANGE },
              { label: 'Failed Login', value: ACTION_TYPES.FAILED_LOGIN },
              { label: 'Security Event', value: ACTION_TYPES.SECURITY_EVENT },
              { label: 'Integration Changed', value: ACTION_TYPES.INTEGRATION_CHANGE }
            ]"
            placeholder="Action Type"
            size="sm"
          />
          <BaseSelect
            v-model="severityFilter"
            :options="[
              { label: 'All Severities', value: 'all' },
              { label: 'Info', value: SEVERITY_LEVELS.INFO },
              { label: 'Warning', value: SEVERITY_LEVELS.WARNING },
              { label: 'Error', value: SEVERITY_LEVELS.ERROR },
              { label: 'Critical', value: SEVERITY_LEVELS.CRITICAL }
            ]"
            placeholder="Severity"
            size="sm"
          />
          <BaseSelect
            v-model="dateRangeFilter"
            :options="[
              { label: 'All Time', value: 'all' },
              { label: 'Today', value: 'today' },
              { label: 'Yesterday', value: 'yesterday' },
              { label: 'Last 7 Days', value: 'week' },
              { label: 'Last 30 Days', value: 'month' },
              { label: 'Last Year', value: 'year' },
              { label: 'Custom Range', value: 'custom' }
            ]"
            placeholder="Date Range"
            size="sm"
          />
        </div>
        <div v-if="dateRangeFilter === 'custom'" class="audit-logs-view__date-range">
          <BaseInput
            v-model="startDate"
            type="date"
            label="Start Date"
            size="sm"
          />
          <BaseInput
            v-model="endDate"
            type="date"
            label="End Date"
            size="sm"
          />
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="audit-logs-view__table-container">
        <table class="audit-logs-view__table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th v-if="isSuperAdmin">Tenant</th>
              <th>Action</th>
              <th>Severity</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="paginatedLogs.length > 0">
              <tr v-for="log in paginatedLogs" :key="log.id">
                <td>
                  <span class="audit-logs-view__timestamp">{{ formatDate(log.timestamp) }}</span>
                </td>
                <td>
                  <div class="audit-logs-view__user-info">
                    <div class="audit-logs-view__user-name">{{ log.userName }}</div>
                    <div class="audit-logs-view__user-email">{{ log.userEmail }}</div>
                  </div>
                </td>
                <td v-if="isSuperAdmin">
                  <span v-if="log.tenantName" class="audit-logs-view__tenant-name">
                    {{ log.tenantName }}
                  </span>
                  <span v-else class="audit-logs-view__tenant-name audit-logs-view__tenant-name--none">
                    Platform
                  </span>
                </td>
                <td>
                  <div class="audit-logs-view__action">
                    <IconBase :name="getActionIcon(log.actionType)" :size="16" />
                    <span>{{ log.action }}</span>
                  </div>
                </td>
                <td>
                  <span
                    :class="['audit-logs-view__badge', `audit-logs-view__badge--${getSeverityColor(log.severity)}`]"
                  >
                    {{ log.severity.charAt(0).toUpperCase() + log.severity.slice(1) }}
                  </span>
                </td>
                <td>
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    icon="eye"
                    @click="viewLogDetails(log)"
                  >
                    View
                  </BaseButton>
                </td>
              </tr>
            </template>
            <template v-else>
              <tr>
                <td :colspan="isSuperAdmin ? 6 : 5" class="audit-logs-view__empty">
                  <IconBase name="file-text" :size="48" />
                  <p>No audit logs found</p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Log Details Modal -->
      <BaseModal
        v-model="isDetailsModalOpen"
        title="Audit Log Details"
        size="lg"
      >
        <div v-if="selectedLog" class="audit-logs-view__modal-content">
          <div class="audit-logs-view__detail-section">
            <h3 class="audit-logs-view__detail-title">Basic Information</h3>
            <div class="audit-logs-view__detail-grid">
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Timestamp</span>
                <span class="audit-logs-view__detail-value">{{ formatFullDate(selectedLog.timestamp) }}</span>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Action</span>
                <div class="audit-logs-view__detail-value">
                  <IconBase :name="getActionIcon(selectedLog.actionType)" :size="16" />
                  <span>{{ selectedLog.action }}</span>
                </div>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Severity</span>
                <span
                  :class="['audit-logs-view__badge', `audit-logs-view__badge--${getSeverityColor(selectedLog.severity)}`]"
                >
                  {{ selectedLog.severity.charAt(0).toUpperCase() + selectedLog.severity.slice(1) }}
                </span>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Description</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.description }}</span>
              </div>
            </div>
          </div>

          <div class="audit-logs-view__detail-section">
            <h3 class="audit-logs-view__detail-title">User Information</h3>
            <div class="audit-logs-view__detail-grid">
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">User Name</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.userName }}</span>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Email</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.userEmail }}</span>
              </div>
              <div v-if="isSuperAdmin && selectedLog.tenantName" class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Tenant</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.tenantName }}</span>
              </div>
            </div>
          </div>

          <div class="audit-logs-view__detail-section">
            <h3 class="audit-logs-view__detail-title">Technical Details</h3>
            <div class="audit-logs-view__detail-grid">
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">IP Address</span>
                <span class="audit-logs-view__detail-value audit-logs-view__detail-value--mono">{{ selectedLog.ipAddress || 'N/A' }}</span>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">User Agent</span>
                <span class="audit-logs-view__detail-value audit-logs-view__detail-value--mono">{{ selectedLog.userAgent || 'N/A' }}</span>
              </div>
              <div class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Resource Type</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.resourceType || 'N/A' }}</span>
              </div>
              <div v-if="selectedLog.resourceId" class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">Resource ID</span>
                <span class="audit-logs-view__detail-value">{{ selectedLog.resourceId }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedLog.changes" class="audit-logs-view__detail-section">
            <h3 class="audit-logs-view__detail-title">Changes</h3>
            <div class="audit-logs-view__changes-container">
              <div v-if="selectedLog.changes.before" class="audit-logs-view__changes-box">
                <h4 class="audit-logs-view__changes-title">Before</h4>
                <pre class="audit-logs-view__changes-content">{{ JSON.stringify(selectedLog.changes.before, null, 2) }}</pre>
              </div>
              <div v-if="selectedLog.changes.after" class="audit-logs-view__changes-box">
                <h4 class="audit-logs-view__changes-title">After</h4>
                <pre class="audit-logs-view__changes-content">{{ JSON.stringify(selectedLog.changes.after, null, 2) }}</pre>
              </div>
            </div>
          </div>

          <div v-if="selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0" class="audit-logs-view__detail-section">
            <h3 class="audit-logs-view__detail-title">Metadata</h3>
            <div class="audit-logs-view__detail-grid">
              <div v-for="(value, key) in selectedLog.metadata" :key="key" class="audit-logs-view__detail-item">
                <span class="audit-logs-view__detail-label">{{ key }}</span>
                <span class="audit-logs-view__detail-value">{{ typeof value === 'object' ? JSON.stringify(value) : value }}</span>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isDetailsModalOpen = false">
            Close
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="audit-logs-view__pagination">
        <BasePagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:current-page="currentPage = $event"
        />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.audit-logs-view {
  padding: var(--spacing-xl);
}

.audit-logs-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.audit-logs-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.audit-logs-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.audit-logs-view__filters {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.audit-logs-view__search {
  margin-bottom: var(--spacing-md);
}

.audit-logs-view__filter-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.audit-logs-view__date-range {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.audit-logs-view__table-container {
  margin-bottom: var(--spacing-xl);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.audit-logs-view__table {
  width: 100%;
  border-collapse: collapse;
}

.audit-logs-view__table thead {
  background-color: rgb(var(--color-surface-secondary));
}

.audit-logs-view__table th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgb(var(--color-border));
}

.audit-logs-view__table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.audit-logs-view__timestamp {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  white-space: nowrap;
}

.audit-logs-view__user-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.audit-logs-view__user-name {
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  font-size: var(--font-size-sm);
}

.audit-logs-view__user-email {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-secondary));
}

.audit-logs-view__tenant-name {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
  font-weight: var(--font-weight-medium);
}

.audit-logs-view__tenant-name--none {
  color: rgb(var(--color-text-secondary));
  font-style: italic;
}

.audit-logs-view__action {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
}

.audit-logs-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.audit-logs-view__detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.audit-logs-view__detail-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgb(var(--color-border));
}

.audit-logs-view__detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.audit-logs-view__detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.audit-logs-view__detail-label {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.audit-logs-view__detail-value {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.audit-logs-view__detail-value--mono {
  font-family: monospace;
  font-size: var(--font-size-xs);
  background-color: rgb(var(--color-surface-secondary));
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  word-break: break-all;
}

.audit-logs-view__changes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.audit-logs-view__changes-box {
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
}

.audit-logs-view__changes-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.audit-logs-view__changes-content {
  font-size: var(--font-size-xs);
  font-family: monospace;
  color: rgb(var(--color-text-primary));
  margin: 0;
  padding: var(--spacing-sm);
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-sm);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.audit-logs-view__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.audit-logs-view__badge--primary {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: rgb(var(--color-primary));
}

.audit-logs-view__badge--warning {
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: rgb(var(--color-warning));
}

.audit-logs-view__badge--error {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: rgb(var(--color-error));
}

.audit-logs-view__badge--secondary {
  background-color: rgb(var(--color-surface-secondary));
  color: rgb(var(--color-text-secondary));
}

.audit-logs-view__ip {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  font-family: monospace;
}

.audit-logs-view__action-button {
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

.audit-logs-view__action-button:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.audit-logs-view__dropdown-menu {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xs);
}

.audit-logs-view__dropdown-item {
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

.audit-logs-view__dropdown-item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.audit-logs-view__empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: rgb(var(--color-text-secondary));
}

.audit-logs-view__empty svg {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.audit-logs-view__pagination {
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .audit-logs-view {
    padding: var(--spacing-md);
  }

  .audit-logs-view__filter-group {
    grid-template-columns: 1fr;
  }

  .audit-logs-view__date-range {
    grid-template-columns: 1fr;
  }
}
</style>

