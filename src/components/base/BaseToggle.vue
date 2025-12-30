<script setup>
/**
 * BaseToggle - Reusable Toggle/Switch Component
 */

import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const toggleClasses = computed(() => {
  const classes = ['base-toggle__switch']
  classes.push(`base-toggle__switch--${props.size}`)
  
  if (props.modelValue) classes.push('base-toggle__switch--active')
  if (props.disabled) classes.push('base-toggle__switch--disabled')
  
  return classes
})

const handleClick = () => {
  if (!props.disabled) {
    const newValue = !props.modelValue
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
}
</script>

<template>
  <div class="base-toggle" @click="handleClick">
    <div :class="toggleClasses">
      <div class="base-toggle__thumb" />
    </div>
    
    <span v-if="label" class="base-toggle__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.base-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  user-select: none;
}

.base-toggle__switch {
  position: relative;
  border-radius: var(--radius-full);
  background-color: rgb(var(--color-border));
  transition: all var(--transition-base) ease;
  flex-shrink: 0;
}

.base-toggle__switch--sm {
  width: 2.25rem;
  height: 1.25rem;
}

.base-toggle__switch--md {
  width: 2.75rem;
  height: 1.5rem;
}

.base-toggle__switch--lg {
  width: 3.5rem;
  height: 2rem;
}

.base-toggle__switch--active {
  background-color: rgb(var(--color-primary));
}

.base-toggle__switch--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  background-color: white;
  border-radius: var(--radius-full);
  transition: all var(--transition-base) ease;
  box-shadow: var(--shadow-sm);
}

.base-toggle__switch--sm .base-toggle__thumb {
  width: 1rem;
  height: 1rem;
}

.base-toggle__switch--md .base-toggle__thumb {
  width: 1.25rem;
  height: 1.25rem;
}

.base-toggle__switch--lg .base-toggle__thumb {
  width: 1.75rem;
  height: 1.75rem;
}

.base-toggle__switch--sm.base-toggle__switch--active .base-toggle__thumb {
  transform: translateX(1rem);
}

.base-toggle__switch--md.base-toggle__switch--active .base-toggle__thumb {
  transform: translateX(1.25rem);
}

.base-toggle__switch--lg.base-toggle__switch--active .base-toggle__thumb {
  transform: translateX(1.5rem);
}

.base-toggle__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
}

.base-toggle:hover .base-toggle__switch:not(.base-toggle__switch--disabled) {
  opacity: 0.9;
}
</style>

