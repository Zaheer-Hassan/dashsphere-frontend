<script setup>
/**
 * NotificationDropdown - Latest Notifications Dropdown
 * Shows recent notifications when bell icon is clicked
 */

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotificationsStore } from '@/stores/notifications'
import IconBase from '../base/IconBase.vue'
import BaseButton from '../base/BaseButton.vue'

const router = useRouter()
const notificationStore = useNotificationsStore()

// Get latest notifications (most recent 5)
const latestNotifications = computed(() => {
  return notificationStore.notifications.slice(0, 5)
})

// Format time ago
const timeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  return time.toLocaleDateString()
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

// Handle notification click
const handleNotificationClick = (notification) => {
  notificationStore.markAsRead(notification.id)
  // Navigate to notification detail or related page if needed
  if (notification.link) {
    router.push(notification.link)
  }
}

// Mark all as read
const markAllAsRead = () => {
  notificationStore.markAllAsRead()
}

// View all notifications
const viewAll = () => {
  router.push('/notifications')
}

// Initialize with sample notifications if empty
onMounted(() => {
  if (notificationStore.notifications.length === 0) {
    // Add some sample notifications for demo
    notificationStore.addNotification({
      message: 'New user registered in your organization',
      type: 'success',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString()
    })
    
    notificationStore.addNotification({
      message: 'Monthly report is ready for review',
      type: 'info',
      priority: 'high',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString()
    })
    
    notificationStore.addNotification({
      message: 'Payment received for subscription',
      type: 'success',
      priority: 'medium',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString()
    })
    
    notificationStore.addNotification({
      message: 'System maintenance scheduled for tonight',
      type: 'warning',
      priority: 'high',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
    })
  }
})
</script>

<template>
  <div class="notification-dropdown">
    <!-- Header -->
    <div class="notification-dropdown__header">
      <div class="notification-dropdown__header-content">
        <h3 class="notification-dropdown__title">Notifications</h3>
        <span v-if="notificationStore.unreadCount > 0" class="notification-dropdown__count">
          {{ notificationStore.unreadCount }} new
        </span>
      </div>
      
      <BaseButton
        v-if="notificationStore.unreadCount > 0"
        variant="ghost"
        size="sm"
        @click="markAllAsRead"
      >
        Mark all read
      </BaseButton>
    </div>
    
    <!-- Notifications List -->
    <div class="notification-dropdown__list">
      <div
        v-if="latestNotifications.length === 0"
        class="notification-dropdown__empty"
      >
        <IconBase name="bell" :size="48" color="rgb(var(--color-text-tertiary))" />
        <p>No notifications</p>
        <p class="notification-dropdown__empty-subtitle">
          You're all caught up!
        </p>
      </div>
      
      <button
        v-for="notification in latestNotifications"
        :key="notification.id"
        :class="[
          'notification-dropdown__item',
          { 'notification-dropdown__item--unread': !notification.read }
        ]"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-dropdown__item-icon">
          <IconBase
            :name="getNotificationIcon(notification.type)"
            :size="20"
            :color="getNotificationColor(notification.type)"
          />
        </div>
        
        <div class="notification-dropdown__item-content">
          <p class="notification-dropdown__item-message">
            {{ notification.message }}
          </p>
          <p class="notification-dropdown__item-time">
            {{ timeAgo(notification.timestamp) }}
          </p>
        </div>
        
        <div
          v-if="!notification.read"
          class="notification-dropdown__item-dot"
        />
      </button>
    </div>
    
    <!-- Footer -->
    <div class="notification-dropdown__footer">
      <BaseButton
        variant="outline"
        full-width
        @click="viewAll"
      >
        View All Notifications
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.notification-dropdown {
  width: 380px;
  max-height: 500px;
  display: flex;
  flex-direction: column;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.notification-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
  background-color: rgb(var(--color-background-secondary));
}

.notification-dropdown__header-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.notification-dropdown__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.notification-dropdown__count {
  padding: 0.125rem 0.5rem;
  background-color: rgb(var(--color-primary));
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
}

.notification-dropdown__list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.notification-dropdown__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  text-align: center;
  color: rgb(var(--color-text-secondary));
}

.notification-dropdown__empty p {
  margin: var(--spacing-md) 0 0 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.notification-dropdown__empty-subtitle {
  font-size: var(--font-size-sm) !important;
  color: rgb(var(--color-text-tertiary)) !important;
  font-weight: var(--font-weight-normal) !important;
}

.notification-dropdown__item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 1px solid rgb(var(--color-border));
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  position: relative;
  width: 100%;
}

.notification-dropdown__item:hover {
  background-color: rgb(var(--color-surface-hover));
}

.notification-dropdown__item--unread {
  background-color: rgb(var(--color-primary-light));
}

.notification-dropdown__item-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-background-secondary));
  border-radius: var(--radius-full);
}

.notification-dropdown__item-content {
  flex: 1;
  min-width: 0;
}

.notification-dropdown__item-message {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
  line-height: var(--line-height-normal);
}

.notification-dropdown__item-time {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-tertiary));
  margin: 0;
}

.notification-dropdown__item-dot {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 8px;
  height: 8px;
  background-color: rgb(var(--color-primary));
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.notification-dropdown__footer {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid rgb(var(--color-border));
  background-color: rgb(var(--color-background-secondary));
}

@media (max-width: 640px) {
  .notification-dropdown {
    width: 320px;
  }
}
</style>

