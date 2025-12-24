<script setup>
/**
 * AnalyticsView - Comprehensive Analytics Dashboard
 * Daily and Weekly Analytics for Tenant
 */

import { ref, onMounted, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
import { LineChart, BarChart, AreaChart, PieChart } from '@/components/charts'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseLoader from '@/components/base/BaseLoader.vue'
import { useTenant } from '@/composables/useTenant'

const { tenantName, tenantId } = useTenant()

const loading = ref(true)
const selectedPeriod = ref('today')

// Period options
const periodOptions = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' }
]

// Daily Analytics Data (Top Section)
const dailyAnalytics = ref({
  todayVisits: {
    value: '2,847',
    trend: 12.5,
    icon: 'users',
    color: 'primary'
  },
  todayRevenue: {
    value: '$8,432',
    trend: 8.3,
    icon: 'trending-up',
    color: 'success'
  },
  todayOrders: {
    value: '124',
    trend: -3.2,
    icon: 'chart',
    color: 'info'
  },
  todayConversion: {
    value: '3.42%',
    trend: 2.1,
    icon: 'chart-pie',
    color: 'secondary'
  }
})

// Hourly Traffic (Daily Analytics)
const hourlyTrafficData = ref({
  series: [
    {
      name: 'Visits',
      data: [23, 31, 28, 45, 67, 89, 102, 134, 156, 178, 165, 142, 128, 145, 167, 189, 198, 185, 156, 134, 98, 67, 45, 32]
    },
    {
      name: 'Conversions',
      data: [1, 2, 1, 3, 4, 5, 6, 8, 9, 10, 8, 7, 6, 7, 8, 9, 10, 9, 7, 6, 4, 3, 2, 1]
    }
  ],
  categories: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
})

// Daily Revenue Breakdown
const dailyRevenueData = ref({
  series: [44, 32, 24],
  labels: ['Products', 'Services', 'Subscriptions']
})

// Weekly Analytics Data
const weeklyVisitsData = ref({
  series: [
    {
      name: 'Total Visits',
      data: [3200, 4100, 3800, 5200, 4900, 6100, 7200]
    },
    {
      name: 'Unique Visitors',
      data: [2100, 2800, 2500, 3500, 3200, 4100, 4800]
    },
    {
      name: 'Returning Visitors',
      data: [1100, 1300, 1300, 1700, 1700, 2000, 2400]
    }
  ],
  categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
})

// Weekly Revenue
const weeklyRevenueData = ref({
  series: [
    {
      name: 'Revenue',
      data: [8200, 9500, 8800, 11200, 10900, 13100, 15200]
    },
    {
      name: 'Target',
      data: [10000, 10000, 10000, 10000, 10000, 10000, 10000]
    }
  ],
  categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
})

// Weekly Performance by Category
const weeklyPerformanceData = ref({
  series: [
    {
      name: 'Products',
      data: [3400, 4200, 3900, 5100, 4800, 6200, 7100]
    },
    {
      name: 'Services',
      data: [2800, 3100, 2900, 3800, 3600, 4300, 5000]
    },
    {
      name: 'Subscriptions',
      data: [2000, 2200, 2000, 2300, 2500, 2600, 3100]
    }
  ],
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
})

// Weekly Top Sources
const weeklySourcesData = ref({
  series: [38, 28, 18, 10, 6],
  labels: ['Organic Search', 'Direct Traffic', 'Social Media', 'Email Campaign', 'Referral']
})

// Load analytics data
const loadAnalytics = async () => {
  loading.value = true
  
  try {
    // In production, this would be:
    // const response = await apiClient.get(`/analytics/${tenantId.value}?period=${selectedPeriod.value}`)
    // dailyAnalytics.value = response.data
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
  } catch (error) {
    console.error('Failed to load analytics:', error)
  } finally {
    loading.value = false
  }
}

// Export analytics data
const exportAnalytics = () => {
  // In production, trigger CSV/PDF export
  alert('Export analytics functionality - would download report for ' + tenantName.value)
}

onMounted(() => {
  loadAnalytics()
})

// Computed formatted date
const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
})
</script>

