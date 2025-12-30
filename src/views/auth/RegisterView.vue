<script setup>
/**
 * RegisterView - User Registration Page
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import IconBase from '@/components/base/IconBase.vue'

const router = useRouter()
const { showError, showSuccess } = useNotifications()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  organizationName: ''
})

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  organizationName: ''
})

const loading = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    organizationName: ''
  }
  
  if (!form.value.name) {
    errors.value.name = 'Name is required'
    isValid = false
  }
  
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
  } else if (form.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  if (!form.value.organizationName) {
    errors.value.organizationName = 'Organization name is required'
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
    // This would be replaced with actual API call
    // await authAPI.register(form.value)
    
    showSuccess('Registration successful! Please check your email.')
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (error) {
    showError('Registration failed. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="register-view">
    <div class="register-view__container">
      <!-- Header -->
      <div class="register-view__header">
        <div class="register-view__logo">
          <IconBase name="dashboard" :size="48" color="rgb(var(--color-primary))" />
        </div>
        <h1 class="register-view__title">Create Your Account</h1>
        <p class="register-view__subtitle">Get started with your free trial</p>
      </div>
      
      <!-- Form -->
      <form class="register-view__form" @submit.prevent="handleSubmit">
        <BaseInput
          v-model="form.name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          icon="user"
          :error="errors.name"
          required
        />
        
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
          v-model="form.organizationName"
          type="text"
          label="Organization Name"
          placeholder="Enter your organization name"
          icon="folder"
          :error="errors.organizationName"
          required
        />
        
        <BaseInput
          v-model="form.password"
          type="password"
          label="Password"
          placeholder="Create a password"
          icon="lock"
          :error="errors.password"
          hint="Must be at least 8 characters"
          required
        />
        
        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          icon="lock"
          :error="errors.confirmPassword"
          required
        />
        
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :loading="loading"
        >
          Create Account
        </BaseButton>
      </form>
      
      <!-- Footer -->
      <div class="register-view__footer">
        <p class="register-view__footer-text">
          Already have an account?
          <router-link to="/login" class="register-view__link">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%);
}

.register-view__container {
  width: 100%;
  max-width: 480px;
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-2xl);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-xl);
}

.register-view__header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.register-view__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background-color: rgb(var(--color-primary-light));
  border-radius: var(--radius-2xl);
  margin-bottom: var(--spacing-lg);
}

.register-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.register-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.register-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.register-view__link {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-primary));
  text-decoration: none;
  transition: all var(--transition-fast) ease;
}

.register-view__link:hover {
  text-decoration: underline;
}

.register-view__footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgb(var(--color-border));
}

.register-view__footer-text {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

@media (max-width: 640px) {
  .register-view__container {
    padding: var(--spacing-xl);
  }
}
</style>

