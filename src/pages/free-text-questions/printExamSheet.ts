import type { FreeTextQuestion } from '@/shared/data/types'

interface PrintExamSheetOptions {
  questions: FreeTextQuestion[]
  title: string
  language: 'EN' | 'ZH'
}

export function generatePrintExamSheet({ questions, title, language }: PrintExamSheetOptions): string {
  const currentDate = new Date().toLocaleDateString(language === 'ZH' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

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
      padding: 0; /* rely on @page margins for printable area */
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
      /* allow splitting long questions across pages to ensure none are lost */
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
      line-height: 1.8;
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
    
    .description {
      padding: 0.5cm 0;
      margin-bottom: 0.5cm;
      padding-left: 0.5cm;
      font-size: 12pt;
      line-height: 1.8;
    }
    
    .sub-questions {
      margin-left: 0.5cm;
    }
    
    .sub-question {
      margin-bottom: 1cm;
      page-break-inside: avoid;
    }
    
    .sub-question-label {
      font-weight: 600;
      display: inline;
      margin-right: 0.3cm;
    }
    
    .sub-question-text {
      display: inline;
      font-size: 12pt;
      line-height: 1.8;
    }
    
    .answer-space {
      margin-top: 0.4cm;
      margin-bottom: 0.2cm;
    }
    
    .answer-line {
      border-bottom: 1px solid #666;
      height: 0.8cm;
      margin: 0.3cm 0;
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
    }
  </style>
</head>
<body>
  <div class="questions-container">
    ${questions.map((q, index) => {
      let questionHtml = `<div class="question-block">`

      questionHtml += `<div class="question-content">`

      const numHtml = `<span class="question-number">${index + 1}.</span>`

      // Description if no main question
      if (!q.question && q.description) {
        let desc = q.description
        // If description starts with <p ...>, inject number after opening <p...>
        if (/^\s*<p(\s[^>]*)?>/i.test(desc)) {
          desc = desc.replace(/^\s*<p(\s[^>]*)?>/i, (m) => m + numHtml + ' ')
        } else {
          desc = numHtml + ' ' + desc
        }
        questionHtml += `<div class="description">${desc}</div>`
      }

      // Main question
      if (q.question) {
        let qtext = q.question
        if (/^\s*<p(\s[^>]*)?>/i.test(qtext)) {
          qtext = qtext.replace(/^\s*<p(\s[^>]*)?>/i, (m) => m + numHtml + ' ')
        } else {
          qtext = numHtml + ' ' + qtext
        }
        questionHtml += `<div class="question-text">${qtext}</div>`
        questionHtml += `
          <div class="answer-space">
            <div class="answer-line"></div>
            <div class="answer-line"></div>
            <div class="answer-line"></div>
          </div>`
      }
      
      // Sub-questions
      const subQuestions = [
        { label: 'a)', text: q.questiona },
        { label: 'b)', text: q.questionb },
        { label: 'c)', text: q.questionc },
        { label: 'd)', text: q.questiond },
        { label: 'e)', text: q.questione },
        { label: 'f)', text: q.questionf }
      ].filter(sq => sq.text)
      
      if (subQuestions.length > 0) {
        questionHtml += `<div class="sub-questions">`
        subQuestions.forEach(sq => {
          let subText = sq.text ?? ''
          // If sub-question text starts with <p...>, inject label after opening <p>
          if (/^\s*<p(\s[^>]*)?>/i.test(subText)) {
            subText = subText.replace(/^\s*<p(\s[^>]*)?>/i, (m) => m + sq.label + ' ')
          } else {
            subText = sq.label + ' ' + subText
          }

          questionHtml += `
            <div class="sub-question">
              <span class="sub-question-text">${subText}</span>
              <div class="answer-space">
                <div class="answer-line"></div>
                <div class="answer-line"></div>
              </div>
            </div>`
        })
        questionHtml += `</div>`
      }
      
      questionHtml += `</div>` // question-content
      questionHtml += `</div>` // question-block
      
      return questionHtml
    }).join('')}
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print()
      }, 500)
    }
  </script>
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
