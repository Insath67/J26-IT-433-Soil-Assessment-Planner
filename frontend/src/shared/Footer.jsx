import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Phone, Mail } from 'lucide-react'
import { siteContact } from './siteContact'
import './Footer.css'

const COPY = {
  en: {
    about:
      'Saru Bima brings soil assessment, soil health, crop recommendations and fertilizer guidance into one research workspace, helping farming communities make more informed decisions.',
    contact: 'Contact us',
    phone: 'Phone',
    email: 'Email',
    pending: 'Contact details will be added soon.',
    developed: 'Developed by Saru Bima Web Team',
    rights: 'All rights reserved.',
    home: 'Home',
  },

  si: {
    about:
      'සරු බිම පස හඳුනාගැනීම, පසේ සෞඛ්‍යය, බෝග නිර්දේශ සහ පොහොර මඟපෙන්වීම එකම පර්යේෂණ පද්ධතියකට එක් කරමින්, ගොවි ප්‍රජාවට වඩා දැනුවත් තීරණ ගැනීමට සහාය වෙයි.',
    contact: 'අප අමතන්න',
    phone: 'දුරකථන',
    email: 'විද්‍යුත් තැපෑල',
    pending: 'සම්බන්ධතා විස්තර ඉක්මනින් එක් කරනු ඇත.',
    developed: 'නිර්මාණය: Saru Bima Web Team',
    rights: 'සියලු හිමිකම් ඇවිරිණි.',
    home: 'මුල් පිටුව',
  },

  ta: {
    about:
      'சரு பிம மண் மதிப்பீடு, மண் நலம், பயிர் பரிந்துரைகள் மற்றும் உர வழிகாட்டலை ஒரே ஆராய்ச்சித் தளத்தில் இணைத்து, விவசாயிகள் அறிவார்ந்த முடிவுகளை எடுக்க உதவுகிறது.',
    contact: 'எங்களைத் தொடர்புகொள்ள',
    phone: 'தொலைபேசி',
    email: 'மின்னஞ்சல்',
    pending: 'தொடர்பு விவரங்கள் விரைவில் சேர்க்கப்படும்.',
    developed: 'உருவாக்கம்: Saru Bima Web Team',
    rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    home: 'முகப்பு',
  },
}

export default function Footer() {
  const { i18n } = useTranslation()
  const language = i18n.resolvedLanguage || 'en'
  const text = COPY[language] || COPY.en
  const year = new Date().getFullYear()

  const hasContact =
    siteContact.phones.length > 0 || Boolean(siteContact.email)

  return (
    <footer className="saru-footer">
      <div className="saru-footer-main">
        <div className="saru-footer-about">
          <Link
            to="/"
            className="saru-footer-brand"
            aria-label={`Saru Bima — ${text.home}`}
          >
            <span className="saru-footer-logo">
              <Leaf size={29} aria-hidden="true" />
            </span>

            <span>
              <strong className="brand-si" lang="si">
                සරු බිම
              </strong>
              <small className="brand-en" lang="en">
                SARU BIMA
              </small>
            </span>
          </Link>

          <p>{text.about}</p>
        </div>

        <div className="saru-footer-contact">
          <h2>{text.contact}</h2>

          {siteContact.phones.length > 0 && (
            <div className="saru-contact-row">
              <Phone size={20} aria-hidden="true" />

              <div>
                <span className="saru-contact-label">
                  {text.phone}
                </span>

                {siteContact.phones.map(phone => (
                  <a key={phone.href} href={phone.href}>
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {siteContact.email && (
            <div className="saru-contact-row">
              <Mail size={20} aria-hidden="true" />

              <div>
                <span className="saru-contact-label">
                  {text.email}
                </span>

                <a href={`mailto:${siteContact.email}`}>
                  {siteContact.email}
                </a>
              </div>
            </div>
            
          )}

          {!hasContact && (
            <p className="saru-contact-pending">
              {text.pending}
            </p>
          )}
        </div>
      </div>

      <div className="saru-footer-bottom">
        <span>
          © {year} Saru Bima. {text.rights}
        </span>

        <span>{text.developed}</span>
      </div>
    </footer>
  )
}