/**
 * useTheme Composable
 * Provides theme management functionality
 */

import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { THEMES } from '@/constants'

export function useTheme() {
  const themeStore = useThemeStore()
  
  // Computed properties
  const currentTheme = computed(() => themeStore.theme)
  const isDark = computed(() => themeStore.isDark())
  const isLight = computed(() => themeStore.isLight())
  
  // Methods
  const setTheme = (theme) => {
    themeStore.setTheme(theme)
  }
  
  const toggleTheme = () => {
    themeStore.toggleTheme()
  }
  
  const setLightMode = () => {
    setTheme(THEMES.LIGHT)
  }
  
  const setDarkMode = () => {
    setTheme(THEMES.DARK)
  }
  
  const setSystemMode = () => {
    setTheme(THEMES.SYSTEM)
  }
  
  return {
    // State
    currentTheme,
    isDark,
    isLight,
    
    // Actions
    setTheme,
    toggleTheme,
    setLightMode,
    setDarkMode,
    setSystemMode,
    
    // Constants
    THEMES
  }
}

