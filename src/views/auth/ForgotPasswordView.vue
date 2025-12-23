<script setup>
/**
 * ForgotPasswordView - Password Reset Request Page
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import IconBase from '@/components/base/IconBase.vue'

const router = useRouter()
const { showError, showSuccess } = useNotifications()

const email = ref('')
const error = ref('')
const loading = ref(false)
const sent = ref(false)

const validateEmail = () => {
  if (!email.value) {
    error.value = 'Email is required'
    return false
  }
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = 'Email is invalid'
    return false
  }
  
  error.value = ''
  return true
}

const handleSubmit = async () => {
  if (!validateEmail()) {
    return
  }
  
  loading.value = true
  
  try {
    // This would be replaced with actual API call
    // await authAPI.forgotPassword(email.value)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    sent.value = true
    showSuccess('Password reset email sent successfully!')
  } catch (err) {
    showError('Failed to send reset email. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="forgot-password-view">
    <div class="forgot-password-view__container">
      <!-- Header -->
      <div class="forgot-password-view__header">
        <div class="forgot-password-view__logo">
          <IconBase name="lock" :size="48" color="rgb(var(--color-primary))" />
        </div>
        <h1 class="forgot-password-view__title">Forgot Password?</h1>
        <p class="forgot-password-view__subtitle">
          {{ sent 
            ? 'Check your email for reset instructions' 
            : 'Enter your email to receive reset instructions' 
          }}
        </p>
      </div>
      
      <!-- Form -->
      <div v-if="!sent">
        <form class="forgot-password-view__form" @submit.prevent="handleSubmit">
          <BaseInput
            v-model="email"
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            icon="mail"
            :error="error"
            required
          />
          
          <BaseButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="loading"
          >
            Send Reset Link
          </BaseButton>
        </form>
        
        <!-- Back to Login -->
        <div class="forgot-password-view__footer">
          <router-link to="/login" class="forgot-password-view__link">
            <IconBase name="arrow-left" :size="16" />
            <span>Back to login</span>
          </router-link>
        </div>
      </div>
      
      <!-- Success Message -->
      <div v-else class="forgot-password-view__success">
        <div class="forgot-password-view__success-icon">
          <IconBase name="check-circle" :size="64" color="rgb(var(--color-success))" />
        </div>
        
        <p class="forgot-password-view__success-text">
          We've sent a password reset link to <strong>{{ email }}</strong>
        </p>
        
        <BaseButton
          variant="primary"
          size="lg"
          full-width
          @click="router.push('/login')"
        >
          Return to Login
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forgot-password-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%);
}

.forgot-password-view__container {
  width: 100%;
  max-width: 440px;
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
}

.forgot-password-view__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.forgot-password-view__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgb(var(--color-primary-light));
  border-radius: var(--radius-2xl);
  margin-bottom: var(--spacing-lg);
}

.forgot-password-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.forgot-password-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.forgot-password-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.forgot-password-view__footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgb(var(--color-border));
}

.forgot-password-view__link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-primary));
  text-decoration: none;
  transition: all var(--transition-fast) ease;
}

.forgot-password-view__link:hover {
  text-decoration: underline;
}

.forgot-password-view__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  text-align: center;
}

.forgot-password-view__success-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-success-light));
  border-radius: var(--radius-full);
}

.forgot-password-view__success-text {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: 0;
  line-height: var(--line-height-relaxed);
}

@media (max-width: 640px) {
  .forgot-password-view__container {
    padding: var(--spacing-xl);
  }
}
</style>

