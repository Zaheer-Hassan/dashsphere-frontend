<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
</script>

<template>
  <AppLayout>
    <div class="view-container">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
        <div>
          <h1>Tenant Management</h1>
          <p>Manage your organizations and tenants</p>
        </div>
        <BaseButton icon="plus">Add Tenant</BaseButton>
      </div>
      
      <div style="padding: 2rem; background: rgb(var(--color-surface)); border-radius: var(--radius-lg); border: 1px solid rgb(var(--color-border));">
        <p>Tenant management interface will be displayed here.</p>
      </div>
    </div>
  </AppLayout>
</template>

