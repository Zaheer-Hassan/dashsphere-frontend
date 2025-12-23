<script setup>
/**
 * BarChart - Reusable Bar Chart Component
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
  horizontal: {
    type: Boolean,
    default: false
  },
  distributed: {
    type: Boolean,
    default: false
  },
  stacked: {
    type: Boolean,
    default: false
  }
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    stacked: props.stacked
  },
  title: {
    text: props.title,
    align: 'left'
  },
  subtitle: {
    text: props.subtitle,
    align: 'left'
  },
  plotOptions: {
    bar: {
      horizontal: props.horizontal,
      distributed: props.distributed,
      borderRadius: 4,
      columnWidth: '60%'
    }
  },
  xaxis: {
    categories: props.categories
  },
  legend: {
    show: !props.distributed
  }
}))
</script>

<template>
  <BaseChart
    type="bar"
    :series="series"
    :options="chartOptions"
    :height="height"
  />
</template>

