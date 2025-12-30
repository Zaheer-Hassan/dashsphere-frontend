<script setup>
/**
 * AreaChart - Reusable Area Chart Component
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
  stacked: {
    type: Boolean,
    default: false
  },
  smooth: {
    type: Boolean,
    default: true
  },
  fillOpacity: {
    type: Number,
    default: 0.4
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    stacked: props.stacked,
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
  fill: {
    type: 'gradient',
    opacity: props.fillOpacity,
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.3,
      stops: [0, 90, 100]
    }
  },
  xaxis: {
    categories: props.categories
  }
}))
</script>

<template>
  <BaseChart
    type="area"
    :series="series"
    :options="chartOptions"
    :height="height"
  />
</template>

