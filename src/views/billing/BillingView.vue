<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseSelect from '@/components/base/BaseSelect.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import IconBase from '@/components/base/IconBase.vue'
import { usePermissions } from '@/composables/usePermissions'
import { useNotifications } from '@/composables/useNotifications'

const permissions = usePermissions()
const { showSuccess, showError } = useNotifications()

// Active tab
const activeTab = ref('plan')

// Current plan data
const currentPlan = ref({
  name: 'Professional',
  price: 99,
  billingCycle: 'monthly', // monthly, annual
  status: 'active',
  nextBillingDate: '2024-02-15',
  limits: {
    users: 50,
    storage: 500, // GB
    apiCalls: 100000,
    projects: 10
  },
  usage: {
    users: 32,
    storage: 245,
    apiCalls: 67890,
    projects: 7
  }
})

// Available plans
const availablePlans = ref([
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    annualPrice: 290,
    description: 'Perfect for small teams',
    features: [
      'Up to 10 users',
      '100 GB storage',
      '50,000 API calls/month',
      '5 projects',
      'Email support'
    ],
    limits: {
      users: 10,
      storage: 100,
      apiCalls: 50000,
      projects: 5
    }
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    annualPrice: 990,
    description: 'For growing businesses',
    features: [
      'Up to 50 users',
      '500 GB storage',
      '100,000 API calls/month',
      '10 projects',
      'Priority support',
      'Advanced analytics'
    ],
    limits: {
      users: 50,
      storage: 500,
      apiCalls: 100000,
      projects: 10
    },
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 299,
    annualPrice: 2990,
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'Unlimited storage',
      'Unlimited API calls',
      'Unlimited projects',
      '24/7 phone support',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limits: {
      users: -1, // unlimited
      storage: -1,
      apiCalls: -1,
      projects: -1
    }
  }
])

// Payment history
const paymentHistory = ref([])

// Invoices
const invoices = ref([])

// Payment methods
const paymentMethods = ref([])

// Modals
const isUpgradeModalOpen = ref(false)
const isPaymentMethodModalOpen = ref(false)
const selectedPlan = ref(null)
const newPaymentMethod = ref({
  type: 'card',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  billingAddress: '',
  errors: {}
})

// Computed
const usagePercentage = computed(() => {
  return {
    users: currentPlan.value.limits.users > 0 
      ? Math.round((currentPlan.value.usage.users / currentPlan.value.limits.users) * 100)
      : 0,
    storage: currentPlan.value.limits.storage > 0
      ? Math.round((currentPlan.value.usage.storage / currentPlan.value.limits.storage) * 100)
      : 0,
    apiCalls: currentPlan.value.limits.apiCalls > 0
      ? Math.round((currentPlan.value.usage.apiCalls / currentPlan.value.limits.apiCalls) * 100)
      : 0,
    projects: currentPlan.value.limits.projects > 0
      ? Math.round((currentPlan.value.usage.projects / currentPlan.value.limits.projects) * 100)
      : 0
  }
})

const getUsageColor = (percentage) => {
  if (percentage >= 90) return 'error'
  if (percentage >= 75) return 'warning'
  return 'success'
}

// Functions
const handleUpgrade = (plan) => {
  selectedPlan.value = plan
  isUpgradeModalOpen.value = true
}

const handleDowngrade = (plan) => {
  selectedPlan.value = plan
  isUpgradeModalOpen.value = true
}

const confirmPlanChange = async () => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    currentPlan.value = {
      ...selectedPlan.value,
      status: 'active',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }
    
    showSuccess(`Successfully ${selectedPlan.value.price > currentPlan.value.price ? 'upgraded' : 'downgraded'} to ${selectedPlan.value.name} plan`)
    isUpgradeModalOpen.value = false
    selectedPlan.value = null
  } catch (error) {
    showError('Failed to change plan')
  }
}

const handleAddPaymentMethod = () => {
  newPaymentMethod.value = {
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    errors: {}
  }
  isPaymentMethodModalOpen.value = true
}

