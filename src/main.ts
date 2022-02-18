import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import {
    Button,
    Card,
    Dropdown,
    Menu,
    Modal,
    Select,
    Input,
    Typography,
    Spin,
    Switch,
    TimePicker,
    DatePicker,
    Tabs,
    Divider,
    Statistic,
    ConfigProvider,
    Carousel,
    Slider,
    Tooltip
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
app.use(Dropdown);
app.use(Menu);
app.use(Modal);
app.use(Select);
app.use(Input);
app.use(Typography);
app.use(Spin);
app.use(Switch);
app.use(TimePicker);
app.use(DatePicker);
app.use(Tabs);
app.use(Divider);
app.use(Statistic);
app.use(ConfigProvider);
app.use(Carousel);
app.use(Slider);
app.use(Tooltip);

app.mount('#app');
