import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import cn from './locals/zh-cn.json'
import hk from './locals/zh-hk.json'
import en from './locals/en.json'
const resources = {
  "zh-CN": {
    translation: cn
  },
  "zh-HK": {
    translation: hk
  },
  "en": {
    translation: en
  },
};
i18n.use(LanguageDetector)
.use(initReactI18next)
  .init({
    resources,
    fallbackLng: "zh-CN",
    detection: {
      caches: ['localStorage', 'sessionStorage', 'cookie'],
    }
  })

export default i18n