<script setup>
/**
 * NotificationsView - All Notifications Panel
 * Complete notification management interface
 */

import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseSearch from '@/components/base/BaseSearch.vue'
import IconBase from '@/components/base/IconBase.vue'
import { useNotificationsStore } from '@/stores/notifications'
import { useNotifications } from '@/composables/useNotifications'
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITY, NOTIFICATION_CATEGORIES } from '@/constants'

const notificationStore = useNotificationsStore()
const { markAsRead, markAllAsRead, removeNotification, clearRead } = useNotifications()

// Filters
const selectedFilter = ref('all')
const searchQuery = ref('')
const selectedCategory = ref('all')

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Read', value: 'read' }
]

const categoryOptions = [
  { label: 'All Categories', value: 'all' },
  { label: 'System', value: NOTIFICATION_CATEGORIES.SYSTEM },
  { label: 'User', value: NOTIFICATION_CATEGORIES.USER },
  { label: 'Billing', value: NOTIFICATION_CATEGORIES.BILLING },
  { label: 'Security', value: NOTIFICATION_CATEGORIES.SECURITY },
  { label: 'Integration', value: NOTIFICATION_CATEGORIES.INTEGRATION },
  { label: 'Analytics', value: NOTIFICATION_CATEGORIES.ANALYTICS }
]

// Filtered notifications
const filteredNotifications = computed(() => {
  let notifications = [...notificationStore.notifications]
  
  // Filter by read status
  if (selectedFilter.value === 'unread') {
    notifications = notifications.filter(n => !n.read)
  } else if (selectedFilter.value === 'read') {
    notifications = notifications.filter(n => n.read)
  }
  
  // Filter by category
  if (selectedCategory.value !== 'all') {
    notifications = notifications.filter(n => n.category === selectedCategory.value)
  }
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    notifications = notifications.filter(n => 
      n.message.toLowerCase().includes(query)
    )
  }
  
  return notifications
})

// Group notifications by date
const groupedNotifications = computed(() => {
  const groups = {}
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  filteredNotifications.value.forEach(notification => {
    const date = new Date(notification.timestamp)
    date.setHours(0, 0, 0, 0)
    
    let groupKey
    const diffTime = today - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      groupKey = 'Today'
    } else if (diffDays === 1) {
      groupKey = 'Yesterday'
    } else if (diffDays < 7) {
      groupKey = date.toLocaleDateString('en-US', { weekday: 'long' })
    } else if (diffDays < 30) {
      groupKey = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    } else {
      groupKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(notification)
  })
  
  return groups
})

// Format time
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  })
}

// Get notification icon
const getNotificationIcon = (type) => {
  const icons = {
    success: 'check-circle',
    error: 'error',
    warning: 'warning',
    info: 'info',
    system: 'bell'
  }
  return icons[type] || 'info'
}

// Get notification color
const getNotificationColor = (type) => {
  const colors = {
    success: 'rgb(var(--color-success))',
    error: 'rgb(var(--color-error))',
    warning: 'rgb(var(--color-warning))',
    info: 'rgb(var(--color-info))',
    system: 'rgb(var(--color-primary))'
  }
  return colors[type] || 'rgb(var(--color-text-secondary))'
}

// Get priority badge color
const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'rgb(var(--color-error))',
    high: 'rgb(var(--color-warning))',
    medium: 'rgb(var(--color-info))',
    low: 'rgb(var(--color-text-tertiary))'
  }
  return colors[priority] || 'rgb(var(--color-text-tertiary))'
}

// Handle notification click
const handleNotificationClick = (notification) => {
  if (!notification.read) {
    markAsRead(notification.id)
  }
}

