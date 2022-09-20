<template>
    <div class="home-page">
        <header-bar @changeMainShow="changeMainShow" />
        <main-content v-if="mainShow" />
        <home-assist v-else />
        <modal-box />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";

import { getConfig } from "@/utils/config";
import { getLocale } from "@/api/content";
import { isLogin as userIsLogin } from "@/api/user";
import HeaderBar from "@/components/HeaderBar.vue";
import MainContent from "@/components/MainContent.vue";
import HomeAssist from "@/components/HomeAssist.vue";
import ModalBox from "@/components/ModalBox/index.vue";

export default defineComponent({
    name: "HomePage",

    components: {
        HeaderBar,
        MainContent,
        ModalBox,
        HomeAssist,
    },

    data() {
        return {
            mainShow: true, //展示易微联设备
            source: null, // SSE source
            windowResizeHandler: null,
        } as {
            mainShow: boolean;
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
        window.removeEventListener("resize", this.windowResizeHandler);
    },

    computed: {
        ...mapState(["originDeviceList", "modalParams", "isLogin"]),
        ...mapGetters(["deviceCardList"]),
    },

    methods: {
        initWinSize() {
            // console.log('init size:', window.innerWidth);
            this.setWindowSize(window.innerWidth);
            this.windowResizeHandler = _.throttle(
                () => {
                    // console.log('resize', window.innerWidth);
                    this.setWindowSize(window.innerWidth);
                },
                1000,
                { leading: false, trailing: true }
            );
            window.addEventListener("resize", this.windowResizeHandler);
        },
        async initIsLogin() {
            const res = await userIsLogin();
            if (res.error === 0 && res.data.isLogin) {
                this.setIsLogin(true);
                this.setUsername(res.data.username);
            } else {
                this.setIsLogin(false);
                this.setUsername('');
            }
        },
        async initLocale() {
            // Get locale from localStorage 'ewelink-addon-locale'
            const locale = localStorage.getItem("ewelink-addon-locale");
            if (!locale) {
                this.$root!.$i18n.locale = "en";
                this.setLocale("en");
                this.setAntdLocale("en");
            } else {
                this.$root!.$i18n.locale = locale;
                this.setLocale(locale);
                this.setAntdLocale(locale);
            }
        },
        initSse() {
            const { sseUrl, debug } = getConfig();

            this.source = new EventSource(sseUrl);
            this.source.addEventListener("open", () => {
                if (debug) {
                    console.log("SSE connect success");
                }
            });
            this.source.addEventListener("message", (e: any) => {
                // console.log(e.data, "stream data----------");

                const msgData = JSON.parse(e.data);
                if (msgData.type === "ha-device") {
                    if (this.isLogin) {
                        console.log("get ha-device list-------");
                        this.getHaDeviceList();
                    }
                } else if (msgData.type === "ck-device") {
                    const newList = msgData.data;
                    // console.log('message data:', msgData);

                    const oldList = _.cloneDeep(this.originDeviceList);
                    if (debug) {
                        console.log("SSE message received, event data:");
                        if (!_.isEqual(newList, oldList)) {
                            console.log("new", newList);
                            console.log("old", oldList);
                        }
                    }
                    if (!_.isEqual(newList, oldList)) {
                        this.setOriginDeviceList(newList);
                        if (this.modalParams) {
                            let res: any;
                            if (this.modalParams.uiid === 28) {
                                // RF devices are special
                                res = this.deviceCardList.find(
                                    (item: any) =>
                                        item.deviceId ===
                                            this.modalParams.deviceId &&
                                        item.cardIndex ===
                                            this.modalParams.cardIndex
                                );
                            } else {
                                // Update device data when modal was opened
                                res = this.deviceCardList.find(
                                    (item: any) =>
                                        item.deviceId ===
                                        this.modalParams.deviceId
                                );
                            }
                            this.setModalParams(res);
                        }
                    }
                }
            });
        },
        changeMainShow(isMainShow: boolean) {
            this.mainShow = isMainShow;
        },
        ...mapMutations([
            "setIsLogin",
            "setLocale",
            "setOriginDeviceList",
            "setWindowSize",
            "setModalParams",
            "setAntdLocale",
            "setUsername"
        ]),
        ...mapActions(["getHaDeviceList"]),
    },
});
</script>
