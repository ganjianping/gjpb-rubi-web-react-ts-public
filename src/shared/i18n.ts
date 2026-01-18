type Language = 'EN' | 'ZH'

interface Translations {
  [key: string]: {
    EN: string
    ZH: string
  }
}

const translations: Translations = {
  // Navigation
  home: {
    EN: 'Home',
    ZH: '首页',
  },
  about: {
    EN: 'About',
    ZH: '关于',
  },
  contact: {
    EN: 'Contact',
    ZH: '联系',
  },
  
  // Common
  loading: {
    EN: 'Loading...',
    ZH: '加载中...',
  },
  loadingAppSettings: {
    EN: 'Loading app settings...',
    ZH: '加载应用设置中...',
  },
  error: {
    EN: 'An error occurred',
    ZH: '发生错误',
  },
  search: {
    EN: 'Search',
    ZH: '搜索',
  },
  searchPlaceholder: {
    EN: 'Search...',
    ZH: '搜索...',
  },
  
  // Theme
  theme: {
    EN: 'Theme',
    ZH: '主题',
  },
  themeColor: {
    EN: 'Theme Color',
    ZH: '主题颜色',
  },
  light: {
    EN: 'Light',
    ZH: '浅色',
  },
  dark: {
    EN: 'Dark',
    ZH: '深色',
  },
  color: {
    EN: 'Color',
    ZH: '颜色',
  },
  blueTheme: {
    EN: 'Blue',
    ZH: '蓝色',
  },
  greenTheme: {
    EN: 'Green',
    ZH: '绿色',
  },
  purpleTheme: {
    EN: 'Purple',
    ZH: '紫色',
  },
  orangeTheme: {
    EN: 'Orange',
    ZH: '橙色',
  },
  
  // Language
  language: {
    EN: 'Language',
    ZH: '语言',
  },
  
  // Footer
  version: {
    EN: 'Version',
    ZH: '版本',
  },
  
  // Not Found Page
  notFound: {
    EN: 'Page Not Found',
    ZH: '页面未找到',
  },
  pageNotFoundDesc: {
    EN: "The page you're looking for doesn't exist or an error occurred.",
    ZH: '您访问的页面不存在或发生了错误。',
  },
  goHome: {
    EN: 'Go Home',
    ZH: '返回首页',
  },
  unknownError: {
    EN: 'Unknown error',
    ZH: '未知错误',
  },
  
  // Home Page
  welcomeTitle: {
    EN: 'Welcome to Rubi Learning',
    ZH: '欢迎来到 Rubi Learning',
  },
  currentSettings: {
    EN: 'Current Settings',
    ZH: '当前设置',
  },
  appVersion: {
    EN: 'App Version',
    ZH: '应用版本',
  },
  features: {
    EN: 'Features',
    ZH: '功能特性',
  },
  feature1: {
    EN: 'React 19 with TypeScript',
    ZH: 'React 19 与 TypeScript',
  },
  feature2: {
    EN: 'Vite 7 for fast development',
    ZH: 'Vite 7 快速开发',
  },
  feature3: {
    EN: 'React Router DOM for routing',
    ZH: 'React Router DOM 路由',
  },
  feature4: {
    EN: 'Theme switching (light/dark)',
    ZH: '主题切换（浅色/深色）',
  },
  feature5: {
    EN: 'Theme color customization',
    ZH: '主题颜色自定义',
  },
  feature6: {
    EN: 'Multi-language support (EN/ZH)',
    ZH: '多语言支持（英文/中文）',
  },
  feature7: {
    EN: 'Context-based state management',
    ZH: '基于 Context 的状态管理',
  },
  feature8: {
    EN: 'Type-safe API layer',
    ZH: '类型安全的 API 层',
  },
  feature9: {
    EN: 'ESLint 9 with flat config',
    ZH: 'ESLint 9 扁平化配置',
  },
  feature10: {
    EN: 'Modular architecture',
    ZH: '模块化架构',
  },
  gettingStarted: {
    EN: 'Getting Started',
    ZH: '开始使用',
  },
  gettingStartedDesc: {
    EN: 'This is a fully configured React application with TypeScript, Vite, and React Router. Use the toolbar above to test theme switching, color customization, and language toggle.',
    ZH: '这是一个完全配置好的 React 应用，使用 TypeScript、Vite 和 React Router。使用上方工具栏测试主题切换、颜色自定义和语言切换功能。',
  },
  
  // Pagination
  previous: {
    EN: 'Previous',
    ZH: '上一页',
  },
  next: {
    EN: 'Next',
    ZH: '下一页',
  },
}

/**
 * Get translated text
 * @param key - Translation key
 * @param lang - Language code (EN or ZH)
 * @returns Translated string
 */
export function t(key: string, lang: Language = 'EN'): string {
  return translations[key]?.[lang] || key
}

/**
 * Create a translation function bound to a specific language
 * @param lang - Language code
 * @returns Translation function
 */
export function createTranslator(lang: Language) {
  return (key: string) => t(key, lang)
}
