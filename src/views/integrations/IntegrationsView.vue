<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseToggle from '@/components/base/BaseToggle.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import IconBase from '@/components/base/IconBase.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'

const permissions = usePermissions()
const { showSuccess, showError } = useNotifications()

// State
const activeCategory = ref('auth')
const selectedIntegration = ref(null)
const isConfigModalOpen = ref(false)
const environmentFilter = ref('all') // all, dev, prod

// Integration categories
const categories = [
  { id: 'auth', name: 'Authentication & SSO', icon: 'lock' },
  { id: 'storage', name: 'Storage & Media', icon: 'folder' },
  { id: 'automation', name: 'Automation & Webhooks', icon: 'link' },
  { id: 'security', name: 'Security & Protection', icon: 'shield' },
  { id: 'developer', name: 'Developer & API', icon: 'key' },
  { id: 'monitoring', name: 'Monitoring & Tracking', icon: 'chart' }
]

// Integration data
const integrations = ref([])

// Form state
const configForm = ref({
  name: '',
  type: '',
  category: '',
  enabled: false,
  environment: 'production', // development, production
  config: {},
  errors: {}
})

// Computed
const filteredIntegrations = computed(() => {
  let filtered = integrations.value.filter(i => i.category === activeCategory.value)
  
  if (environmentFilter.value !== 'all') {
    filtered = filtered.filter(i => i.environment === environmentFilter.value)
  }
  
  return filtered
})

const categoryIntegrations = computed(() => {
  return categories.map(cat => ({
    ...cat,
    items: integrations.value.filter(i => i.category === cat.id)
  }))
})

// Functions
const handleConfigure = (integration) => {
  selectedIntegration.value = integration
  configForm.value = {
    name: integration.name,
    type: integration.type,
    category: integration.category,
    enabled: integration.enabled,
    environment: integration.environment || 'production',
    config: { ...integration.config },
    errors: {}
  }
  isConfigModalOpen.value = true
}

const handleToggle = async (integration) => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const index = integrations.value.findIndex(i => i.id === integration.id)
    if (index !== -1) {
      integrations.value[index].enabled = !integrations.value[index].enabled
      integrations.value[index].status = integrations.value[index].enabled ? 'active' : 'inactive'
    }
    
    showSuccess(`${integration.name} ${integrations.value[index].enabled ? 'enabled' : 'disabled'}`)
  } catch (error) {
    showError('Failed to update integration')
  }
}

const saveConfiguration = async () => {
  // Validation
  configForm.value.errors = {}
  
  if (!configForm.value.name.trim()) {
    configForm.value.errors.name = 'Name is required'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = integrations.value.findIndex(i => i.id === selectedIntegration.value.id)
    if (index !== -1) {
      integrations.value[index] = {
        ...integrations.value[index],
        ...configForm.value,
        config: { ...configForm.value.config }
      }
    }
    
    showSuccess('Integration configuration saved successfully')
    isConfigModalOpen.value = false
    selectedIntegration.value = null
  } catch (error) {
    showError('Failed to save configuration')
  }
}

const getStatusColor = (status) => {
  const colors = {
    active: 'success',
    inactive: 'secondary',
    error: 'error',
    warning: 'warning',
    pending: 'warning'
  }
  return colors[status] || 'secondary'
}

