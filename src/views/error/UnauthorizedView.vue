<script setup>
import { useRouter } from 'vue-router'
import IconBase from '@/components/base/IconBase.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <div class="error-view">
    <div class="error-view__content">
      <IconBase name="lock" :size="120" color="rgb(var(--color-error))" />
      <h1 class="error-view__title">403</h1>
      <h2 class="error-view__subtitle">Access Denied</h2>
      <p class="error-view__message">
        You don't have permission to access this resource.
      </p>
      <div class="error-view__actions">
        <BaseButton @click="router.go(-1)">Go Back</BaseButton>
        <BaseButton variant="outline" @click="router.push('/dashboard')">
          Go to Dashboard
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-background));
}

.error-view__content {
  text-align: center;
  max-width: 600px;
}

.error-view__title {
  font-size: 6rem;
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: var(--spacing-lg) 0 var(--spacing-md) 0;
  line-height: 1;
}

.error-view__subtitle {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-md) 0;
}

.error-view__message {
  font-size: var(--font-size-lg);
  color: rgb(var(--color-text-secondary));
  margin: 0 0 var(--spacing-2xl) 0;
  line-height: var(--line-height-relaxed);
}

.error-view__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}
</style>

