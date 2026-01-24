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
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  partOfSpeech?: string
  difficultyLevel?: string
  tags?: string
  page?: number
  size?: number
  sort?: 'name' | 'displayOrder' | 'updatedAt' | 'difficultyLevel'
  direction?: 'asc' | 'desc'
}

// Expression Types
export interface Expression {
  id: string
  name: string
  phonetic: string
  translation: string
  explanation: string
  example: string
  term: number
  week: number
  tags: string
  difficultyLevel: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  phoneticAudioUrl?: string
  updatedAt: string
}

export interface ExpressionPageData {
  content: Expression[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type ExpressionResponse = ApiResponse<ExpressionPageData>

export interface ExpressionFilters {
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

// Sentence Types
export interface Sentence {
  id: string
  name: string
  phonetic: string
  translation: string
  explanation: string
  term: number
  week: number
  tags: string
  difficultyLevel: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  phoneticAudioUrl?: string
  updatedAt: string
}

export interface SentencePageData {
  content: Sentence[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type SentenceResponse = ApiResponse<SentencePageData>

export interface SentenceFilters {
  term?: number | string
  week?: number
  lang?: 'EN' | 'ZH'
  difficultyLevel?: string
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'name' | 'updatedAt' | 'difficultyLevel'
  direction?: 'asc' | 'desc'
}

// Article Types
export interface Article {
  id: string
  title: string
  summary: string
  content: string
  originalUrl: string | null
  sourceName: string | null
  coverImageFilename: string
  coverImageFileUrl: string
  coverImageOriginalUrl: string
  term: number | null
  week: number | null
  tags: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface ArticlePageData {
  content: Article[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type ArticleResponse = ApiResponse<ArticlePageData>

export interface ArticleFilters {
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'title' | 'updatedAt'
  direction?: 'asc' | 'desc'
}

// Video Types
export interface Video {
  id: string
  name: string
  filename: string
  fileUrl: string
  sizeBytes: number
  coverImageFilename: string | null
  coverImageFileUrl: string | null
  originalUrl: string | null
  sourceName: string | null
  description: string | null
  term: number | null
  week: number | null
  tags: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface VideoPageData {
  content: Video[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type VideoResponse = ApiResponse<VideoPageData>

export interface VideoFilters {
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'name' | 'updatedAt'
  direction?: 'asc' | 'desc'
}

// Audio Types
export interface Audio {
  id: string
  name: string
  filename: string
  fileUrl: string
  sizeBytes: number
  coverImageFilename: string | null
  coverImageFileUrl: string | null
  originalUrl: string | null
  sourceName: string | null
  description: string | null
  subtitle: string | null
  artist: string | null
  term: number | null
  week: number | null
  tags: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface AudioPageData {
  content: Audio[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type AudioResponse = ApiResponse<AudioPageData>

export interface AudioFilters {
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'name' | 'updatedAt'
  direction?: 'asc' | 'desc'
}

// Image Types
export interface Image {
  id: string
  name: string
  originalUrl: string | null
  sourceName: string | null
  filename: string
  fileUrl: string
  thumbnailFilename: string
  thumbnailFileUrl: string
  extension: string
  mimeType: string
  sizeBytes: number
  width: number
  height: number
  altText: string | null
  term: number | null
  week: number | null
  tags: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface ImagePageData {
  content: Image[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type ImageResponse = ApiResponse<ImagePageData>

export interface ImageFilters {
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'name' | 'updatedAt'
  direction?: 'asc' | 'desc'
}

// Multiple Choice Question Types
export interface MultipleChoiceQuestion {
  id: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
  explanation: string
  difficultyLevel: string
  failCount: number
  successCount: number
  term: number
  week: number
  tags: string
  lang: 'EN' | 'ZH'
  displayOrder: number
  updatedAt: string
}

export interface MultipleChoiceQuestionPageData {
  content: MultipleChoiceQuestion[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type MultipleChoiceQuestionResponse = ApiResponse<MultipleChoiceQuestionPageData>

export interface MultipleChoiceQuestionFilters {
  term?: number | string
  week?: number | string
  lang?: 'EN' | 'ZH'
  difficultyLevel?: string
  tags?: string
  page?: number
  size?: number
  sort?: 'displayOrder' | 'updatedAt' | 'difficultyLevel'
  direction?: 'asc' | 'desc'
}
