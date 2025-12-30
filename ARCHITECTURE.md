# DashSphere Architecture Documentation

## 🏗️ System Overview

DashSphere is an enterprise-grade, multi-tenant SaaS platform built with Vue 3, designed to support multiple organizations with strict data isolation, role-based permissions, and scalable architecture.

## 🎯 Core Architectural Principles

### 1. Multi-Tenancy (CRITICAL)

Every aspect of the application is tenant-aware:

#### Tenant Context Management
- **Tenant Store** (`stores/tenant.js`): Central tenant state management
- **Tenant ID Injection**: Automatically added to all API requests via Axios interceptors
- **Tenant Isolation**: No cross-tenant data access allowed
- **Tenant Loading**: Can be loaded from:
  - Subdomain (e.g., `acme.dashsphere.com`)
  - Tenant ID in localStorage
  - Auth token claims

#### Tenant Configuration
Each tenant has:
```javascript
{
  id: 'tenant-1',
  name: 'Acme Corporation',
  slug: 'acme',
  settings: {},                    // Custom settings
  features: [],                    // Enabled features
  limits: {                        // Usage limits
    maxUsers: 50,
    maxStorage: 100,
    maxApiCalls: 100000
  },
  theme: {},                       // Custom branding
  subscription: {}                 // Plan details
}
```

### 2. Authentication & Authorization

#### Authentication Flow
1. User logs in → `useAuth().login()`
2. Auth store saves user + tokens → localStorage
3. Axios interceptor adds `Authorization: Bearer {token}` to all requests
4. Token refresh handled automatically on 401 responses

#### Role-Based Access Control (RBAC)
- **Roles**: Super Admin, Tenant Owner, Tenant Admin, Manager, User, Viewer, Guest
- **Permissions**: Granular permission system (see `constants/roles.js`)
- **Hierarchy**: Roles inherit permissions from lower roles

#### Permission Checking
```javascript
// In composable
const { can, canViewUsers, canEditUsers } = usePermissions()

// In component
<BaseButton v-if="canEditUsers">Edit</BaseButton>

// In route
meta: { permissions: [PERMISSIONS.USERS_EDIT] }
```

### 3. State Management Architecture

#### Pinia Stores
- **auth.js**: User authentication state
- **tenant.js**: Tenant context and configuration
- **theme.js**: Theme preferences (dark/light)
- **notifications.js**: In-app notifications

#### Store Pattern
```javascript
export const useXStore = defineStore('x', () => {
  // State (ref)
  const data = ref(null)
  
  // Getters (computed)
  const processedData = computed(() => transform(data.value))
  
  // Actions (functions)
  const loadData = async () => { /* ... */ }
  
  return { data, processedData, loadData }
})
```

### 4. Composables (Business Logic)

Composables wrap stores and provide business logic:

```javascript
// useAuth.js
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  
  const login = async (credentials) => {
    const result = await authStore.login(credentials)
    if (result.success) router.push('/dashboard')
    return result
  }
  
  return { login, logout, user, hasPermission }
}
```

**Available Composables:**
- `useAuth()`: Authentication logic
- `useTenant()`: Tenant management
- `useTheme()`: Theme switching
- `usePermissions()`: Permission checks
- `useNotifications()`: Toast notifications
- `useModal()`: Modal state management

### 5. Component Architecture

#### Base Components (Atomic Design)
All UI elements use base components - NEVER recreate:

**Available Base Components:**
- `BaseButton`: All button variations
- `BaseInput`: Text inputs with validation
- `BaseToggle`: Switch/toggle component
- `BaseSelect`: Dropdown select
- `BaseSearch`: Search input with debounce
- `BaseDropdown`: Dropdown menu
- `BasePagination`: Pagination controls
- `BaseLoader`: Loading spinner
- `BaseSnackbar`: Toast notifications

**Modal System:**
- `BaseModal`: Generic modal with slots
- `DeleteConfirmModal`: Delete confirmation

**Icon System:**
- `IconBase`: SVG icon system (50+ icons)

#### Component Rules
1. **Props Down, Events Up**: Use props and emits
2. **Slots for Flexibility**: Allow content injection
3. **No Business Logic**: Keep components presentational
4. **Reusability First**: Think generic, not specific

### 6. Chart System

Built on ApexCharts with theme integration:

```vue
<LineChart
  :series="[{ name: 'Sales', data: [30, 40, 35] }]"
  :categories="['Jan', 'Feb', 'Mar']"
  title="Monthly Sales"
  smooth
/>
```

**Available Charts:**
- `LineChart`: Trend analysis
- `BarChart`: Comparisons (supports horizontal, stacked)
- `PieChart`: Distribution (supports donut mode)
- `AreaChart`: Cumulative trends
- `BaseChart`: Generic wrapper

**Features:**
- Auto theme switching (dark/light)
- Responsive design
- Interactive tooltips
- Export functionality

### 7. Router Architecture

#### Route Structure
```javascript
{
  path: '/users',
  component: () => import('@/views/users/UsersView.vue'),
  meta: {
    requiresAuth: true,
    permissions: [PERMISSIONS.USERS_VIEW],
    title: 'Users'
  }
}
```

#### Navigation Guards
1. **Authentication Check**: Redirect to login if not authenticated
2. **Permission Check**: Verify user has required permissions
3. **Tenant Context**: Ensure tenant is loaded
4. **Page Title**: Set document title

### 8. API Client Architecture

#### Axios Configuration
```javascript
// Automatic tenant context injection
config.headers['X-Tenant-ID'] = tenantId
config.headers['Authorization'] = `Bearer ${token}`

// Global error handling
- 401 → Refresh token or logout
- 403 → Show permission error
- 500 → Show server error
```

