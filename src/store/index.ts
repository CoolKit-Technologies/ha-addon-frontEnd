import { createStore } from 'vuex';

export default createStore({
    state: {
        // If user is login
        isLogin: false,

        // Component 'ModalBox' visibility
        modalVisible: true
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