const savePaymentMethod = async () => {
  // Validation
  newPaymentMethod.value.errors = {}
  
  if (!newPaymentMethod.value.cardNumber) {
    newPaymentMethod.value.errors.cardNumber = 'Card number is required'
    return
  }
  
  if (!newPaymentMethod.value.expiryDate) {
    newPaymentMethod.value.errors.expiryDate = 'Expiry date is required'
    return
  }
  
  if (!newPaymentMethod.value.cvv) {
    newPaymentMethod.value.errors.cvv = 'CVV is required'
    return
  }
  
  if (!newPaymentMethod.value.cardholderName) {
    newPaymentMethod.value.errors.cardholderName = 'Cardholder name is required'
    return
  }

  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    paymentMethods.value.push({
      id: Date.now(),
      type: 'card',
      last4: newPaymentMethod.value.cardNumber.slice(-4),
      brand: 'Visa',
      expiryDate: newPaymentMethod.value.expiryDate,
      isDefault: paymentMethods.value.length === 0
    })
    
    showSuccess('Payment method added successfully')
    isPaymentMethodModalOpen.value = false
  } catch (error) {
    showError('Failed to add payment method')
  }
}

const setDefaultPaymentMethod = async (method) => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    paymentMethods.value.forEach(m => {
      m.isDefault = m.id === method.id
    })
    
    showSuccess('Default payment method updated')
  } catch (error) {
    showError('Failed to update payment method')
  }
}

const deletePaymentMethod = async (method) => {
  try {
    // Dummy API call
    await new Promise(resolve => setTimeout(resolve, 300))
    
    paymentMethods.value = paymentMethods.value.filter(m => m.id !== method.id)
    showSuccess('Payment method deleted')
  } catch (error) {
    showError('Failed to delete payment method')
  }
}

