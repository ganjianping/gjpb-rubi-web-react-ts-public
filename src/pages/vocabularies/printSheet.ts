import type { Vocabulary } from '@/shared/data/types'

interface PrintSheetOptions {
  vocabularies: Vocabulary[]
  title: string
  language: 'EN' | 'ZH'
}

// Helper function to remove <p> tags from start and end
function stripParagraphTags(text: string): string {
  return text.replace(/^<p>|<\/p>$/g, '').trim()
}

export function generatePrintSheet({ vocabularies, title, language }: PrintSheetOptions): string {
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
      text-align: left;
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
    
    .vocabulary-list {
      display: grid;
      gap: 0.8cm;
    }
    
    .vocabulary-item {
      page-break-inside: avoid;
      border-bottom: 1px solid #ddd;
      padding-bottom: 0.4cm;
    }
    
    .vocabulary-item:last-child {
      border-bottom: none;
    }
    
    .vocabulary-header {
      display: flex;
      align-items: baseline;
      gap: 0.4cm;
      margin-bottom: 0.2cm;
    }
    
    .vocabulary-name {
      font-size: 13pt;
      font-weight: 700;
      color: #000;
    }
    
    .vocabulary-phonetic {
      font-size: 10pt;
      color: #555;
      font-style: italic;
    }
    
    .vocabulary-pos {
      font-size: 9pt;
      color: #666;
      background: #f0f0f0;
      padding: 0.1cm 0.25cm;
      border-radius: 3px;
      margin-left: 0.2cm;
    }
    
    .vocabulary-content {
      margin-top: 0.3cm;
      padding-left: 0.3cm;
    }
    
    .vocab-row {
      margin-bottom: 0.2cm;
    }
    
    .vocab-label {
      font-weight: 600;
      font-size: 10pt;
      color: #333;
      margin-right: 0.2cm;
    }
    
    .vocab-value {
      font-size: 10pt;
      color: #000;
    }
    
    .vocab-example {
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
    <div class="header">
    <div class="vocabulary-list">
      ${vocabularies.map((v) => {
        const parts = []
        
        // Header
        parts.push(`
        <div class="vocabulary-item">
          <div class="vocabulary-header">
            <span class="vocabulary-name">${v.name}</span>
            ${v.phonetic ? `<span class="vocabulary-phonetic">${v.phonetic}</span>` : ''}
            ${v.partOfSpeech ? `<span class="vocabulary-pos">${v.partOfSpeech}</span>` : ''}
          </div>
          <div class="vocabulary-content">
        `)

        // Translation
        if (v.translation) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '翻译' : 'Translation'}:</span>
              <span class="vocab-value">${v.translation}</span>
            </div>
          `)
        }

        // Synonyms
        if (v.synonyms) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '同义词' : 'Synonyms'}:</span>
              <span class="vocab-value">${v.synonyms}</span>
            </div>
          `)
        }
        
        // Definition
        if (v.definition) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '定义' : 'Definition'}:</span>
              <span class="vocab-value">${stripParagraphTags(v.definition)}</span>
            </div>
          `)
        }

        // Example
        if (v.example) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '例句' : 'Example'}:</span>
              <div class="vocab-example">${stripParagraphTags(v.example)}</div>
            </div>
          `)
        }
        
        // Part of speech specific content (legacy fields)
        if (v.partOfSpeech === 'Noun') {
          if (v.nounPluralForm) {
            parts.push(`
              <div class="vocab-row">
                <span class="vocab-label">${language === 'ZH' ? '复数形式' : 'Plural'}:</span>
                <span class="vocab-value">${v.nounPluralForm}</span>
              </div>
            `)
          }
        }
        
        if (v.partOfSpeech === 'Verb') {
          if (v.verbSimplePastTense || v.verbPastPerfectTense || v.verbPresentParticiple) {
            parts.push(`
              <div class="vocab-row">
                <span class="vocab-label">${language === 'ZH' ? '动词变化形式' : 'Simple Past / Past Perfect / Present Participle'}:</span>
                <span class="vocab-value">${[v.verbSimplePastTense, v.verbPastPerfectTense, v.verbPresentParticiple].filter(Boolean).join(', ')}</span>
              </div>
            `)
          }
        }
        
        if (v.partOfSpeech === 'Adjective') {
          if (v.adjectiveComparativeForm || v.adjectiveSuperlativeForm) {
            parts.push(`
              <div class="vocab-row">
                <span class="vocab-label">${language === 'ZH' ? '比较级/最高级' : 'Comparative/Superlative'}:</span>
                <span class="vocab-value">${[v.adjectiveComparativeForm, v.adjectiveSuperlativeForm].filter(Boolean).join(' / ')}</span>
              </div>
            `)
          }
        }

        // Noun form section
        if (v.nounForm) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '名词形式' : 'Noun Form'}:</span>
              <span class="vocab-value"><b>${v.nounForm}</b> - ${stripParagraphTags(v.nounMeaning)} <br/> 
                ${language === 'ZH' ? '名词例句' : 'Example'} : ${stripParagraphTags(v.nounExample)}</span>
            </div>
          `)
        }
        
        // Verb form section
        if (v.verbForm) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '动词形式' : 'Verb Form'}:</span>
              <span class="vocab-value"><b>${v.verbForm}</b> - ${stripParagraphTags(v.verbMeaning)} <br/> 
                ${language === 'ZH' ? '动词例句' : 'Example'} : ${stripParagraphTags(v.verbExample)}</span>
            </div>
          `)
        }
        
        // Adjective form section
        if (v.adjectiveForm) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '形容词形式' : 'Adjective Form'}:</span>
              <span class="vocab-value"><b>${v.adjectiveForm}</b> - ${stripParagraphTags(v.adjectiveMeaning)} <br/> 
                ${language === 'ZH' ? '形容词例句' : 'Example'} : ${stripParagraphTags(v.adjectiveExample)}</span>
            </div>
          `)
        }
        
        // Adverb form section
        if (v.adverbForm) {
          parts.push(`
            <div class="vocab-row">
              <span class="vocab-label">${language === 'ZH' ? '副词形式' : 'Adverb Form'}:</span>
              <span class="vocab-value"><b>${v.adverbForm}</b> - ${stripParagraphTags(v.adverbMeaning)} <br/> 
                ${language === 'ZH' ? '副词例句' : 'Example'} : ${stripParagraphTags(v.adverbExample)}</span>
            </div>
          `)
        }
        
        parts.push(`
          </div>
        </div>
        `)
        
        return parts.join('')
      }).join('')}
    </div>
    
    <div class="footer">
      ${language === 'ZH' ? '词汇表' : 'Vocabulary List'} | ${vocabularies.length} ${language === 'ZH' ? '个单词' : 'words'}
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
