<template>
    <div class="home-page">
        <header-bar />
        <main-content />
        <modal-box />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import _ from 'lodash';

import { getConfig } from '@/utils/config';
import { getLocale } from '@/api/content';
import { isLogin as userIsLogin } from '@/api/user';
import HeaderBar from '@/components/HeaderBar.vue';
import MainContent from '@/components/MainContent.vue';
import ModalBox from '@/components/ModalBox/index.vue';

export default defineComponent({
    name: 'HomePage',

    components: {
        HeaderBar,
        MainContent,
        ModalBox
    },

    data() {
        return {
            source: null,   // SSE source
            windowResizeHandler: null
        } as {
            source: any;
            windowResizeHandler: any;
        };
    },

    async created() {
        this.initWinSize();
        await this.initIsLogin();
        await this.initLocale();
        this.initSse();
    },

    beforeUnmount() {
        // Close SSE when page reload or tear down
        this.source.close();
        // Remove event handler
        window.removeEventListener('resize', this.windowResizeHandler);
    },

    computed: {
        ...mapState(['originDeviceList', 'modalParams']),
        ...mapGetters(['deviceCardList'])
    },

    methods: {
        initWinSize() {
            // console.log('init size:', window.innerWidth);
            this.setWindowSize(window.innerWidth);
            this.windowResizeHandler = _.throttle(() => {
                // console.log('resize', window.innerWidth);
                this.setWindowSize(window.innerWidth);
            }, 1000, { 'leading': false, 'trailing': true });
            window.addEventListener('resize', this.windowResizeHandler);
        },
        async initIsLogin() {
            const res = await userIsLogin();
            if (res.error === 0 && res.data.isLogin) {
                this.setIsLogin(true);
            } else {
                this.setIsLogin(false);
            }
        },
        async initLocale() {
            const res = await getLocale();
            if (res.error === 0 && res.data === 'zh-Hans') {
                this.$root!.$i18n.locale = 'zh';
                this.setLocale('zh');
                this.setAntdLocale('zh');
            } else {
                this.$root!.$i18n.locale = 'en';
                this.setLocale('en');
                this.setAntdLocale('en');
            }
        },
        initSse() {
            const { sseUrl, debug } = getConfig();

            this.source = new EventSource(sseUrl);
            this.source.addEventListener('open', () => {
                if (debug) {
                    console.log('SSE connect success');
                }
            });
            this.source.addEventListener('message', (e: any) => {
                const newList = JSON.parse(e.data);
                const oldList = _.cloneDeep(this.originDeviceList);
                if (debug) {
                    console.log('SSE message received, event data:');
                    console.log('new', newList);
                    console.log('old', oldList);
                    console.log('new list === old list:', _.isEqual(newList, oldList));
                }
                if (!_.isEqual(newList, oldList)) {
                    this.setOriginDeviceList(newList);
                    if (this.modalParams) {
                        // Update device data when modal was opened
                        const res = this.deviceCardList.find((item: any) => item.deviceId === this.modalParams.deviceId);
                        this.setModalParams(res);
                    }
                }
            });
        },
        ...mapMutations(['setIsLogin', 'setLocale', 'setOriginDeviceList', 'setWindowSize', 'setModalParams', 'setAntdLocale'])
    }
});
</script>