const downloadInvoice = (invoice) => {
  // Dummy download
  showSuccess(`Downloading invoice ${invoice.number}...`)
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

// Load data
const loadPaymentHistory = () => {
  paymentHistory.value = [
    {
      id: 1,
      date: '2024-01-15',
      amount: 99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
      method: 'Visa •••• 4242'
    },
    {
      id: 2,
      date: '2023-12-15',
      amount: 99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
      method: 'Visa •••• 4242'
    },
    {
      id: 3,
      date: '2023-11-15',
      amount: 99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
      method: 'Visa •••• 4242'
    },
    {
      id: 4,
      date: '2023-10-15',
      amount: 99,
      status: 'completed',
      description: 'Professional Plan - Monthly',
      method: 'Visa •••• 4242'
    }
  ]
}

const loadInvoices = () => {
  invoices.value = [
    {
      id: 1,
      number: 'INV-2024-001',
      date: '2024-01-15',
      amount: 99,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 2,
      number: 'INV-2023-012',
      date: '2023-12-15',
      amount: 99,
      status: 'paid',
      downloadUrl: '#'
    },
    {
      id: 3,
      number: 'INV-2023-011',
      date: '2023-11-15',
      amount: 99,
      status: 'paid',
      downloadUrl: '#'
    }
  ]
}

const loadPaymentMethods = () => {
  paymentMethods.value = [
    {
      id: 1,
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'card',
      brand: 'Mastercard',
      last4: '8888',
      expiryDate: '06/26',
      isDefault: false
    }
  ]
}

onMounted(() => {
  loadPaymentHistory()
  loadInvoices()
  loadPaymentMethods()
})
</script>

<template>
  <AppLayout>
    <div class="billing-view">
      <!-- Header -->
      <div class="billing-view__header">
        <div>
          <h1 class="billing-view__title">Billing & Subscription</h1>
          <p class="billing-view__subtitle">
            Manage your subscription, invoices, and payment methods
          </p>
        </div>
      </div>

      <!-- Content with Side Menu -->
      <div class="billing-view__content">
        <!-- Side Menu -->
        <div class="billing-view__tabs">
          <button
            :class="[
              'billing-view__tab',
              { 'billing-view__tab--active': activeTab === 'plan' }
            ]"
            @click="activeTab = 'plan'"
          >
            <IconBase name="credit-card" :size="20" />
            <span>Current Plan</span>
          </button>
          <button
            :class="[
              'billing-view__tab',
              { 'billing-view__tab--active': activeTab === 'history' }
            ]"
            @click="activeTab = 'history'"
          >
            <IconBase name="clock" :size="20" />
            <span>Payment History</span>
          </button>
          <button
            :class="[
              'billing-view__tab',
              { 'billing-view__tab--active': activeTab === 'invoices' }
            ]"
            @click="activeTab = 'invoices'"
          >
            <IconBase name="document" :size="20" />
            <span>Invoices & Receipts</span>
          </button>
          <button
            :class="[
              'billing-view__tab',
              { 'billing-view__tab--active': activeTab === 'payment-methods' }
            ]"
            @click="activeTab = 'payment-methods'"
          >
            <IconBase name="key" :size="20" />
            <span>Payment Methods</span>
          </button>
        </div>

        <!-- Content Panel -->
        <div class="billing-view__panel">
          <!-- Current Plan Tab -->
          <div v-if="activeTab === 'plan'" class="billing-view__section">
            <div class="billing-view__section-header">
              <h2 class="billing-view__section-title">Current Plan</h2>
              <p class="billing-view__section-subtitle">
                Your current subscription plan and usage limits
              </p>
            </div>

            <!-- Current Plan Card -->
            <div class="billing-view__plan-card">
              <div class="billing-view__plan-header">
                <div>
                  <h3 class="billing-view__plan-name">{{ currentPlan.name }}</h3>
                  <p class="billing-view__plan-price">
                    {{ formatCurrency(currentPlan.price) }}
                    <span class="billing-view__plan-cycle">/ {{ currentPlan.billingCycle }}</span>
                  </p>
                </div>
                <span class="billing-view__plan-badge billing-view__plan-badge--success">
                  {{ currentPlan.status.charAt(0).toUpperCase() + currentPlan.status.slice(1) }}
                </span>
              </div>
              <p class="billing-view__plan-description">
                Next billing date: {{ formatDate(currentPlan.nextBillingDate) }}
              </p>
            </div>

            <!-- Usage Limits -->
            <div class="billing-view__limits">
              <h3 class="billing-view__limits-title">Usage & Limits</h3>
              <div class="billing-view__limits-grid">
                <div class="billing-view__limit-item">
                  <div class="billing-view__limit-header">
                    <span class="billing-view__limit-label">Users</span>
                    <span class="billing-view__limit-value">
                      {{ currentPlan.usage.users }} / {{ currentPlan.limits.users === -1 ? '∞' : currentPlan.limits.users }}
                    </span>
                  </div>
                  <div class="billing-view__limit-bar">
                    <div
                      :class="['billing-view__limit-bar-fill', `billing-view__limit-bar-fill--${getUsageColor(usagePercentage.users)}`]"
                      :style="{ width: `${Math.min(usagePercentage.users, 100)}%` }"
                    />
                  </div>
                </div>

                <div class="billing-view__limit-item">
                  <div class="billing-view__limit-header">
                    <span class="billing-view__limit-label">Storage</span>
                    <span class="billing-view__limit-value">
                      {{ currentPlan.usage.storage }} GB / {{ currentPlan.limits.storage === -1 ? '∞' : currentPlan.limits.storage }} GB
                    </span>
                  </div>
                  <div class="billing-view__limit-bar">
                    <div
                      :class="['billing-view__limit-bar-fill', `billing-view__limit-bar-fill--${getUsageColor(usagePercentage.storage)}`]"
                      :style="{ width: `${Math.min(usagePercentage.storage, 100)}%` }"
                    />
                  </div>
                </div>

                <div class="billing-view__limit-item">
                  <div class="billing-view__limit-header">
                    <span class="billing-view__limit-label">API Calls</span>
                    <span class="billing-view__limit-value">
                      {{ currentPlan.usage.apiCalls.toLocaleString() }} / {{ currentPlan.limits.apiCalls === -1 ? '∞' : currentPlan.limits.apiCalls.toLocaleString() }}
                    </span>
                  </div>
                  <div class="billing-view__limit-bar">
                    <div
                      :class="['billing-view__limit-bar-fill', `billing-view__limit-bar-fill--${getUsageColor(usagePercentage.apiCalls)}`]"
                      :style="{ width: `${Math.min(usagePercentage.apiCalls, 100)}%` }"
                    />
                  </div>
                </div>

                <div class="billing-view__limit-item">
                  <div class="billing-view__limit-header">
                    <span class="billing-view__limit-label">Projects</span>
                    <span class="billing-view__limit-value">
                      {{ currentPlan.usage.projects }} / {{ currentPlan.limits.projects === -1 ? '∞' : currentPlan.limits.projects }}
                    </span>
                  </div>
                  <div class="billing-view__limit-bar">
                    <div
                      :class="['billing-view__limit-bar-fill', `billing-view__limit-bar-fill--${getUsageColor(usagePercentage.projects)}`]"
                      :style="{ width: `${Math.min(usagePercentage.projects, 100)}%` }"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Available Plans -->
            <div class="billing-view__plans">
              <h3 class="billing-view__plans-title">Available Plans</h3>
              <div class="billing-view__plans-grid">
                <div
                  v-for="plan in availablePlans"
                  :key="plan.id"
                  :class="[
                    'billing-view__plan-option',
                    { 'billing-view__plan-option--current': plan.id === 'professional' },
                    { 'billing-view__plan-option--popular': plan.popular }
                  ]"
                >
                  <div v-if="plan.popular" class="billing-view__plan-popular-badge">
                    Most Popular
                  </div>
                  <h4 class="billing-view__plan-option-name">{{ plan.name }}</h4>
                  <p class="billing-view__plan-option-description">{{ plan.description }}</p>
                  <div class="billing-view__plan-option-price">
                    <span class="billing-view__plan-option-amount">{{ formatCurrency(plan.price) }}</span>
                    <span class="billing-view__plan-option-period">/month</span>
                  </div>
                  <ul class="billing-view__plan-option-features">
                    <li v-for="feature in plan.features" :key="feature">
                      <IconBase name="check" :size="16" />
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                  <BaseButton
                    v-if="plan.id !== 'professional'"
                    :variant="plan.price > currentPlan.price ? 'primary' : 'outline'"
                    full-width
                    @click="plan.price > currentPlan.price ? handleUpgrade(plan) : handleDowngrade(plan)"
                  >
                    {{ plan.price > currentPlan.price ? 'Upgrade' : 'Downgrade' }}
                  </BaseButton>
                  <BaseButton
                    v-else
                    variant="outline"
                    full-width
                    disabled
                  >
                    Current Plan
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment History Tab -->
          <div v-if="activeTab === 'history'" class="billing-view__section">
            <div class="billing-view__section-header">
              <h2 class="billing-view__section-title">Payment History</h2>
              <p class="billing-view__section-subtitle">
                View all your past transactions
              </p>
            </div>

            <div class="billing-view__table-container">
              <table class="billing-view__table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Payment Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="payment in paymentHistory" :key="payment.id">
                    <td>{{ formatDate(payment.date) }}</td>
                    <td>{{ payment.description }}</td>
                    <td class="billing-view__table-amount">{{ formatCurrency(payment.amount) }}</td>
                    <td>{{ payment.method }}</td>
                    <td>
                      <span class="billing-view__status-badge billing-view__status-badge--success">
                        {{ payment.status }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Invoices Tab -->
          <div v-if="activeTab === 'invoices'" class="billing-view__section">
            <div class="billing-view__section-header">
              <h2 class="billing-view__section-title">Invoices & Receipts</h2>
              <p class="billing-view__section-subtitle">
                Download and manage your invoices
              </p>
            </div>

            <div class="billing-view__table-container">
              <table class="billing-view__table">
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="invoice in invoices" :key="invoice.id">
                    <td>{{ invoice.number }}</td>
                    <td>{{ formatDate(invoice.date) }}</td>
                    <td class="billing-view__table-amount">{{ formatCurrency(invoice.amount) }}</td>
                    <td>
                      <span class="billing-view__status-badge billing-view__status-badge--success">
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td>
                      <BaseButton
                        variant="ghost"
                        size="sm"
                        icon="download"
                        @click="downloadInvoice(invoice)"
                      >
                        Download
                      </BaseButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Payment Methods Tab -->
          <div v-if="activeTab === 'payment-methods'" class="billing-view__section">
            <div class="billing-view__section-header">
              <div class="billing-view__section-header-content">
                <div>
                  <h2 class="billing-view__section-title">Payment Methods</h2>
                  <p class="billing-view__section-subtitle">
                    Manage your payment methods
                  </p>
                </div>
                <BaseButton icon="plus" @click="handleAddPaymentMethod">
                  Add Payment Method
                </BaseButton>
              </div>
            </div>

            <div class="billing-view__payment-methods">
              <div
                v-for="method in paymentMethods"
                :key="method.id"
                class="billing-view__payment-method-card"
              >
                <div class="billing-view__payment-method-info">
                  <div class="billing-view__payment-method-icon">
                    <IconBase name="credit-card" :size="24" />
                  </div>
                  <div>
                    <div class="billing-view__payment-method-brand">
                      {{ method.brand }} •••• {{ method.last4 }}
                    </div>
                    <div class="billing-view__payment-method-details">
                      Expires {{ method.expiryDate }}
                    </div>
                  </div>
                </div>
                <div class="billing-view__payment-method-actions">
                  <span
                    v-if="method.isDefault"
                    class="billing-view__payment-method-default"
                  >
                    Default
                  </span>
                  <BaseButton
                    v-else
                    variant="outline"
                    size="sm"
                    @click="setDefaultPaymentMethod(method)"
                  >
                    Set as Default
                  </BaseButton>
                  <BaseButton
                    variant="ghost"
                    size="sm"
                    icon="delete"
                    @click="deletePaymentMethod(method)"
                  >
                    Delete
                  </BaseButton>
                </div>
              </div>

              <div v-if="paymentMethods.length === 0" class="billing-view__empty">
                <IconBase name="credit-card" :size="48" />
                <p>No payment methods added</p>
                <BaseButton icon="plus" @click="handleAddPaymentMethod">
                  Add Payment Method
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upgrade/Downgrade Plan Modal -->
      <BaseModal
        v-model="isUpgradeModalOpen"
        :title="selectedPlan && selectedPlan.price > currentPlan.price ? 'Upgrade Plan' : 'Downgrade Plan'"
        size="md"
      >
        <div v-if="selectedPlan" class="billing-view__modal-content">
          <p class="billing-view__modal-text">
            Are you sure you want to {{ selectedPlan.price > currentPlan.price ? 'upgrade' : 'downgrade' }} to the <strong>{{ selectedPlan.name }}</strong> plan?
          </p>
          <div class="billing-view__modal-plan-details">
            <div class="billing-view__modal-plan-detail">
              <span class="billing-view__modal-plan-detail-label">New Price:</span>
              <span class="billing-view__modal-plan-detail-value">{{ formatCurrency(selectedPlan.price) }}/month</span>
            </div>
            <div class="billing-view__modal-plan-detail">
              <span class="billing-view__modal-plan-detail-label">Current Price:</span>
              <span class="billing-view__modal-plan-detail-value">{{ formatCurrency(currentPlan.price) }}/month</span>
            </div>
          </div>
          <p class="billing-view__modal-warning">
            Your plan will be updated immediately. {{ selectedPlan.price > currentPlan.price ? 'You will be charged the difference prorated for the remaining billing period.' : 'Downgrades will take effect at the end of your current billing period.' }}
          </p>
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isUpgradeModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="confirmPlanChange">
            Confirm {{ selectedPlan && selectedPlan.price > currentPlan.price ? 'Upgrade' : 'Downgrade' }}
          </BaseButton>
        </template>
      </BaseModal>

      <!-- Add Payment Method Modal -->
      <BaseModal
        v-model="isPaymentMethodModalOpen"
        title="Add Payment Method"
        size="md"
      >
        <div class="billing-view__modal-content">
          <BaseSelect
            v-model="newPaymentMethod.type"
            label="Payment Method Type"
            :options="[
              { label: 'Credit Card', value: 'card' },
              { label: 'Debit Card', value: 'debit' }
            ]"
            size="sm"
          />
          <BaseInput
            v-model="newPaymentMethod.cardNumber"
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            :error="newPaymentMethod.errors.cardNumber"
            size="sm"
            required
          />
          <div class="billing-view__form-grid">
            <BaseInput
              v-model="newPaymentMethod.expiryDate"
              label="Expiry Date"
              placeholder="MM/YY"
              :error="newPaymentMethod.errors.expiryDate"
              size="sm"
              required
            />
            <BaseInput
              v-model="newPaymentMethod.cvv"
              label="CVV"
              placeholder="123"
              type="password"
              :error="newPaymentMethod.errors.cvv"
              size="sm"
              required
            />
          </div>
          <BaseInput
            v-model="newPaymentMethod.cardholderName"
            label="Cardholder Name"
            placeholder="John Doe"
            :error="newPaymentMethod.errors.cardholderName"
            size="sm"
            required
          />
          <BaseInput
            v-model="newPaymentMethod.billingAddress"
            label="Billing Address"
            placeholder="123 Main St, City, State, ZIP"
            size="sm"
          />
        </div>
        <template #footer>
          <BaseButton variant="ghost" @click="isPaymentMethodModalOpen = false">
            Cancel
          </BaseButton>
          <BaseButton @click="savePaymentMethod">
            Add Payment Method
          </BaseButton>
        </template>
      </BaseModal>
    </div>
  </AppLayout>
