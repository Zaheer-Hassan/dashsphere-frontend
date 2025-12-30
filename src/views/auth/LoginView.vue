<script setup>
/**
 * LoginView - User Login Page
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import IconBase from '@/components/base/IconBase.vue'

const router = useRouter()
const { login } = useAuth()
const { showError, showSuccess } = useNotifications()

const form = ref({
  email: '',
  password: '',
  remember: false
})

const errors = ref({
  email: '',
  password: ''
})

const loading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = { email: '', password: '' }
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email is invalid'
    isValid = false
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }
  
  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  
  try {
    const result = await login({
      email: form.value.email,
      password: form.value.password
    })
    
    if (result.success) {
      showSuccess('Login successful!')
      router.push('/dashboard')
    } else {
      showError(result.error || 'Login failed')
    }
  } catch (error) {
    showError('An error occurred during login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-view">
    <div class="login-view__container">
      <!-- Header -->
      <div class="login-view__header">
        <div class="login-view__logo">
          <IconBase name="dashboard" :size="48" color="rgb(var(--color-primary))" />
        </div>
        <h1 class="login-view__title">Welcome to DashSphere</h1>
        <p class="login-view__subtitle">Sign in to your account to continue</p>
      </div>
      
      <!-- Form -->
      <form class="login-view__form" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email Address"
          placeholder="Enter your email"
          icon="mail"
          :error="errors.email"
          required
        />
        
        <BaseInput
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          icon="lock"
          :error="errors.password"
          required
        />
        
        <div class="login-view__options">
          <BaseToggle
            v-model="form.remember"
            label="Remember me"
            size="sm"
          />
          
          <router-link to="/forgot-password" class="login-view__link">
            Forgot password?
          </router-link>
        </div>
        
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="loading"
        >
          Sign In
        </BaseButton>
      </form>
      
      <!-- Footer -->
      <div class="login-view__footer">
        <p class="login-view__footer-text">
          Don't have an account?
          <router-link to="/register" class="login-view__link">
            Sign up
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%);
}

.login-view__container {
  width: 100%;
  max-width: 440px;
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
}

.login-view__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.login-view__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgb(var(--color-primary-light));
  border-radius: var(--radius-2xl);
  margin-bottom: var(--spacing-lg);
}

.login-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.login-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.login-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.login-view__options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.login-view__link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-primary));
  text-decoration: none;
  transition: all var(--transition-fast) ease;
}

.login-view__link:hover {
  text-decoration: underline;
}

.login-view__footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgb(var(--color-border));
}

.login-view__footer-text {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

@media (max-width: 640px) {
  .login-view__container {
    padding: var(--spacing-xl);
  }
}
</style>