// Initialize with sample notifications
onMounted(() => {
  if (notificationStore.notifications.length === 0) {
    // Add sample notifications
    const sampleNotifications = [
      {
        message: 'New user registered in your organization',
        type: NOTIFICATION_TYPES.SUCCESS,
        category: NOTIFICATION_CATEGORIES.USER,
        priority: NOTIFICATION_PRIORITY.MEDIUM,
        timestamp: new Date(Date.now() - 5 * 60000).toISOString()
      },
      {
        message: 'Monthly report is ready for review',
        type: NOTIFICATION_TYPES.INFO,
        category: NOTIFICATION_CATEGORIES.ANALYTICS,
        priority: NOTIFICATION_PRIORITY.HIGH,
        timestamp: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        message: 'Payment received for subscription',
        type: NOTIFICATION_TYPES.SUCCESS,
        category: NOTIFICATION_CATEGORIES.BILLING,
        priority: NOTIFICATION_PRIORITY.MEDIUM,
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
      },
      {
        message: 'System maintenance scheduled for tonight',
        type: NOTIFICATION_TYPES.WARNING,
        category: NOTIFICATION_CATEGORIES.SYSTEM,
        priority: NOTIFICATION_PRIORITY.HIGH,
        timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
      },
      {
        message: 'New integration connected successfully',
        type: NOTIFICATION_TYPES.SUCCESS,
        category: NOTIFICATION_CATEGORIES.INTEGRATION,
        priority: NOTIFICATION_PRIORITY.MEDIUM,
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString()
      },
      {
        message: 'Suspicious login attempt detected',
        type: NOTIFICATION_TYPES.ERROR,
        category: NOTIFICATION_CATEGORIES.SECURITY,
        priority: NOTIFICATION_PRIORITY.URGENT,
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString()
      }
    ]
    
    sampleNotifications.forEach(notif => {
      notificationStore.addNotification(notif)
    })
  }
})
</script>

<template>
  <AppLayout>
    <div class="notifications-view">
      <!-- Header -->
      <div class="notifications-view__header">
        <div>
          <h1 class="notifications-view__title">Notifications</h1>
          <p class="notifications-view__subtitle">
            Manage and view all your notifications
          </p>
        </div>
        
        <div class="notifications-view__header-actions">
          <BaseButton
            v-if="notificationStore.unreadCount > 0"
            variant="outline"
            icon="check"
            @click="markAllAsRead"
          >
            Mark All Read
          </BaseButton>
          
          <BaseButton
            variant="outline"
            icon="delete"
            @click="clearRead"
          >
            Clear Read
          </BaseButton>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="notifications-view__filters">
        <BaseSearch
          v-model="searchQuery"
          placeholder="Search notifications..."
          style="flex: 1; max-width: 400px;"
        />
        
        <BaseSelect
          v-model="selectedFilter"
          :options="filterOptions"
          style="width: 150px;"
        />
        
        <BaseSelect
          v-model="selectedCategory"
          :options="categoryOptions"
          style="width: 200px;"
        />
      </div>
      
      <!-- Notifications List -->
      <div class="notifications-view__content">
        <div v-if="filteredNotifications.length === 0" class="notifications-view__empty">
          <IconBase name="bell" :size="64" color="rgb(var(--color-text-tertiary))" />
          <h3>No notifications found</h3>
          <p>Try adjusting your filters or check back later</p>
        </div>
        
        <div v-else class="notifications-view__groups">
          <div
            v-for="(notifications, groupKey) in groupedNotifications"
            :key="groupKey"
            class="notifications-view__group"
          >
            <h3 class="notifications-view__group-title">{{ groupKey }}</h3>
            
            <div class="notifications-view__list">
              <button
                v-for="notification in notifications"
                :key="notification.id"
                :class="[
                  'notifications-view__item',
                  { 'notifications-view__item--unread': !notification.read }
                ]"
                @click="handleNotificationClick(notification)"
              >
                <div class="notifications-view__item-icon">
                  <IconBase
                    :name="getNotificationIcon(notification.type)"
                    :size="24"
                    :color="getNotificationColor(notification.type)"
                  />
                </div>
                
                <div class="notifications-view__item-content">
                  <div class="notifications-view__item-header">
                    <p class="notifications-view__item-message">
                      {{ notification.message }}
                    </p>
                    
                    <div class="notifications-view__item-badges">
                      <span
                        v-if="notification.priority === NOTIFICATION_PRIORITY.URGENT"
                        class="notifications-view__badge notifications-view__badge--priority"
                        :style="{ backgroundColor: getPriorityColor(notification.priority) }"
                      >
                        Urgent
                      </span>
                      
                      <span
                        v-if="notification.category"
                        class="notifications-view__badge"
                      >
                        {{ notification.category }}
                      </span>
                    </div>
                  </div>
                  
                  <div class="notifications-view__item-footer">
                    <span class="notifications-view__item-time">
                      {{ formatTime(notification.timestamp) }}
                    </span>
                  </div>
                </div>
                
                <div class="notifications-view__item-actions">
                  <button
                    v-if="!notification.read"
                    class="notifications-view__action"
                    @click.stop="markAsRead(notification.id)"
                    title="Mark as read"
                  >
                    <IconBase name="check" :size="16" />
                  </button>
                  
                  <button
                    class="notifications-view__action"
                    @click.stop="removeNotification(notification.id)"
                    title="Delete"
                  >
                    <IconBase name="delete" :size="16" />
                  </button>
                </div>
                
                <div
                  v-if="!notification.read"
                  class="notifications-view__item-dot"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.notifications-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Header */
