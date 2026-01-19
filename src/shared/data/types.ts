// API Response Types
export interface ApiStatus {
  code: number
  message: string
  errors: string[] | null
}

export interface ApiMeta {
  serverDateTime: string
  requestId: string
  sessionId: string
}

export interface ApiResponse<T> {
  status: ApiStatus
  data: T
  meta: ApiMeta
}

// App Settings Types
export interface AppSetting {
  name: string
  value: string
  lang: 'EN' | 'ZH'
}

export type AppSettingsResponse = ApiResponse<AppSetting[]>

// Vocabulary Types
export interface Vocabulary {
  id: string
  name: string
  phonetic: string
  partOfSpeech: string
  nounPluralForm: string
  nounForm: string
  nounMeaning: string
  nounExample: string
  verbSimplePastTense: string
  verbPastPerfectTense: string
  verbPresentParticiple: string
  adjectiveComparativeForm: string
  adjectiveSuperlativeForm: string
  verbForm: string
  verbMeaning: string
  verbExample: string
  adjectiveForm: string
  adjectiveMeaning: string
  adjectiveExample: string
  adverbForm: string
  adverbMeaning: string
  adverbExample: string
  translation: string
  synonyms: string
  definition: string
  example: string
  dictionaryUrl: string
  imageUrl: string
  phoneticAudioUrl: string
  term: number
  week: number
  tags: string
  difficultyLevel: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface VocabularyPageData {
  content: Vocabulary[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type VocabularyResponse = ApiResponse<VocabularyPageData>

export interface VocabularyFilters {
  term?: number
  week?: number
  lang?: 'EN' | 'ZH'
  difficultyLevel?: string
  tags?: string
  page?: number
  size?: number
  sort?: 'name' | 'displayOrder' | 'updatedAt' | 'difficultyLevel'
  direction?: 'asc' | 'desc'
}
