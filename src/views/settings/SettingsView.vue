<script setup>
/**
 * SettingsView - Application & Organization Settings
 * Comprehensive settings management
 */

import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import IconBase from '@/components/base/IconBase.vue'
import { useTheme } from '@/composables/useTheme'
import { useTenant } from '@/composables/useTenant'
import { useNotifications } from '@/composables/useNotifications'

const { currentTheme, setTheme, THEMES } = useTheme()
const { tenantName } = useTenant()
const { showSuccess } = useNotifications()

// Active settings tab
const activeTab = ref('appearance')

// Settings tabs
const tabs = [
  { id: 'appearance', label: 'Appearance', icon: 'sun' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'security', label: 'Security', icon: 'lock' },
  { id: 'organization', label: 'Organization', icon: 'folder' },
  { id: 'preferences', label: 'Preferences', icon: 'settings' }
]

// Appearance settings
const appearanceSettings = ref({
  theme: currentTheme.value,
  compactMode: false,
  animations: true,
  language: 'en'
})

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' }
]

const themeOptions = [
  { label: 'Light Mode', value: THEMES.LIGHT },
  { label: 'Dark Mode', value: THEMES.DARK },
  { label: 'System Default', value: THEMES.SYSTEM }
]

// Notification settings
const notificationSettings = ref({
  emailNotifications: true,
  pushNotifications: true,
  desktopNotifications: false,
  notifyOnMention: true,
  notifyOnComment: true,
  notifyOnUpdate: true,
  weeklyDigest: true,
  marketingEmails: false
})

// Security settings
const securitySettings = ref({
  twoFactorAuth: false,
  sessionTimeout: '30',
  loginNotifications: true,
  deviceTracking: true
})

const sessionTimeoutOptions = [
  { label: '15 minutes', value: '15' },
  { label: '30 minutes', value: '30' },
  { label: '1 hour', value: '60' },
  { label: '4 hours', value: '240' },
  { label: 'Never', value: '0' }
]

// Organization settings
const organizationSettings = ref({
  name: tenantName.value,
  domain: '',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
})

const timezoneOptions = [
  { label: 'UTC', value: 'UTC' },
  { label: 'Eastern Time (ET)', value: 'America/New_York' },
  { label: 'Pacific Time (PT)', value: 'America/Los_Angeles' },
  { label: 'Central European Time (CET)', value: 'Europe/Paris' }
]

