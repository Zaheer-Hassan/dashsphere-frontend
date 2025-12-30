/**
 * useNotifications Composable
 * Provides notification system functionality
 */

import { computed } from 'vue'
import { useNotificationsStore } from '@/stores/notifications'

export function useNotifications() {
  const notificationStore = useNotificationsStore()
  
  // Computed properties
  const notifications = computed(() => notificationStore.notifications)
  const unreadCount = computed(() => notificationStore.unreadCount)
  const unreadNotifications = computed(() => notificationStore.unreadNotifications)
  const urgentNotifications = computed(() => notificationStore.urgentNotifications)
  
  // Methods
  const markAsRead = (id) => {
    notificationStore.markAsRead(id)
  }
  
  const markAllAsRead = () => {
    notificationStore.markAllAsRead()
  }
  
  const removeNotification = (id) => {
    notificationStore.removeNotification(id)
  }
  
  const clearAll = () => {
    notificationStore.clearAll()
  }
  
  // Toast methods
  const showSuccess = (message, duration) => {
    notificationStore.showSuccess(message, duration)
  }
  
  const showError = (message, duration) => {
    notificationStore.showError(message, duration)
  }
  
  const showWarning = (message, duration) => {
    notificationStore.showWarning(message, duration)
  }
  
  const showInfo = (message, duration) => {
    notificationStore.showInfo(message, duration)
  }
  
  return {
    // State
    notifications,
    unreadCount,
    unreadNotifications,
    urgentNotifications,
    
    // Actions
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    
    // Toast methods
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