</template>

<style scoped>
.billing-view {
  padding: var(--spacing-xl);
}

.billing-view__header {
  background-color: rgb(var(--color-surface));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.billing-view__title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.billing-view__subtitle {
  font-size: var(--font-size-md);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.billing-view__content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

.billing-view__tabs {
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

.billing-view__tab {
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

.billing-view__tab:hover {
  background-color: rgb(var(--color-surface-hover));
  color: rgb(var(--color-text-primary));
}

.billing-view__tab--active {
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
}

.billing-view__panel {
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-xl);
  border: 1px solid rgb(var(--color-border));
  padding: var(--spacing-xl);
}

.billing-view__section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.billing-view__section-header {
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgb(var(--color-border));
}

.billing-view__section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.billing-view__section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.billing-view__section-subtitle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Current Plan */
.billing-view__plan-card {
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
}

.billing-view__plan-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.billing-view__plan-name {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-xs) 0;
}

.billing-view__plan-price {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.billing-view__plan-cycle {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  font-weight: var(--font-weight-normal);
}

.billing-view__plan-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.billing-view__plan-badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

.billing-view__plan-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

/* Usage Limits */
.billing-view__limits {
  margin-top: var(--spacing-xl);
}

.billing-view__limits-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-lg) 0;
}

.billing-view__limits-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.billing-view__limit-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.billing-view__limit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.billing-view__limit-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
}

