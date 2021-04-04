import { defineConfig } from 'umi';

export default defineConfig({
    nodeModulesTransform: {
        type: 'none',
    },
    locale: {
        default: 'zh-CN',
        antd: false,
        baseSeparator: '-',
    },
    routes: [{ path: '/', component: '@/pages/index', title: 'Home' }],
});
