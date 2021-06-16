<template>
    <div class="loading">
        <div class="wrapper">
            <a-spin size="large" />
            <p>{{ $t('common.text.loading') }}</p>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

import { getLocale } from '@/api/content';
import { getHaToken, isAuth } from '@/api/user';

export default defineComponent({
    name: 'LoadingPage',

    data() {
        return {
            timer: null
        } as {
            timer: any;
        };
    },

    methods: {
        async getToken() {
            let code = '';
            let index = 0;
            if ((index = window.location.search.indexOf('code=')) !== -1) {
                code = window.location.search.slice(index + 5);
                await getHaToken({
                    code,
                    clientId: window.location.origin
                });
            }
        },
        checkIsAuth() {
            this.timer = setInterval(async () => {
                const res = await isAuth();
                if (res.data.isAuth) {
                    this.setPageLoading(false);
                }
            }, 1000);
        },
        ...mapMutations(['setPageLoading'])
    },

    beforeUnmount() {
        clearInterval(this.timer);
    },

    async created() {
        // Call for testing 302 redir
        await getLocale();
        await this.getToken();
        this.checkIsAuth();
    }
});
</script>

<style lang="stylus" scoped>
.loading
    height 100vh
    display flex
    justify-content center
    align-items center
    .wrapper
        display flex
        flex-direction column
        align-items center
        & p
            font-size 22px
            margin-top 20px
</style>
