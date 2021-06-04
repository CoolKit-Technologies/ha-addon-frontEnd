import { createStore } from 'vuex';

import { getRegionMap } from '@/utils/etc';

export default createStore({
    state: {
        // If user is login
        isLogin: false,

        // Component 'ModalBox' visibility
        modalVisible: false,
        // Component 'ModalBox' type
        modalType: '',
        // Component 'ModalBox' params
        modalParams: null,

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
        setModalType(state, v) {
            state.modalType = v;
        },
        setModalParams(state, v) {
            state.modalParams = v;
        },
        setLocale(state, v) {
            state.locale = v;
        }
    },

    actions: {
        openModal(context, v) {
            // type - modal box type, 'login' or 'device'
            // params - modal box params, used when type is 'device'
            const { type, params } = v;
            context.commit('setModalVisible', true);
            context.commit('setModalType', type);
            context.commit('setModalParams', params);
        },
        closeModal(context) {
            context.commit('setModalVisible', false);
            context.commit('setModalType', '');
            context.commit('setModalParams', null);
        }
    }
});
