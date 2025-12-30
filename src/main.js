/**
 * Main Application Entry Point
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'
import './style.css'

// Create app instance
const app = createApp(App)

// Create Pinia instance
const pinia = createPinia()

// Register plugins
app.use(pinia)
app.use(router)
app.use(VueApexCharts)

// Initialize theme before mounting
import { useThemeStore } from './stores/theme'
const themeStore = useThemeStore()
themeStore.initializeTheme()

// Mount app
app.mount('#app')
