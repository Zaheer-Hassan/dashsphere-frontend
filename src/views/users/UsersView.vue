<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSearch from '@/components/base/BaseSearch.vue'
import BaseDropdown from '@/components/base/BaseDropdown.vue'
import BasePagination from '@/components/base/BasePagination.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import IconBase from '@/components/base/IconBase.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'
import { USER_ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '@/constants'

const permissions = usePermissions()
const { showSuccess, showError } = useNotifications()

// Tab state
const activeTab = ref('users')

// Modal states
const isInviteModalOpen = ref(false)
const isResetPasswordModalOpen = ref(false)
const isDeactivateModalOpen = ref(false)
const isRoleModalOpen = ref(false)

// Form states
const inviteForm = ref({
  email: '',
  role: USER_ROLES.USER,
  errors: {}
})

const resetPasswordForm = ref({
  sendEmail: true,
  temporaryPassword: '',
  errors: {}
})

const selectedUser = ref(null)
const selectedRole = ref(null)
const roleForm = ref({
  name: '',
  description: '',
  permissions: [],
  errors: {}
})

// Data
const users = ref([])
const roles = ref([])
const searchQuery = ref('')
const userTypeFilter = ref('all')
const roleFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  // User type filter
  if (userTypeFilter.value !== 'all') {
    filtered = filtered.filter(user => user.userType === userTypeFilter.value)
  }

  // Role filter
  if (roleFilter.value !== 'all') {
    filtered = filtered.filter(user => user.role === roleFilter.value)
  }

  // Status filter
  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const permissionGroups = computed(() => {
  const groups = {
    'User Management': [
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE
    ],
    'Role Management': [
      PERMISSIONS.ROLES_VIEW,
      PERMISSIONS.ROLES_CREATE,
      PERMISSIONS.ROLES_EDIT,
      PERMISSIONS.ROLES_DELETE
    ],
    'Analytics': [
      PERMISSIONS.ANALYTICS_VIEW,
      PERMISSIONS.ANALYTICS_EXPORT
    ],
    'Billing': [
      PERMISSIONS.BILLING_VIEW,
      PERMISSIONS.BILLING_MANAGE
    ],
    'Settings': [
      PERMISSIONS.SETTINGS_VIEW,
      PERMISSIONS.SETTINGS_EDIT
    ],
    'Integrations': [
      PERMISSIONS.INTEGRATIONS_VIEW,
      PERMISSIONS.INTEGRATIONS_MANAGE
    ],
    'Notifications': [
      PERMISSIONS.NOTIFICATIONS_VIEW,
      PERMISSIONS.NOTIFICATIONS_MANAGE
    ],
    'Audit Logs': [
      PERMISSIONS.AUDIT_LOGS_VIEW
    ]
  }

  return Object.entries(groups).map(([group, perms]) => ({
    group,
    permissions: perms.map(perm => ({
      key: perm,
      label: perm.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }))
  }))
})

const defaultRoles = computed(() => {
  return [
    {
      id: 'admin',
      name: 'Admin',
      description: 'Full access to tenant resources and settings',
      userCount: users.value.filter(u => u.role === USER_ROLES.TENANT_ADMIN).length,
      permissions: ROLE_PERMISSIONS[USER_ROLES.TENANT_ADMIN] || []
    },
    {
      id: 'manager',
      name: 'Manager',
      description: 'Can manage teams and view analytics',
      userCount: users.value.filter(u => u.role === USER_ROLES.MANAGER).length,
      permissions: ROLE_PERMISSIONS[USER_ROLES.MANAGER] || []
    },
    {
      id: 'staff',
      name: 'Staff',
      description: 'Standard user with limited permissions',
      userCount: users.value.filter(u => u.role === USER_ROLES.USER).length,
      permissions: ROLE_PERMISSIONS[USER_ROLES.USER] || []
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'Read-only access to analytics and reports',
      userCount: users.value.filter(u => u.role === USER_ROLES.VIEWER).length,
      permissions: ROLE_PERMISSIONS[USER_ROLES.VIEWER] || []
    }
  ]
})

const customRoles = computed(() => {
  return roles.value
})

// Functions
const handleInviteUser = () => {
  inviteForm.value = {
    email: '',
    role: USER_ROLES.USER,
    errors: {}
  }
  isInviteModalOpen.value = true
}

const sendInvite = async () => {
  // Validation
  inviteForm.value.errors = {}
  
  if (!inviteForm.value.email) {
    inviteForm.value.errors.email = 'Email is required'
    return
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteForm.value.email)) {
    inviteForm.value.errors.email = 'Invalid email format'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Add pending user
    users.value.push({
      id: Date.now(),
      name: 'Pending',
      email: inviteForm.value.email,
      role: inviteForm.value.role,
      userType: 'tenant_user',
      status: 'pending',
      avatar: null,
      lastLogin: null,
      invitedAt: new Date().toISOString()
    })

    showSuccess(`Invitation sent to ${inviteForm.value.email}`)
    isInviteModalOpen.value = false
  } catch (error) {
    showError('Failed to send invitation')
  }
}

