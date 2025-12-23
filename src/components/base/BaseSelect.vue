<script setup>
/**
 * BaseSelect - Reusable Select Dropdown Component
 */

import { computed } from 'vue'
import IconBase from './IconBase.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, null],
    default: null
  },
  options: {
    type: Array,
    required: true,
    // Expected format: [{ label: 'Option 1', value: 1 }] or ['Option 1', 'Option 2']
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select an option'
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
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

const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return option
    }
    return { label: String(option), value: option }
  })
})

const selectClasses = computed(() => {
  const classes = ['base-select__field']
  classes.push(`base-select__field--${props.size}`)
  
  if (props.error) classes.push('base-select__field--error')
  if (props.disabled) classes.push('base-select__field--disabled')
  
  return classes
})

const handleChange = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<template>
  <div class="base-select">
    <label v-if="label" class="base-select__label">
      {{ label }}
      <span v-if="required" class="base-select__required">*</span>
    </label>
    
    <div class="base-select__wrapper">
      <select
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option
          v-for="(option, index) in normalizedOptions"
          :key="index"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <IconBase
        name="chevron-down"
        :size="size === 'sm' ? 16 : size === 'lg' ? 20 : 18"
        class="base-select__icon"
        color="rgb(var(--color-text-tertiary))"
      />
    </div>
    
    <p v-if="error" class="base-select__error">{{ error }}</p>
    <p v-else-if="hint" class="base-select__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.base-select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.base-select__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  display: flex;
  gap: var(--spacing-xs);
}

.base-select__required {
  color: rgb(var(--color-error));
}

.base-select__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-select__field {
  width: 100%;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-primary));
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast) ease;
  outline: none;
  appearance: none;
  padding-right: 2.5rem;
  cursor: pointer;
}

.base-select__field--sm {
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-sm);
}

.base-select__field--md {
  padding: 0.5rem 1rem;
}

.base-select__field--lg {
  padding: 0.625rem 1.25rem;
  font-size: var(--font-size-lg);
}

.base-select__field:hover:not(:disabled) {
  border-color: rgb(var(--color-border-hover));
}

.base-select__field:focus {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}

.base-select__field--error {
  border-color: rgb(var(--color-error));
}

.base-select__field--error:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-error), 0.1);
}

.base-select__field--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgb(var(--color-background-secondary));
}

.base-select__icon {
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
}

.base-select__error {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-error));
  margin: 0;
}

.base-select__hint {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}
</style>