#### Making API Calls
```javascript
// In a composable or store
import apiClient from '@/api/client'

const fetchUsers = async () => {
  const response = await apiClient.get('/users')
  return response.data
}
```

### 9. Theme System

#### CSS Variables Architecture
All styling uses CSS variables defined in `src/style.css`:

```css
:root {
  --color-primary: 59 130 246;
  --color-surface: 255 255 255;
  /* ... */
}

[data-theme="dark"] {
  --color-surface: 31 41 55;
  /* ... */
}
```

#### Usage in Components
```css
.component {
  background-color: rgb(var(--color-surface));
  color: rgb(var(--color-text-primary));
}
```

#### Theme Switching
```javascript
const { toggleTheme, isDark, setTheme } = useTheme()

toggleTheme() // Switch between light/dark
setTheme(THEMES.DARK) // Set specific theme
```

### 10. Notification System

#### Types
- **Toast Notifications**: Temporary messages (auto-dismiss)
- **In-App Notifications**: Persistent notification center

#### Usage
```javascript
const { showSuccess, showError, showWarning } = useNotifications()

showSuccess('User created successfully!')
showError('Failed to save changes')
```

#### Features
- Tenant-scoped notifications
- Priority levels (low, medium, high, urgent)
- Categories (system, user, billing, security)
- Read/unread tracking

## 🔐 Security Features

### 1. Authentication Security
- JWT tokens stored in localStorage
- Automatic token refresh
- Secure token transmission
- Logout on token expiration

### 2. Authorization Security
- Route-level permission guards
- Component-level permission checks
- API-level authorization
- No client-side permission bypass possible

### 3. Tenant Isolation
- Tenant ID in every API request
- Server-side tenant validation required
- No shared data between tenants
- Tenant context validation

### 4. XSS Prevention
- Vue's built-in XSS protection
- Sanitized user inputs
- Safe HTML rendering

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Mobile Features
- Collapsible sidebar
- Touch-friendly buttons
- Responsive tables
- Adaptive charts

## 🎨 Styling Guidelines

### Rules
1. **CSS Variables Only**: Never use hardcoded colors
2. **Tailwind Classes**: Use for layout and spacing
3. **Scoped Styles**: Component-specific styles in `<style scoped>`
4. **No Inline Styles**: Except dynamic computed values

### Color Usage
```css
/* Correct */
background-color: rgb(var(--color-primary));

/* Wrong */
background-color: #3b82f6;
```

## 🚀 Performance Optimizations

### 1. Code Splitting
- Lazy-loaded routes
- Dynamic component imports
- Vendor chunk separation

### 2. Build Optimizations
- Tree shaking
- Minification
- Sourcemap generation (dev only)

### 3. Runtime Optimizations
- Computed properties for derived state
- Debounced search inputs
- Virtualized lists (when needed)
- Chart rendering optimization

## 📊 Data Flow

```
User Action → Component Event → Composable → Store → API Client → Backend
                                    ↓
                              Update Store
                                    ↓
                            Reactive Update
                                    ↓
                               Component
```

## 🧪 Best Practices

### Component Development
1. Use `<script setup>` syntax
2. Define props with validation
3. Emit events for parent communication
4. Use slots for content projection
5. Keep components under 300 lines

### State Management
1. Use stores for global state only
2. Use composables for shared logic
3. Use local `ref`/`reactive` for component state
4. Never mutate props directly

### Performance
1. Use `computed` for derived data
2. Avoid unnecessary watchers
3. Lazy load heavy components
4. Use `v-show` vs `v-if` appropriately

### Code Quality
1. Consistent naming (camelCase for JS, kebab-case for files)
2. One component per file
3. Extract magic values to constants
4. Comment complex logic
5. Use TypeScript for critical logic (optional)

## 🔄 Adding New Features

### Adding a New Page
1. Create view in `src/views/`
2. Add route in `src/router/index.js`
3. Add navigation item in `AppLayout.vue`
4. Add permission check if needed

### Adding a New Component
1. Determine if it should be a base component
2. Create in appropriate `components/` subdirectory
3. Export from index file if reusable
4. Document props and emits

### Adding a New Store
1. Create in `src/stores/`
2. Follow composition API pattern
3. Create corresponding composable
4. Export from `stores/index.js`

### Adding a New Permission
1. Add to `constants/roles.js`
2. Add to role mappings
3. Use in route meta or component checks

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| `src/main.js` | App initialization |
| `src/App.vue` | Root component |
| `src/style.css` | Global styles & theme |
| `src/router/index.js` | Route definitions |
| `src/api/client.js` | API configuration |
| `src/constants/` | App-wide constants |

## 🎓 Learning Resources

To understand this architecture:
1. Study the stores → Learn state management
2. Study composables → Learn logic extraction
3. Study base components → Learn reusability
4. Study router guards → Learn security
5. Study the theme system → Learn CSS architecture

## 🤔 Common Patterns

### Loading States
```vue
<script setup>
const loading = ref(false)
const data = ref(null)

onMounted(async () => {
  loading.value = true
  data.value = await fetchData()
  loading.value = false
})
</script>

<template>
  <BaseLoader v-if="loading" />
  <div v-else>{{ data }}</div>
</template>
```

### Permission-Gated UI
```vue
<script setup>
const { canEditUsers } = usePermissions()
</script>

<template>
  <BaseButton v-if="canEditUsers" @click="edit">
    Edit User
  </BaseButton>
</template>
```

### Modal Management
```vue
<script setup>
const { isOpen, openModal, closeModal } = useModal()
</script>

<template>
  <BaseButton @click="openModal()">Open</BaseButton>
  <BaseModal v-model="isOpen" title="Modal">
    Content here
  </BaseModal>
</template>
```

---

This architecture ensures scalability, maintainability, and enterprise-grade quality. Follow these patterns consistently for best results.

