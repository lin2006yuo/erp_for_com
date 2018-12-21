import Vue from 'vue';
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
export const i18n = new VueI18n({
});

const loadedLanguages = []; // our default language that is preloaded

function setI18nLanguage (lang) {
    i18n.locale = lang;
    sessionStorage.setItem('lang', lang);
    document.querySelector('html').setAttribute('lang', lang);
    return lang;
}

window.loadLanguageAsync = function  (lang)  {
    if (i18n.locale !== lang) {
        if (!loadedLanguages.includes(lang)) {
            return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${lang}`).then(msgs => {
                i18n.setLocaleMessage(lang, msgs.default);
                console.log('lang:',lang);
                loadedLanguages.push(lang);
                return setI18nLanguage(lang);
            })
        }
        return Promise.resolve(setI18nLanguage(lang))
    }
    return Promise.resolve(lang)
};
let lang = sessionStorage.getItem('lang');
loadLanguageAsync(lang||'zh');
export default i18n;
