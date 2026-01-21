import type { AppSetting, AppSettingsResponse, VocabularyResponse, VocabularyFilters } from './types'

// Remove trailing slash from base URL to prevent double slashes
const API_BASE_URL = (import.meta.env.VITE_PUBLIC_API_BASE_URL || '/v1/public').replace(/\/$/, '')

const APP_SETTINGS_CACHE_KEY = 'gjp_app_settings_cache'
const APP_SETTINGS_CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

interface CachedAppSettings {
  data: AppSetting[]
  timestamp: number
}

/**
 * Fetch app settings from the API with local storage caching
 * @returns Promise<AppSetting[]>
 */
export async function fetchAppSettings(): Promise<AppSetting[]> {
  // Check cache first
  const cachedSettings = getAppSettingsFromCache()
  if (cachedSettings) {
    return cachedSettings
  }

  try {
    const response = await fetch(`${API_BASE_URL}/app-settings`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result: AppSettingsResponse = await response.json()
    
    if (result.status.code !== 200) {
      throw new Error(result.status.message || 'Failed to fetch app settings')
    }
    
    // Cache the result
    cacheAppSettings(result.data)
    
    return result.data
  } catch (error) {
    console.error('Error fetching app settings:', error)
    
    // Try to return cached data if available, even if expired
    const expiredCache = getAppSettingsFromCache(true)
    if (expiredCache) {
      return expiredCache
    }
    
    // Return fallback data if API fails and no cache available
    return [
      { name: 'app_version', value: '1.0.0', lang: 'EN' },
      { name: 'app_version', value: '1.0.0', lang: 'ZH' },
    ]
  }
}

/**
 * Cache app settings to local storage
 */
function cacheAppSettings(settings: AppSetting[]): void {
  try {
    const cacheData: CachedAppSettings = {
      data: settings,
      timestamp: Date.now()
    }
    localStorage.setItem(APP_SETTINGS_CACHE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.warn('Failed to cache app settings:', error)
  }
}

/**
 * Get app settings from local storage cache
 * @param ignoreExpiration - If true, returns cached data even if expired
 */
function getAppSettingsFromCache(ignoreExpiration = false): AppSetting[] | null {
  try {
    const cached = localStorage.getItem(APP_SETTINGS_CACHE_KEY)
    if (!cached) return null
    
    const cacheData: CachedAppSettings = JSON.parse(cached)
    const isExpired = Date.now() - cacheData.timestamp > APP_SETTINGS_CACHE_DURATION
    
    if (isExpired && !ignoreExpiration) {
      return null
    }
    
    return cacheData.data
  } catch (error) {
    console.warn('Failed to retrieve cached app settings:', error)
    return null
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
  try {
    const params = new URLSearchParams()
    
    if (filters.term !== undefined) params.append('term', filters.term.toString())
    if (filters.week !== undefined) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.partOfSpeech) params.append('partOfSpeech', filters.partOfSpeech)
    if (filters.difficultyLevel) params.append('difficultyLevel', filters.difficultyLevel)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/vocabulary-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch vocabularies: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Vocabulary fetch error:', error)
    throw error
  }
}
