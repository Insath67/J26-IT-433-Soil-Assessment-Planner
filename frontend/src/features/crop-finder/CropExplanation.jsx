import { useTranslation } from 'react-i18next'

const TEXT = {
  en: {
    title: 'Why this crop?',
    otherTitle: 'What affects this crop’s score?',
    intro: 'See how your inputs influenced the model’s score for this crop.',
    positive: 'Raised the model score',
    negative: 'Lowered the model score',
    neutral: 'No contribution for this result',
    strongestPositive: 'Strongest supporting factor',
    strongestNegative: 'Strongest opposing factor',
    noPositive: 'No positive contribution in this result.',
    noNegative: 'No negative contribution in this result.',
    value: 'Input used',
    details: 'View technical SHAP values',
    impact: 'SHAP contribution',
    note: 'These reasons explain the model’s score. They do not prove crop suitability or tell you what to change in the field.',
    technical: 'Values are in raw model-score units, not percentages. Bar lengths compare contribution sizes within this result.',
    empty: 'Run an analysis to see the reasons behind your crop results.',
    missing: 'Explanation data is unavailable for this result.',
    warning: 'Some inputs are outside the training range. Review the input warnings before using this result.',
  },

  si: {
    title: 'මේ බෝගය තෝරාගත්තේ ඇයි?',
    otherTitle: 'මේ බෝගයේ ලකුණට බලපෑ හේතු',
    intro: 'ඔබ ඇතුළත් කළ දත්ත මේ බෝගයේ model ලකුණට බලපෑ ආකාරය බලන්න.',
    positive: 'Model ලකුණ ඉහළ දැමූ හේතු',
    negative: 'Model ලකුණ අඩු කළ හේතු',
    neutral: 'මෙම ප්‍රතිඵලයට දායකත්වයක් නැති දත්ත',
    strongestPositive: 'වැඩියෙන්ම සහාය දුන් දත්තය',
    strongestNegative: 'ලකුණ වැඩියෙන්ම අඩු කළ දත්තය',
    noPositive: 'මෙම ප්‍රතිඵලයේ ධනාත්මක දායකත්වයක් නැත.',
    noNegative: 'මෙම ප්‍රතිඵලයේ ඍණාත්මක දායකත්වයක් නැත.',
    value: 'භාවිත කළ අගය',
    details: 'තාක්ෂණික SHAP අගයන් බලන්න',
    impact: 'SHAP දායකත්වය',
    note: 'මේ හේතු පැහැදිලි කරන්නේ model ලකුණයි. ඒවා බෝගයේ සුදුසුකම තහවුරු කිරීමක් හෝ ගොවිබිමේ කළ යුතු වෙනස්කම් පිළිබඳ උපදෙස් නොවේ.',
    technical: 'අගයන් raw model-score ඒකකවලින් දක්වයි; ප්‍රතිශත නොවේ. තීරුවල දිග මෙම ප්‍රතිඵලයේ දායකත්ව ප්‍රමාණ සසඳයි.',
    empty: 'බෝග ප්‍රතිඵලයට බලපෑ හේතු බැලීමට විශ්ලේෂණයක් කරන්න.',
    missing: 'මෙම ප්‍රතිඵලයට පැහැදිලි කිරීමේ දත්ත නොමැත.',
    warning: 'සමහර inputs training පරාසයෙන් පිටත ඇත. ප්‍රතිඵලය භාවිත කිරීමට පෙර input අනතුරු ඇඟවීම් බලන්න.',
  },

  ta: {
    title: 'இந்தப் பயிர் ஏன் தேர்ந்தெடுக்கப்பட்டது?',
    otherTitle: 'இந்தப் பயிரின் மதிப்பெண்ணைப் பாதித்த காரணிகள்',
    intro: 'உங்கள் உள்ளீடுகள் இந்தப் பயிரின் மாதிரி மதிப்பெண்ணை எவ்வாறு பாதித்தன என்பதைப் பாருங்கள்.',
    positive: 'மாதிரி மதிப்பெண்ணை உயர்த்திய காரணிகள்',
    negative: 'மாதிரி மதிப்பெண்ணைக் குறைத்த காரணிகள்',
    neutral: 'இந்த முடிவில் பங்களிப்பு இல்லாத உள்ளீடுகள்',
    strongestPositive: 'அதிக ஆதரவளித்த காரணி',
    strongestNegative: 'மதிப்பெண்ணை அதிகம் குறைத்த காரணி',
    noPositive: 'இந்த முடிவில் நேர்மறைப் பங்களிப்பு இல்லை.',
    noNegative: 'இந்த முடிவில் எதிர்மறைப் பங்களிப்பு இல்லை.',
    value: 'பயன்படுத்திய மதிப்பு',
    details: 'தொழில்நுட்ப SHAP மதிப்புகளைக் காண்க',
    impact: 'SHAP பங்களிப்பு',
    note: 'இந்தக் காரணங்கள் மாதிரியின் மதிப்பெண்ணை விளக்குகின்றன. இவை பயிரின் பொருத்தத்தை உறுதிப்படுத்தவோ வயலில் செய்ய வேண்டிய மாற்றங்களை அறிவுறுத்தவோ இல்லை.',
    technical: 'மதிப்புகள் மூல மாதிரி மதிப்பெண் அலகுகளில் உள்ளன; சதவீதங்கள் அல்ல. பட்டைகளின் நீளம் இந்த முடிவின் பங்களிப்புகளை ஒப்பிடுகிறது.',
    empty: 'பயிர் முடிவுகளுக்கான காரணங்களைக் காண ஒரு பகுப்பாய்வைச் செய்யுங்கள்.',
    missing: 'இந்த முடிவிற்கான விளக்கத் தரவு இல்லை.',
    warning: 'சில உள்ளீடுகள் பயிற்சித் தரவு வரம்பிற்கு வெளியே உள்ளன. முடிவைப் பயன்படுத்தும் முன் உள்ளீட்டு எச்சரிக்கைகளைப் பாருங்கள்.',
  },
}

