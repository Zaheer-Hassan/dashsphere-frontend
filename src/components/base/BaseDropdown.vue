<script setup>
/**
 * BaseDropdown - Reusable Dropdown Menu Component
 */

import { ref, onMounted, onBeforeUnmount } from 'vue'
import IconBase from './IconBase.vue'

const props = defineProps({
  placement: {
    type: String,
    default: 'bottom-end',
    validator: (value) => ['bottom-start', 'bottom-end', 'top-start', 'top-end'].includes(value)
  },
  trigger: {
    type: String,
    default: 'click',
    validator: (value) => ['click', 'hover'].includes(value)
  }
})

const emit = defineEmits(['open', 'close'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  emit(isOpen.value ? 'open' : 'close')
}

const openDropdown = () => {
  isOpen.value = true
  emit('open')
}

const closeDropdown = () => {
  isOpen.value = false
  emit('close')
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div
    ref="dropdownRef"
    class="base-dropdown"
    @mouseenter="trigger === 'hover' ? openDropdown() : null"
    @mouseleave="trigger === 'hover' ? closeDropdown() : null"
  >
    <div
      class="base-dropdown__trigger"
      @click="trigger === 'click' ? toggleDropdown() : null"
    >
      <slot name="trigger">
        <button class="base-dropdown__button">
          <span>Menu</span>
          <IconBase name="chevron-down" :size="16" />
        </button>
      </slot>
    </div>
    
    <transition name="dropdown">
      <div
        v-show="isOpen"
        :class="['base-dropdown__menu', `base-dropdown__menu--${placement}`]"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<style scoped>
.base-dropdown {
  position: relative;
  display: inline-block;
}

.base-dropdown__trigger {
  cursor: pointer;
}

.base-dropdown__button {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0.5rem 1rem;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.base-dropdown__button:hover {
  border-color: rgb(var(--color-primary));
}

.base-dropdown__menu {
  position: absolute;
  z-index: var(--z-dropdown);
  min-width: 12rem;
  margin-top: var(--spacing-xs);
  padding: var(--spacing-xs);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.base-dropdown__menu--bottom-start {
  top: 100%;
  left: 0;
}

.base-dropdown__menu--bottom-end {
  top: 100%;
  right: 0;
}

.base-dropdown__menu--top-start {
  bottom: 100%;
  left: 0;
  margin-bottom: var(--spacing-xs);
  margin-top: 0;
}

.base-dropdown__menu--top-end {
  bottom: 100%;
  right: 0;
  margin-bottom: var(--spacing-xs);
  margin-top: 0;
}

/* Dropdown animations */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

