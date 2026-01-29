import type { FreeTextQuestion } from '@/shared/data/types'

interface PrintExamSheetOptions {
  questions: FreeTextQuestion[]
  title: string
  language: 'EN' | 'ZH'
  showAnswer?: boolean
  showExplanation?: boolean
}

export function generatePrintExamSheet({ questions, title, language, showAnswer = false, showExplanation = false }: PrintExamSheetOptions): string {
  // inline date in template to avoid unused-variable linter errors

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

    /* Screen preview wrapper: adds margins and subtle card look for browser preview */
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
      min-height: 0.8cm;
      margin: 0.3cm 0;
      padding: 0.2cm 0;
      line-height: 1.4;
      font-weight: 500;
    }
    
    .answer-section {
      margin-top: 0.3cm;
      padding: 0.3cm;
      background: #f0f9ff;
      border-left: 3px solid #0369a1;
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
      /* remove screen-only wrapper for print */
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
            <div class="answer-line">${showAnswer && q.answer ? q.answer : ''}</div>${!showAnswer ? `
            <div class="answer-line"></div>
            <div class="answer-line"></div>` : ''}
          </div>`
      }
      
      if (showExplanation && q.explanation) {
        questionHtml += `<div class="explanation-section"><strong>${language === 'ZH' ? '解释' : 'Explanation'}:</strong> ${q.explanation}</div>`
      }
      
      // Sub-questions
      const subQuestions = [
        { label: 'a)', text: q.questiona, answer: q.answera },
        { label: 'b)', text: q.questionb, answer: q.answerb },
        { label: 'c)', text: q.questionc, answer: q.answerc },
        { label: 'd)', text: q.questiond, answer: q.answerd },
        { label: 'e)', text: q.questione, answer: q.answere },
        { label: 'f)', text: q.questionf, answer: q.answerf }
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
                <div class="answer-line">${showAnswer && sq.answer ? sq.answer : ''}</div>${!showAnswer ? `
                <div class="answer-line"></div>` : ''}
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
