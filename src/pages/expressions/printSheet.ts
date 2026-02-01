import type { Expression } from '@/shared/data/types'

interface PrintSheetOptions {
  expressions: Expression[]
  title: string
  language: 'EN' | 'ZH'
}

export function generatePrintSheet({ expressions, title, language }: PrintSheetOptions): string {
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
      margin: 2cm 1.5cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #000;
      background: white;
    }
    
    .header {
      text-align: center;
      margin-bottom: 1.2cm;
      border-bottom: 2px solid #000;
      padding-bottom: 0.4cm;
    }
    
    .header h1 {
      font-size: 16pt;
      font-weight: bold;
      margin-bottom: 0.2cm;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .header .date {
      font-size: 9pt;
      color: #333;
    }

    .print-controls {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      margin: 0.5cm 0 0 0;
    }

    .print-button {
      appearance: none;
      border: 1px solid #333;
      background: transparent;
      padding: 0.3rem 0.5rem;
      font-size: 10pt;
      cursor: pointer;
    }

    .screen-wrapper {
      max-width: 1000px;
      margin: 20px auto;
      padding: 20px;
      background: #ffffff;
      box-shadow: 0 4px 12px rgba(0,0,0,0.06);
      border-radius: 6px;
    }
    
    .expression-list {
      display: grid;
      gap: 0.6cm;
    }
    
    .expression-item {
      page-break-inside: avoid;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.4cm;
    }
    
    .expression-item:last-child {
      border-bottom: none;
    }
    
    .expression-header {
      display: flex;
      align-items: baseline;
      gap: 0.3cm;
      margin-bottom: 0.2cm;
    }
    
    .expression-name {
      font-size: 12pt;
      font-weight: 700;
      color: #000;
    }
    
    .expression-phonetic {
      font-size: 10pt;
      color: #555;
      font-style: italic;
    }
    
    .expression-content {
      margin-top: 0.2cm;
      padding-left: 0.3cm;
    }
    
    .expr-row {
      margin-bottom: 0.2cm;
    }
    
    .expr-label {
      font-weight: 600;
      font-size: 10pt;
      color: #333;
      margin-right: 0.2cm;
    }
    
    .expr-value {
      font-size: 10pt;
      color: #000;
    }
    
    .expr-example {
      font-style: italic;
      color: #444;
      margin-top: 0.1cm;
      padding-left: 0.3cm;
    }
    
    .footer {
      margin-top: 1.5cm;
      padding-top: 0.4cm;
      border-top: 1px solid #ccc;
      text-align: center;
      font-size: 8pt;
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
    <div class="print-controls no-print">
      <button onclick="window.print()" class="print-button">
        ${language === 'ZH' ? '🖨️ 打印' : '🖨️ Print'}
      </button>
    </div>

    <div class="header">
      <h1>${title}</h1>
      <div class="date">${new Date().toLocaleDateString(language === 'ZH' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
    
    <div class="expression-list">
      ${expressions.map((expr) => `
        <div class="expression-item">
          <div class="expression-header">
            <span class="expression-name">${expr.name}</span>
            ${expr.phonetic ? `<span class="expression-phonetic">${expr.phonetic}</span>` : ''}
          </div>
          <div class="expression-content">
            ${expr.translation ? `
              <div class="expr-row">
                <span class="expr-label">${language === 'ZH' ? '翻译' : 'Translation'}:</span>
                <span class="expr-value">${expr.translation}</span>
              </div>
            ` : ''}
            ${expr.explanation ? `
              <div class="expr-row">
                <span class="expr-label">${language === 'ZH' ? '解释' : 'Explanation'}:</span>
                <span class="expr-value">${expr.explanation}</span>
              </div>
            ` : ''}
            ${expr.example ? `
              <div class="expr-row">
                <span class="expr-label">${language === 'ZH' ? '例句' : 'Example'}:</span>
                <div class="expr-example">${expr.example}</div>
              </div>
            ` : ''}
          </div>
        </div>
      `).join('')}
    </div>
    
    <div class="footer">
      ${language === 'ZH' ? '表达列表' : 'Expression List'} | ${expressions.length} ${language === 'ZH' ? '个表达' : 'expressions'}
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
