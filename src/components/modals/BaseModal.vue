<script setup>
/**
 * BaseModal - Reusable Modal Component
 * Dynamic, controlled by props and slots
 */

import { watch, onMounted, onBeforeUnmount } from 'vue'
import IconBase from '../base/IconBase.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full'].includes(value)
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showFooter: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'confirm'])

const closeModal = () => {
  if (!props.persistent) {
    emit('update:modelValue', false)
    emit('close')
  }
}

const confirmModal = () => {
  emit('confirm')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    closeModal()
  }
}

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closeOnEscape && !props.persistent) {
    closeModal()
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="modelValue"
        class="base-modal"
        @click="handleBackdropClick"
      >
        <div
          :class="['base-modal__content', `base-modal__content--${size}`]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || $slots.header || showClose" class="base-modal__header">
            <slot name="header">
              <h2 class="base-modal__title">{{ title }}</h2>
            </slot>
            
            <button
              v-if="showClose"
              class="base-modal__close"
              @click="closeModal"
            >
              <IconBase name="close" :size="20" />
            </button>
          </div>
          
          <!-- Body -->
          <div class="base-modal__body">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="showFooter && $slots.footer" class="base-modal__footer">
            <slot name="footer">
              <BaseButton variant="ghost" @click="closeModal">
                Cancel
              </BaseButton>
              <BaseButton @click="confirmModal">
                Confirm
              </BaseButton>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.base-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  overflow-y: auto;
}

.base-modal__content {
  position: relative;
  width: 100%;
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 4rem);
}

.base-modal__content--sm {
  max-width: 380px;
}

.base-modal__content--md {
  max-width: 480px;
}

.base-modal__content--lg {
  max-width: 600px;
}

.base-modal__content--xl {
  max-width: 800px;
}

.base-modal__content--full {
  max-width: 95vw;
  max-height: 95vh;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
}

.base-modal__title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.base-modal__close {
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

.base-modal__close:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.base-modal__body {
  flex: 1;
  padding: var(--spacing-md);
  overflow-y: auto;
}

.base-modal__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-top: 1px solid rgb(var(--color-border));
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .base-modal__content,
.modal-leave-active .base-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .base-modal__content,
.modal-leave-to .base-modal__content {
  transform: scale(0.9);
}

@media (max-width: 640px) {
  .base-modal {
    padding: 0;
  }
  
  .base-modal__content {
    max-height: 100vh;
    border-radius: 0;
  }
  
  .base-modal__content--sm,
  .base-modal__content--md,
  .base-modal__content--lg,
  .base-modal__content--xl {
    max-width: 100%;
  }
}
</style>

