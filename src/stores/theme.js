/**
 * Theme Store - Manages Dark/Light Mode
 */

import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { THEMES, STORAGE_KEYS } from '@/constants'

export const useThemeStore = defineStore('theme', () => {
  // State
  const theme = ref(THEMES.LIGHT)
  const systemTheme = ref(THEMES.LIGHT)
  
  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
    
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      theme.value = savedTheme
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      theme.value = prefersDark ? THEMES.DARK : THEMES.LIGHT
    }
    
    applyTheme()
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      systemTheme.value = e.matches ? THEMES.DARK : THEMES.LIGHT
      if (theme.value === THEMES.SYSTEM) {
        applyTheme()
      }
    })
  }
  
  // Apply theme to document
  const applyTheme = () => {
    const effectiveTheme = theme.value === THEMES.SYSTEM ? systemTheme.value : theme.value
    
    if (effectiveTheme === THEMES.DARK) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }
  
  // Actions
  const setTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      theme.value = newTheme
      localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
      applyTheme()
    }
  }
  
  const toggleTheme = () => {
    const newTheme = theme.value === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    setTheme(newTheme)
  }
  
  // Getters
  const isDark = () => {
    const effectiveTheme = theme.value === THEMES.SYSTEM ? systemTheme.value : theme.value
    return effectiveTheme === THEMES.DARK
  }
  
  const isLight = () => !isDark()
  
  return {
    // State
    theme,
    systemTheme,
    
    // Actions
    initializeTheme,
    setTheme,
    toggleTheme,
    
    // Getters
    isDark,
    isLight
  }
})

