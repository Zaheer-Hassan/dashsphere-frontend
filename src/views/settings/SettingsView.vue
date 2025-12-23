<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import { useTheme } from '@/composables/useTheme'

const { toggleTheme, isDark } = useTheme()
</script>

<template>
  <AppLayout>
    <div class="view-container">
      <h1>Settings</h1>
      <p>Manage your account and application preferences</p>
      
      <div style="margin-top: 2rem; padding: 2rem; background: rgb(var(--color-surface)); border-radius: var(--radius-lg); border: 1px solid rgb(var(--color-border));">
        <h3 style="margin-bottom: 1rem;">Appearance</h3>
        <BaseToggle
          :model-value="isDark"
          label="Dark Mode"
          @update:model-value="toggleTheme"
        />
      </div>
    </div>
  </AppLayout>
</template>

