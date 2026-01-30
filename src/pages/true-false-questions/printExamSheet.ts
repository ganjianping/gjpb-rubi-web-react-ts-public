
import type { TrueFalseQuestion } from '@/shared/data/types'

interface PrintExamSheetOptions {
  questions: TrueFalseQuestion[]
  title: string
  language: 'EN' | 'ZH'
  showAnswer?: boolean
  showExplanation?: boolean
}

export function generatePrintExamSheet({ questions, title, language, showAnswer = false, showExplanation = false }: PrintExamSheetOptions): string {
  return `
<!DOCTYPE html>
<html lang="${language === 'ZH' ? 'zh-CN' : 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 2.5cm 2cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000;
      background: white;
      width: auto;
      margin: 0;
      padding: 0;
    }
    
    .header {
      text-align: center;
      margin-bottom: 1.5cm;
      border-bottom: 2px solid #000;
      padding-bottom: 0.5cm;
    }
    
    .header h1 {
      font-size: 18pt;
      font-weight: bold;
      margin-bottom: 0.3cm;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    .header .date {
      font-size: 10pt;
      color: #333;
    }

    .print-controls {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin: 0.6cm 0 0 0;
    }

    .print-button {
      appearance: none;
      border: 1px solid #333;
      background: transparent;
      padding: 0.4rem 0.6rem;
      font-size: 11pt;
      cursor: pointer;
    }

    .screen-wrapper {
      max-width: 1000px;
      margin: 24px auto;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
      border-radius: 6px;
    }
    
    .student-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 1cm 0;
      padding: 0.5cm 0;
      border-bottom: 1px solid #ccc;
      font-size: 11pt;
    }
    
    .student-info-item {
      display: flex;
      align-items: center;
      gap: 0.3cm;
    }
    
    .student-info-item .label {
      font-weight: 600;
    }
    
    .student-info-item .underline {
      border-bottom: 1px solid #000;
      min-width: 4cm;
      display: inline-block;
    }
    
    .question-block {
      margin-bottom: 0.5cm;
      page-break-inside: auto;
      break-inside: avoid;
    }
    
    .question-number {
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 0.3cm;
      display: inline-block;
    }
    
    .question-content {
      margin-left: 0;
    }
    
    .question-text {
      margin-bottom: 0.5cm;
      font-size: 12pt;
      line-height: 1.6;
    }
    
    .question-text p {
      margin: 0.3cm 0;
    }
    
    .question-text img {
      max-width: 100%;
      height: auto;
      margin: 0.5cm 0;
      display: block;
    }
    
    .tf-options {
      margin-top: 0.5cm;
      display: flex;
      gap: 2rem;
    }
    
    .tf-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .checkbox {
      width: 18px;
      height: 18px;
      border: 1px solid #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    }

    .correct-icon {
      color: #0b6623;
      font-weight: 700;
      margin-left: 0.25rem;
    }

    .wrong-icon {
      color: #b91c1c;
      font-weight: 700;
      margin-left: 0.25rem;
    }
    
    .answer-section {
      margin-top: 0.5cm;
      padding: 0.4cm;
      background: #f0f9ff;
      border-left: 3px solid #000;
      font-size: 11pt;
    }
    
    .explanation-section {
      margin-top: 0.5cm;
      padding: 0.1cm 0.4cm 0.1cm
      border-left: 3px solid #000;
      font-size: 11pt;
      line-height: 1.7;
    }
    
    .footer {
      margin-top: 2cm;
      padding-top: 0.5cm;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 9pt;
      color: #666;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .no-print {
        display: none !important;
      }
      
      .page-break {
        page-break-after: always;
      }
      
      .screen-wrapper {
        margin: 0;
        padding: 0;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="screen-wrapper">
    <div class="questions-container">
      ${questions.map((q, index) => {
        const isTrue = q.answer === 'TRUE'
        const iconHtml = showAnswer ? (isTrue ? '<span class="correct-icon">✓</span>' : '<span class="wrong-icon">✗</span>') : ''

        // prepare question HTML - inject index and icon appropriately
        let questionHtml = (q.question || '').trim()

        if (/^<p[^>]*>/i.test(questionHtml)) {
          // inject number after opening <p...>
          questionHtml = questionHtml.replace(/^<p([^>]*)>/i, `<p$1>${index + 1}. `)

          // if need to show icon and the question ends with </p>, insert before </p>
          if (iconHtml) {
            questionHtml = questionHtml.replace(/<\/p>\s*$/i, `${iconHtml}</p>`)
          }
        } else {
          // no enclosing <p> - prefix the number and append icon if needed
          questionHtml = `${index + 1}. ${questionHtml}${iconHtml ? ' ' + iconHtml : ''}`
        }

        return `
        <div class="question-block">
          <div class="question-content">
            <div class="question-text">${questionHtml}</div>
          </div>

          ${showExplanation && q.explanation ? (() => {
            const label = language === 'ZH' ? '解释' : 'Explanation'
            let explanationHtml = (q.explanation || '').trim()
            if (/^<p[^>]*>/i.test(explanationHtml)) {
              explanationHtml = explanationHtml.replace(/^<p([^>]*)>/i, `<p$1><strong>${label}:</strong> `)
            } else {
              explanationHtml = `<strong>${label}:</strong> ${explanationHtml}`
            }
            return `
            <div class="explanation-section">
              ${explanationHtml}
            </div>
          `
          })() : ''}
        </div>
        `
      }).join('')}
    </div>
    
    <div class="footer">
      ${language === 'ZH' ? '祝考试顺利！' : 'Good Luck!'}
    </div>
  </div>
</body>
</html>
  `
}

export function openPrintWindow(content: string) {
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(content)
    printWindow.document.close()
  }
}
