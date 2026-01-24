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
  studyHub: {
    EN: 'Study Hub',
    ZH: '学习中心',
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
  expandAll: {
    EN: 'Expand All',
    ZH: '全部展开',
  },
  collapseAll: {
    EN: 'Collapse All',
    ZH: '全部折叠',
  },
  search: {
    EN: 'Search',
    ZH: '搜索',
  },
  searchPlaceholder: {
    EN: 'Search...',
    ZH: '搜索...',
  },
  all: {
    EN: 'All',
    ZH: '全部',
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
    EN: 'Welcome to Rubi Study Hub',
    ZH: '欢迎来到 Rubi Study Hub',
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
  itemsPerPage: {
    EN: 'Items per page',
    ZH: '每页条数',
  },
  
  // Sorting
  sortBy: {
    EN: 'Sort By',
    ZH: '排序方式',
  },
  sortDirection: {
    EN: 'Direction',
    ZH: '排序方向',
  },
  ascending: {
    EN: 'Ascending',
    ZH: '升序',
  },
  descending: {
    EN: 'Descending',
    ZH: '降序',
  },
  name: {
    EN: 'Name',
    ZH: '名称',
  },
  displayOrder: {
    EN: 'Display Order',
    ZH: '显示顺序',
  },
  updatedAt: {
    EN: 'Updated At',
    ZH: '更新时间',
  },
  
  // Menu Groups
  learningContent: {
    EN: 'Learning',
    ZH: '学习内容',
  },
  media: {
    EN: 'Media',
    ZH: '媒体',
  },
  questions: {
    EN: 'Questions',
    ZH: '问题',
  },
  
  // Learning Content Items
  vocabularies: {
    EN: 'Vocabularies',
    ZH: '单词',
  },
  expressions: {
    EN: 'Expressions',
    ZH: '表达',
  },
  sentences: {
    EN: 'Sentences',
    ZH: '句子',
  },
  articles: {
    EN: 'Articles',
    ZH: '文章',
  },
  
  // Media Items
  images: {
    EN: 'Images',
    ZH: '图片',
  },
  videos: {
    EN: 'Videos',
    ZH: '视频',
  },
  audios: {
    EN: 'Audios',
    ZH: '音频',
  },
  
  // Question Types
  multipleChoice: {
    EN: 'Multiple Choice',
    ZH: '选择题',
  },
  freeText: {
    EN: 'Free Text',
    ZH: '问答题',
  },
  fillBlanks: {
    EN: 'Fill Blanks',
    ZH: '填空题',
  },
  fillBlank: {
    EN: 'Fill in the Blanks',
    ZH: '填空题',
  },
  trueFalse: {
    EN: 'True/False',
    ZH: '判断题',
  },
  
  // Dashboard
  dashboard: {
    EN: 'Dashboard',
    ZH: '仪表板',
  },
  dashboardWelcome: {
    EN: 'Welcome to your learning hub. Choose a category to get started.',
    ZH: '欢迎来到您的学习中心。选择一个类别开始学习。',
  },
  mediaResources: {
    EN: 'Media Resources',
    ZH: '媒体资源',
  },
  practiceQuestions: {
    EN: 'Practice Questions',
    ZH: '练习题',
  },
  
  // Page Descriptions
  vocabulariesDesc: {
    EN: 'Learn new words and expand your vocabulary',
    ZH: '学习新单词，扩展词汇量',
  },
  expressionsDesc: {
    EN: 'Master common phrases and expressions',
    ZH: '掌握常用短语和表达',
  },
  sentencesDesc: {
    EN: 'Practice with example sentences',
    ZH: '通过例句练习',
  },
  articlesDesc: {
    EN: 'Read articles to improve comprehension',
    ZH: '阅读文章提高理解能力',
  },
  imagesDesc: {
    EN: 'Visual learning with images',
    ZH: '通过图片进行视觉学习',
  },
  videosDesc: {
    EN: 'Watch educational videos',
    ZH: '观看教育视频',
  },
  audiosDesc: {
    EN: 'Listen to audio materials',
    ZH: '聆听音频材料',
  },
  multipleChoiceDesc: {
    EN: 'Test your knowledge with multiple choice questions',
    ZH: '通过选择题测试您的知识',
  },
  freeTextDesc: {
    EN: 'Practice writing with free text questions',
    ZH: '通过问答题练习写作',
  },
  fillBlankDesc: {
    EN: 'Fill in the blanks exercises',
    ZH: '填空练习',
  },
  trueFalseDesc: {
    EN: 'True or false questions',
    ZH: '判断题',
  },
  
  // Vocabulary Page
  filters: {
    EN: 'Filters',
    ZH: '筛选',
  },
  toggleFilters: {
    EN: 'Toggle Filters',
    ZH: '切换筛选',
  },
  showFilters: {
    EN: 'Show Filters',
    ZH: '显示筛选',
  },
  hideFilters: {
    EN: 'Hide Filters',
    ZH: '隐藏筛选',
  },
  resetFilters: {
    EN: 'Reset Filters',
    ZH: '重置筛选',
  },
  term: {
    EN: 'Term',
    ZH: '学期',
  },
  week: {
    EN: 'Week',
    ZH: '周',
  },
  difficultyLevel: {
    EN: 'Difficulty',
    ZH: '难度',
  },
  allLevels: {
    EN: 'All Levels',
    ZH: '所有难度',
  },
  easy: {
    EN: 'Easy',
    ZH: '简单',
  },
  medium: {
    EN: 'Medium',
    ZH: '中等',
  },
  hard: {
    EN: 'Hard',
    ZH: '困难',
  },
  enterTerm: {
    EN: 'Enter term...',
    ZH: '输入学期...',
  },
  enterWeek: {
    EN: 'Enter week...',
    ZH: '输入周数...',
  },
  loadingVocabularies: {
    EN: 'Loading vocabularies...',
    ZH: '加载词汇中...',
  },
  noVocabularies: {
    EN: 'No vocabularies found. Try adjusting your filters.',
    ZH: '未找到单词。尝试调整筛选条件。',
  },
  showing: {
    EN: 'Showing',
    ZH: '显示',
  },
  of: {
    EN: 'of',
    ZH: '共',
  },
  retry: {
    EN: 'Retry',
    ZH: '重试',
  },
  translation: {
    EN: 'Translation',
    ZH: '翻译',
  },
  definition: {
    EN: 'Definition',
    ZH: '定义',
  },
  example: {
    EN: 'Example',
    ZH: '例句',
  },
  synonyms: {
    EN: 'Synonyms',
    ZH: '同义词',
  },
  partsOfSpeech: {
    EN: 'Parts of Speech',
    ZH: '词性',
  },
  partOfSpeech: {
    EN: 'Part of Speech',
    ZH: '词性',
  },
  noun: {
    EN: 'Noun',
    ZH: '名词',
  },
  verb: {
    EN: 'Verb',
    ZH: '动词',
  },
  adjective: {
    EN: 'Adjective',
    ZH: '形容词',
  },
  adverb: {
    EN: 'Adverb',
    ZH: '副词',
  },
  pronoun: {
    EN: 'Pronoun',
    ZH: '代词',
  },
  preposition: {
    EN: 'Preposition',
    ZH: '介词',
  },
  conjunction: {
    EN: 'Conjunction',
    ZH: '连词',
  },
  interjection: {
    EN: 'Interjection',
    ZH: '感叹词',
  },
  form: {
    EN: 'Form',
    ZH: '形式',
  },
  meaning: {
    EN: 'Meaning',
    ZH: '含义',
  },
  plural: {
    EN: 'Plural',
    ZH: '复数',
  },
  simplePast: {
    EN: 'Simple Past',
    ZH: '一般过去时',
  },
  pastPerfect: {
    EN: 'Past Perfect',
    ZH: '过去完成时',
  },
  presentParticiple: {
    EN: 'Present Participle',
    ZH: '现在分词',
  },
  comparative: {
    EN: 'Comparative',
    ZH: '比较级',
  },
  superlative: {
    EN: 'Superlative',
    ZH: '最高级',
  },
  viewInDictionary: {
    EN: 'View in Dictionary',
    ZH: '在词典中查看',
  },
  close: {
    EN: 'Close',
    ZH: '关闭',
  },
  verbTenses: {
    EN: 'Verb Tenses',
    ZH: '动词时态',
  },
  comparativeAndSuperlative: {
    EN: 'Comparative & Superlative',
    ZH: '比较级和最高级',
  },
  selectPlayInterval: {
    EN: 'Select Play Interval',
    ZH: '选择播放间隔',
  },
  choosePlayIntervalDescription: {
    EN: 'Choose how long to wait before playing the next vocabulary:',
    ZH: '选择播放下一个词汇前的等待时间：',
  },
  seconds: {
    EN: 'seconds',
    ZH: '秒',
  },
  cancel: {
    EN: 'Cancel',
    ZH: '取消',
  },
  showCompactView: {
    EN: 'Show compact view',
    ZH: '显示紧凑视图',
  },
  showDetailedView: {
    EN: 'Show detailed view',
    ZH: '显示详细视图',
  },
  stopAutoPlay: {
    EN: 'Stop auto-play',
    ZH: '停止自动播放',
  },
  playAllVocabularies: {
    EN: 'Play all vocabularies',
    ZH: '播放所有词汇',
  },
  playPronunciation: {
    EN: 'Play pronunciation',
    ZH: '播放发音',
  },
  viewDetails: {
    EN: 'View details',
    ZH: '查看详情',
  },
  hide: {
    EN: 'Hide',
    ZH: '隐藏',
  },
  show: {
    EN: 'Show',
    ZH: '显示',
  },
  back: {
    EN: 'Back',
    ZH: '返回',
  },
  print: {
    EN: 'Print',
    ZH: '打印',
  },
  metadata: {
    EN: 'Metadata',
    ZH: '元数据',
  },
  articleNotFound: {
    EN: 'Article not found',
    ZH: '文章未找到',
  },
  backToArticles: {
    EN: 'Back to Articles',
    ZH: '返回文章列表',
  },
  videoNotFound: {
    EN: 'Video not found',
    ZH: '视频未找到',
  },
  noVideos: {
    EN: 'No videos found',
    ZH: '未找到视频',
  },
  play: {
    EN: 'Play',
    ZH: '播放',
  },
  videoNotSupported: {
    EN: 'Your browser does not support the video tag.',
    ZH: '您的浏览器不支持视频标签。',
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
