/**
 * Notifications Store - Tenant-Aware Notification System
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NOTIFICATION_TYPES, NOTIFICATION_PRIORITY } from '@/constants'

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref([])
  const unreadCount = ref(0)
  const loading = ref(false)
  
  // Getters
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.read)
  })
  
  const readNotifications = computed(() => {
    return notifications.value.filter(n => n.read)
  })
  
  const notificationsByType = (type) => {
    return notifications.value.filter(n => n.type === type)
  }
  
  const notificationsByPriority = (priority) => {
    return notifications.value.filter(n => n.priority === priority)
  }
  
  const urgentNotifications = computed(() => {
    return notifications.value.filter(n => 
      n.priority === NOTIFICATION_PRIORITY.URGENT && !n.read
    )
  })
  
  // Actions
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      type: NOTIFICATION_TYPES.INFO,
      priority: NOTIFICATION_PRIORITY.MEDIUM,
      ...notification
    }
    
    notifications.value.unshift(newNotification)
    if (!newNotification.read) {
      unreadCount.value++
    }
    
    return newNotification
  }
  
  const setNotifications = (notificationList) => {
    notifications.value = notificationList
    unreadCount.value = notificationList.filter(n => !n.read).length
  }
  
  const markAsRead = (notificationId) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      unreadCount.value--
    }
  }
  
  const markAllAsRead = () => {
    notifications.value.forEach(n => {
      n.read = true
    })
    unreadCount.value = 0
  }
  
  const removeNotification = (notificationId) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = notifications.value[index]
      if (!notification.read) {
        unreadCount.value--
      }
      notifications.value.splice(index, 1)
    }
  }
  
  const clearAll = () => {
    notifications.value = []
    unreadCount.value = 0
  }
  
  const clearRead = () => {
    notifications.value = notifications.value.filter(n => !n.read)
  }
  
  // Toast notification helper (in-app snackbar)
  const showToast = (message, type = NOTIFICATION_TYPES.INFO, duration = 3000) => {
    const toast = {
      message,
      type,
      duration,
      isToast: true
    }
    
    return addNotification(toast)
  }
  
  const showSuccess = (message, duration) => {
    return showToast(message, NOTIFICATION_TYPES.SUCCESS, duration)
  }
  
  const showError = (message, duration) => {
    return showToast(message, NOTIFICATION_TYPES.ERROR, duration)
  }
  
  const showWarning = (message, duration) => {
    return showToast(message, NOTIFICATION_TYPES.WARNING, duration)
  }
  
  const showInfo = (message, duration) => {
    return showToast(message, NOTIFICATION_TYPES.INFO, duration)
  }
  
  return {
    // State
    notifications,
    unreadCount,
    loading,
    
    // Getters
    unreadNotifications,
    readNotifications,
    urgentNotifications,
    notificationsByType,
    notificationsByPriority,
    
    // Actions
    addNotification,
    setNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    clearRead,
    
    // Toast helpers
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
})