.notifications-view__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.notifications-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.notifications-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: var(--spacing-xs) 0 0 0;
}

.notifications-view__header-actions {
  display: flex;
  gap: var(--spacing-md);
}

/* Filters */
.notifications-view__filters {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

/* Content */
.notifications-view__content {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  min-height: 400px;
}

.notifications-view__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
  color: rgb(var(--color-text-secondary));
}

.notifications-view__empty h3 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: var(--spacing-md) 0 var(--spacing-xs) 0;
}

.notifications-view__empty p {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Groups */
.notifications-view__groups {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.notifications-view__group-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-lg) 0;
  padding-bottom: var(--spacing-sm);
  border-bottom: 2px solid rgb(var(--color-border));
}

.notifications-view__list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* Notification Item */
.notifications-view__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: none;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  position: relative;
  width: 100%;
}

.notifications-view__item:hover {
  background-color: rgb(var(--color-surface-hover));
  border-color: rgb(var(--color-primary));
  transform: translateX(4px);
}

.notifications-view__item--unread {
  background-color: rgb(var(--color-primary-light));
  border-color: rgb(var(--color-primary));
}

.notifications-view__item-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-background-secondary));
  border-radius: var(--radius-full);
}

.notifications-view__item-content {
  flex: 1;
  min-width: 0;
}

.notifications-view__item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.notifications-view__item-message {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin: 0;
  line-height: var(--line-height-normal);
  flex: 1;
}

.notifications-view__item-badges {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.notifications-view__badge {
  padding: 0.125rem 0.5rem;
  background-color: rgb(var(--color-background-secondary));
  color: rgb(var(--color-text-secondary));
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-sm);
  text-transform: capitalize;
}

.notifications-view__badge--priority {
  color: white;
}

.notifications-view__item-footer {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.notifications-view__item-time {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-tertiary));
}

.notifications-view__item-actions {
  display: flex;
  gap: var(--spacing-xs);
  flex-shrink: 0;
}

.notifications-view__action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  background: none;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.notifications-view__action:hover {
  background-color: rgb(var(--color-surface-hover));
  border-color: rgb(var(--color-primary));
  color: rgb(var(--color-primary));
}

.notifications-view__item-dot {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 10px;
  height: 10px;
  background-color: rgb(var(--color-primary));
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .notifications-view__header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .notifications-view__header-actions {
    width: 100%;
  }
  
  .notifications-view__filters {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .notifications-view__title {
    font-size: var(--font-size-2xl);
  }
  
  .notifications-view__item-header {
    flex-direction: column;
  }
  
  .notifications-view__item-actions {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
  }
}
</style>

