<script setup>
/**
 * BaseSnackbar - Toast Notification Component
 * Displays temporary messages
 */

import { ref, watch, onMounted } from 'vue'
import IconBase from './IconBase.vue'
import { useNotificationsStore } from '@/stores/notifications'

const notificationStore = useNotificationsStore()

const toasts = ref([])

// Watch for new toast notifications
watch(
  () => notificationStore.notifications,
  (notifications) => {
    // Filter only toast notifications
    const newToasts = notifications.filter(n => n.isToast && !toasts.value.find(t => t.id === n.id))
    
    newToasts.forEach(toast => {
      toasts.value.push(toast)
      
      // Auto-remove after duration
      if (toast.duration) {
        setTimeout(() => {
          removeToast(toast.id)
        }, toast.duration)
      }
    })
  },
  { deep: true }
)

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
    notificationStore.removeNotification(id)
  }
}

const getIconName = (type) => {
  const icons = {
    success: 'check-circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[type] || 'info'
}

const getTypeClass = (type) => {
  return `base-snackbar__toast--${type}`
}
</script>

<template>
  <div class="base-snackbar">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['base-snackbar__toast', getTypeClass(toast.type)]"
      >
        <IconBase
          :name="getIconName(toast.type)"
          :size="20"
          class="base-snackbar__icon"
        />
        
        <p class="base-snackbar__message">{{ toast.message }}</p>
        
        <button
          class="base-snackbar__close"
          @click="removeToast(toast.id)"
        >
          <IconBase name="close" :size="16" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.base-snackbar {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  z-index: var(--z-tooltip);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  max-width: 400px;
}

.base-snackbar__toast {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border-left: 4px solid;
  min-width: 300px;
}

.base-snackbar__toast--success {
  border-left-color: rgb(var(--color-success));
  background-color: rgb(var(--color-success-light));
}

.base-snackbar__toast--success .base-snackbar__icon {
  color: rgb(var(--color-success));
}

.base-snackbar__toast--error {
  border-left-color: rgb(var(--color-error));
  background-color: rgb(var(--color-error-light));
}

.base-snackbar__toast--error .base-snackbar__icon {
  color: rgb(var(--color-error));
}

.base-snackbar__toast--warning {
  border-left-color: rgb(var(--color-warning));
  background-color: rgb(var(--color-warning-light));
}

.base-snackbar__toast--warning .base-snackbar__icon {
  color: rgb(var(--color-warning));
}

.base-snackbar__toast--info {
  border-left-color: rgb(var(--color-info));
  background-color: rgb(var(--color-info-light));
}

.base-snackbar__toast--info .base-snackbar__icon {
  color: rgb(var(--color-info));
}

.base-snackbar__message {
  flex: 1;
  margin: 0;
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
  line-height: var(--line-height-normal);
}

.base-snackbar__close {
  background: none;
  border: none;
  padding: var(--spacing-xs);
  cursor: pointer;
  color: rgb(var(--color-text-secondary));
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast) ease;
}

.base-snackbar__close:hover {
  background-color: rgba(var(--color-border), 0.5);
  color: rgb(var(--color-text-primary));
}

/* Toast animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .base-snackbar {
    left: var(--spacing-sm);
    right: var(--spacing-sm);
    max-width: none;
  }
  
  .base-snackbar__toast {
    min-width: auto;
  }
}
</style>

