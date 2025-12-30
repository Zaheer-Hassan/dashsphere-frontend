<script setup>
/**
 * BaseInput - Reusable Input Component
 * Supports validation, icons, various types
 */

import { computed } from 'vue'
import IconBase from './IconBase.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
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
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
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
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'blur', 'focus', 'enter'])

const inputClasses = computed(() => {
  const classes = ['base-input__field']
  classes.push(`base-input__field--${props.size}`)
  
  if (props.error) classes.push('base-input__field--error')
  if (props.icon) classes.push('base-input__field--with-icon')
  if (props.iconRight) classes.push('base-input__field--with-icon-right')
  if (props.disabled) classes.push('base-input__field--disabled')
  
  return classes
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleKeydown = (event) => {
  if (event.key === 'Enter') {
    emit('enter', event.target.value)
  }
}
</script>

<template>
  <div class="base-input">
    <label v-if="label" class="base-input__label">
      {{ label }}
      <span v-if="required" class="base-input__required">*</span>
    </label>
    
    <div class="base-input__wrapper">
      <IconBase
        v-if="icon"
        :name="icon"
        :size="size === 'sm' ? 16 : size === 'lg' ? 20 : 18"
        class="base-input__icon"
        color="rgb(var(--color-text-tertiary))"
      />
      
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
        @keydown="handleKeydown"
      />
      
      <IconBase
        v-if="iconRight"
        :name="iconRight"
        :size="size === 'sm' ? 16 : size === 'lg' ? 20 : 18"
        class="base-input__icon-right"
        color="rgb(var(--color-text-tertiary))"
      />
    </div>
    
    <p v-if="error" class="base-input__error">{{ error }}</p>
    <p v-else-if="hint" class="base-input__hint">{{ hint }}</p>
  </div>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  width: 100%;
}

.base-input__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  display: flex;
  gap: var(--spacing-xs);
}

.base-input__required {
  color: rgb(var(--color-error));
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__field {
  width: 100%;
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-primary));
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast) ease;
  outline: none;
}

.base-input__field--sm {
  padding: 0.375rem 0.75rem;
  font-size: var(--font-size-sm);
}

.base-input__field--md {
  padding: 0.5rem 1rem;
}

.base-input__field--lg {
  padding: 0.625rem 1.25rem;
  font-size: var(--font-size-lg);
}

.base-input__field--with-icon {
  padding-left: 2.5rem;
}

.base-input__field--with-icon-right {
  padding-right: 2.5rem;
}

.base-input__field:hover:not(:disabled) {
  border-color: rgb(var(--color-border-hover));
}

.base-input__field:focus {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.1);
}

.base-input__field--error {
  border-color: rgb(var(--color-error));
}

.base-input__field--error:focus {
  box-shadow: 0 0 0 3px rgba(var(--color-error), 0.1);
}

.base-input__field--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: rgb(var(--color-background-secondary));
}

.base-input__field::placeholder {
  color: rgb(var(--color-text-tertiary));
}

.base-input__icon {
  position: absolute;
  left: 0.75rem;
  pointer-events: none;
}

.base-input__icon-right {
  position: absolute;
  right: 0.75rem;
  pointer-events: none;
}

.base-input__error {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-error));
  margin: 0;
}

.base-input__hint {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}
</style>

