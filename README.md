# DashSphere - Enterprise Multi-Tenant SaaS Platform

A full-fledged, enterprise-grade, multi-tenant SaaS application built with Vue 3, following strict architectural patterns and best practices.

## 🚀 Features

### Core Features
- **Multi-Tenant Architecture**: Complete tenant isolation and context management
- **Role-Based Access Control (RBAC)**: Granular permissions system
- **Subscription & Billing**: Plan management and usage tracking
- **Analytics & Reporting**: Advanced charts and KPI dashboards
- **Notifications**: In-app, tenant-aware notification system
- **Integrations**: Third-party service connections
- **Theme System**: Dark/Light mode with centralized CSS variables

### Technology Stack
- **Vue 3** (Composition API with `<script setup>`)
- **Vite** (Build tool)
- **Tailwind CSS** (Utility-first CSS with custom theme)
- **Pinia** (State management)
- **Vue Router** (Permission-based routing)
- **Axios** (HTTP client with tenant-aware interceptors)
- **ApexCharts** (Interactive charts)

## 📁 Project Structure

```
src/
├── api/                    # API client with interceptors
│   └── client.js
├── assets/                 # Static assets
├── components/
│   ├── base/              # Reusable base components
│   │   ├── IconBase.vue
│   │   ├── BaseButton.vue
│   │   ├── BaseInput.vue
│   │   ├── BaseToggle.vue
│   │   └── ...
│   ├── charts/            # Chart components
│   │   ├── BaseChart.vue
│   │   ├── LineChart.vue
│   │   ├── BarChart.vue
│   │   └── ...
│   ├── dashboard/         # Dashboard-specific components
│   ├── layout/            # Layout components
│   │   └── AppLayout.vue
│   └── modals/            # Modal components
│       ├── BaseModal.vue
│       └── DeleteConfirmModal.vue
├── composables/           # Vue composables
│   ├── useAuth.js
│   ├── useTenant.js
│   ├── useTheme.js
│   └── ...
├── constants/             # App constants
│   ├── roles.js
│   ├── plans.js
│   ├── api.js
│   └── ...
├── router/                # Vue Router configuration
│   └── index.js
├── stores/                # Pinia stores
│   ├── auth.js
│   ├── tenant.js
│   ├── theme.js
│   └── notifications.js
├── views/                 # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── analytics/
│   └── ...
├── style.css              # Centralized theme & global styles
├── App.vue
└── main.js
```

## 🏗️ Architecture Principles

### 1. Multi-Tenancy
- Every API request includes tenant context
- Data isolation enforced at all levels
- Tenant-specific features and limits
- Subdomain or tenant ID-based routing

### 2. Permission System
- Route-level permission guards
- Component-level permission checks
- Role hierarchy support
- Custom permissions per tenant

### 3. State Management
- Pinia stores for global state
- Composables for business logic
- No API calls in components
- Centralized error handling

### 4. Component Architecture
- Reusable base components
- Props, emits, and slots for flexibility
- No duplicated UI logic
- Dynamic, config-driven components

### 5. Theme System
- CSS variables for all styling
- Dark/Light mode support
- Theme persistence
- One file updates entire app

## 🚀 Getting Started

### Prerequisites
- Node.js (v20.19.0 or higher recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

## 🔑 Default Access

For demo purposes, you can use any email/password combination to log in. The application will authenticate with mock data.

## 🎨 Theme Customization

All theme variables are defined in `src/style.css`. To customize:

1. Edit CSS variables in `:root` (light mode) or `[data-theme="dark"]` (dark mode)
2. Changes apply instantly across the entire application
3. Use `rgb(var(--color-name))` format for all colors

## 📊 Analytics & Charts

Charts are built with ApexCharts and wrapped in reusable components:
- **LineChart**: Trend analysis
- **BarChart**: Comparisons
- **PieChart**: Distributions
- **AreaChart**: Cumulative data

All charts support:
- Theme-aware colors
- Responsive design
- Interactive tooltips
- Export functionality

## 🔐 Security Features

- JWT token authentication
- Automatic token refresh
- Permission-based access control
- Tenant context isolation
- Secure API interceptors
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Responsive sidebar navigation
- Adaptive layouts
- Touch-friendly interfaces

## 🧪 Best Practices Implemented

- ✅ Composition API with `<script setup>`
- ✅ Centralized state management
- ✅ Permission-based routing
- ✅ Lazy-loaded routes
- ✅ Component code splitting
- ✅ Optimized build output
- ✅ Type-safe props validation
- ✅ Consistent naming conventions
- ✅ No magic values
- ✅ Scalable architecture

## 🤝 Contributing

This is an enterprise template. Follow the established patterns:
1. Use base components (never recreate)
2. Follow naming conventions
3. Keep components focused
4. Extract logic to composables
5. Use constants for magic values
6. Add permission checks to new routes
7. Ensure tenant-aware data handling

## 📄 License

MIT License - feel free to use this template for your projects.

## 🙋 Support

For questions or issues, please refer to the inline documentation in the codebase.

---

Built with ❤️ using Vue 3 and modern web technologies.