const handleResetPassword = (user) => {
  selectedUser.value = user
  resetPasswordForm.value = {
    sendEmail: true,
    temporaryPassword: '',
    errors: {}
  }
  isResetPasswordModalOpen.value = true
}

const resetPassword = async () => {
  if (!resetPasswordForm.value.sendEmail && !resetPasswordForm.value.temporaryPassword) {
    resetPasswordForm.value.errors.temporaryPassword = 'Temporary password is required'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    showSuccess(
      resetPasswordForm.value.sendEmail
        ? `Password reset email sent to ${selectedUser.value.email}`
        : `Password reset for ${selectedUser.value.name}`
    )
    isResetPasswordModalOpen.value = false
    selectedUser.value = null
  } catch (error) {
    showError('Failed to reset password')
  }
}

const handleDeactivateUser = (user) => {
  selectedUser.value = user
  isDeactivateModalOpen.value = true
}

const deactivateUser = async () => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index].status = 'inactive'
    }
    
    showSuccess(`${selectedUser.value.name} has been deactivated`)
    isDeactivateModalOpen.value = false
    selectedUser.value = null
  } catch (error) {
    showError('Failed to deactivate user')
  }
}

const activateUser = async (user) => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = users.value.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users.value[index].status = 'active'
    }
    
    showSuccess(`${user.name} has been activated`)
  } catch (error) {
    showError('Failed to activate user')
  }
}

const handleEditRole = (role) => {
  selectedRole.value = role
  roleForm.value = {
    name: role.name,
    description: role.description || '',
    permissions: [...(role.permissions || [])],
    errors: {}
  }
  isRoleModalOpen.value = true
}

const handleCreateRole = () => {
  selectedRole.value = null
  roleForm.value = {
    name: '',
    description: '',
    permissions: [],
    errors: {}
  }
  isRoleModalOpen.value = true
}

const togglePermission = (permission) => {
  const index = roleForm.value.permissions.indexOf(permission)
  if (index > -1) {
    roleForm.value.permissions.splice(index, 1)
  } else {
    roleForm.value.permissions.push(permission)
  }
}

const saveRole = async () => {
  // Validation
  roleForm.value.errors = {}
  
  if (!roleForm.value.name.trim()) {
    roleForm.value.errors.name = 'Role name is required'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (selectedRole.value) {
      // Update existing role
      const index = roles.value.findIndex(r => r.id === selectedRole.value.id)
      if (index !== -1) {
        roles.value[index] = {
          ...roles.value[index],
          name: roleForm.value.name,
          description: roleForm.value.description,
          permissions: roleForm.value.permissions
        }
      }
      showSuccess(`Role "${roleForm.value.name}" updated successfully`)
    } else {
      // Create new role
      const newRole = {
        id: `custom-${Date.now()}`,
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions,
        isCustom: true,
        userCount: 0
      }
      roles.value.push(newRole)
      showSuccess(`Role "${roleForm.value.name}" created successfully`)
    }
    
    isRoleModalOpen.value = false
    selectedRole.value = null
  } catch (error) {
    showError('Failed to save role')
  }
}

