<script setup>
/**
 * BaseChart - Reusable Chart Component
 * Wrapper for ApexCharts with theme support
 */

import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import { useThemeStore } from '@/stores/theme'

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['line', 'area', 'bar', 'pie', 'donut', 'radialBar', 'scatter', 'bubble', 'heatmap'].includes(value)
  },
  series: {
    type: Array,
    required: true
  },
  options: {
    type: Object,
    default: () => ({})
  },
  height: {
    type: [String, Number],
    default: 350
  },
  width: {
    type: [String, Number],
    default: '100%'
  }
})

const themeStore = useThemeStore()
const chartRef = ref(null)

// Get theme colors based on current theme
const getThemeColors = () => {
  const isDark = themeStore.isDark()
  
  return {
    background: isDark ? 'transparent' : 'transparent',
    foreColor: isDark ? '#e5e7eb' : '#374151',
    gridColor: isDark ? '#374151' : '#e5e7eb',
    borderColor: isDark ? '#4b5563' : '#d1d5db'
  }
}

// Merge user options with theme-aware defaults
const chartOptions = computed(() => {
  const themeColors = getThemeColors()
  
  const defaultOptions = {
    chart: {
      background: themeColors.background,
      foreColor: themeColors.foreColor,
      fontFamily: 'var(--font-family-base)',
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800
      }
    },
    theme: {
      mode: themeStore.isDark() ? 'dark' : 'light'
    },
    colors: [
      'rgb(59, 130, 246)',   // primary
      'rgb(139, 92, 246)',   // secondary
      'rgb(34, 197, 94)',    // success
      'rgb(251, 146, 60)',   // warning
      'rgb(239, 68, 68)',    // error
      'rgb(14, 165, 233)',   // info
      'rgb(168, 85, 247)',   // purple
      'rgb(236, 72, 153)'    // pink
    ],
    grid: {
      borderColor: themeColors.gridColor,
      strokeDashArray: 4,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 10
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    xaxis: {
      labels: {
        style: {
          colors: themeColors.foreColor
        }
      },
      axisBorder: {
        color: themeColors.borderColor
      },
      axisTicks: {
        color: themeColors.borderColor
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: themeColors.foreColor
        }
      }
    },
    legend: {
      labels: {
        colors: themeColors.foreColor
      }
    },
    tooltip: {
      theme: themeStore.isDark() ? 'dark' : 'light'
    }
  }
  
  // Deep merge user options with defaults
  return mergeDeep(defaultOptions, props.options)
})

// Deep merge utility
const mergeDeep = (target, source) => {
  const output = { ...target }
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = mergeDeep(target[key], source[key])
        }
      } else {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }
  
  return output
}

const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

// Update chart when theme changes
watch(() => themeStore.theme, () => {
  // Force chart re-render by updating options
  if (chartRef.value) {
    chartRef.value.updateOptions(chartOptions.value)
  }
})
</script>

<template>
  <div class="base-chart">
    <VueApexCharts
      ref="chartRef"
      :type="type"
      :series="series"
      :options="chartOptions"
      :height="height"
      :width="width"
    />
  </div>
</template>

<style scoped>
.base-chart {
  width: 100%;
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
}
</style>

