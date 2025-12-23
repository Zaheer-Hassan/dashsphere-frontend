<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
</script>

<template>
  <AppLayout>
    <div class="view-container">
      <h1>Billing & Subscription</h1>
      <p>Manage your subscription, invoices, and payment methods</p>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 2rem;">
        <KPICard
          title="Current Plan"
          value="Professional"
          icon="credit-card"
          color="primary"
        />
        <KPICard
          title="Next Billing"
          value="Jan 15, 2024"
          icon="calendar"
          color="info"
        />
        <KPICard
          title="Total Spent"
          value="$2,450"
          icon="trending-up"
          color="success"
        />
      </div>
    </div>
  </AppLayout>
</template>

