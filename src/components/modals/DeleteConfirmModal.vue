<script setup>
/**
 * DeleteConfirmModal - Reusable Delete Confirmation Modal
 */

import BaseModal from './BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import IconBase from '../base/IconBase.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirm Deletion'
  },
  message: {
    type: String,
    default: 'Are you sure you want to delete this item? This action cannot be undone.'
  },
  itemName: {
    type: String,
    default: ''
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('update:modelValue', false)
  emit('cancel')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="sm"
    :persistent="loading"
    :show-footer="false"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="delete-confirm">
      <div class="delete-confirm__icon">
        <IconBase name="warning" :size="48" color="rgb(var(--color-error))" />
      </div>
      
      <div class="delete-confirm__content">
        <p class="delete-confirm__message">
          {{ message }}
        </p>
        
        <p v-if="itemName" class="delete-confirm__item">
          <strong>{{ itemName }}</strong>
        </p>
      </div>
      
      <div class="delete-confirm__actions">
        <BaseButton
          variant="ghost"
          full-width
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </BaseButton>
        
        <BaseButton
          variant="error"
          full-width
          :loading="loading"
          @click="handleConfirm"
        >
          {{ confirmText }}
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>

<style scoped>
.delete-confirm {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
  text-align: center;
  padding: var(--spacing-md) 0;
}

.delete-confirm__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgb(var(--color-error-light));
  border-radius: var(--radius-full);
}

.delete-confirm__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.delete-confirm__message {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  line-height: var(--line-height-normal);
  margin: 0;
}

.delete-confirm__item {
  font-size: var(--font-size-lg);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.delete-confirm__actions {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  margin-top: var(--spacing-md);
}
</style>