// Data loading
const loadUsers = () => {
  users.value = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: USER_ROLES.TENANT_ADMIN,
      userType: 'tenant_user',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: USER_ROLES.MANAGER,
      userType: 'tenant_user',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T09:15:00Z'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      role: USER_ROLES.USER,
      userType: 'tenant_user',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-14T16:45:00Z'
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      role: USER_ROLES.VIEWER,
      userType: 'tenant_user',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-14T14:20:00Z'
    },
    {
      id: 5,
      name: 'Super Admin',
      email: 'admin@platform.com',
      role: USER_ROLES.SUPER_ADMIN,
      userType: 'super_admin',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T11:00:00Z'
    },
    {
      id: 6,
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      role: USER_ROLES.USER,
      userType: 'tenant_user',
      status: 'inactive',
      avatar: null,
      lastLogin: '2024-01-10T08:30:00Z'
    },
    {
      id: 7,
      name: 'Diana Prince',
      email: 'diana.prince@example.com',
      role: USER_ROLES.MANAGER,
      userType: 'tenant_user',
      status: 'active',
      avatar: null,
      lastLogin: '2024-01-15T07:20:00Z'
    },
    {
      id: 8,
      name: 'Pending User',
      email: 'pending@example.com',
      role: USER_ROLES.USER,
      userType: 'tenant_user',
      status: 'pending',
      avatar: null,
      lastLogin: null,
      invitedAt: '2024-01-12T12:00:00Z'
    }
  ]
}

const loadRoles = () => {
  roles.value = [
    {
      id: 'custom-1',
      name: 'Content Manager',
      description: 'Can manage content and view analytics',
      permissions: [
        PERMISSIONS.ANALYTICS_VIEW,
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.NOTIFICATIONS_VIEW
      ],
      isCustom: true,
      userCount: 2
    },
    {
      id: 'custom-2',
      name: 'Support Agent',
      description: 'Can view users and manage notifications',
      permissions: [
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.NOTIFICATIONS_VIEW,
        PERMISSIONS.NOTIFICATIONS_MANAGE
      ],
      isCustom: true,
      userCount: 1
    }
  ]
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'Never'
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getUserInitials = (name) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getRoleColor = (role) => {
  const colors = {
    [USER_ROLES.SUPER_ADMIN]: 'error',
    [USER_ROLES.TENANT_ADMIN]: 'error',
    [USER_ROLES.MANAGER]: 'warning',
    [USER_ROLES.USER]: 'primary',
    [USER_ROLES.VIEWER]: 'secondary'
  }
  return colors[role] || 'secondary'
}

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'secondary',
    suspended: 'error',
    pending: 'warning'
  }
  return colors[status] || 'secondary'
}

const formatRole = (role) => {
  const roleMap = {
    [USER_ROLES.SUPER_ADMIN]: 'Super Admin',
    [USER_ROLES.TENANT_ADMIN]: 'Admin',
    [USER_ROLES.MANAGER]: 'Manager',
    [USER_ROLES.USER]: 'Staff',
    [USER_ROLES.VIEWER]: 'Viewer'
  }
  return roleMap[role] || role
}

const getUserTypeLabel = (userType) => {
  return userType === 'super_admin' ? 'Super Admin' : 'Tenant User'
}

const getUserTypeColor = (userType) => {
  return userType === 'super_admin' ? 'error' : 'primary'
}

onMounted(() => {
  loadUsers()
  loadRoles()
})
</script>