.billing-view__limit-value {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.billing-view__limit-bar {
  width: 100%;
  height: 8px;
  background-color: rgb(var(--color-surface-secondary));
  border-radius: var(--radius-full);
  overflow: hidden;
}

.billing-view__limit-bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width var(--transition-base) ease;
}

.billing-view__limit-bar-fill--success {
  background-color: rgb(var(--color-success));
}

.billing-view__limit-bar-fill--warning {
  background-color: rgb(var(--color-warning));
}

.billing-view__limit-bar-fill--error {
  background-color: rgb(var(--color-error));
}

/* Available Plans */
.billing-view__plans {
  margin-top: var(--spacing-xl);
}

.billing-view__plans-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0 0 var(--spacing-lg) 0;
}

.billing-view__plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}

.billing-view__plan-option {
  position: relative;
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.billing-view__plan-option--current {
  border-color: rgb(var(--color-primary));
  border-width: 2px;
}

.billing-view__plan-option--popular {
  border-color: rgb(var(--color-primary));
}

.billing-view__plan-popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: rgb(var(--color-primary));
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-full);
}

.billing-view__plan-option-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
  margin: 0;
}

.billing-view__plan-option-description {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
  margin: 0;
}

.billing-view__plan-option-price {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-xs);
}

.billing-view__plan-option-amount {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: rgb(var(--color-text-primary));
}

