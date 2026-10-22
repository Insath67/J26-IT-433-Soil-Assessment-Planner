import { useTranslation } from 'react-i18next'

// Each row: English key/text, Sinhala text, Tamil text.
const rows = [
  ['Soil Nutrient Prediction', 'පසේ පෝෂක පුරෝකථනය', 'மண் ஊட்டச்சத்து கணிப்பு'],
  [
    'Estimate N, P, K and pH from a selected soil category. These are research dataset estimates, not sensor readings.',
    'තෝරාගත් පස් වර්ගය අනුව N, P, K සහ pH ඇස්තමේන්තු කරන්න. මේවා පර්යේෂණ දත්ත මත ඇස්තමේන්තු වන අතර සංවේදක මිනුම් නොවේ.',
    'தேர்ந்தெடுத்த மண் வகையிலிருந்து N, P, K மற்றும் pH மதிப்புகளை மதிப்பிடுங்கள். இவை ஆராய்ச்சித் தரவு மதிப்பீடுகள்; உணரி அளவீடுகள் அல்ல.',
  ],
  [
    'Sample Identification & Geographical Origin',
    'සාම්පලය සහ එය ලබාගත් ප්‍රදේශය',
    'மாதிரி அடையாளமும் புவியியல் இடமும்',
  ],
  ['Sample ID', 'සාම්පල අංකය', 'மாதிரி எண்'],
  ['Location / District', 'ස්ථානය / දිස්ත්‍රික්කය', 'இடம் / மாவட்டம்'],
  ['Agro-Ecological Sub-Zone', 'කෘෂි පාරිසරික උපකලාපය', 'வேளாண் சூழலியல் துணை வலயம்'],
  ['Soil Type', 'පස් වර්ගය', 'மண் வகை'],
  ['Use 1 to 4 numbers', 'ඉලක්කම් 1 සිට 4 දක්වා භාවිත කරන්න', '1 முதல் 4 இலக்கங்களைப் பயன்படுத்தவும்'],
  [
    'Use English letters and spaces only',
    'ඉංග්‍රීසි අකුරු සහ හිස්තැන් පමණක් භාවිත කරන්න',
    'ஆங்கில எழுத்துகளையும் இடைவெளிகளையும் மட்டும் பயன்படுத்தவும்',
  ],
  ['Cancel', 'අවලංගු කරන්න', 'ரத்து செய்யவும்'],
  ['Estimating...', 'ඇස්තමේන්තු කරමින්…', 'மதிப்பிடப்படுகிறது…'],
  ['Predict Soil Nutrients', 'පසේ පෝෂක පුරෝකථනය කරන්න', 'மண் ஊட்டச்சத்துகளைக் கணிக்கவும்'],
  [
    'Sample ID must contain 1 to 4 numbers.',
    'සාම්පල අංකයට ඉලක්කම් 1 සිට 4 දක්වා ඇතුළත් විය යුතුයි.',
    'மாதிரி எண்ணில் 1 முதல் 4 இலக்கங்கள் இருக்க வேண்டும்.',
  ],
  [
    'Location must contain English letters and spaces only.',
    'ස්ථානය සඳහා ඉංග්‍රීසි අකුරු සහ හිස්තැන් පමණක් භාවිත කරන්න.',
    'இடத்தின் பெயரில் ஆங்கில எழுத்துகளும் இடைவெளிகளும் மட்டும் இருக்க வேண்டும்.',
  ],
  [
    'Prediction failed. Please check your inputs and try again.',
    'පුරෝකථනය අසාර්ථකයි. ඇතුළත් කළ දත්ත පරීක්ෂා කර නැවත උත්සාහ කරන්න.',
    'கணிப்பு தோல்வியடைந்தது. உள்ளீடுகளைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
  ],
  [
    'Could not contact the prediction server.',
    'පුරෝකථන සේවාදායකයට සම්බන්ධ වීමට නොහැකි විය.',
    'கணிப்பு சேவையகத்தைத் தொடர்புகொள்ள முடியவில்லை.',
  ],

  ['Loamy soil', 'ලෝම පස', 'இருவாட்டி மண்'],
  ['Red-yellow Podzolic (Ultisol)', 'රතු-කහ පොඩ්සොලික් පස (Ultisol)', 'சிவப்பு-மஞ்சள் பொட்ஸோலிக் மண் (Ultisol)'],
  ['Reddish brown latsolic', 'රතු-දුඹුරු ලැටසොලික් පස', 'சிவப்பு-பழுப்பு லட்டசோலிக் மண்'],
  [
    'Kegalle (Wet Zone Low Country - WL2a)',
    'කෑගල්ල (පහතරට තෙත් කලාපය - WL2a)',
    'கேகாலை (தாழ்நாட்டு ஈர வலயம் - WL2a)',
  ],
  [
    'Kegalle (Wet Zone Low Country - WL2b)',
    'කෑගල්ල (පහතරට තෙත් කලාපය - WL2b)',
    'கேகாலை (தாழ்நாட்டு ஈர வலயம் - WL2b)',
  ],
  ['Kegalle', 'කෑගල්ල', 'கேகாலை'],
  ['Galle', 'ගාල්ල', 'காலி'],
  ['Kandy', 'මහනුවර', 'கண்டி'],
  ['Nuwara Eliya', 'නුවරඑළිය', 'நுவரெலியா'],
  [
    'Kegalle (Mid-Country Wet Zone)',
    'කෑගල්ල (මැදරට තෙත් කලාපය)',
    'கேகாலை (மத்தியநாட்டு ஈர வலயம்)',
  ],
  [
    'Galle (Low-Country Wet Zone)',
    'ගාල්ල (පහතරට තෙත් කලාපය)',
    'காலி (தாழ்நாட்டு ஈர வலயம்)',
  ],
  [
    'Kandy (Mid-Country Wet Zone)',
    'මහනුවර (මැදරට තෙත් කලාපය)',
    'கண்டி (மத்தியநாட்டு ஈர வலயம்)',
  ],
  [
    'Nuwara Eliya (Up-Country Wet Zone)',
    'නුවරඑළිය (උඩරට තෙත් කලාපය)',
    'நுவரெலியா (மேல்நாட்டு ஈர வலயம்)',
  ],

  ['Historical Repository', 'සාම්පල ලේඛනාගාරය', 'மாதிரி காப்பகம்'],
  ['{{total}} records', 'වාර්තා {{total}}', '{{total}} பதிவுகள்'],
  ['Soil Analysis History', 'පස් විශ්ලේෂණ ඉතිහාසය', 'மண் பகுப்பாய்வு வரலாறு'],
  [
    'Saved soil samples, measurements and fertility assessments.',
    'සුරැකි පස් සාම්පල, මිනුම් සහ සාරවත් බවේ ඇගයීම්.',
    'சேமிக்கப்பட்ட மண் மாதிரிகள், அளவீடுகள் மற்றும் வள மதிப்பீடுகள்.',
  ],
  ['New Analysis', 'නව විශ්ලේෂණයක්', 'புதிய பகுப்பாய்வு'],
  [
    'Search by Sample ID or District...',
    'සාම්පල අංකය හෝ දිස්ත්‍රික්කය අනුව සොයන්න…',
    'மாதிரி எண் அல்லது மாவட்டம் மூலம் தேடுங்கள்…',
  ],
  [
    'Showing {{shown}} of {{total}} samples',
    'සාම්පල {{total}} අතරින් {{shown}} පෙන්වයි',
    '{{total}} மாதிரிகளில் {{shown}} காட்டப்படுகின்றன',
  ],
  ['Location / Agro-Zone', 'ස්ථානය / කෘෂි කලාපය', 'இடம் / வேளாண் வலயம்'],
  ['Date', 'දිනය', 'தேதி'],
  ['pH Value', 'pH අගය', 'pH மதிப்பு'],
  ['Fertility Rating', 'සාරවත් බවේ මට්ටම', 'மண் வள நிலை'],
  ['Actions', 'ක්‍රියාමාර්ග', 'செயல்கள்'],
  [
    'No soil analysis records match your search.',
    'ඔබේ සෙවුමට ගැළපෙන පස් විශ්ලේෂණ වාර්තා නැත.',
    'உங்கள் தேடலுக்குப் பொருத்தமான மண் பகுப்பாய்வுப் பதிவுகள் இல்லை.',
  ],
  ['Download PDF Report', 'PDF වාර්තාව බාගන්න', 'PDF அறிக்கையைப் பதிவிறக்கவும்'],
  ['Load into Dashboard', 'දළ විශ්ලේෂණයට පූරණය කරන්න', 'கண்ணோட்டத்தில் ஏற்றவும்'],
  ['Dashboard', 'දළ විශ්ලේෂණය', 'கண்ணோட்டம்'],
  ['Full Detailed Analysis', 'සම්පූර්ණ විශ්ලේෂණය', 'முழுமையான பகுப்பாய்வு'],
  ['Inspect', 'විස්තර බලන්න', 'விவரங்களைப் பார்க்கவும்'],
  ['Delete Sample', 'සාම්පලය මකන්න', 'மாதிரியை நீக்கவும்'],
  [
    'Remove sample {{id}} from history?',
    '{{id}} සාම්පලය ඉතිහාසයෙන් මකන්නද?',
    '{{id}} மாதிரியை வரலாற்றிலிருந்து நீக்கவா?',
  ],
  ['High', 'ඉහළ', 'அதிகம்'],
  ['Medium', 'මධ්‍යම', 'நடுத்தரம்'],
  ['Low', 'අඩු', 'குறைவு'],
  ['Unavailable', 'තොරතුරු නොමැත', 'தகவல் இல்லை'],

  ['Hardware Telemetry', 'උපාංග දත්ත', 'சாதனத் தரவுகள்'],
  ['Kegalle Field Unit #01', 'කෑගල්ල ක්ෂේත්‍ර ඒකකය #01', 'கேகாலை கள அலகு #01'],
  ['IoT Field Device Status', 'IoT ක්ෂේත්‍ර උපාංගයේ තත්ත්වය', 'IoT களச் சாதன நிலை'],
  [
    'Diagnostics and communication health of the ESP32 and soil sensors.',
    'ESP32 සහ පාංශු සංවේදකවල ක්‍රියාකාරීත්වය සහ සම්බන්ධතා තත්ත්වය.',
    'ESP32 மற்றும் மண் உணரிகளின் செயல்பாடும் தொடர்பு நிலையும்.',
  ],
  ['Checking Device...', 'උපාංගය පරීක්ෂා කරමින්…', 'சாதனம் சரிபார்க்கப்படுகிறது…'],
  ['Refresh Readings', 'මිනුම් යාවත්කාලීන කරන්න', 'அளவீடுகளைப் புதுப்பிக்கவும்'],
  ['Live Sensor Readings', 'සජීවී සංවේදක මිනුම්', 'நேரடி உணரி அளவீடுகள்'],
  [
    'The IoT device is connected and the latest sensor values are available.',
    'IoT උපාංගය සම්බන්ධ වී ඇති අතර නවතම සංවේදක අගයන් ලබාගත හැක.',
    'IoT சாதனம் இணைக்கப்பட்டுள்ளது; சமீபத்திய உணரி மதிப்புகள் கிடைக்கின்றன.',
  ],
  [
    'The IoT device is disconnected. Connect the ESP32 device to view soil readings.',
    'IoT උපාංගය සම්බන්ධ වී නැත. පසේ මිනුම් බැලීමට ESP32 උපාංගය සම්බන්ධ කරන්න.',
    'IoT சாதனம் இணைக்கப்படவில்லை. மண் அளவீடுகளைக் காண ESP32 சாதனத்தை இணைக்கவும்.',
  ],
  ['Device Connected', 'උපාංගය සම්බන්ධයි', 'சாதனம் இணைக்கப்பட்டுள்ளது'],
  ['Device Offline', 'උපාංගය සම්බන්ධ වී නැත', 'சாதனம் இணைக்கப்படவில்லை'],
  ['The device could not be reached.', 'උපාංගයේ තත්ත්වය ලබාගත නොහැකි විය.', 'சாதன நிலையைப் பெற முடியவில்லை.'],
  ['Microcontroller', 'ක්ෂුද්‍ර පාලකය', 'நுண்கட்டுப்படுத்தி'],
  ['Wireless Connectivity', 'රැහැන් රහිත සම්බන්ධතාව', 'கம்பியில்லா இணைப்பு'],
  ['Disconnected', 'විසන්ධි වී ඇත', 'துண்டிக்கப்பட்டுள்ளது'],
  ['Signal: {{value}}', 'සංඥාව: {{value}}', 'சமிக்ஞை: {{value}}'],
  ['Signal unavailable', 'සංඥා තොරතුරු නොමැත', 'சமிக்ஞைத் தகவல் இல்லை'],
  ['Battery Level', 'බැටරි මට්ටම', 'மின்கல நிலை'],
  ['Heartbeat', 'උපාංගයේ ප්‍රතිචාරය', 'சாதனத்தின் தொடர்புச் சமிக்ஞை'],
  ['Last ping: {{value}}', 'අවසන් ප්‍රතිචාරය: {{value}}', 'கடைசி பதில்: {{value}}'],
  ['No heartbeat received', 'උපාංගයෙන් ප්‍රතිචාරයක් ලැබී නැත', 'சாதனத்திலிருந்து பதில் கிடைக்கவில்லை'],
  ['Connected Soil Probes', 'පාංශු සංවේදක', 'மண் உணரிகள்'],
  [
    'Hardware channel allocation and sensor bus health.',
    'උපාංග සම්බන්ධතා සහ සංවේදක සන්නිවේදන තත්ත්වය.',
    'சாதன இணைப்புகளும் உணரித் தொடர்பு நிலையும்.',
  ],
  ['Probe Description', 'සංවේදක විස්තරය', 'உணரி விவரம்'],
  ['Hardware Protocol / Pin', 'සන්නිවේදන ක්‍රමය / Pin', 'தொடர்பு நெறிமுறை / Pin'],
  ['Operational Status', 'ක්‍රියාකාරී තත්ත්වය', 'செயல்பாட்டு நிலை'],
  ['Sensor Calibration Health', 'සංවේදක ක්‍රමාංකන තත්ත්වය', 'உணரி அளவுத்திருத்த நிலை'],
  ['No sensor details available.', 'සංවේදක විස්තර නොමැත.', 'உணரி விவரங்கள் இல்லை.'],
  ['Offline', 'සම්බන්ධ වී නැත', 'இணைக்கப்படவில்லை'],
  ['Online', 'සම්බන්ධයි', 'இணைக்கப்பட்டுள்ளது'],
  ['Active', 'ක්‍රියාත්මකයි', 'செயலில் உள்ளது'],
  ['No heartbeat', 'ප්‍රතිචාරයක් නැත', 'பதில் இல்லை'],
  ['Calibrated & Online', 'ක්‍රමාංකනය කර සම්බන්ධ කර ඇත', 'அளவுத்திருத்தப்பட்டு இணைக்கப்பட்டுள்ளது'],
  ['Optimal Precision', 'ප්‍රශස්ත නිරවද්‍යතාව', 'உகந்த துல்லியம்'],
  ['Active Reading', 'මිනුම් ලබාගනිමින් පවතී', 'அளவீடு பெறப்படுகிறது'],
  ['Stable', 'ස්ථාවරයි', 'நிலையானது'],
  ['Soil pH', 'පසේ pH අගය', 'மண்ணின் pH'],
  ['Nitrogen (N)', 'නයිට්‍රජන් (N)', 'நைட்ரஜன் (N)'],
  ['Phosphorus (P)', 'පොස්පරස් (P)', 'பொஸ்பரஸ் (P)'],
  ['Potassium (K)', 'පොටෑසියම් (K)', 'பொட்டாசியம் (K)'],
  ['Moisture', 'තෙතමනය', 'ஈரப்பதம்'],
  ['Temperature', 'උෂ්ණත්වය', 'வெப்பநிலை'],
  ['Electrical Conductivity', 'විද්‍යුත් සන්නායකතාව', 'மின் கடத்துத்திறன்'],
  ['7-in-1 NPK Soil Modbus Probe', '7-in-1 NPK පාංශු Modbus සංවේදකය', '7-in-1 NPK மண் Modbus உணரி'],
  ['Glass pH Industrial Electrode', 'කාර්මික වීදුරු pH ඉලෙක්ට්‍රෝඩය', 'தொழில்துறை கண்ணாடி pH மின்முனை'],
  ['Capacitive Soil Moisture Probe v2', 'ධාරිත්‍රක පාංශු තෙතමන සංවේදකය v2', 'கொள்ளளவு மண் ஈரப்பத உணரி v2'],
  ['DS18B20 Waterproof Temp Probe', 'DS18B20 ජලයට ඔරොත්තු දෙන උෂ්ණත්ව සංවේදකය', 'DS18B20 நீர்ப்புகா வெப்பநிலை உணரி'],
]

const resources = {
  en: Object.fromEntries(rows.map(([en]) => [en, en])),
  si: Object.fromEntries(rows.map(([en, si]) => [en, si])),
  ta: Object.fromEntries(rows.map(([en, , ta]) => [en, ta])),
}

export default resources

export function useSoilPageText() {
  const { t } = useTranslation('soilHealthPages')

  return (text, values = {}) => {
    const key = String(text ?? '')

    return t(key, {
      ...values,
      keySeparator: false,
      nsSeparator: false,
      defaultValue: key,
    })
  }
}