const getStatusLabel = (status) => {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

// Load dummy data
const loadIntegrations = () => {
  integrations.value = [
    // Authentication & SSO
    {
      id: 'google-oauth',
      name: 'Google OAuth',
      type: 'oauth',
      category: 'auth',
      description: 'Enable Google Sign-In for your users',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'user',
      config: {
        clientId: '***',
        clientSecret: '***',
        redirectUri: 'https://app.example.com/auth/google/callback'
      }
    },
    {
      id: 'microsoft-oauth',
      name: 'Microsoft OAuth',
      type: 'oauth',
      category: 'auth',
      description: 'Enable Microsoft/Azure AD Sign-In',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'user',
      config: {
        clientId: '',
        clientSecret: '',
        tenantId: '',
        redirectUri: ''
      }
    },
    {
      id: 'saml-sso',
      name: 'SAML / Enterprise SSO',
      type: 'saml',
      category: 'auth',
      description: 'Configure SAML 2.0 for enterprise single sign-on',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'lock',
      config: {
        ssoUrl: '',
        entityId: '',
        certificate: '',
        nameIdFormat: 'email'
      }
    },
    
    // Storage & Media Services
    {
      id: 'aws-s3',
      name: 'AWS S3',
      type: 'storage',
      category: 'storage',
      description: 'Store files and media in Amazon S3',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'folder',
      config: {
        accessKeyId: '***',
        secretAccessKey: '***',
        bucket: 'my-app-storage',
        region: 'us-east-1'
      }
    },
    {
      id: 'cloudinary',
      name: 'Cloudinary',
      type: 'media',
      category: 'storage',
      description: 'Cloud-based image and video management',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'folder',
      config: {
        cloudName: '',
        apiKey: '',
        apiSecret: ''
      }
    },
    
    // Automation & Webhooks
    {
      id: 'custom-webhooks',
      name: 'Custom Webhooks',
      type: 'webhook',
      category: 'automation',
      description: 'Configure custom webhook endpoints',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'link',
      config: {
        endpoints: [
          { url: 'https://api.example.com/webhook', events: ['user.created', 'order.completed'], secret: '***' }
        ]
      }
    },
    {
      id: 'zapier',
      name: 'Zapier',
      type: 'automation',
      category: 'automation',
      description: 'Connect with Zapier for workflow automation',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'link',
      config: {
        apiKey: '',
        webhookUrl: ''
      }
    },
    {
      id: 'make',
      name: 'Make (Integromat)',
      type: 'automation',
      category: 'automation',
      description: 'Integrate with Make for advanced automation',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'link',
      config: {
        apiKey: '',
        webhookUrl: ''
      }
    },
    
    // Security & Protection
    {
      id: 'recaptcha',
      name: 'reCAPTCHA',
      type: 'security',
      category: 'security',
      description: 'Protect forms with Google reCAPTCHA',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'shield',
      config: {
        siteKey: '***',
        secretKey: '***',
        version: 'v3'
      }
    },
    {
      id: 'ip-whitelist',
      name: 'IP Whitelisting',
      type: 'security',
      category: 'security',
      description: 'Restrict access to specific IP addresses',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'shield',
      config: {
        allowedIPs: [],
        enabled: false
      }
    },
    {
      id: 'rate-limiting',
      name: 'API Rate Limiting',
      type: 'security',
      category: 'security',
      description: 'Configure API rate limits and throttling',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'shield',
      config: {
        requestsPerMinute: 100,
        requestsPerHour: 1000,
        enabled: true
      }
    },
    
    // Developer & API Access
    {
      id: 'api-keys',
      name: 'Public / Private API Keys',
      type: 'api',
      category: 'developer',
      description: 'Manage API keys for external access',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'key',
      config: {
        publicKey: 'pk_live_***',
        privateKey: 'sk_live_***',
        scopes: ['read', 'write']
      }
    },
    {
      id: 'token-management',
      name: 'Token & Scope Management',
      type: 'api',
      category: 'developer',
      description: 'Manage OAuth tokens and API scopes',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'key',
      config: {
        tokenExpiry: 3600,
        refreshTokenEnabled: true,
        scopes: ['read', 'write', 'admin']
      }
    },
    
    // Monitoring & Error Tracking
    {
      id: 'sentry',
      name: 'Sentry',
      type: 'monitoring',
      category: 'monitoring',
      description: 'Error tracking and performance monitoring',
      enabled: true,
      status: 'active',
      environment: 'production',
      icon: 'chart',
      config: {
        dsn: 'https://***@sentry.io/***',
        environment: 'production',
        sampleRate: 1.0
      }
    },
    {
      id: 'log-streaming',
      name: 'Log Streaming',
      type: 'monitoring',
      category: 'monitoring',
      description: 'Stream application logs to external services',
      enabled: false,
      status: 'inactive',
      environment: 'production',
      icon: 'chart',
      config: {
        endpoint: '',
        format: 'json',
        level: 'info'
      }
    }
  ]
}

onMounted(() => {
  loadIntegrations()
})
</script>

<template>
  <AppLayout>
    <div class="integrations-view">
      <!-- Header -->
      <div class="integrations-view__header">
        <div>
          <h1 class="integrations-view__title">Integrations</h1>
          <p class="integrations-view__subtitle">
            Connect with third-party services and APIs to extend your platform's capabilities
          </p>
        </div>
        <div class="integrations-view__header-actions">
          <BaseSelect
            v-model="environmentFilter"
            :options="[
              { label: 'All Environments', value: 'all' },
              { label: 'Development', value: 'development' },
              { label: 'Production', value: 'production' }
            ]"
            size="sm"
          />
        </div>
      </div>

      <!-- Content with Side Menu -->
      <div class="integrations-view__content">
        <!-- Category Side Menu -->
        <div class="integrations-view__categories">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="[
              'integrations-view__category-tab',
              { 'integrations-view__category-tab--active': activeCategory === category.id }
            ]"
            @click="activeCategory = category.id"
          >
            <IconBase :name="category.icon" :size="20" />
            <span>{{ category.name }}</span>
          </button>
        </div>

        <!-- Integrations Panel -->
        <div class="integrations-view__panel">
        <div v-if="filteredIntegrations.length > 0" class="integrations-view__grid">
          <div
            v-for="integration in filteredIntegrations"
            :key="integration.id"
            class="integrations-view__card"
          >
            <div class="integrations-view__card-header">
              <div class="integrations-view__card-title-section">
                <div class="integrations-view__card-icon">
                  <IconBase :name="integration.icon" :size="24" />
                </div>
                <div>
                  <h3 class="integrations-view__card-title">{{ integration.name }}</h3>
                  <p class="integrations-view__card-description">{{ integration.description }}</p>
                </div>
              </div>
              <div class="integrations-view__card-actions">
                <span
                  :class="['integrations-view__status-badge', `integrations-view__status-badge--${getStatusColor(integration.status)}`]"
                >
                  {{ getStatusLabel(integration.status) }}
                </span>
                <BaseToggle
                  :model-value="integration.enabled"
                  @update:model-value="handleToggle(integration)"
                />
              </div>
            </div>

            <div class="integrations-view__card-body">
              <div class="integrations-view__card-info">
                <div class="integrations-view__info-item">
                  <span class="integrations-view__info-label">Environment:</span>
                  <span class="integrations-view__info-value">{{ integration.environment || 'production' }}</span>
                </div>
                <div class="integrations-view__info-item">
                  <span class="integrations-view__info-label">Type:</span>
                  <span class="integrations-view__info-value">{{ integration.type }}</span>
                </div>
              </div>
            </div>

            <div class="integrations-view__card-footer">
              <BaseButton
                variant="outline"
                size="sm"
                @click="handleConfigure(integration)"
              >
                <IconBase name="settings" :size="16" />
                Configure
              </BaseButton>
            </div>
          </div>
        </div>

          <div v-else class="integrations-view__empty">
            <IconBase name="link" :size="48" />
            <p>No integrations found in this category</p>
          </div>
        </div>
      </div>

      <!-- Configuration Modal -->
      <BaseModal
        v-model="isConfigModalOpen"
        :title="`Configure ${selectedIntegration?.name || 'Integration'}`"
        size="lg"
      >
        <div v-if="selectedIntegration" class="integrations-view__modal-content">
          <!-- Basic Settings -->
          <div class="integrations-view__form-section">
            <h3 class="integrations-view__form-section-title">Basic Settings</h3>
            <div class="integrations-view__form-grid">
              <BaseInput
                v-model="configForm.name"
                label="Integration Name"
                placeholder="Enter integration name"
                :error="configForm.errors.name"
                size="sm"
                required
              />
              <BaseSelect
                v-model="configForm.environment"
                label="Environment"
                size="sm"
                :options="[
                  { label: 'Development', value: 'development' },
                  { label: 'Production', value: 'production' }
                ]"
                required
              />
            </div>
            <div class="integrations-view__toggle-section">
              <BaseToggle
                v-model="configForm.enabled"
                label="Enable Integration"
              />
            </div>
          </div>

          <!-- Configuration Fields (Dynamic based on integration type) -->
          <div class="integrations-view__form-section">
            <h3 class="integrations-view__form-section-title">Configuration</h3>
            
            <!-- OAuth Config -->
            <template v-if="selectedIntegration.type === 'oauth'">
              <div class="integrations-view__form-grid">
                <BaseInput
                  v-model="configForm.config.clientId"
                  label="Client ID"
                  placeholder="Enter client ID"
                  type="password"
                  size="sm"
                />
                <BaseInput
                  v-model="configForm.config.clientSecret"
                  label="Client Secret"
                  placeholder="Enter client secret"
                  type="password"
                  size="sm"
                />
                <BaseInput
                  v-model="configForm.config.redirectUri"
                  label="Redirect URI"
                  placeholder="https://app.example.com/auth/callback"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'microsoft-oauth'"
                  v-model="configForm.config.tenantId"
                  label="Tenant ID"
                  placeholder="Enter Azure AD tenant ID"
                  size="sm"
                />
              </div>
            </template>

            <!-- SAML Config -->
            <template v-if="selectedIntegration.type === 'saml'">
              <div class="integrations-view__form-grid">
                <BaseInput
                  v-model="configForm.config.ssoUrl"
                  label="SSO URL"
                  placeholder="https://idp.example.com/sso"
                  size="sm"
                />
                <BaseInput
                  v-model="configForm.config.entityId"
                  label="Entity ID"
                  placeholder="Enter entity ID"
                  size="sm"
                />
                <BaseInput
                  v-model="configForm.config.certificate"
                  label="Certificate"
                  placeholder="Paste certificate (PEM format)"
                  size="sm"
                />
                <BaseSelect
                  v-model="configForm.config.nameIdFormat"
                  label="Name ID Format"
                  size="sm"
                  :options="[
                    { label: 'Email', value: 'email' },
                    { label: 'Username', value: 'username' },
                    { label: 'Persistent', value: 'persistent' }
                  ]"
                />
              </div>
            </template>

            <!-- Storage Config -->
            <template v-if="selectedIntegration.type === 'storage' || selectedIntegration.type === 'media'">
              <div class="integrations-view__form-grid">
                <BaseInput
                  v-if="selectedIntegration.id === 'aws-s3'"
                  v-model="configForm.config.accessKeyId"
                  label="Access Key ID"
                  placeholder="Enter AWS access key"
                  type="password"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'aws-s3'"
                  v-model="configForm.config.secretAccessKey"
                  label="Secret Access Key"
                  placeholder="Enter AWS secret key"
                  type="password"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'aws-s3'"
                  v-model="configForm.config.bucket"
                  label="Bucket Name"
                  placeholder="my-app-storage"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'aws-s3'"
                  v-model="configForm.config.region"
                  label="Region"
                  placeholder="us-east-1"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'cloudinary'"
                  v-model="configForm.config.cloudName"
                  label="Cloud Name"
                  placeholder="Enter cloud name"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'cloudinary'"
                  v-model="configForm.config.apiKey"
                  label="API Key"
                  placeholder="Enter API key"
                  type="password"
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'cloudinary'"
                  v-model="configForm.config.apiSecret"
                  label="API Secret"
                  placeholder="Enter API secret"
                  type="password"
                  size="sm"
                />
              </div>
            </template>

            <!-- Webhook Config -->
            <template v-if="selectedIntegration.type === 'webhook'">
              <div class="integrations-view__form-grid">
                <div class="integrations-view__webhook-info">
                  <p class="integrations-view__info-text">
                    Configure webhook endpoints in the automation settings. Each webhook can have multiple endpoints and event subscriptions.
                  </p>
                </div>
              </div>
            </template>

            <!-- Security Config -->
            <template v-if="selectedIntegration.type === 'security'">
              <div v-if="selectedIntegration.id === 'recaptcha'" class="integrations-view__form-grid">
                <BaseInput
                  v-model="configForm.config.siteKey"
                  label="Site Key"
                  placeholder="Enter reCAPTCHA site key"
                  size="sm"
                />
                <BaseInput
                  v-model="configForm.config.secretKey"
                  label="Secret Key"
                  placeholder="Enter reCAPTCHA secret key"
                  type="password"
                  size="sm"
                />
                <BaseSelect
                  v-model="configForm.config.version"
                  label="Version"
                  size="sm"
                  :options="[
                    { label: 'reCAPTCHA v2', value: 'v2' },
                    { label: 'reCAPTCHA v3', value: 'v3' }
                  ]"
                />
              </div>
              <div v-if="selectedIntegration.id === 'rate-limiting'" class="integrations-view__form-grid">
                <BaseInput
                  v-model.number="configForm.config.requestsPerMinute"
                  label="Requests Per Minute"
                  type="number"
                  placeholder="100"
                  size="sm"
                />
                <BaseInput
                  v-model.number="configForm.config.requestsPerHour"
                  label="Requests Per Hour"
                  type="number"
                  placeholder="1000"
                  size="sm"
                />
                <BaseToggle
                  v-model="configForm.config.enabled"
                  label="Enable Rate Limiting"
                />
              </div>
            </template>

            <!-- API Config -->
            <template v-if="selectedIntegration.type === 'api'">
              <div class="integrations-view__form-grid">
                <BaseInput
                  v-if="selectedIntegration.id === 'api-keys'"
                  v-model="configForm.config.publicKey"
                  label="Public API Key"
                  placeholder="pk_live_***"
                  readonly
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'api-keys'"
                  v-model="configForm.config.privateKey"
                  label="Private API Key"
                  placeholder="sk_live_***"
                  type="password"
                  readonly
                  size="sm"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'token-management'"
                  v-model.number="configForm.config.tokenExpiry"
                  label="Token Expiry (seconds)"
                  type="number"
                  placeholder="3600"
                  size="sm"
                />
                <BaseToggle
                  v-if="selectedIntegration.id === 'token-management'"
                  v-model="configForm.config.refreshTokenEnabled"
                  label="Enable Refresh Tokens"
                />
              </div>
            </template>

            <!-- Monitoring Config -->
            <template v-if="selectedIntegration.type === 'monitoring'">
              <div class="integrations-view__form-grid">
                <BaseInput
                  v-if="selectedIntegration.id === 'sentry'"
                  v-model="configForm.config.dsn"
                  label="Sentry DSN"
                  placeholder="https://***@sentry.io/***"
                  size="sm"
                />
                <BaseSelect
                  v-if="selectedIntegration.id === 'sentry'"
                  v-model="configForm.config.environment"
                  label="Environment"
                  size="sm"
                  :options="[
                    { label: 'Development', value: 'development' },
                    { label: 'Staging', value: 'staging' },
                    { label: 'Production', value: 'production' }
                  ]"
                />
                <BaseInput
                  v-if="selectedIntegration.id === 'log-streaming'"
                  v-model="configForm.config.endpoint"
                  label="Log Endpoint"
                  placeholder="https://logs.example.com/api"
                  size="sm"
                />
                <BaseSelect
                  v-if="selectedIntegration.id === 'log-streaming'"
                  v-model="configForm.config.level"
                  label="Log Level"
                  size="sm"
                  :options="[
                    { label: 'Debug', value: 'debug' },
                    { label: 'Info', value: 'info' },
                    { label: 'Warning', value: 'warning' },
                    { label: 'Error', value: 'error' }
                  ]"
                />
              </div>
            </template>
          </div>
        </div>

        <template #footer>
          <BaseButton variant="ghost" @click="isConfigModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="saveConfiguration">
            Save Configuration
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style scoped>
.integrations-view {
  padding: var(--spacing-xl);
}

