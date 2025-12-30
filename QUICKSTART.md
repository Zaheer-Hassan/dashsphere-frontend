# DashSphere Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v20.19.0 or higher
- npm or yarn

### Installation

```bash
# 1. Navigate to project directory
cd dashsphere-frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will open at `http://localhost:3000`

### 🎯 First Login

Use any email and password to log in (demo mode):
- Email: `admin@example.com`
- Password: `password`

## 📖 Quick Tour

### 1. Dashboard
After login, you'll see the main dashboard with:
- **KPI Cards**: Key metrics with trends
- **Charts**: User activity, revenue, traffic sources
- **Responsive Layout**: Works on all devices

### 2. Navigation
- **Sidebar**: Main navigation (collapsible)
- **Header**: Theme toggle, notifications, user menu
- **Mobile**: Tap menu icon to open sidebar

### 3. Theme Switching
Click the sun/moon icon in the header to toggle dark/light mode.

### 4. Explore Pages
Navigate through:
- **Analytics**: Advanced charts and metrics
- **Users**: User management (permission required)
- **Billing**: Subscription and invoices
- **Settings**: App preferences

## 🛠️ Common Tasks

### Creating a New Component

```vue
<!-- src/components/example/MyComponent.vue -->
<script setup>
import { ref } from 'vue'
import { BaseButton } from '@/components/base'

const count = ref(0)
</script>

<template>
  <div class="my-component">
    <p>Count: {{ count }}</p>
    <BaseButton @click="count++">Increment</BaseButton>
  </div>
</template>

<style scoped>
.my-component {
  padding: var(--spacing-md);
  background-color: rgb(var(--color-surface));
  border-radius: var(--radius-lg);
}
</style>
```

### Adding a New Page

1. **Create View**:
```bash
src/views/example/ExampleView.vue
```

2. **Add Route**:
```javascript
// src/router/index.js
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/ExampleView.vue'),
  meta: { requiresAuth: true, title: 'Example' }
}
```

3. **Add to Navigation**:
```javascript
// src/components/layout/AppLayout.vue
// Add to navigationItems computed property
```

### Using Base Components

```vue
<script setup>
import {
  BaseButton,
  BaseInput,
  BaseToggle,
  BaseSelect
} from '@/components/base'

const form = ref({
  name: '',
  email: '',
  active: false,
  role: ''
})
</script>

<template>
  <BaseInput
    v-model="form.name"
    label="Name"
    placeholder="Enter name"
  />
  
  <BaseInput
    v-model="form.email"
    type="email"
    label="Email"
    icon="mail"
  />
  
  <BaseToggle
    v-model="form.active"
    label="Active"
  />
  
  <BaseSelect
    v-model="form.role"
    :options="[
      { label: 'Admin', value: 'admin' },
      { label: 'User', value: 'user' }
    ]"
    label="Role"
  />
  
  <BaseButton @click="submit">Submit</BaseButton>
</template>
```

### Adding Charts

```vue
<script setup>
import { LineChart, BarChart, PieChart } from '@/components/charts'

const lineData = {
  series: [
    { name: 'Sales', data: [30, 40, 35, 50, 49, 60, 70] }
  ],
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}

const pieData = {
  series: [44, 55, 41, 17, 15],
  labels: ['A', 'B', 'C', 'D', 'E']
}
</script>

<template>
  <LineChart
    :series="lineData.series"
    :categories="lineData.categories"
    title="Weekly Sales"
  />
  
  <PieChart
    :series="pieData.series"
    :labels="pieData.labels"
    title="Distribution"
  />
</template>
```

### Permission Checking

```vue
<script setup>
import { usePermissions } from '@/composables'

const { canEditUsers, canViewBilling, can } = usePermissions()
</script>

<template>
  <!-- Show/hide based on permission -->
  <BaseButton v-if="canEditUsers">Edit User</BaseButton>
  
  <!-- Custom permission -->
  <div v-if="can('custom:permission')">
    Protected content
  </div>
</template>
```

### Working with Modals

```vue
<script setup>
import { useModal } from '@/composables'
import BaseModal from '@/components/modals/BaseModal.vue'

const { isOpen, openModal, closeModal } = useModal()

const handleConfirm = () => {
  // Do something
  closeModal()
}
</script>

<template>
  <BaseButton @click="openModal()">Open Modal</BaseButton>
  
  <BaseModal
    v-model="isOpen"
    title="Confirmation"
    @confirm="handleConfirm"
  >
    <p>Are you sure?</p>
  </BaseModal>
</template>
```

### Showing Notifications

```vue
<script setup>
import { useNotifications } from '@/composables'

const { showSuccess, showError, showWarning } = useNotifications()

const handleAction = async () => {
  try {
    await someApiCall()
    showSuccess('Action completed successfully!')
  } catch (error) {
    showError('Something went wrong')
  }
}
</script>
```

### Theme Customization

Edit `src/style.css`:

```css
:root {
  /* Change primary color */
  --color-primary: 59 130 246; /* Your RGB values */
  
  /* Change fonts */
  --font-family-base: 'Your Font', sans-serif;
  
  /* Change spacing */
  --spacing-md: 1rem;
}
```

## 🎨 Styling Best Practices

```vue
<style scoped>
/* ✅ Good: Use CSS variables */
.component {
  background-color: rgb(var(--color-surface));
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
}

/* ❌ Bad: Hardcoded values */
.component {
  background-color: #ffffff;
  padding: 16px;
  border-radius: 8px;
}
</style>
```

## 🔧 Configuration

### Environment Variables

Create `.env`:
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=DashSphere
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

### API Integration

```javascript
// src/api/client.js is already configured
// Just import and use:

import apiClient from '@/api/client'

const fetchData = async () => {
  const response = await apiClient.get('/endpoint')
  return response.data
}
```

## 📚 Project Structure Quick Reference

```
src/
├── components/base/     → Reusable UI components
├── components/charts/   → Chart components
├── components/layout/   → Layout components
├── composables/         → Business logic hooks
├── stores/             → Pinia state stores
├── views/              → Page components
├── router/             → Route configuration
├── constants/          → App constants
└── api/                → API client
```

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
```

### Build Errors
```bash
# Clean and rebuild
npm run build -- --force
```

## 📖 Next Steps

1. **Read**: `ARCHITECTURE.md` for in-depth understanding
2. **Explore**: Base components in `src/components/base/`
3. **Study**: Stores and composables
4. **Customize**: Theme in `src/style.css`
5. **Build**: Your features following the patterns

## 💡 Tips

1. **Always use base components** - Never recreate buttons, inputs, etc.
2. **Check permissions** - Gate features by user permissions
3. **Be tenant-aware** - All data operations should consider tenant context
4. **Follow patterns** - Copy existing patterns for consistency
5. **Use composables** - Extract logic from components

## 🎓 Learning Path

1. Start with `src/views/dashboard/DashboardView.vue`
2. Study how it uses KPI cards and charts
3. Look at `src/components/base/` to understand base components
4. Check `src/stores/` to understand state management
5. Review `src/composables/` for business logic patterns

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

Build output will be in `dist/` directory.

---

**Need Help?** Check `ARCHITECTURE.md` for detailed documentation.

**Ready to Build?** Start by exploring the existing pages and components!

