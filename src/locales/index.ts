import en from './en';
import zh from './zh';
import { createI18n } from 'vue-i18n';
export const messages = {
    en,
    zh
};

export const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'zh',
    messages
});
