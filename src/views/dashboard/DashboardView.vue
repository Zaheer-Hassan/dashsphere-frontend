<script setup>
/**
 * DashboardView - Main Dashboard with Analytics
 */

import { ref, onMounted } from 'vue'
import { useTenant } from '@/composables/useTenant'
import AppLayout from '@/components/layout/AppLayout.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
import { LineChart, BarChart, PieChart, AreaChart } from '@/components/charts'
import BaseLoader from '@/components/base/BaseLoader.vue'

const { tenantName, tenantSubscription } = useTenant()

const loading = ref(true)

// KPI Data
const kpiData = ref({
  totalUsers: {
    value: '1,234',
    trend: 12.5,
    icon: 'users',
    color: 'primary'
  },
  revenue: {
    value: '$45,678',
    trend: 8.3,
    icon: 'trending-up',
    color: 'success'
  },
  activeProjects: {
    value: '89',
    trend: -3.2,
    icon: 'folder',
    color: 'info'
  },
  satisfaction: {
    value: '96%',
    trend: 2.1,
    icon: 'chart',
    color: 'secondary'
  }
})

// User Activity Chart (Line Chart)
const userActivityData = ref({
  series: [
    {
      name: 'Active Users',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 140, 160, 180]
    },
    {
      name: 'New Users',
      data: [20, 25, 22, 30, 28, 35, 40, 50, 55, 60, 70, 80]
    }
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})

// Revenue Chart (Area Chart)
const revenueData = ref({
  series: [
    {
      name: 'Revenue',
      data: [31000, 40000, 28000, 51000, 42000, 70000, 85000, 92000, 100000, 115000, 130000, 145000]
    },
    {
      name: 'Expenses',
      data: [11000, 15000, 13000, 17000, 19000, 23000, 25000, 28000, 30000, 35000, 38000, 40000]
    }
  ],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
})

// Traffic Sources (Pie Chart)
const trafficSourcesData = ref({
  series: [44, 55, 13, 43, 22],
  labels: ['Organic Search', 'Direct', 'Social Media', 'Referral', 'Email']
})

// Top Products (Bar Chart)
const topProductsData = ref({
  series: [
    {
      name: 'Sales',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }
  ],
  categories: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F', 'Product G', 'Product H', 'Product I']
})

onMounted(async () => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
})
</script>

<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="dashboard__header">
        <div>
          <h1 class="dashboard__welcome">Welcome back!</h1>
          <p class="dashboard__subtitle">{{ tenantName }} Dashboard Overview</p>
        </div>
        
        <div v-if="tenantSubscription" class="dashboard__plan">
          <span class="dashboard__plan-badge">
            {{ tenantSubscription.plan }} Plan
          </span>
        </div>
      </div>
      
      <!-- KPI Cards -->
      <div class="dashboard__kpis">
        <KPICard
          title="Total Users"
          :value="kpiData.totalUsers.value"
          :icon="kpiData.totalUsers.icon"
          :trend="kpiData.totalUsers.trend"
          :color="kpiData.totalUsers.color"
          :loading="loading"
        />
        
        <KPICard
          title="Revenue"
          :value="kpiData.revenue.value"
          :icon="kpiData.revenue.icon"
          :trend="kpiData.revenue.trend"
          :color="kpiData.revenue.color"
          :loading="loading"
        />
        
        <KPICard
          title="Active Projects"
          :value="kpiData.activeProjects.value"
          :icon="kpiData.activeProjects.icon"
          :trend="kpiData.activeProjects.trend"
          :color="kpiData.activeProjects.color"
          :loading="loading"
        />
        
        <KPICard
          title="Satisfaction"
          :value="kpiData.satisfaction.value"
          :icon="kpiData.satisfaction.icon"
          :trend="kpiData.satisfaction.trend"
          :color="kpiData.satisfaction.color"
          :loading="loading"
        />
      </div>
      
      <!-- Charts Section -->
      <div v-if="!loading" class="dashboard__charts">
        <!-- User Activity -->
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">User Activity</h3>
          <LineChart
            :series="userActivityData.series"
            :categories="userActivityData.categories"
            :height="350"
            smooth
          />
        </div>
        
        <!-- Revenue Overview -->
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Revenue Overview</h3>
          <AreaChart
            :series="revenueData.series"
            :categories="revenueData.categories"
            :height="350"
            stacked
          />
        </div>
        
        <!-- Traffic Sources -->
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Traffic Sources</h3>
          <PieChart
            :series="trafficSourcesData.series"
            :labels="trafficSourcesData.labels"
            :height="350"
          />
        </div>
        
        <!-- Top Products -->
        <div class="dashboard__chart-card">
          <h3 class="dashboard__chart-title">Top Products</h3>
          <BarChart
            :series="topProductsData.series"
            :categories="topProductsData.categories"
            :height="350"
          />
        </div>
      </div>
      
      <div v-else class="dashboard__loading">
        <BaseLoader size="lg" text="Loading dashboard..." />
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.dashboard__welcome {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.dashboard__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: var(--spacing-xs) 0 0 0;
}

.dashboard__plan {
  display: flex;
  align-items: center;
}

.dashboard__plan-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
  text-transform: uppercase;
}

.dashboard__kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.dashboard__charts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.dashboard__chart-card {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
}

.dashboard__chart-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-md) 0;
}

.dashboard__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

@media (max-width: 1024px) {
  .dashboard__charts {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard__kpis {
    grid-template-columns: 1fr;
  }
  
  .dashboard__welcome {
    font-size: var(--font-size-2xl);
  }
}
</style>

