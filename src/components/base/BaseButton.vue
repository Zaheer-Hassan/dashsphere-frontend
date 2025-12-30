<script setup>
/**
 * BaseButton - Reusable Button Component
 * Supports multiple variants, sizes, loading states
 */

import { computed } from 'vue'
import IconBase from './IconBase.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'ghost', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  iconRight: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

const buttonClasses = computed(() => {
  const classes = ['base-button']
  
  // Variant classes
  classes.push(`base-button--${props.variant}`)
  
  // Size classes
  classes.push(`base-button--${props.size}`)
  
  // State classes
  if (props.disabled || props.loading) classes.push('base-button--disabled')
  if (props.loading) classes.push('base-button--loading')
  if (props.fullWidth) classes.push('base-button--full-width')
  
  return classes
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="base-button__spinner">
      <IconBase name="refresh" :size="16" class="animate-spin" />
    </span>
    
    <IconBase
      v-if="icon && !loading"
      :name="icon"
      :size="size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 22 : 18"
      class="base-button__icon"
    />
    
    <span v-if="$slots.default" class="base-button__content">
      <slot />
    </span>
    
    <IconBase
      v-if="iconRight && !loading"
      :name="iconRight"
      :size="size === 'xs' ? 14 : size === 'sm' ? 16 : size === 'lg' ? 20 : size === 'xl' ? 22 : 18"
      class="base-button__icon-right"
    />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
  white-space: nowrap;
  user-select: none;
  position: relative;
}

/* Sizes */
.base-button--xs {
  padding: 0.25rem 0.75rem;
  font-size: var(--font-size-xs);
  line-height: 1.25rem;
}

.base-button--sm {
  padding: 0.375rem 1rem;
  font-size: var(--font-size-sm);
  line-height: 1.5rem;
}

.base-button--md {
  padding: 0.5rem 1.25rem;
  font-size: var(--font-size-base);
  line-height: 1.5rem;
}

.base-button--lg {
  padding: 0.625rem 1.5rem;
  font-size: var(--font-size-lg);
  line-height: 1.75rem;
}

.base-button--xl {
  padding: 0.75rem 2rem;
  font-size: var(--font-size-xl);
  line-height: 2rem;
}

/* Variants */
.base-button--primary {
  background-color: rgb(var(--color-primary));
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: rgb(var(--color-primary-hover));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--secondary {
  background-color: rgb(var(--color-secondary));
  color: white;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: rgb(var(--color-secondary-hover));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--success {
  background-color: rgb(var(--color-success));
  color: white;
}

.base-button--success:hover:not(.base-button--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--warning {
  background-color: rgb(var(--color-warning));
  color: white;
}

.base-button--warning:hover:not(.base-button--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--error {
  background-color: rgb(var(--color-error));
  color: white;
}

.base-button--error:hover:not(.base-button--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--ghost {
  background-color: transparent;
  color: rgb(var(--color-text-primary));
}

.base-button--ghost:hover:not(.base-button--disabled) {
  background-color: rgb(var(--color-surface-hover));
}

.base-button--outline {
  background-color: transparent;
  border-color: rgb(var(--color-border));
  color: rgb(var(--color-text-primary));
}

.base-button--outline:hover:not(.base-button--disabled) {
  border-color: rgb(var(--color-primary));
  color: rgb(var(--color-primary));
  background-color: rgb(var(--color-primary-light));
}

/* States */
.base-button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.base-button--loading {
  position: relative;
}

.base-button--full-width {
  width: 100%;
}

.base-button__spinner {
  display: flex;
  align-items: center;
}

.base-button__icon,
.base-button__icon-right {
  flex-shrink: 0;
}

.base-button:active:not(.base-button--disabled) {
  transform: translateY(0);
}

.base-button:focus-visible {
  outline: 2px solid rgb(var(--color-primary));
  outline-offset: 2px;
}
</style>