export default function CropExplanation({
  active,
  top,
  warnings = [],
}) {
  const { t, i18n } = useTranslation('cropFinder')

  const language = (
    i18n.resolvedLanguage || i18n.language || 'en'
  ).split('-')[0]

  const text = TEXT[language] || TEXT.en
  const locale = { en: 'en-LK', si: 'si-LK', ta: 'ta-LK' }[language] || 'en-LK'

  const number = value =>
    typeof value === 'number' && Number.isFinite(value)
      ? new Intl.NumberFormat(locale, {
          maximumFractionDigits: 2,
        }).format(value)
      : String(value ?? '—')

  const factors = (active?.factors || [])
    .filter(factor => Number.isFinite(factor.shap_value))
    .slice()
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value))

  const positive = factors.filter(factor => factor.shap_value > 0)
  const negative = factors.filter(factor => factor.shap_value < 0)
  const neutral = factors.filter(factor => factor.shap_value === 0)

  const maximum = Math.max(
    ...factors.map(factor => Math.abs(factor.shap_value)),
    0.000001,
  )

  const featureName = factor =>
    t(factor.feature, {
      defaultValue: factor.label || factor.feature,
    })

  function summaryCard(factor, type, title, emptyText) {
    return (
      <div className={`cf-reason-summary cf-reason-${type}`}>
        <span className="cf-reason-caption">{title}</span>

        {factor ? (
          <>
            <strong>
              <span aria-hidden="true">
                {type === 'positive' ? '↑ ' : '↓ '}
              </span>
              {featureName(factor)}
            </strong>

            <p>
              {text.value}: <b>{number(factor.value)}</b>
            </p>
          </>
        ) : (
          <p>{emptyText}</p>
        )}
      </div>
    )
  }

  function factorGroup(items, type, title, symbol) {
    if (!items.length) return null

    return (
      <section className={`cf-reason-group cf-reason-${type}`}>
        <h3>
          <span aria-hidden="true">{symbol}</span>
          {title}
        </h3>

        <ul>
          {items.map(factor => (
            <li key={factor.feature}>
              <div className="cf-reason-row">
                <strong>{featureName(factor)}</strong>

                <span>
                  {text.value}: <b>{number(factor.value)}</b>
                </span>
              </div>

              <div className="cf-reason-track" aria-hidden="true">
                <span
                  style={{
                    width: `${Math.abs(factor.shap_value) / maximum * 100}%`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  return (
    <section className="cf-reasons" aria-labelledby="why-title">
      <header className="cf-reasons-header">
        <div>
          <span className="cf-reasons-label">
            {t('explainable')}
          </span>

          <h2 id="why-title" tabIndex={-1}>
            {active && active.crop !== top
              ? text.otherTitle
              : text.title}
          </h2>

          {active && <p>{text.intro}</p>}
        </div>

        {active && (
          <span className="cf-reasons-crop">
            {t(active.crop, { defaultValue: active.crop })}
          </span>
        )}
      </header>

      {!active ? (
        <p className="cf-reasons-empty">{text.empty}</p>
      ) : factors.length === 0 ? (
        <p className="cf-reasons-empty">{text.missing}</p>
      ) : (
        <div className="cf-reasons-body">
          {warnings.length > 0 && (
            <p className="cf-reasons-warning" role="status">
              {text.warning}
            </p>
          )}

          <div className="cf-reason-summaries">
            {summaryCard(
              positive[0],
              'positive',
              text.strongestPositive,
              text.noPositive,
            )}

            {summaryCard(
              negative[0],
              'negative',
              text.strongestNegative,
              text.noNegative,
            )}
          </div>

          <div className="cf-reason-groups">
            {factorGroup(positive, 'positive', text.positive, '↑')}
            {factorGroup(negative, 'negative', text.negative, '↓')}
            {factorGroup(neutral, 'neutral', text.neutral, '—')}
          </div>

          <p className="cf-reasons-note">{text.note}</p>

          <details className="cf-reasons-technical">
            <summary>{text.details}</summary>

            <p>{text.technical}</p>

            <dl>
              {factors.map(factor => (
                <div key={factor.feature}>
                  <dt>{featureName(factor)}</dt>
                  <dd>
                    {text.impact}:{' '}
                    {new Intl.NumberFormat(locale, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 5,
                      signDisplay: 'exceptZero',
                    }).format(factor.shap_value)}
                  </dd>
                </div>
              ))}
            </dl>
          </details>
        </div>
      )}
    </section>
  )
}