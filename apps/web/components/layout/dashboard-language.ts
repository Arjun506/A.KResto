export type DashboardLanguageCode =
  | 'en'
  | 'hi'
  | 'bn'
  | 'te'
  | 'mr'
  | 'ta'
  | 'ur'
  | 'gu'
  | 'kn'
  | 'ml'
  | 'or'
  | 'pa'
  | 'as'
  | 'mai'
  | 'sat'
  | 'ks'
  | 'ne'
  | 'sd'
  | 'kok'
  | 'mni'
  | 'doi'
  | 'brx'
  | 'sa';

export const dashboardLanguages: Array<{
  code: DashboardLanguageCode;
  name: string;
  nativeName: string;
}> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी' },
  { code: 'mni', name: 'Manipuri', nativeName: 'মৈতৈলোন্' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
];

type ShellCopy = {
  adminPanel: string;
  plan: string;
  validTill: string;
  managePlan: string;
  language: string;
  notifications: string;
  noAlerts: string;
  clearAll: string;
  loggedInId: string;
  systemSettings: string;
  signOut: string;
  menu: Record<string, string>;
};

const englishMenu = {
  Dashboard: 'Dashboard',
  Orders: 'Orders',
  'Menu Management': 'Menu Management',
  'Table Management': 'Table Management',
  'QR Code': 'QR Code',
  Customers: 'Customers',
  Reservations: 'Reservations',
  Payments: 'Payments',
  'Offers & Coupons': 'Offers & Coupons',
  'Inventory / Stock': 'Inventory / Stock',
  'Purchase Management': 'Purchase Management',
  Expenses: 'Expenses',
  'Staff Management': 'Staff Management',
  Attendance: 'Attendance',
  'Reports & Analytics': 'Reports & Analytics',
  'Feedback & Reviews': 'Feedback & Reviews',
  'Loyalty & Rewards': 'Loyalty & Rewards',
  Notifications: 'Notifications',
  Settings: 'Settings',
  Subscription: 'Subscription',
};

const translations: Partial<Record<DashboardLanguageCode, ShellCopy>> = {
  en: {
    adminPanel: 'Admin Panel',
    plan: 'Plan',
    validTill: 'Valid till',
    managePlan: 'Manage Plan',
    language: 'Language',
    notifications: 'Notifications',
    noAlerts: 'No new alerts',
    clearAll: 'Clear All',
    loggedInId: 'Logged In ID',
    systemSettings: 'System Settings',
    signOut: 'Sign Out',
    menu: englishMenu,
  },
  hi: {
    adminPanel: 'एडमिन पैनल',
    plan: 'प्लान',
    validTill: 'मान्य तिथि',
    managePlan: 'प्लान मैनेज करें',
    language: 'भाषा',
    notifications: 'सूचनाएं',
    noAlerts: 'नई सूचना नहीं',
    clearAll: 'सब साफ करें',
    loggedInId: 'लॉगिन आईडी',
    systemSettings: 'सिस्टम सेटिंग',
    signOut: 'लॉगआउट',
    menu: {
      Dashboard: 'डैशबोर्ड',
      Orders: 'ऑर्डर',
      'Menu Management': 'मेन्यू मैनेजमेंट',
      'Table Management': 'टेबल मैनेजमेंट',
      'QR Code': 'QR कोड',
      Customers: 'ग्राहक',
      Reservations: 'रिजर्वेशन',
      Payments: 'पेमेंट',
      'Offers & Coupons': 'ऑफर और कूपन',
      'Inventory / Stock': 'इन्वेंटरी / स्टॉक',
      'Purchase Management': 'खरीद मैनेजमेंट',
      Expenses: 'खर्च',
      'Staff Management': 'स्टाफ मैनेजमेंट',
      Attendance: 'हाजिरी',
      'Reports & Analytics': 'रिपोर्ट और एनालिटिक्स',
      'Feedback & Reviews': 'फीडबैक और रिव्यू',
      'Loyalty & Rewards': 'लॉयल्टी और रिवॉर्ड',
      Notifications: 'सूचनाएं',
      Settings: 'सेटिंग',
      Subscription: 'सब्सक्रिप्शन',
    },
  },
};

const shellCopyFallbacks: Record<Exclude<DashboardLanguageCode, 'en' | 'hi'>, Partial<ShellCopy>> = {
  bn: { adminPanel: 'অ্যাডমিন প্যানেল', language: 'ভাষা' },
  te: { adminPanel: 'అడ్మిన్ ప్యానెల్', language: 'భాష' },
  mr: { adminPanel: 'अ‍ॅडमिन पॅनेल', language: 'भाषा' },
  ta: { adminPanel: 'நிர்வாக பலகம்', language: 'மொழி' },
  ur: { adminPanel: 'ایڈمن پینل', language: 'زبان' },
  gu: { adminPanel: 'એડમિન પેનલ', language: 'ભાષા' },
  kn: { adminPanel: 'ಅಡ್ಮಿನ್ ಪ್ಯಾನೆಲ್', language: 'ಭಾಷೆ' },
  ml: { adminPanel: 'അഡ്മിൻ പാനൽ', language: 'ഭാഷ' },
  or: { adminPanel: 'ଆଡମିନ ପ୍ୟାନେଲ୍', language: 'ଭାଷା' },
  pa: { adminPanel: 'ਐਡਮਿਨ ਪੈਨਲ', language: 'ਭਾਸ਼ਾ' },
  as: { adminPanel: 'এডমিন পেনেল', language: 'ভাষা' },
  mai: { adminPanel: 'एडमिन पैनल', language: 'भाषा' },
  sat: { adminPanel: 'Admin Panel', language: 'Language' },
  ks: { adminPanel: 'ایڈمن پینل', language: 'زبان' },
  ne: { adminPanel: 'एडमिन प्यानल', language: 'भाषा' },
  sd: { adminPanel: 'ايڊمن پينل', language: 'ٻولي' },
  kok: { adminPanel: 'एडमिन पॅनल', language: 'भास' },
  mni: { adminPanel: 'Admin Panel', language: 'Language' },
  doi: { adminPanel: 'एडमिन पैनल', language: 'भाषा' },
  brx: { adminPanel: 'Admin Panel', language: 'Language' },
  sa: { adminPanel: 'प्रशासन पटलम्', language: 'भाषा' },
};

export function getDashboardCopy(code: DashboardLanguageCode): ShellCopy {
  const english = translations.en!;
  if (code === 'en' || code === 'hi') return translations[code]!;

  return {
    ...english,
    ...shellCopyFallbacks[code],
    menu: english.menu,
  };
}

