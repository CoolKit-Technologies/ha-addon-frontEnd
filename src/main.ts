import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import {
    Button,
    Card
} from 'ant-design-vue';

import store from '@/store';
import App from '@/App.vue';
import { messages } from '@/locales';

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'zh',
    messages
});

const app = createApp(App);

app.use(store);
app.use(i18n);

// ant-design-vue components
app.use(Button);
app.use(Card);

app.mount('#app');
