<script setup>
/**
 * BaseLoader - Reusable Loading Spinner
 */

import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary'
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  }
})

const loaderSize = computed(() => {
  const sizes = {
    sm: '1.5rem',
    md: '2.5rem',
    lg: '3.5rem',
    xl: '5rem'
  }
  return sizes[props.size]
})

const loaderColor = computed(() => {
  const colors = {
    primary: 'rgb(var(--color-primary))',
    secondary: 'rgb(var(--color-secondary))',
    success: 'rgb(var(--color-success))',
    warning: 'rgb(var(--color-warning))',
    error: 'rgb(var(--color-error))',
    white: 'white'
  }
  return colors[props.color] || colors.primary
})
</script>

<template>
  <div :class="['base-loader', { 'base-loader--fullscreen': fullScreen }]">
    <div class="base-loader__content">
      <div
        class="base-loader__spinner"
        :style="{
          width: loaderSize,
          height: loaderSize,
          borderTopColor: loaderColor,
          borderRightColor: loaderColor
        }"
      />
      <p v-if="text" class="base-loader__text">{{ text }}</p>
    </div>
  </div>
</template>

<style scoped>
.base-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-md);
}

.base-loader--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(var(--color-background), 0.8);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
}

.base-loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.base-loader__spinner {
  border: 3px solid rgba(var(--color-border), 0.3);
  border-top-color: rgb(var(--color-primary));
  border-right-color: rgb(var(--color-primary));
  border-radius: var(--radius-full);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.base-loader__text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}
</style>