.billing-view__plan-option-period {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.billing-view__plan-option-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.billing-view__plan-option-features li {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
}

.billing-view__plan-option-features li svg {
  color: rgb(var(--color-success));
  flex-shrink: 0;
}

/* Tables */
.billing-view__table-container {
  overflow-x: auto;
}

.billing-view__table {
  width: 100%;
  border-collapse: collapse;
}

.billing-view__table thead {
  background-color: rgb(var(--color-surface-secondary));
}

.billing-view__table th {
  padding: var(--spacing-md);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgb(var(--color-border));
}

.billing-view__table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid rgb(var(--color-border));
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-primary));
}

.billing-view__table-amount {
  font-weight: var(--font-weight-semibold);
}

.billing-view__status-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.billing-view__status-badge--success {
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
}

/* Payment Methods */
.billing-view__payment-methods {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.billing-view__payment-method-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background-color: rgb(var(--color-surface-secondary));
  border: 1px solid rgb(var(--color-border));
  border-radius: var(--radius-lg);
}

.billing-view__payment-method-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.billing-view__payment-method-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgb(var(--color-primary-light));
  color: rgb(var(--color-primary));
  border-radius: var(--radius-md);
}

.billing-view__payment-method-brand {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  color: rgb(var(--color-text-primary));
  margin-bottom: var(--spacing-xs);
}

