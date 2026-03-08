import { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'bn' | 'hi';

const translations: Record<string, Record<Lang, string>> = {
  dashboard: { en: 'Dashboard', bn: 'ড্যাশবোর্ড', hi: 'डैशबोर्ड' },
  customers: { en: 'Customers', bn: 'গ্রাহকরা', hi: 'ग्राहक' },
  ledger: { en: 'Ledger', bn: 'খাতা', hi: 'खाता' },
  sales: { en: 'Sales & Expenses', bn: 'বিক্রয় ও খরচ', hi: 'बिक्री और खर्च' },
  inventory: { en: 'Inventory', bn: 'ইনভেন্টরি', hi: 'इन्वेंटरी' },
  reports: { en: 'Reports', bn: 'রিপোর্ট', hi: 'रिपोर्ट' },
  reminders: { en: 'Reminders', bn: 'রিমাইন্ডার', hi: 'रिमाइंडर' },
  settings: { en: 'Settings', bn: 'সেটিংস', hi: 'सेटिंग्स' },
  install: { en: 'Install App', bn: 'অ্যাপ ইনস্টল', hi: 'ऐप इंस्टॉल' },
  totalCashIn: { en: 'Total Cash In', bn: 'মোট ক্যাশ ইন', hi: 'कुल कैश इन' },
  totalCashOut: { en: 'Total Cash Out', bn: 'মোট ক্যাশ আউট', hi: 'कुल कैश आउट' },
  totalDue: { en: 'Total Due', bn: 'মোট বকেয়া', hi: 'कुल बकाया' },
  activeCustomers: { en: 'Active Customers', bn: 'সক্রিয় গ্রাহক', hi: 'सक्रिय ग्राहक' },
  addCustomer: { en: 'Add Customer', bn: 'গ্রাহক যোগ করুন', hi: 'ग्राहक जोड़ें' },
  newEntry: { en: 'New Entry', bn: 'নতুন এন্ট্রি', hi: 'नई प्रविष्टि' },
  given: { en: 'Given', bn: 'দেওয়া', hi: 'दिया' },
  received: { en: 'Received', bn: 'নেওয়া', hi: 'लिया' },
  balance: { en: 'Balance', bn: 'ব্যালেন্স', hi: 'बैलेंस' },
  search: { en: 'Search...', bn: 'খুঁজুন...', hi: 'खोजें...' },
  noData: { en: 'No data found', bn: 'কোনো তথ্য পাওয়া যায়নি', hi: 'कोई डेटा नहीं मिला' },
  save: { en: 'Save', bn: 'সংরক্ষণ', hi: 'सहेजें' },
  cancel: { en: 'Cancel', bn: 'বাতিল', hi: 'रद्द करें' },
  delete: { en: 'Delete', bn: 'মুছুন', hi: 'हटाएं' },
  edit: { en: 'Edit', bn: 'সম্পাদনা', hi: 'संपादित करें' },
  exportPdf: { en: 'Export PDF', bn: 'PDF ডাউনলোড', hi: 'PDF निर्यात' },
  print: { en: 'Print', bn: 'প্রিন্ট', hi: 'प्रिंट' },
  businessHealth: { en: 'Business Health', bn: 'ব্যবসার স্বাস্থ্য', hi: 'व्यापार स्वास्थ्य' },
  overview: { en: 'Overview', bn: 'সারাংশ', hi: 'अवलोकन' },
  interestEarned: { en: 'Interest Earned (est.)', bn: 'সুদ আয় (আনুমানিক)', hi: 'ब्याज कमाई (अनुमानित)' },
  totalSales: { en: 'Total Sales', bn: 'মোট বিক্রয়', hi: 'कुल बिक्री' },
  totalExpenses: { en: 'Total Expenses', bn: 'মোট খরচ', hi: 'कुल खर्च' },
  emiCalculator: { en: 'EMI Calculator', bn: 'EMI ক্যালকুলেটর', hi: 'EMI कैलकुलेटर' },
  qrCode: { en: 'QR Code', bn: 'QR কোড', hi: 'QR कोड' },
  financialTracker: { en: 'Financial Tracker', bn: 'আর্থিক ট্র্যাকার', hi: 'वित्तीय ट्रैकर' },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('khata-lang') as Lang) || 'en');

  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem('khata-lang', newLang);
  };

  const t = (key: string): string => translations[key]?.[lang] || translations[key]?.en || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