<template>
  <AppLayout>
    <div class="users-management-view">
      <!-- Header -->
      <div class="users-management-view__header">
        <div>
          <h1 class="users-management-view__title">User Management</h1>
          <p class="users-management-view__subtitle">
            Manage users, roles, and permissions for your organization
          </p>
        </div>
        <BaseButton
          v-if="activeTab === 'users' && permissions.canCreateUsers.value"
          icon="plus"
          @click="handleInviteUser"
        >
          Invite User
        </BaseButton>
        <BaseButton
          v-if="activeTab === 'roles' && permissions.canCreateUsers.value"
          icon="plus"
          @click="handleCreateRole"
        >
          Create Role
        </BaseButton>
      </div>

      <!-- Tabs -->
      <div class="users-management-view__tabs">
        <button
          :class="['users-management-view__tab', { 'users-management-view__tab--active': activeTab === 'users' }]"
          @click="activeTab = 'users'"
        >
          <IconBase name="users" :size="20" />
          <span>Users</span>
        </button>
        <button
          :class="['users-management-view__tab', { 'users-management-view__tab--active': activeTab === 'roles' }]"
          @click="activeTab = 'roles'"
        >
          <IconBase name="settings" :size="20" />
          <span>Roles & Permissions</span>
        </button>
      </div>

      <!-- Users Tab Content -->
      <div v-if="activeTab === 'users'" class="users-management-view__content">
        <!-- Filters -->
        <div class="users-management-view__filters">
          <div class="users-management-view__search">
            <BaseSearch
              v-model="searchQuery"
              placeholder="Search users by name or email..."
            />
          </div>
          <div class="users-management-view__filter-group">
            <BaseSelect
              v-model="userTypeFilter"
              :options="[
                { label: 'All Types', value: 'all' },
                { label: 'Tenant Users', value: 'tenant_user' },
                { label: 'Super Admin', value: 'super_admin' }
              ]"
              placeholder="User Type"
            />
            <BaseSelect
              v-model="roleFilter"
              :options="[
                { label: 'All Roles', value: 'all' },
                { label: 'Admin', value: USER_ROLES.TENANT_ADMIN },
                { label: 'Manager', value: USER_ROLES.MANAGER },
                { label: 'Staff', value: USER_ROLES.USER },
                { label: 'Viewer', value: USER_ROLES.VIEWER }
              ]"
              placeholder="Role"
            />
            <BaseSelect
              v-model="statusFilter"
              :options="[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Pending', value: 'pending' }
              ]"
              placeholder="Status"
            />
          </div>
        </div>

        <!-- Users Table -->
        <div class="users-management-view__table-container">
          <table class="users-management-view__table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="paginatedUsers.length > 0">
                <tr v-for="user in paginatedUsers" :key="user.id">
                  <td>
                    <div class="users-management-view__user-info">
                      <div
                        class="users-management-view__avatar"
                        :style="{ backgroundColor: `hsl(${user.id * 50 % 360}, 70%, 50%)` }"
                      >
                        {{ getUserInitials(user.name) }}
                      </div>
                      <div>
                        <div class="users-management-view__user-name">{{ user.name }}</div>
                        <div class="users-management-view__user-email">{{ user.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      :class="['users-management-view__badge', `users-management-view__badge--${getUserTypeColor(user.userType)}`]"
                    >
                      {{ getUserTypeLabel(user.userType) }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="['users-management-view__badge', `users-management-view__badge--${getRoleColor(user.role)}`]"
                    >
                      {{ formatRole(user.role) }}
                    </span>
                  </td>
                  <td>
                    <span
                      :class="['users-management-view__badge', `users-management-view__badge--${getStatusColor(user.status)}`]"
                    >
                      {{ user.status.charAt(0).toUpperCase() + user.status.slice(1) }}
                    </span>
                  </td>
                  <td>
                    <span class="users-management-view__date">{{ formatDate(user.lastLogin) }}</span>
                  </td>
                  <td>
                    <BaseDropdown placement="bottom-end">
                      <template #trigger>
                        <button class="users-management-view__action-button">
                          <IconBase name="more-vertical" :size="18" />
                        </button>
                      </template>
                      <div class="users-management-view__dropdown-menu">
                        <button
                          class="users-management-view__dropdown-item"
                          @click="handleResetPassword(user)"
                        >
                          <IconBase name="key" :size="16" />
                          <span>Reset Password</span>
                        </button>
                        <button
                          v-if="user.status === 'active'"
                          class="users-management-view__dropdown-item users-management-view__dropdown-item--danger"
                          @click="handleDeactivateUser(user)"
                        >
                          <IconBase name="ban" :size="16" />
                          <span>Deactivate</span>
                        </button>
                        <button
                          v-else
                          class="users-management-view__dropdown-item"
                          @click="activateUser(user)"
                        >
                          <IconBase name="check" :size="16" />
                          <span>Activate</span>
                        </button>
                      </div>
                    </BaseDropdown>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr>
                  <td colspan="6" class="users-management-view__empty">
                    <IconBase name="users" :size="48" />
                    <p>No users found</p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="users-management-view__pagination">
          <BasePagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:current-page="currentPage = $event"
          />
        </div>
      </div>

      <!-- Roles & Permissions Tab Content -->
      <div v-if="activeTab === 'roles'" class="users-management-view__content">
        <!-- Default Roles -->
        <div class="users-management-view__section">
          <h2 class="users-management-view__section-title">Default Roles</h2>
          <div class="users-management-view__roles-grid">
            <div
              v-for="role in defaultRoles"
              :key="role.id"
              class="users-management-view__role-card"
            >
              <div class="users-management-view__role-header">
                <div>
                  <h3 class="users-management-view__role-name">{{ role.name }}</h3>
                  <p class="users-management-view__role-description">{{ role.description }}</p>
                </div>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="edit"
                  @click="handleEditRole(role)"
                >
                  Edit
                </BaseButton>
              </div>
              <div class="users-management-view__role-stats">
                <span class="users-management-view__role-count">{{ role.userCount }} users</span>
              </div>
              <div class="users-management-view__role-permissions">
                <span class="users-management-view__permission-label">Permissions:</span>
                <div class="users-management-view__permission-tags">
                  <span
                    v-for="perm in role.permissions.slice(0, 5)"
                    :key="perm"
                    class="users-management-view__permission-tag"
                  >
                    {{ perm.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </span>
                  <span
                    v-if="role.permissions.length > 5"
                    class="users-management-view__permission-tag"
                  >
                    +{{ role.permissions.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Custom Roles -->
        <div v-if="customRoles.length > 0" class="users-management-view__section">
          <h2 class="users-management-view__section-title">Custom Roles</h2>
          <div class="users-management-view__roles-grid">
            <div
              v-for="role in customRoles"
              :key="role.id"
              class="users-management-view__role-card"
            >
              <div class="users-management-view__role-header">
                <div>
                  <h3 class="users-management-view__role-name">{{ role.name }}</h3>
                  <p class="users-management-view__role-description">{{ role.description }}</p>
                </div>
                <BaseButton
                  variant="ghost"
                  size="sm"
                  icon="edit"
                  @click="handleEditRole(role)"
                >
                  Edit
                </BaseButton>
              </div>
              <div class="users-management-view__role-stats">
                <span class="users-management-view__role-count">{{ role.userCount }} users</span>
              </div>
              <div class="users-management-view__role-permissions">
                <span class="users-management-view__permission-label">Permissions:</span>
                <div class="users-management-view__permission-tags">
                  <span
                    v-for="perm in role.permissions.slice(0, 5)"
                    :key="perm"
                    class="users-management-view__permission-tag"
                  >
                    {{ perm.replace(/:/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }}
                  </span>
                  <span
                    v-if="role.permissions.length > 5"
                    class="users-management-view__permission-tag"
                  >
                    +{{ role.permissions.length - 5 }} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Invite User Modal -->
      <BaseModal
        v-model="isInviteModalOpen"
        title="Invite User"
        size="md"
      >
        <div class="users-management-view__modal-content">
          <BaseInput
            v-model="inviteForm.email"
            label="Email Address"
            type="email"
            placeholder="user@example.com"
            :error="inviteForm.errors.email"
            size="sm"
            required
          />
          <BaseSelect
            v-model="inviteForm.role"
            label="Role"
            size="sm"
            :options="[
              { label: 'Admin', value: USER_ROLES.TENANT_ADMIN },
              { label: 'Manager', value: USER_ROLES.MANAGER },
              { label: 'Staff', value: USER_ROLES.USER },
              { label: 'Viewer', value: USER_ROLES.VIEWER }
            ]"
            required
          />
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isInviteModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="sendInvite">
            Send Invitation
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Reset Password Modal -->
      <BaseModal
        v-model="isResetPasswordModalOpen"
        title="Reset Password"
        size="md"
      >
        <div class="users-management-view__modal-content">
          <p class="users-management-view__modal-text">
            Reset password for <strong>{{ selectedUser?.name }}</strong> ({{ selectedUser?.email }})
          </p>
          <div class="users-management-view__toggle-group">
            <label class="users-management-view__toggle-label">
              <input
                v-model="resetPasswordForm.sendEmail"
                type="checkbox"
                class="users-management-view__toggle-checkbox"
              />
              <span>Send password reset email</span>
            </label>
          </div>
          <BaseInput
            v-if="!resetPasswordForm.sendEmail"
            v-model="resetPasswordForm.temporaryPassword"
            label="Temporary Password"
            type="password"
            placeholder="Enter temporary password"
            :error="resetPasswordForm.errors.temporaryPassword"
            size="sm"
            required
          />
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isResetPasswordModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="resetPassword">
            Reset Password
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Deactivate User Modal -->
      <BaseModal
        v-model="isDeactivateModalOpen"
        title="Deactivate User"
        size="md"
      >
        <div class="users-management-view__modal-content">
          <p class="users-management-view__modal-text">
            Are you sure you want to deactivate <strong>{{ selectedUser?.name }}</strong>?
          </p>
          <p class="users-management-view__modal-warning">
            This user will no longer be able to access the platform until reactivated.
          </p>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isDeactivateModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton variant="error" @click="deactivateUser">
            Deactivate User
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Role Management Modal -->
      <BaseModal
        v-model="isRoleModalOpen"
        :title="selectedRole ? 'Edit Role' : 'Create Role'"
        size="lg"
      >
        <div class="users-management-view__modal-content">
          <BaseInput
            v-model="roleForm.name"
            label="Role Name"
            placeholder="e.g., Content Manager"
            :error="roleForm.errors.name"
            size="sm"
            required
          />
          <BaseInput
            v-model="roleForm.description"
            label="Description"
            placeholder="Describe the role's responsibilities..."
            size="sm"
          />
          <div class="users-management-view__permissions-section">
            <h3 class="users-management-view__permissions-title">Permissions</h3>
            <div
              v-for="group in permissionGroups"
              :key="group.group"
              class="users-management-view__permission-group"
            >
              <h4 class="users-management-view__permission-group-title">{{ group.group }}</h4>
              <div class="users-management-view__permission-grid">
                <label
                  v-for="perm in group.permissions"
                  :key="perm.key"
                  class="users-management-view__permission-item"
                >
                  <input
                    type="checkbox"
                    :checked="roleForm.permissions.includes(perm.key)"
                    @change="togglePermission(perm.key)"
                  />
                  <span>{{ perm.label }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isRoleModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveRole">
            {{ selectedRole ? 'Update Role' : 'Create Role' }}
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style scoped>
.users-management-view {
  padding: var(--spacing-xl);
}

.users-management-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.users-management-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.users-management-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.users-management-view__tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid rgb(var(--color-border));
}

.users-management-view__tab {
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

.users-management-view__tab:hover {
  color: rgb(var(--color-text-primary));
  background-color: rgb(var(--color-surface-hover));
}

.users-management-view__tab--active {
  color: rgb(var(--color-primary));
  border-bottom-color: rgb(var(--color-primary));
}

.users-management-view__content {
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-xl);
  border: 1px solid rgb(var(--color-border));
  padding: var(--spacing-xl);
}

.users-management-view__filters {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  align-items: start;
}

.users-management-view__search {
  max-width: 100%;
}

.users-management-view__filter-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.users-management-view__table-container {
  overflow-x: auto;
  margin-bottom: var(--spacing-xl);
}

.users-management-view__table {
  width: 100%;
  border-collapse: collapse;
}

.users-management-view__table thead {
  background-color: rgb(var(--color-surface-secondary));
}

.users-management-view__table th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgb(var(--color-border));
}

.users-management-view__table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.users-management-view__user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.users-management-view__avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
}

.users-management-view__user-name {
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin-bottom: var(--spacing-xs);
}

.users-management-view__user-email {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.users-management-view__badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.users-management-view__badge--primary {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  color: rgb(var(--color-primary));
}

.users-management-view__badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

.users-management-view__badge--warning {
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: rgb(var(--color-warning));
}

.users-management-view__badge--error {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: rgb(var(--color-error));
}

.users-management-view__badge--secondary {
  background-color: rgb(var(--color-surface-secondary));
  color: rgb(var(--color-text-secondary));
}

.users-management-view__date {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.users-management-view__action-button {
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

.users-management-view__action-button:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.users-management-view__dropdown-menu {
  display: flex;
  flex-direction: column;
  min-width: 180px;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xs);
}

.users-management-view__dropdown-item {
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

.users-management-view__dropdown-item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.users-management-view__dropdown-item--danger {
  color: rgb(var(--color-error));
}

.users-management-view__dropdown-item--danger:hover {
  background-color: rgba(var(--color-error-rgb), 0.1);
}

.users-management-view__empty {
  text-align: center;
  padding: var(--spacing-2xl) !important;
  color: rgb(var(--color-text-secondary));
}

.users-management-view__empty svg {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.users-management-view__pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.users-management-view__section {
  margin-bottom: var(--spacing-2xl);
}

.users-management-view__section:last-child {
  margin-bottom: 0;
}

.users-management-view__section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-lg) 0;
}

.users-management-view__roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.users-management-view__role-card {
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
}

.users-management-view__role-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.users-management-view__role-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.users-management-view__role-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.users-management-view__role-stats {
  margin-bottom: var(--spacing-md);
}

.users-management-view__role-count {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.users-management-view__role-permissions {
  margin-top: var(--spacing-md);
}

.users-management-view__permission-label {
  display: block;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--spacing-sm);
}

.users-management-view__permission-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.users-management-view__permission-tag {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-secondary));
}

.users-management-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.users-management-view__modal-text {
  margin: 0;
  color: rgb(var(--color-text-primary));
}

.users-management-view__modal-warning {
  margin: 0;
  padding: var(--spacing-md);
  background-color: rgba(var(--color-warning-rgb), 0.1);
  border: 1px solid rgba(var(--color-warning-rgb), 0.2);
  border-radius: var(--radius-md);
  color: rgb(var(--color-warning));
  font-size: var(--font-size-sm);
}

.users-management-view__toggle-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.users-management-view__toggle-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  color: rgb(var(--color-text-primary));
}

.users-management-view__toggle-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.users-management-view__permissions-section {
  margin-top: var(--spacing-lg);
}

.users-management-view__permissions-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-md) 0;
}

.users-management-view__permission-group {
  margin-bottom: var(--spacing-md);
}

.users-management-view__permission-group-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.users-management-view__permission-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.users-management-view__permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-sm);
}

.users-management-view__permission-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  cursor: pointer;
  color: rgb(var(--color-text-primary));
  font-size: var(--font-size-xs);
  transition: all var(--transition-fast) ease;
}

.users-management-view__permission-item:hover {
  background-color: rgb(var(--color-surface-hover));
  border-color: rgb(var(--color-primary));
}

.users-management-view__permission-item input[type="checkbox"] {
  width: 14px;
  height: 14px;
  cursor: pointer;
  flex-shrink: 0;
}

.users-management-view__permission-item span {
  font-size: var(--font-size-xs);
  line-height: 1.4;
}

@media (max-width: 768px) {
  .users-management-view {
    padding: var(--spacing-md);
  }

  .users-management-view__header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .users-management-view__filter-group {
    grid-template-columns: 1fr;
  }

  .users-management-view__permission-grid {
    grid-template-columns: 1fr;
  }

  .users-management-view__roles-grid {
    grid-template-columns: 1fr;
  }
}
</style>