.billing-view__payment-method-details {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.billing-view__payment-method-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.billing-view__payment-method-default {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(var(--color-success-rgb), 0.1);
  color: rgb(var(--color-success));
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.billing-view__empty {
  text-align: center;
  padding: var(--spacing-2xl);
  color: rgb(var(--color-text-secondary));
}

.billing-view__empty svg {
  margin: 0 auto var(--spacing-md);
  opacity: 0.5;
}

/* Modal */
.billing-view__modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.billing-view__modal-text {
  margin: 0;
  color: rgb(var(--color-text-primary));
}

.billing-view__modal-plan-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: rgb(var(--color-surface-secondary));
  border-radius: var(--radius-md);
}

.billing-view__modal-plan-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.billing-view__modal-plan-detail-label {
  font-size: var(--font-size-sm);
  color: rgb(var(--color-text-secondary));
}

.billing-view__modal-plan-detail-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: rgb(var(--color-text-primary));
}

.billing-view__modal-warning {
  margin: 0;
  padding: var(--spacing-md);
  background-color: rgba(var(--color-warning-rgb), 0.1);
  border: 1px solid rgba(var(--color-warning-rgb), 0.2);
  border-radius: var(--radius-md);
  color: rgb(var(--color-warning));
  font-size: var(--font-size-sm);
}

.billing-view__form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .billing-view {
    padding: var(--spacing-md);
  }

  .billing-view__content {
    grid-template-columns: 1fr;
  }

  .billing-view__tabs {
    position: static;
    flex-direction: row;
    overflow-x: auto;
  }

  .billing-view__plans-grid {
    grid-template-columns: 1fr;
  }

  .billing-view__form-grid {
    grid-template-columns: 1fr;
  }

  .billing-view__section-header-content {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>
