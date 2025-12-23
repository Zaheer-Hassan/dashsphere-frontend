<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { LineChart, BarChart, AreaChart } from '@/components/charts'

// Sample data - replace with actual API calls
const data = {
  series: [{ name: 'Analytics', data: [30, 40, 35, 50, 49, 60, 70] }],
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}
</script>

<template>
  <AppLayout>
    <div class="view-container">
      <h1>Analytics</h1>
      <p>Advanced analytics and reporting dashboard</p>
      
      <div style="margin-top: 2rem;">
        <LineChart :series="data.series" :categories="data.categories" title="Weekly Analytics" />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.view-container {
  max-width: 1400px;
}
</style>

