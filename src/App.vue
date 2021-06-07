<template>
    <div class="main">
        <header-bar />
        <main-content />
        <modal-box />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import _ from 'lodash';

import { getConfig } from '@/utils/config';
import { getLocale } from '@/api/content';
import HeaderBar from '@/components/HeaderBar.vue';
import MainContent from '@/components/MainContent.vue';
import ModalBox from '@/components/ModalBox/index.vue';

export default defineComponent({
    name: 'App',

    components: {
        HeaderBar,
        MainContent,
        ModalBox
    },

    data() {
        return {
            source: null    // SSE source
        } as {
            source: any;
        };
    },

    async created() {
        const { sseUrl, debug } = getConfig();

        // Set locale
        const res = await getLocale();
        if (res.error === 0 && res.data === 'zh-Hans') {
            this.$root!.$i18n.locale = 'zh';
            this.setLocale('zh');
        } else {
            this.$root!.$i18n.locale = 'en';
            this.setLocale('en');
        }
        // TODO: uncomment for test
        return;

        // Set SSE
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
                console.log(newList, oldList);
                console.log('new list === old list:', _.isEqual(newList, oldList));
            }
            if (!_.isEqual(newList, oldList)) {
                this.setOriginDeviceList(newList);
            }
        });
    },

    beforeUnmount() {
        // Close SSE when page reload or tear down
        this.source.close();
    },

    computed: {
        ...mapState(['originDeviceList'])
    },

    methods: {
        ...mapMutations(['setLocale', 'setOriginDeviceList'])
    }
});
</script>