.integrations-view__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
}

.integrations-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.integrations-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.integrations-view__header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.integrations-view__content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

.integrations-view__categories {
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

.integrations-view__category-tab {
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
  white-space: nowrap;
}

.integrations-view__category-tab:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.integrations-view__category-tab--active {
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
}

.integrations-view__panel {
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-xl);
  border: 1px solid rgb(var(--color-border));
  padding: var(--spacing-xl);
}

.integrations-view__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.integrations-view__card {
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-fast) ease;
}

.integrations-view__card:hover {
  border-color: rgb(var(--color-primary));
  box-shadow: var(--shadow-md);
}

.integrations-view__card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.integrations-view__card-title-section {
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
}

.integrations-view__card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.integrations-view__card-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.integrations-view__card-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.integrations-view__card-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.integrations-view__status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.integrations-view__status-badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

.integrations-view__status-badge--warning {
  background-color: rgba(var(--color-warning-rgb), 0.1);
  color: rgb(var(--color-warning));
}

.integrations-view__status-badge--error {
  background-color: rgba(var(--color-error-rgb), 0.1);
  color: rgb(var(--color-error));
}

.integrations-view__status-badge--secondary {
  background-color: rgb(var(--color-surface-secondary));
  color: rgb(var(--color-text-secondary));
}