const dateFormatOptions = [
  { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
  { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
  { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' }
]

const timeFormatOptions = [
  { label: '12-hour (AM/PM)', value: '12h' },
  { label: '24-hour', value: '24h' }
]

// Preferences
const preferences = ref({
  autoSave: true,
  showHints: true,
  keyboardShortcuts: true,
  pageSize: '20'
})

const pageSizeOptions = [
  { label: '10 items', value: '10' },
  { label: '20 items', value: '20' },
  { label: '50 items', value: '50' },
  { label: '100 items', value: '100' }
]

// Save settings
const saveSettings = (section) => {
  // In production, save to API
  showSuccess(`${section} settings saved successfully!`)
  
  // Update theme if changed
  if (section === 'Appearance') {
    setTheme(appearanceSettings.value.theme)
  }
}
</script>

<template>
  <AppLayout>
    <div class="settings-view">
      <!-- Header -->
      <div class="settings-view__header">
        <div>
          <h1 class="settings-view__title">Settings</h1>
          <p class="settings-view__subtitle">
            Manage your application and organization preferences
          </p>
        </div>
      </div>
      
      <div class="settings-view__content">
        <!-- Tabs Navigation -->
        <div class="settings-view__tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'settings-view__tab',
              { 'settings-view__tab--active': activeTab === tab.id }
            ]"
            @click="activeTab = tab.id"
          >
            <IconBase :name="tab.icon" :size="20" />
            <span>{{ tab.label }}</span>
          </button>
        </div>
        
        <!-- Tab Content -->
        <div class="settings-view__panel">
          <!-- Appearance Settings -->
          <div v-if="activeTab === 'appearance'" class="settings-view__section">
            <div class="settings-view__section-header">
              <h2 class="settings-view__section-title">Appearance</h2>
              <p class="settings-view__section-subtitle">
                Customize how the application looks and feels
              </p>
            </div>
            
            <div class="settings-view__section-content">
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Theme</h3>
                  <p class="settings-view__setting-description">
                    Choose your preferred color theme
                  </p>
                </div>
                <BaseSelect
                  v-model="appearanceSettings.theme"
                  :options="themeOptions"
                  style="width: 200px"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Language</h3>
                  <p class="settings-view__setting-description">
                    Select your preferred language
                  </p>
                </div>
                <BaseSelect
                  v-model="appearanceSettings.language"
                  :options="languageOptions"
                  style="width: 200px"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Compact Mode</h3>
                  <p class="settings-view__setting-description">
                    Reduce spacing and show more content
                  </p>
                </div>
                <BaseToggle
                  v-model="appearanceSettings.compactMode"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Animations</h3>
                  <p class="settings-view__setting-description">
                    Enable smooth transitions and animations
                  </p>
                </div>
                <BaseToggle
                  v-model="appearanceSettings.animations"
                />
              </div>
            </div>
            
            <div class="settings-view__section-actions">
              <BaseButton
                variant="primary"
                @click="saveSettings('Appearance')"
              >
                Save Changes
              </BaseButton>
            </div>
          </div>
          
          <!-- Notification Settings -->
          <div v-if="activeTab === 'notifications'" class="settings-view__section">
            <div class="settings-view__section-header">
              <h2 class="settings-view__section-title">Notifications</h2>
              <p class="settings-view__section-subtitle">
                Control how and when you receive notifications
              </p>
            </div>
            
            <div class="settings-view__section-content">
              <div class="settings-view__subsection">
                <h3 class="settings-view__subsection-title">Notification Channels</h3>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Email Notifications</h3>
                    <p class="settings-view__setting-description">
                      Receive notifications via email
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.emailNotifications" />
                </div>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Push Notifications</h3>
                    <p class="settings-view__setting-description">
                      Receive push notifications in-app
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.pushNotifications" />
                </div>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Desktop Notifications</h3>
                    <p class="settings-view__setting-description">
                      Show browser desktop notifications
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.desktopNotifications" />
                </div>
              </div>
              
              <div class="settings-view__subsection">
                <h3 class="settings-view__subsection-title">Activity Notifications</h3>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Mentions</h3>
                    <p class="settings-view__setting-description">
                      When someone mentions you
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.notifyOnMention" />
                </div>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Comments</h3>
                    <p class="settings-view__setting-description">
                      When someone comments on your content
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.notifyOnComment" />
                </div>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Updates</h3>
                    <p class="settings-view__setting-description">
                      When there are system updates
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.notifyOnUpdate" />
                </div>
              </div>
              
              <div class="settings-view__subsection">
                <h3 class="settings-view__subsection-title">Email Preferences</h3>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Weekly Digest</h3>
                    <p class="settings-view__setting-description">
                      Receive a weekly summary email
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.weeklyDigest" />
                </div>
                
                <div class="settings-view__setting">
                  <div class="settings-view__setting-info">
                    <h3 class="settings-view__setting-title">Marketing Emails</h3>
                    <p class="settings-view__setting-description">
                      Receive product updates and tips
                    </p>
                  </div>
                  <BaseToggle v-model="notificationSettings.marketingEmails" />
                </div>
              </div>
            </div>
            
            <div class="settings-view__section-actions">
              <BaseButton
                variant="primary"
                @click="saveSettings('Notification')"
              >
                Save Changes
              </BaseButton>
            </div>
          </div>
          
          <!-- Security Settings -->
          <div v-if="activeTab === 'security'" class="settings-view__section">
            <div class="settings-view__section-header">
              <h2 class="settings-view__section-title">Security</h2>
              <p class="settings-view__section-subtitle">
                Manage security settings and authentication methods
              </p>
            </div>
            
            <div class="settings-view__section-content">
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Two-Factor Authentication</h3>
                  <p class="settings-view__setting-description">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <div style="display: flex; gap: var(--spacing-md); align-items: center;">
                  <BaseToggle v-model="securitySettings.twoFactorAuth" />
                  <BaseButton
                    v-if="securitySettings.twoFactorAuth"
                    variant="outline"
                    size="sm"
                  >
                    Configure
                  </BaseButton>
                </div>
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Session Timeout</h3>
                  <p class="settings-view__setting-description">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                <BaseSelect
                  v-model="securitySettings.sessionTimeout"
                  :options="sessionTimeoutOptions"
                  style="width: 200px"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Login Notifications</h3>
                  <p class="settings-view__setting-description">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <BaseToggle v-model="securitySettings.loginNotifications" />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Device Tracking</h3>
                  <p class="settings-view__setting-description">
                    Track devices that access your account
                  </p>
                </div>
                <BaseToggle v-model="securitySettings.deviceTracking" />
              </div>
              
              <div class="settings-view__info-box">
                <IconBase name="info" :size="20" color="rgb(var(--color-info))" />
                <div>
                  <h4>Active Sessions</h4>
                  <p>View and manage all devices currently logged into your account</p>
                  <BaseButton variant="outline" size="sm" style="margin-top: var(--spacing-sm);">
                    View Sessions
                  </BaseButton>
                </div>
              </div>
            </div>
            
            <div class="settings-view__section-actions">
              <BaseButton
                variant="primary"
                @click="saveSettings('Security')"
              >
                Save Changes
              </BaseButton>
            </div>
          </div>
          
          <!-- Organization Settings -->
          <div v-if="activeTab === 'organization'" class="settings-view__section">
            <div class="settings-view__section-header">
              <h2 class="settings-view__section-title">Organization</h2>
              <p class="settings-view__section-subtitle">
                Manage organization-wide settings and preferences
              </p>
            </div>
            
            <div class="settings-view__section-content">
              <BaseInput
                v-model="organizationSettings.name"
                label="Organization Name"
                placeholder="Enter organization name"
              />
              
              <BaseInput
                v-model="organizationSettings.domain"
                label="Custom Domain"
                placeholder="yourdomain.com"
                hint="Custom domain for your organization"
              />
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Timezone</h3>
                  <p class="settings-view__setting-description">
                    Default timezone for your organization
                  </p>
                </div>
                <BaseSelect
                  v-model="organizationSettings.timezone"
                  :options="timezoneOptions"
                  style="width: 250px"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Date Format</h3>
                  <p class="settings-view__setting-description">
                    How dates are displayed
                  </p>
                </div>
                <BaseSelect
                  v-model="organizationSettings.dateFormat"
                  :options="dateFormatOptions"
                  style="width: 200px"
                />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Time Format</h3>
                  <p class="settings-view__setting-description">
                    How times are displayed
                  </p>
                </div>
                <BaseSelect
                  v-model="organizationSettings.timeFormat"
                  :options="timeFormatOptions"
                  style="width: 200px"
                />
              </div>
            </div>
            
            <div class="settings-view__section-actions">
              <BaseButton
                variant="primary"
                @click="saveSettings('Organization')"
              >
                Save Changes
              </BaseButton>
            </div>
          </div>
          
          <!-- Preferences -->
          <div v-if="activeTab === 'preferences'" class="settings-view__section">
            <div class="settings-view__section-header">
              <h2 class="settings-view__section-title">Preferences</h2>
              <p class="settings-view__section-subtitle">
                Customize your personal workflow preferences
              </p>
            </div>
            
            <div class="settings-view__section-content">
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Auto-Save</h3>
                  <p class="settings-view__setting-description">
                    Automatically save changes as you work
                  </p>
                </div>
                <BaseToggle v-model="preferences.autoSave" />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Show Hints</h3>
                  <p class="settings-view__setting-description">
                    Display helpful hints and tooltips
                  </p>
                </div>
                <BaseToggle v-model="preferences.showHints" />
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Keyboard Shortcuts</h3>
                  <p class="settings-view__setting-description">
                    Enable keyboard shortcuts for quick actions
                  </p>
                </div>
                <div style="display: flex; gap: var(--spacing-md); align-items: center;">
                  <BaseToggle v-model="preferences.keyboardShortcuts" />
                  <BaseButton
                    variant="ghost"
                    size="sm"
                  >
                    View Shortcuts
                  </BaseButton>
                </div>
              </div>
              
              <div class="settings-view__setting">
                <div class="settings-view__setting-info">
                  <h3 class="settings-view__setting-title">Items Per Page</h3>
                  <p class="settings-view__setting-description">
                    Default number of items to show in lists
                  </p>
                </div>
                <BaseSelect
                  v-model="preferences.pageSize"
                  :options="pageSizeOptions"
                  style="width: 150px"
                />
              </div>
            </div>
            
            <div class="settings-view__section-actions">
              <BaseButton
                variant="primary"
                @click="saveSettings('Preferences')"
              >
                Save Changes
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.settings-view {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

/* Header */
.settings-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.settings-view__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.settings-view__subtitle {
  font-size: var(--font-size-base);
  color: rgb(var(--color-text-secondary));
  margin: var(--spacing-xs) 0 0 0;
}

/* Content */
.settings-view__content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

/* Tabs */
.settings-view__tabs {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-md);
  height: fit-content;
  position: sticky;
  top: var(--spacing-xl);
}

.settings-view__tab {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: none;
  border: none;
  border-radius: var(--radius-md);
  color: rgb(var(--color-text-secondary));
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast) ease;
}

.settings-view__tab:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.settings-view__tab--active {
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
}

/* Panel */
.settings-view__panel {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

/* Section */
.settings-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-view__section-header {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
}

.settings-view__section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.settings-view__section-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.settings-view__section-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-view__section-actions {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid rgb(var(--color-border));
}

/* Subsection */
.settings-view__subsection {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.settings-view__subsection-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

/* Setting */
.settings-view__setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.settings-view__setting-info {
  flex: 1;
}

.settings-view__setting-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.settings-view__setting-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Info Box */
.settings-view__info-box {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-info-light));
  border: 1px solid rgb(var(--color-info));
  border-radius: var(--radius-lg);
}

.settings-view__info-box h4 {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.settings-view__info-box p {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .settings-view__content {
    grid-template-columns: 1fr;
  }
  
  .settings-view__tabs {
    position: static;
    flex-direction: row;
    overflow-x: auto;
  }
  
  .settings-view__tab {
    flex-shrink: 0;
  }
}

@media (max-width: 640px) {
  .settings-view__title {
    font-size: var(--font-size-2xl);
  }
  
  .settings-view__setting {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .settings-view__tabs {
    gap: var(--spacing-xs);
  }
  
  .settings-view__tab span {
    display: none;
  }
}
</style>

