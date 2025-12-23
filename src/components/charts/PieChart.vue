<script setup>
/**
 * PieChart - Reusable Pie/Donut Chart Component
 */

import BaseChart from './BaseChart.vue'
import { computed } from 'vue'

const props = defineProps({
  series: {
    type: Array,
    required: true
    // Format: [44, 55, 13, 43, 22]
  },
  labels: {
    type: Array,
    required: true
    // Format: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E']
  },
  height: {
    type: [String, Number],
    default: 350
  },
  title: {
    type: String,
    default: ''
  },
  donut: {
    type: Boolean,
    default: false
  },
  showLegend: {
    type: Boolean,
    default: true
  },
  showDataLabels: {
    type: Boolean,
    default: true
  }
})

const chartType = computed(() => props.donut ? 'donut' : 'pie')

const chartOptions = computed(() => ({
  chart: {
    type: chartType.value
  },
  title: {
    text: props.title,
    align: 'left'
  },
  labels: props.labels,
  legend: {
    show: props.showLegend,
    position: 'bottom'
  },
  dataLabels: {
    enabled: props.showDataLabels
  },
  plotOptions: {
    pie: {
      donut: {
        size: props.donut ? '70%' : '0%'
      }
    }
  },
  responsive: [{
    breakpoint: 480,
    options: {
      chart: {
        width: 300
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
}))
</script>

<template>
  <BaseChart
    :type="chartType"
    :series="series"
    :options="chartOptions"
    :height="height"
  />
</template>

