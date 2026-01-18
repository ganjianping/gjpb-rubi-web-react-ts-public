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
