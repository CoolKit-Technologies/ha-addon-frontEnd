import { createStore } from 'vuex';

import { getRegionMap } from '@/utils/etc';

export default createStore({
    state: {
        // If user is login
        isLogin: false,

        // Component 'ModalBox' visibility
        modalVisible: true
    },

    getters: {
        regionMap() {
            // TODO: lang should be set by state
            const result = [];
            const res = getRegionMap('en');
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
        }
    }
});
