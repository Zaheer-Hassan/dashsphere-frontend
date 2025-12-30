<script setup>
/**
 * ProfileView - User Profile Management
 * Update name, avatar, and password
 */

import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import IconBase from '@/components/base/IconBase.vue'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'

const { user, userName, userEmail, userRole } = useAuth()
const { showSuccess, showError } = useNotifications()

// Profile form
const profileForm = ref({
  name: userName.value || '',
  email: userEmail.value || '',
  phone: '',
  bio: '',
  location: ''
})

const profileErrors = ref({
  name: '',
  email: '',
  phone: ''
})

// Avatar upload
const avatarFile = ref(null)
const avatarPreview = ref(null)
const avatarInput = ref(null)

// Password form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Loading states
const profileLoading = ref(false)
const passwordLoading = ref(false)
const avatarLoading = ref(false)

// Handle avatar selection
const handleAvatarSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showError('Please select a valid image file')
    return
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError('Image size must be less than 5MB')
    return
  }
  
  avatarFile.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    avatarPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Trigger file input
const selectAvatar = () => {
  avatarInput.value.click()
}

// Remove avatar
const removeAvatar = () => {
  avatarFile.value = null
  avatarPreview.value = null
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}

// Upload avatar
const uploadAvatar = async () => {
  if (!avatarFile.value) {
    showError('Please select an image first')
    return
  }
  
  avatarLoading.value = true
  
  try {
    // In production, upload to API:
    // const formData = new FormData()
    // formData.append('avatar', avatarFile.value)
    // await apiClient.post('/users/avatar', formData)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showSuccess('Avatar updated successfully!')
    // Clear selection after upload
    avatarFile.value = null
  } catch (error) {
    showError('Failed to upload avatar')
  } finally {
    avatarLoading.value = false
  }
}

// Validate profile form
const validateProfile = () => {
  let isValid = true
  profileErrors.value = { name: '', email: '', phone: '' }
  
  if (!profileForm.value.name.trim()) {
    profileErrors.value.name = 'Name is required'
    isValid = false
  }
  
  if (!profileForm.value.email.trim()) {
    profileErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(profileForm.value.email)) {
    profileErrors.value.email = 'Email is invalid'
    isValid = false
  }
  
  return isValid
}

// Update profile
const updateProfile = async () => {
  if (!validateProfile()) return
  
  profileLoading.value = true
  
  try {
    // In production:
    // await apiClient.put('/users/profile', profileForm.value)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showSuccess('Profile updated successfully!')
  } catch (error) {
    showError('Failed to update profile')
  } finally {
    profileLoading.value = false
  }
}

// Validate password form
const validatePassword = () => {
  let isValid = true
  passwordErrors.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  
  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = 'Current password is required'
    isValid = false
  }
  
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = 'New password is required'
    isValid = false
  } else if (passwordForm.value.newPassword.length < 8) {
    passwordErrors.value.newPassword = 'Password must be at least 8 characters'
    isValid = false
  }
  
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }
  
  return isValid
}

// Update password
const updatePassword = async () => {
  if (!validatePassword()) return
  
  passwordLoading.value = true
  
  try {
    // In production:
    // await apiClient.put('/users/password', {
    //   currentPassword: passwordForm.value.currentPassword,
    //   newPassword: passwordForm.value.newPassword
    // })
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Clear form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
    
    showSuccess('Password changed successfully!')
  } catch (error) {
    showError('Failed to change password. Please check your current password.')
  } finally {
    passwordLoading.value = false
  }
}

// Get initials for avatar placeholder
const userInitials = computed(() => {
  const name = profileForm.value.name || 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})
</script>

