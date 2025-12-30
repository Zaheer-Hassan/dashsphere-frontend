<script setup>
/**
 * KPICard - Key Performance Indicator Card Component
 */

import { computed } from 'vue'
import IconBase from '../base/IconBase.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  trend: {
    type: Number,
    default: null
    // Positive number = up, negative = down, null = no trend
  },
  trendLabel: {
    type: String,
    default: 'vs last period'
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'error', 'info'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const trendDirection = computed(() => {
  if (props.trend === null || props.trend === 0) return 'neutral'
  return props.trend > 0 ? 'up' : 'down'
})

const trendColor = computed(() => {
  if (trendDirection.value === 'up') return 'rgb(var(--color-success))'
  if (trendDirection.value === 'down') return 'rgb(var(--color-error))'
  return 'rgb(var(--color-text-tertiary))'
})
</script>

<template>
  <div class="kpi-card">
    <div class="kpi-card__header">
      <div :class="['kpi-card__icon', `kpi-card__icon--${color}`]">
        <IconBase :name="icon" :size="24" />
      </div>
      
      <p class="kpi-card__title">{{ title }}</p>
    </div>
    
    <div class="kpi-card__body">
      <div v-if="loading" class="kpi-card__skeleton">
        <div class="kpi-card__skeleton-value" />
        <div class="kpi-card__skeleton-trend" />
      </div>
      
      <template v-else>
        <p class="kpi-card__value">{{ value }}</p>
        
        <div v-if="trend !== null" class="kpi-card__trend" :style="{ color: trendColor }">
          <IconBase
            :name="trendDirection === 'up' ? 'trending-up' : 'trending-down'"
            :size="16"
          />
          <span>{{ Math.abs(trend) }}%</span>
          <span class="kpi-card__trend-label">{{ trendLabel }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast) ease;
}

.kpi-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.kpi-card__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.kpi-card__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
}

.kpi-card__icon--primary {
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
}

.kpi-card__icon--secondary {
  background-color: rgb(var(--color-secondary) / 0.1);
  color: rgb(var(--color-secondary));
}

.kpi-card__icon--success {
  background-color: rgb(var(--color-success-light));
  color: rgb(var(--color-success));
}

.kpi-card__icon--warning {
  background-color: rgb(var(--color-warning-light));
  color: rgb(var(--color-warning));
}

.kpi-card__icon--error {
  background-color: rgb(var(--color-error-light));
  color: rgb(var(--color-error));
}

.kpi-card__icon--info {
  background-color: rgb(var(--color-info-light));
  color: rgb(var(--color-info));
}

.kpi-card__title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.kpi-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.kpi-card__value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.kpi-card__trend {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.kpi-card__trend-label {
  color: rgb(var(--color-text-tertiary));
  font-weight: var(--font-weight-normal);
}

.kpi-card__skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.kpi-card__skeleton-value,
.kpi-card__skeleton-trend {
  background: linear-gradient(
    90deg,
    rgb(var(--color-border)) 0%,
    rgb(var(--color-surface-hover)) 50%,
    rgb(var(--color-border)) 100%
  );
  background-size: 200% 100%;
  animation: skeleton 1.5s infinite;
  border-radius: var(--radius-sm);
}

.kpi-card__skeleton-value {
  width: 60%;
  height: 40px;
}

.kpi-card__skeleton-trend {
  width: 40%;
  height: 20px;
}

@keyframes skeleton {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

