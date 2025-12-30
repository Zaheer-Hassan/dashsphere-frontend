<script setup>
/**
 * BaseSearch - Reusable Search Input Component
 */

import { ref } from 'vue'
import BaseInput from './BaseInput.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Search...'
  },
  debounce: {
    type: Number,
    default: 300
  },
  size: {
    type: String,
    default: 'md'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

let debounceTimeout = null

const handleInput = (value) => {
  emit('update:modelValue', value)
  
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  debounceTimeout = setTimeout(() => {
    emit('search', value)
  }, props.debounce)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('search', '')
}
</script>

<template>
  <BaseInput
    :model-value="modelValue"
    :placeholder="placeholder"
    :size="size"
    type="text"
    icon="search"
    :icon-right="modelValue ? 'close' : null"
    @update:model-value="handleInput"
  />
</template>