<template>
  <AppLayout>
    <div class="analytics-view">
      <!-- Header -->
      <div class="analytics-view__header">
        <div class="analytics-view__header-content">
          <div>
            <h1 class="analytics-view__title">Analytics Dashboard</h1>
            <p class="analytics-view__subtitle">
              {{ tenantName }} - {{ currentDate }}
            </p>
          </div>
          
          <div class="analytics-view__header-actions">
            <BaseSelect
              v-model="selectedPeriod"
              :options="periodOptions"
              size="md"
              @change="loadAnalytics"
            />
            
            <BaseButton
              icon="download"
              variant="outline"
              @click="exportAnalytics"
            >
              Export Report
            </BaseButton>
          </div>
        </div>
      </div>
      
      <div v-if="loading" class="analytics-view__loading">
        <BaseLoader size="lg" text="Loading analytics data..." />
      </div>
      
      <div v-else class="analytics-view__content">
        <!-- DAILY ANALYTICS SECTION -->
        <section class="analytics-view__section">
          <div class="analytics-view__section-header">
            <h2 class="analytics-view__section-title">
              📊 Daily Analytics
            </h2>
            <p class="analytics-view__section-subtitle">
              Real-time performance metrics for today
            </p>
          </div>
          
          <!-- Daily KPI Cards -->
          <div class="analytics-view__kpi-grid">
            <KPICard
              title="Today's Visits"
              :value="dailyAnalytics.todayVisits.value"
              :icon="dailyAnalytics.todayVisits.icon"
              :trend="dailyAnalytics.todayVisits.trend"
              :color="dailyAnalytics.todayVisits.color"
              trend-label="vs yesterday"
            />
            
            <KPICard
              title="Today's Revenue"
              :value="dailyAnalytics.todayRevenue.value"
              :icon="dailyAnalytics.todayRevenue.icon"
              :trend="dailyAnalytics.todayRevenue.trend"
              :color="dailyAnalytics.todayRevenue.color"
              trend-label="vs yesterday"
            />
            
            <KPICard
              title="Today's Orders"
              :value="dailyAnalytics.todayOrders.value"
              :icon="dailyAnalytics.todayOrders.icon"
              :trend="dailyAnalytics.todayOrders.trend"
              :color="dailyAnalytics.todayOrders.color"
              trend-label="vs yesterday"
            />
            
            <KPICard
              title="Conversion Rate"
              :value="dailyAnalytics.todayConversion.value"
              :icon="dailyAnalytics.todayConversion.icon"
              :trend="dailyAnalytics.todayConversion.trend"
              :color="dailyAnalytics.todayConversion.color"
              trend-label="vs yesterday"
            />
          </div>
          
          <!-- Daily Charts -->
          <div class="analytics-view__charts-grid">
            <div class="analytics-view__chart-card analytics-view__chart-card--large">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Hourly Traffic</h3>
                <p class="analytics-view__chart-subtitle">
                  Traffic pattern throughout the day
                </p>
              </div>
              <AreaChart
                :series="hourlyTrafficData.series"
                :categories="hourlyTrafficData.categories"
                :height="350"
                stacked
              />
            </div>
            
            <div class="analytics-view__chart-card">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Traffic Sources</h3>
                <p class="analytics-view__chart-subtitle">
                  Where your visitors come from this week
                </p>
              </div>
              <PieChart
                :series="weeklySourcesData.series"
                :labels="weeklySourcesData.labels"
                :height="350"
                donut
              />
            </div>
            
            <div class="analytics-view__chart-card">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Revenue Breakdown</h3>
                <p class="analytics-view__chart-subtitle">
                  Today's revenue distribution by category
                </p>
              </div>
              <PieChart
                :series="dailyRevenueData.series"
                :labels="dailyRevenueData.labels"
                :height="350"
              />
            </div>
          </div>
        </section>
        
        <!-- WEEKLY ANALYTICS SECTION -->
        <section class="analytics-view__section">
          <div class="analytics-view__section-header">
            <h2 class="analytics-view__section-title">
              📈 Weekly Analytics
            </h2>
            <p class="analytics-view__section-subtitle">
              Performance trends and insights for this week
            </p>
          </div>
          
          <!-- Weekly Charts Grid -->
          <div class="analytics-view__charts-grid">
            <!-- Weekly Visits -->
            <div class="analytics-view__chart-card analytics-view__chart-card--large">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Weekly Visits</h3>
                <p class="analytics-view__chart-subtitle">
                  Total, unique, and returning visitors
                </p>
              </div>
              <LineChart
                :series="weeklyVisitsData.series"
                :categories="weeklyVisitsData.categories"
                :height="400"
                smooth
                show-markers
              />
            </div>
            
            <!-- Weekly Revenue -->
            <div class="analytics-view__chart-card analytics-view__chart-card--large">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Weekly Revenue</h3>
                <p class="analytics-view__chart-subtitle">
                  Revenue vs target comparison
                </p>
              </div>
              <AreaChart
                :series="weeklyRevenueData.series"
                :categories="weeklyRevenueData.categories"
                :height="400"
              />
            </div>
            
            <!-- Weekly Performance by Category -->
            <div class="analytics-view__chart-card analytics-view__chart-card--large">
              <div class="analytics-view__chart-header">
                <h3 class="analytics-view__chart-title">Performance by Category</h3>
                <p class="analytics-view__chart-subtitle">
                  Weekly breakdown of revenue sources
                </p>
              </div>
              <BarChart
                :series="weeklyPerformanceData.series"
                :categories="weeklyPerformanceData.categories"
                :height="400"
                stacked
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.analytics-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Header */
.analytics-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.analytics-view__header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
}

.analytics-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.analytics-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: var(--spacing-xs) 0 0 0;
}

.analytics-view__header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Loading */
.analytics-view__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
}

/* Content */
.analytics-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

/* Section */
.analytics-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.analytics-view__section-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.analytics-view__section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.analytics-view__section-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* KPI Grid */
.analytics-view__kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

/* Charts Grid */
.analytics-view__charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.analytics-view__chart-card {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast) ease;
}

.analytics-view__chart-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.analytics-view__chart-card--large {
  grid-column: span 2;
}

.analytics-view__chart-header {
  margin-bottom: var(--spacing-lg);
}

.analytics-view__chart-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.analytics-view__chart-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1280px) {
  .analytics-view__chart-card--large {
    grid-column: span 2;
  }
}

@media (max-width: 1024px) {
  .analytics-view__charts-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-view__chart-card--large {
    grid-column: span 1;
  }
  
  .analytics-view__header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .analytics-view__header-actions {
    width: 100%;
    flex-direction: column;
  }
}

@media (max-width: 640px) {
  .analytics-view__kpi-grid {
    grid-template-columns: 1fr;
  }
  
  .analytics-view__title {
    font-size: var(--font-size-2xl);
  }
  
  .analytics-view__section-title {
    font-size: var(--font-size-xl);
  }
  
  .analytics-view__header-actions {
    gap: var(--spacing-sm);
  }
}
</style>

