import type { AppSetting, AppSettingsResponse } from './types'

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_BASE_URL || '/v1/public'

/**
 * Fetch app settings from the API
 * @returns Promise<AppSetting[]>
 */
export async function fetchAppSettings(): Promise<AppSetting[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/app-settings`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result: AppSettingsResponse = await response.json()
    
    if (result.status.code !== 200) {
      throw new Error(result.status.message || 'Failed to fetch app settings')
    }
    
    return result.data
  } catch (error) {
    console.error('Error fetching app settings:', error)
    
    // Return fallback data if API fails
    return [
      { name: 'app_version', value: '1.0.0', lang: 'EN' },
      { name: 'app_version', value: '1.0.0', lang: 'ZH' },
    ]
  }
}

/**
 * Generic API fetch helper
 * @param endpoint - API endpoint path
 * @returns Promise<T>
 */
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const result = await response.json()
  
  if (result.status?.code !== 200) {
    throw new Error(result.status?.message || 'API request failed')
  }
  
  return result.data
}
