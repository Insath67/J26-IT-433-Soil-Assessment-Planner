import i18n from '../../../i18n'

const REPORT_TEXT = {
  en: {
    brand: 'Saru Bima',
    title: 'Soil Assessment Report',
    subtitle: 'Soil Health · Kegalle Research Project',
    generated: 'Report generated',
    sampleDetails: 'Sample details',
    sampleId: 'Sample ID',
    location: 'Location',
    district: 'District / Zone',
    soilType: 'Soil type',
    depth: 'Sampling depth',
    sampledAt: 'Sample date and time',
    fertility: 'Fertility assessment',
    score: 'Fertility score',
    rating: 'Fertility level',
    measurements: 'Soil measurements',
    parameter: 'Parameter',
    reading: 'Measured value',
    status: 'Assessment',
    unavailable: 'Not available',
    print: 'Print / Save as PDF',
    preparing: 'Preparing report…',
    popupError: 'Please allow pop-ups for this site and try again.',
    exportError: 'Could not prepare the report. Please try again.',
    note:
      'Research report based on the selected sample. It does not certify field validation or sensor calibration.',
    footer: 'Developed by Saru Bima Web Team',
    parameters: [
      'Soil pH',
      'Nitrogen (N)',
      'Phosphorus (P)',
      'Potassium (K)',
      'Soil moisture',
      'Soil temperature',
      'Electrical conductivity (EC)',
      'Humidity',
      'Rainfall',
    ],
    statuses: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
      sufficient: 'Sufficient',
      deficient: 'Deficient',
      suitable: 'Suitable',
      optimal: 'Optimal',
      normal: 'Normal',
      saturated: 'Saturated',
      suboptimal: 'Suboptimal',
      'strongly acidic': 'Strongly acidic',
      'moderately acidic': 'Moderately acidic',
      acidic: 'Acidic',
      alkaline: 'Alkaline',
      'saline hazard': 'Salinity risk',
    },
  },

  si: {
    brand: 'සරු බිම',
    title: 'පස් සාම්පල ඇගයීම් වාර්තාව',
    subtitle: 'පසේ සෞඛ්‍යය · කෑගල්ල පර්යේෂණ ව්‍යාපෘතිය',
    generated: 'වාර්තාව සකස් කළ වේලාව',
    sampleDetails: 'සාම්පලයේ තොරතුරු',
    sampleId: 'සාම්පල අංකය',
    location: 'ස්ථානය',
    district: 'දිස්ත්‍රික්කය / කලාපය',
    soilType: 'පස් වර්ගය',
    depth: 'සාම්පලය ලබාගත් ගැඹුර',
    sampledAt: 'සාම්පලයේ දිනය සහ වේලාව',
    fertility: 'පසේ සාරවත් බව ඇගයීම',
    score: 'සාරවත් බවේ ලකුණු',
    rating: 'සාරවත් බවේ මට්ටම',
    measurements: 'පසේ මිනුම්',
    parameter: 'පරාමිතිය',
    reading: 'මනින ලද අගය',
    status: 'ඇගයීම',
    unavailable: 'තොරතුරු නොමැත',
    print: 'මුද්‍රණය / PDF ලෙස සුරකින්න',
    preparing: 'වාර්තාව සකස් වෙමින් පවතී…',
    popupError:
      'මෙම වෙබ් අඩවියට pop-up windows විවෘත කිරීමට අවසර දී නැවත උත්සාහ කරන්න.',
    exportError: 'වාර්තාව සකස් කිරීමට නොහැකි විය. නැවත උත්සාහ කරන්න.',
    note:
      'තෝරාගත් සාම්පලය මත පදනම් වූ පර්යේෂණ වාර්තාවකි. මෙය ක්ෂේත්‍ර සත්‍යාපනය හෝ සංවේදක ක්‍රමාංකනය තහවුරු කරන සහතිකයක් නොවේ.',
    footer: 'සරු බිම වෙබ් කණ්ඩායම විසින් නිර්මාණය කරන ලදී',
    parameters: [
      'පසේ pH අගය',
      'නයිට්‍රජන් (N)',
      'පොස්පරස් (P)',
      'පොටෑසියම් (K)',
      'පසේ තෙතමනය',
      'පසේ උෂ්ණත්වය',
      'විද්‍යුත් සන්නායකතාව (EC)',
      'වායු ආර්ද්‍රතාව',
      'වර්ෂාපතනය',
    ],
    statuses: {
      high: 'ඉහළ',
      medium: 'මධ්‍යම',
      low: 'අඩු',
      sufficient: 'ප්‍රමාණවත්',
      deficient: 'ඌන',
      suitable: 'සුදුසු',
      optimal: 'ප්‍රශස්ත',
      normal: 'සාමාන්‍ය',
      saturated: 'සංතෘප්ත',
      suboptimal: 'ප්‍රශස්ත මට්ටමේ නොමැත',
      'strongly acidic': 'දැඩි ආම්ලික',
      'moderately acidic': 'මධ්‍යස්ථ ආම්ලික',
      acidic: 'ආම්ලික',
      alkaline: 'ක්ෂාරීය',
      'saline hazard': 'ලවණතාවේ අවදානමක් ඇත',
    },
  },

  ta: {
    brand: 'சரு பிம',
    title: 'மண் மதிப்பீட்டு அறிக்கை',
    subtitle: 'மண் நலம் · கேகாலை ஆராய்ச்சித் திட்டம்',
    generated: 'அறிக்கை உருவாக்கப்பட்ட நேரம்',
    sampleDetails: 'மாதிரி விவரங்கள்',
    sampleId: 'மாதிரி எண்',
    location: 'இடம்',
    district: 'மாவட்டம் / வலயம்',
    soilType: 'மண் வகை',
    depth: 'மாதிரி எடுக்கப்பட்ட ஆழம்',
    sampledAt: 'மாதிரி தேதி மற்றும் நேரம்',
    fertility: 'மண் வள மதிப்பீடு',
    score: 'மண் வள மதிப்பெண்',
    rating: 'மண் வள நிலை',
    measurements: 'மண் அளவீடுகள்',
    parameter: 'அளவுரு',
    reading: 'அளவிடப்பட்ட மதிப்பு',
    status: 'மதிப்பீடு',
    unavailable: 'தகவல் இல்லை',
    print: 'அச்சிடவும் / PDF ஆகச் சேமிக்கவும்',
    preparing: 'அறிக்கை தயாராகிறது…',
    popupError:
      'இந்தத் தளத்தில் பாப்-அப் சாளரங்களை அனுமதித்து மீண்டும் முயற்சிக்கவும்.',
    exportError: 'அறிக்கையைத் தயாரிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
    note:
      'தேர்ந்தெடுக்கப்பட்ட மாதிரியின் அடிப்படையிலான ஆராய்ச்சி அறிக்கை. இது களச் சரிபார்ப்பு அல்லது உணரி அளவுத்திருத்தத்தை உறுதிப்படுத்தும் சான்றிதழ் அல்ல.',
    footer: 'சரு பிம இணையக் குழுவால் உருவாக்கப்பட்டது',
    parameters: [
      'மண்ணின் pH',
      'நைட்ரஜன் (N)',
      'பொஸ்பரஸ் (P)',
      'பொட்டாசியம் (K)',
      'மண் ஈரப்பதம்',
      'மண் வெப்பநிலை',
      'மின் கடத்துத்திறன் (EC)',
      'காற்றின் ஈரப்பதம்',
      'மழைவீழ்ச்சி',
    ],
    statuses: {
      high: 'அதிகம்',
      medium: 'நடுத்தரம்',
      low: 'குறைவு',
      sufficient: 'போதுமானது',
      deficient: 'பற்றாக்குறை',
      suitable: 'பொருத்தமானது',
      optimal: 'உகந்தது',
      normal: 'சாதாரணம்',
      saturated: 'நிறைவுற்றது',
      suboptimal: 'உகந்த நிலையில் இல்லை',
      'strongly acidic': 'அதிக அமிலத்தன்மை',
      'moderately acidic': 'மிதமான அமிலத்தன்மை',
      acidic: 'அமிலத்தன்மை',
      alkaline: 'காரத்தன்மை',
      'saline hazard': 'உவர்ப்புத்தன்மை அபாயம்',
    },
  },
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character])
}

