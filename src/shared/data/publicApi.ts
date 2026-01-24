import type { AppSetting, AppSettingsResponse, VocabularyResponse, VocabularyFilters, ExpressionResponse, ExpressionFilters, SentenceResponse, SentenceFilters, ArticleResponse, ArticleFilters, Article, VideoResponse, VideoFilters, Video, AudioResponse, AudioFilters, ImageResponse, ImageFilters, MultipleChoiceQuestionResponse, MultipleChoiceQuestionFilters } from './types'

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
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.partOfSpeech && filters.partOfSpeech !== '') params.append('partOfSpeech', filters.partOfSpeech)
    if (filters.difficultyLevel && filters.difficultyLevel !== '') params.append('difficultyLevel', filters.difficultyLevel)
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

/**
 * Fetch expressions with filters
 * @param filters - Query parameters for filtering expressions
 * @returns Promise<ExpressionResponse>
 */
export async function fetchExpressions(filters: ExpressionFilters = {}): Promise<ExpressionResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.difficultyLevel && filters.difficultyLevel !== '') params.append('difficultyLevel', filters.difficultyLevel)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/expression-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch expressions: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Expression fetch error:', error)
    throw error
  }
}

/**
 * Fetch sentences with filters
 * @param filters - Query parameters for filtering sentences
 * @returns Promise<SentenceResponse>
 */
export async function fetchSentences(filters: SentenceFilters = {}): Promise<SentenceResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.difficultyLevel && filters.difficultyLevel !== '') params.append('difficultyLevel', filters.difficultyLevel)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/sentence-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch sentences: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Sentence fetch error:', error)
    throw error
  }
}

/**
 * Fetch a single article by ID
 * @param id - Article ID
 * @returns Promise<Article>
 */
export async function fetchArticleById(id: string): Promise<Article> {
  try {
    const response = await fetch(`${API_BASE_URL}/article-rus/${id}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch article: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data.data
  } catch (error) {
    console.error('Article fetch error:', error)
    throw error
  }
}

/**
 * Fetch articles with filters
 * @param filters - Query parameters for filtering articles
 * @returns Promise<ArticleResponse>
 */
export async function fetchArticles(filters: ArticleFilters = {}): Promise<ArticleResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/article-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Article fetch error:', error)
    throw error
  }
}

/**
 * Fetch a single video by ID
 * @param id - Video ID
 * @returns Promise<Video>
 */
export async function fetchVideoById(id: string): Promise<Video> {
  try {
    const response = await fetch(`${API_BASE_URL}/video-rus/${id}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data.data
  } catch (error) {
    console.error('Video fetch error:', error)
    throw error
  }
}

/**
 * Fetch videos with filters
 * @param filters - Query parameters for filtering videos
 * @returns Promise<VideoResponse>
 */
export async function fetchVideos(filters: VideoFilters = {}): Promise<VideoResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/video-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch videos: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Video fetch error:', error)
    throw error
  }
}

/**
 * Fetch audios with optional filters
 * @param filters - Query parameters for filtering audios
 * @returns Promise<AudioResponse>
 */
export async function fetchAudios(filters: AudioFilters = {}): Promise<AudioResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/audio-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch audios: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Audio fetch error:', error)
    throw error
  }
}

/**
 * Fetch images with filters
 * @param filters - Query parameters for filtering images
 * @returns Promise<ImageResponse>
 */
export async function fetchImages(filters: ImageFilters = {}): Promise<ImageResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/image-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch images: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Image fetch error:', error)
    throw error
  }
}

/**
 * Fetch multiple choice questions with filters
 * @param filters - Multiple choice question filters
 * @returns Promise<MultipleChoiceQuestionResponse>
 */
export async function fetchMultipleChoiceQuestions(filters: MultipleChoiceQuestionFilters = {}): Promise<MultipleChoiceQuestionResponse> {
  try {
    const params = new URLSearchParams()
    
    if (filters.term) params.append('term', filters.term.toString())
    if (filters.week) params.append('week', filters.week.toString())
    if (filters.lang) params.append('lang', filters.lang)
    if (filters.difficultyLevel && filters.difficultyLevel !== '') params.append('difficultyLevel', filters.difficultyLevel)
    if (filters.tags) params.append('tags', filters.tags)
    params.append('page', (filters.page ?? 0).toString())
    params.append('size', (filters.size ?? 20).toString())
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.direction) params.append('direction', filters.direction)
    
    const response = await fetch(`${API_BASE_URL}/multiple-choice-question-rus?${params.toString()}`)
    
    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unable to read error response')
      throw new Error(`Failed to fetch multiple choice questions: ${response.status} ${response.statusText} - ${errorBody}`)
    }
    
    const data = await response.json()
    
    if (data.status?.code !== 200) {
      throw new Error(data.status?.message || 'API returned error status')
    }
    
    return data
  } catch (error) {
    console.error('Multiple choice question fetch error:', error)
    throw error
  }
}
