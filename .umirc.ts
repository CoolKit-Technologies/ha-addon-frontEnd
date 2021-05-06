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
    exportStatic: {},
    routes: [{ path: '/', component: '@/pages/index', title: 'eWeLink Smart Home' }],
});