.integrations-view__card-body {
  margin-bottom: var(--spacing-md);
}

.integrations-view__card-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.integrations-view__info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--font-size-sm);
}

.integrations-view__info-label {
  color: rgb(var(--color-text-secondary));
}

.integrations-view__info-value {
  color: rgb(var(--color-text-primary));
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.integrations-view__card-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
}

.integrations-view__empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: rgb(var(--color-text-secondary));
}

.integrations-view__empty svg {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

.integrations-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.integrations-view__form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.integrations-view__form-section-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-sm) 0;
}

.integrations-view__form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-sm);
}

.integrations-view__toggle-section {
  margin-top: var(--spacing-sm);
}

.integrations-view__webhook-info {
  grid-column: 1 / -1;
}

.integrations-view__info-text {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
  padding: var(--spacing-md);
  background-color: rgb(var(--color-surface-secondary));
  border-radius: var(--radius-md);
  border: 1px solid rgb(var(--color-border));
}

@media (max-width: 768px) {
  .integrations-view {
    padding: var(--spacing-md);
  }

  .integrations-view__header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .integrations-view__content {
    grid-template-columns: 1fr;
  }

  .integrations-view__categories {
    position: static;
    flex-direction: row;
    overflow-x: auto;
    gap: var(--spacing-xs);
  }

  .integrations-view__category-tab {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-size-xs);
    flex-shrink: 0;
    white-space: nowrap;
  }

  .integrations-view__grid {
    grid-template-columns: 1fr;
  }

  .integrations-view__form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
