import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEN from "./locales/en/translation.json";
import translationKO from "./locales/ko/translation.json";
import translationVi from "./locales/vi/translation.json";

// the translations
const resources = {
  en: {
    translation: translationEN,
  },
  ko: {
    translation: translationKO,
  },
  vi: {
    translation: translationVi,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ko", //앱 실행시 기본값으로 표시되는 언어
    fallbackLng: "ko", //찾으려는 내용이 현재 표시되는 언어에 존재하지 않는 경우 표시되는 언어

    // keySeparator: true, //딕셔너리 형태로 json을 사용하기 위해서 지운다.

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
