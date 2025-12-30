<script setup>
/**
 * BasePagination - Reusable Pagination Component
 */

import { computed } from 'vue'
import BaseButton from './BaseButton.vue'
import IconBase from './IconBase.vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxVisiblePages: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:currentPage', 'change'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const max = props.maxVisiblePages
  
  if (total <= max) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const half = Math.floor(max / 2)
  let start = current - half
  let end = current + half
  
  if (start < 1) {
    start = 1
    end = max
  }
  
  if (end > total) {
    end = total
    start = total - max + 1
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

const canGoPrevious = computed(() => props.currentPage > 1)
const canGoNext = computed(() => props.currentPage < props.totalPages)

const goToPage = (page) => {
  if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
    emit('update:currentPage', page)
    emit('change', page)
  }
}

const previousPage = () => {
  if (canGoPrevious.value) {
    goToPage(props.currentPage - 1)
  }
}

const nextPage = () => {
  if (canGoNext.value) {
    goToPage(props.currentPage + 1)
  }
}
</script>

<template>
  <div class="base-pagination">
    <BaseButton
      variant="ghost"
      size="sm"
      :disabled="!canGoPrevious"
      @click="previousPage"
    >
      <IconBase name="chevron-left" :size="18" />
    </BaseButton>
    
    <button
      v-if="pages[0] > 1"
      class="base-pagination__page"
      @click="goToPage(1)"
    >
      1
    </button>
    
    <span v-if="pages[0] > 2" class="base-pagination__ellipsis">...</span>
    
    <button
      v-for="page in pages"
      :key="page"
      :class="[
        'base-pagination__page',
        { 'base-pagination__page--active': page === currentPage }
      ]"
      @click="goToPage(page)"
    >
      {{ page }}
    </button>
    
    <span v-if="pages[pages.length - 1] < totalPages - 1" class="base-pagination__ellipsis">...</span>
    
    <button
      v-if="pages[pages.length - 1] < totalPages"
      class="base-pagination__page"
      @click="goToPage(totalPages)"
    >
      {{ totalPages }}
    </button>
    
    <BaseButton
      variant="ghost"
      size="sm"
      :disabled="!canGoNext"
      @click="nextPage"
    >
      <IconBase name="chevron-right" :size="18" />
    </BaseButton>
  </div>
</template>

<style scoped>
.base-pagination {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.base-pagination__page {
  min-width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  background-color: transparent;
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.base-pagination__page:hover {
  background-color: rgb(var(--color-surface-hover));
  border-color: rgb(var(--color-primary));
}

.base-pagination__page--active {
  background-color: rgb(var(--color-primary));
  color: white;
  border-color: rgb(var(--color-primary));
}

.base-pagination__page--active:hover {
  background-color: rgb(var(--color-primary-hover));
}

.base-pagination__ellipsis {
  padding: 0 var(--spacing-xs);
  color: rgb(var(--color-text-tertiary));
  font-size: var(--font-size-sm);
}
</style>

