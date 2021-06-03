import { createStore } from 'vuex';

import { getRegionMap } from '@/utils/etc';

export default createStore({
    state: {
        // If user is login
        isLogin: false,

        // Component 'ModalBox' visibility
        modalVisible: false,

        // Locale for i18n: 'en' or 'zh'
        locale: 'en'
    },

    getters: {
        regionMap(state) {
            // TODO: lang should be set by state
            const result = [];
            const res = getRegionMap(state.locale);
            for (let i = 0; i < res.length; i++) {
                const [code, name] = Object.entries(res[i])[0];
                result.push({ i, code, name });
            }
            return result;
        }
    },

    mutations: {
        setIsLogin(state, v) {
            state.isLogin = v;
        },
        setModalVisible(state, v) {
            state.modalVisible = v;
        },
        setLocale(state, v) {
            state.locale = v;
        }
    }
});