<template>
  <AppLayout>
    <div class="profile-view">
      <!-- Header -->
      <div class="profile-view__header">
        <div>
          <h1 class="profile-view__title">Profile Settings</h1>
          <p class="profile-view__subtitle">
            Manage your personal information and security settings
          </p>
        </div>
      </div>
      
      <div class="profile-view__content">
        <!-- Avatar Section -->
        <section class="profile-view__section">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">Profile Picture</h2>
            <p class="profile-view__section-subtitle">
              Upload a profile picture to personalize your account
            </p>
          </div>
          
          <div class="profile-view__avatar-container">
            <div class="profile-view__avatar-preview">
              <!-- Avatar Preview -->
              <div v-if="avatarPreview" class="profile-view__avatar profile-view__avatar--image">
                <img :src="avatarPreview" alt="Avatar preview" />
              </div>
              <div v-else class="profile-view__avatar profile-view__avatar--placeholder">
                <span>{{ userInitials }}</span>
              </div>
              
              <div class="profile-view__avatar-info">
                <p class="profile-view__avatar-name">{{ profileForm.name }}</p>
                <p class="profile-view__avatar-role">{{ userRole }}</p>
              </div>
            </div>
            
            <div class="profile-view__avatar-actions">
              <input
                ref="avatarInput"
                type="file"
                accept="image/*"
                style="display: none"
                @change="handleAvatarSelect"
              />
              
              <BaseButton
                variant="outline"
                icon="upload"
                @click="selectAvatar"
              >
                Choose Image
              </BaseButton>
              
              <BaseButton
                v-if="avatarFile"
                variant="primary"
                :loading="avatarLoading"
                @click="uploadAvatar"
              >
                Upload
              </BaseButton>
              
              <BaseButton
                v-if="avatarPreview"
                variant="ghost"
                icon="delete"
                @click="removeAvatar"
              >
                Remove
              </BaseButton>
              
              <p class="profile-view__avatar-hint">
                Recommended: Square image, at least 400x400px. Max 5MB.
              </p>
            </div>
          </div>
        </section>
        
        <!-- Profile Information -->
        <section class="profile-view__section">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">Personal Information</h2>
            <p class="profile-view__section-subtitle">
              Update your personal details and contact information
            </p>
          </div>
          
          <form class="profile-view__form" @submit.prevent="updateProfile">
            <div class="profile-view__form-grid">
              <BaseInput
                v-model="profileForm.name"
                label="Full Name"
                placeholder="Enter your full name"
                icon="user"
                :error="profileErrors.name"
                required
              />
              
              <BaseInput
                v-model="profileForm.email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                icon="mail"
                :error="profileErrors.email"
                required
              />
              
              <BaseInput
                v-model="profileForm.phone"
                type="tel"
                label="Phone Number"
                placeholder="+1 (555) 000-0000"
                icon="user"
                :error="profileErrors.phone"
              />
              
              <BaseInput
                v-model="profileForm.location"
                label="Location"
                placeholder="City, Country"
                icon="user"
              />
            </div>
            
            <BaseInput
              v-model="profileForm.bio"
              label="Bio"
              placeholder="Tell us about yourself..."
              hint="Brief description for your profile"
            />
            
            <div class="profile-view__form-actions">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="profileLoading"
              >
                Save Changes
              </BaseButton>
            </div>
          </form>
        </section>
        
        <!-- Change Password -->
        <section class="profile-view__section">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">Change Password</h2>
            <p class="profile-view__section-subtitle">
              Ensure your account stays secure with a strong password
            </p>
          </div>
          
          <form class="profile-view__form" @submit.prevent="updatePassword">
            <BaseInput
              v-model="passwordForm.currentPassword"
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              icon="lock"
              :error="passwordErrors.currentPassword"
              required
            />
            
            <BaseInput
              v-model="passwordForm.newPassword"
              type="password"
              label="New Password"
              placeholder="Enter new password"
              icon="lock"
              :error="passwordErrors.newPassword"
              hint="Must be at least 8 characters"
              required
            />
            
            <BaseInput
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirm New Password"
              placeholder="Confirm new password"
              icon="lock"
              :error="passwordErrors.confirmPassword"
              required
            />
            
            <div class="profile-view__form-actions">
              <BaseButton
                type="submit"
                variant="primary"
                :loading="passwordLoading"
              >
                Update Password
              </BaseButton>
            </div>
          </form>
        </section>
        
        <!-- Danger Zone -->
        <section class="profile-view__section profile-view__section--danger">
          <div class="profile-view__section-header">
            <h2 class="profile-view__section-title">Danger Zone</h2>
            <p class="profile-view__section-subtitle">
              Irreversible actions that affect your account
            </p>
          </div>
          
          <div class="profile-view__danger-actions">
            <div class="profile-view__danger-item">
              <div>
                <h3 class="profile-view__danger-title">Delete Account</h3>
                <p class="profile-view__danger-description">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <BaseButton variant="error" size="sm">
                Delete Account
              </BaseButton>
            </div>
          </div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Header */
.profile-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.profile-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.profile-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: var(--spacing-xs) 0 0 0;
}

/* Content */
.profile-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Section */
.profile-view__section {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.profile-view__section--danger {
  border-color: rgb(var(--color-error));
  background-color: rgb(var(--color-error-light));
}

.profile-view__section-header {
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
}

.profile-view__section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.profile-view__section-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Avatar */
.profile-view__avatar-container {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-2xl);
}

.profile-view__avatar-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.profile-view__avatar {
  width: 120px;
  height: 120px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.profile-view__avatar--image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-view__avatar--placeholder {
  background: linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-secondary)) 100%);
  color: white;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
}

.profile-view__avatar-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.profile-view__avatar-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.profile-view__avatar-role {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  text-transform: capitalize;
  margin: 0;
}

.profile-view__avatar-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
}

.profile-view__avatar-hint {
  font-size: var(--font-size-xs);
  color: rgb(var(--color-text-tertiary));
  margin: 0;
}

/* Form */
.profile-view__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.profile-view__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
}

.profile-view__form-actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
}

/* Danger Zone */
.profile-view__danger-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.profile-view__danger-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-error));
  border-radius: var(--radius-lg);
}

.profile-view__danger-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.profile-view__danger-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .profile-view__avatar-container {
    flex-direction: column;
  }
  
  .profile-view__form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-view__title {
    font-size: var(--font-size-2xl);
  }
  
  .profile-view__avatar-preview {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-view__danger-item {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