// Reuse the application's installed Sinhala/Tamil font styles.
async function copyAppStyles(targetDocument) {
  const pending = []

  document.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
    const copy = node.cloneNode(true)

    if (node.tagName === 'LINK') {
      copy.href = node.href

      pending.push(new Promise((resolve, reject) => {
        copy.onload = resolve
        copy.onerror = () => reject(new Error('Stylesheet failed to load'))
      }))
    }

    targetDocument.head.appendChild(copy)
  })

  await Promise.all(pending)
}

export async function downloadSoilReportPdf(sample) {
  if (!sample) return

  // Capture the selected language when the user clicks Download PDF.
  const selected = (
    i18n.resolvedLanguage ||
    i18n.language ||
    'en'
  ).split('-')[0]

  const language = REPORT_TEXT[selected] ? selected : 'en'
  const text = REPORT_TEXT[language]

  // Open immediately so this remains part of the button click.
  const reportWindow = window.open('', '_blank')

  if (!reportWindow) {
    window.alert(text.popupError)
    return
  }

  try {
    const doc = reportWindow.document

    doc.open()
    doc.write('<!doctype html><html><head></head><body></body></html>')
    doc.close()

    doc.documentElement.lang = language
    doc.documentElement.dir = 'ltr'

    const charset = doc.createElement('meta')
    charset.setAttribute('charset', 'utf-8')
    doc.head.appendChild(charset)

    const base = doc.createElement('base')
    base.href = document.baseURI
    doc.head.appendChild(base)

    const safeId = String(sample.sampleId || 'sample')
      .replace(/[^a-zA-Z0-9_-]/g, '_')

    doc.title = `Saru_Bima_Soil_Report_${safeId}_${language}`
    doc.body.textContent = text.preparing

    await copyAppStyles(doc)

    const font = {
      en: 'Arial',
      si: '"Noto Sans Sinhala Variable", "Noto Sans Sinhala"',
      ta: '"Noto Sans Tamil Variable", "Noto Sans Tamil"',
    }[language]

    const styles = doc.createElement('style')

    styles.textContent = `
      @page {
        size: A4;
        margin: 14mm;
      }

      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        color: #172b20 !important;
        color-scheme: light !important;
        height: auto !important;
        overflow: visible !important;
      }

      body {
        display: block !important;
        font-family: ${font}, sans-serif !important;
        font-size: 12px !important;
        line-height: 1.7 !important;
      }

      .soil-pdf-report {
        max-width: 780px;
        margin: 0 auto;
        padding: 24px;
        overflow-wrap: anywhere;
      }

      .soil-pdf-report * {
        box-sizing: border-box;
        font-family: inherit;
      }

      .soil-pdf-report header {
        position: static;
        border-bottom: 3px solid #25834a;
        padding-bottom: 16px;
        margin-bottom: 18px;
      }

      .soil-pdf-report h1 {
        font-size: 23px;
        line-height: 1.6;
        color: #174c30;
        margin: 4px 0;
      }

      .soil-pdf-report h2 {
        font-size: 16px;
        color: #174c30;
        margin: 20px 0 10px;
        break-after: avoid;
      }

      .soil-pdf-report p {
        margin: 5px 0;
      }

      .soil-pdf-report .brand {
        font-size: 18px;
        font-weight: 700;
        color: #174c30;
      }

      .soil-pdf-report table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
        margin-bottom: 16px;
      }

      .soil-pdf-report th,
      .soil-pdf-report td {
        border: 1px solid #cbd8ce;
        padding: 9px;
        text-align: left;
        vertical-align: top;
      }

      .soil-pdf-report th {
        font-weight: 700;
        background: #edf5ef;
        color: #174c30;
      }

      .soil-pdf-report tr {
        break-inside: avoid;
      }

      .soil-pdf-report thead {
        display: table-header-group;
      }

      .soil-pdf-report .note {
        padding: 12px;
        border-left: 3px solid #d99735;
        background: #fff8e9;
        margin-top: 18px;
      }

      .soil-pdf-report footer {
        position: static;
        margin-top: 20px;
        padding-top: 10px;
        border-top: 1px solid #cbd8ce;
        font-size: 11px;
      }

      .soil-pdf-report button {
        border: 0;
        border-radius: 8px;
        padding: 10px 18px;
        background: #174c30;
        color: white;
        cursor: pointer;
        margin-bottom: 20px;
      }

      @media print {
        .soil-pdf-report {
          max-width: none;
          margin: 0;
          padding: 0;
        }

        .soil-pdf-report button {
          display: none !important;
        }
      }
    `

    doc.head.appendChild(styles)

    const present = value =>
      value !== undefined && value !== null && value !== ''

    const display = value =>
      escapeHtml(present(value) ? value : text.unavailable)

    const statusText = value => {
      if (!present(value)) return text.unavailable

      const key = String(value).trim().toLowerCase()
      return text.statuses[key] || String(value)
    }

    // Accept both the frontend's flat sample and backend sensorData format.
    const sensor = sample.sensorData || sample
    const statuses = sample.nutrientStatus || {}

    const definitions = [
      ['ph', ''],
      ['nitrogen', 'mg/kg'],
      ['phosphorus', 'mg/kg'],
      ['potassium', 'mg/kg'],
      ['moisture', '%'],
      ['temperature', '°C'],
      ['ec', 'mS/cm'],
      ['humidity', '%'],
      // The current schema does not specify the rainfall period/unit.
      ['rainfall', ''],
    ]

    const measurementRows = definitions.map(([key, unit], index) => {
      const value = sensor[key]
      const reading = present(value)
        ? `${value}${unit ? ` ${unit}` : ''}`
        : text.unavailable

      return `
        <tr>
          <td>${escapeHtml(text.parameters[index])}</td>
          <td>${escapeHtml(reading)}</td>
          <td>${escapeHtml(statusText(statuses[key]))}</td>
        </tr>
      `
    }).join('')

    const sampleDate = [sample.date, sample.time]
      .filter(present)
      .join(' ')

    const metadata = [
      [text.sampleId, sample.sampleId],
      [text.location, sample.location],
      [text.district, sample.district],
      [text.soilType, sample.soilType || sample.soilColor],
      [text.depth, sample.samplingDepth],
      [text.sampledAt, sampleDate],
    ]

    const metadataRows = metadata.map(([label, value]) => `
      <tr>
        <th scope="row">${escapeHtml(label)}</th>
        <td>${display(value)}</td>
      </tr>
    `).join('')

    const locale = {
      en: 'en-LK',
      si: 'si-LK',
      ta: 'ta-LK',
    }[language]

    const generated = new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Colombo',
    }).format(new Date())

    const score = present(sample.fertilityScore)
      ? `${sample.fertilityScore} / 100`
      : text.unavailable

    const rating = statusText(
      sample.fertilityStatus ?? sample.fertility,
    )

    doc.body.innerHTML = `
      <main class="soil-pdf-report">
        <button type="button" id="save-report">
          ${escapeHtml(text.print)}
        </button>

        <header>
          <div class="brand">${escapeHtml(text.brand)}</div>
          <h1>${escapeHtml(text.title)}</h1>
          <p>${escapeHtml(text.subtitle)}</p>
          <p>
            ${escapeHtml(text.generated)}:
            ${escapeHtml(generated)}
          </p>
        </header>

        <h2>${escapeHtml(text.sampleDetails)}</h2>
        <table>
          <tbody>${metadataRows}</tbody>
        </table>

        <h2>${escapeHtml(text.fertility)}</h2>
        <table>
          <tbody>
            <tr>
              <th scope="row">${escapeHtml(text.score)}</th>
              <td>${escapeHtml(score)}</td>
            </tr>
            <tr>
              <th scope="row">${escapeHtml(text.rating)}</th>
              <td>${escapeHtml(rating)}</td>
            </tr>
          </tbody>
        </table>

        <h2>${escapeHtml(text.measurements)}</h2>
        <table>
          <thead>
            <tr>
              <th>${escapeHtml(text.parameter)}</th>
              <th>${escapeHtml(text.reading)}</th>
              <th>${escapeHtml(text.status)}</th>
            </tr>
          </thead>
          <tbody>${measurementRows}</tbody>
        </table>

        <p class="note">${escapeHtml(text.note)}</p>

        <footer>${escapeHtml(text.footer)}</footer>
      </main>
    `

    doc.getElementById('save-report').addEventListener('click', () => {
      reportWindow.focus()
      reportWindow.print()
    })

    // Allow layout and Sinhala/Tamil fonts to finish before printing.
    await new Promise(resolve => {
      reportWindow.requestAnimationFrame(resolve)
    })

    await doc.fonts.ready

    if (!reportWindow.closed) {
      reportWindow.focus()
      reportWindow.print()
    }
  } catch (error) {
    console.error('Soil report export failed:', error)

    if (!reportWindow.closed) {
      reportWindow.document.body.textContent = text.exportError
    }
  }
}

export function printSoilReport() {
  window.print()
}