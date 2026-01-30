import type { FillBlankQuestion } from '@/shared/data/types'

interface PrintExamSheetOptions {
  questions: FillBlankQuestion[]
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
      margin-bottom: 1.5cm;
      page-break-inside: auto;
      break-inside: auto;
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
      line-height: 2;
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
    
    .blank-input {
      display: inline-block;
      border-bottom: 2px solid #000;
      min-width: 3cm;
      margin: 0 0.2cm;
      padding: 0 0.3cm;
      text-align: center;
      font-weight: ${showAnswer ? '600' : '400'};
      color: ${showAnswer ? '#000' : 'transparent'};
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
      padding: 0.4cm;
      background: #fef3c7;
      border-left: 3px solid #d97706;
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
        border-radius: 0;
        background: transparent;
      }
    }
  </style>
</head>
<body>
  <div class="screen-wrapper">

    <div class="questions-container">
      ${questions.map((q, index) => {
        // Parse the question and replace ____ with blanks
        const answers = q.answer.split(',').map(a => a.trim())
        let questionText = q.question.replace(/<\/?p[^>]*>/g, '') // Strip p tags
        let blankIndex = 0
        
        questionText = questionText.replace(/____/g, () => {
          const answerValue = showAnswer ? (answers[blankIndex] || '') : ''
          blankIndex++
          return `<span class="blank-input">${answerValue}</span>`
        })
        
        const numHtml = `<span class="question-number">${index + 1}.</span>`
        
        return `
          <div class="question-block">
            <div class="question-content">
              <div class="question-text">${numHtml} ${questionText}</div>
              
              ${showExplanation && q.explanation ? `
                <div class="explanation-section">
                  <strong>${language === 'ZH' ? '解释' : 'Explanation'}:</strong> ${q.explanation}
                </div>
              ` : ''}
            </div>
          </div>
        `
      }).join('')}
    </div>

    <div class="footer">
      ${language === 'ZH' ? '总分' : 'Total Score'}: __________ / ${questions.length}
    </div>
  </div>
</body>
</html>
  `
}

export function openPrintWindow(htmlContent: string): void {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    console.error('Failed to open print window. Please check popup blocker settings.')
    return
  }
  
  printWindow.document.write(htmlContent)
  printWindow.document.close()
}
