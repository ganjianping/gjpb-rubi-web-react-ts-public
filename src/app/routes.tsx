import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import NotFoundPage from '@/shared/components/NotFoundPage'
import DashboardPage from '@/pages/DashboardPage'
import VocabulariesPage from '@/pages/vocabularies'
import ExpressionsPage from '@/pages/expressions'
import SentencesPage from '@/pages/sentences'
import ArticlesPage from '@/pages/articles'
import ArticleDetail from '@/pages/articles/ArticleDetail'
import ImagesPage from '@/pages/images'
import VideosPage from '@/pages/videos'
import AudiosPage from '@/pages/audios'
import MultipleChoiceQuestionsPage from '@/pages/multiple-choice-questions'
import FreeTextQuestionsPage from '@/pages/free-text-questions'
import FillBlankQuestionsPage from '@/pages/fill-blank-questions'
import TrueFalseQuestionsPage from '@/pages/true-false-questions'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      // Learning Content
      {
        path: 'vocabularies',
        element: <VocabulariesPage />,
      },
      {
        path: 'expressions',
        element: <ExpressionsPage />,
      },
      {
        path: 'sentences',
        element: <SentencesPage />,
      },
      {
        path: 'articles',
        element: <ArticlesPage />,
      },
      {
        path: 'articles/:id',
        element: <ArticleDetail />,
      },
      // Media
      {
        path: 'videos',
        element: <VideosPage />,
      },
      {
        path: 'images',
        element: <ImagesPage />,
      },
      {
        path: 'audios',
        element: <AudiosPage />,
      },
      // Questions
      {
        path: 'questions/multiple-choice',
        element: <MultipleChoiceQuestionsPage />,
      },
      {
        path: 'questions/free-text',
        element: <FreeTextQuestionsPage />,
      },
      {
        path: 'questions/fill-blank',
        element: <FillBlankQuestionsPage />,
      },
      {
        path: 'questions/true-false',
        element: <TrueFalseQuestionsPage />,
      },
    ],
  },
], {
  basename: '/rubi/',
})
