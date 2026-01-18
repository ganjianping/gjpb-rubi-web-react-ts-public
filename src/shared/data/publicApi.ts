import type { AppSetting, AppSettingsResponse, VocabularyResponse, VocabularyFilters } from './types'

// Remove trailing slash from base URL to prevent double slashes
const API_BASE_URL = (import.meta.env.VITE_PUBLIC_API_BASE_URL || '/v1/public').replace(/\/$/, '')

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

/**
 * Fetch vocabularies with filters
 * @param filters - Query parameters for filtering vocabularies
 * @returns Promise<VocabularyResponse>
 */
export async function fetchVocabularies(filters: VocabularyFilters = {}): Promise<VocabularyResponse> {
  const params = new URLSearchParams()
  
  if (filters.term !== undefined) params.append('term', filters.term.toString())
  if (filters.week !== undefined) params.append('week', filters.week.toString())
  if (filters.lang) params.append('lang', filters.lang)
  if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel)
  params.append('page', (filters.page ?? 0).toString())
  params.append('size', (filters.size ?? 20).toString())
  
  const response = await fetch(`${API_BASE_URL}/vocabulary-rus?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  return await response.json()
}
