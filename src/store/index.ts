import { createStore } from 'vuex';

export default createStore({
    state: {
        // If user is login
        isLogin: false,
    },

    mutations: {
        setIsLogin(state, v) {
            state.isLogin = v;
        }
    }
});
