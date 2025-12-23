<script setup>
/**
 * LineChart - Reusable Line Chart Component
 */

import BaseChart from './BaseChart.vue'
import { computed } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    required: true
    // Format: [{ name: 'Series 1', data: [30, 40, 35, 50, 49, 60, 70] }]
  },
  categories: {
    type: Array,
    default: () => []
  },
  height: {
    type: [String, Number],
    default: 350
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  smooth: {
    type: Boolean,
    default: true
  },
  showMarkers: {
    type: Boolean,
    default: true
  },
  showGrid: {
    type: Boolean,
    default: true
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: 'line',
    zoom: {
      enabled: true
    }
  },
  title: {
    text: props.title,
    align: 'left'
  },
  subtitle: {
    text: props.subtitle,
    align: 'left'
  },
  stroke: {
    curve: props.smooth ? 'smooth' : 'straight',
    width: 2
  },
  markers: {
    size: props.showMarkers ? 4 : 0,
    hover: {
      size: 6
    }
  },
  grid: {
    show: props.showGrid
  },
  xaxis: {
    categories: props.categories
  }
}))
</script>

<template>
  <BaseChart
    type="line"
    :series="series"
    :options="chartOptions"
    :height="height"
  />
</template>

