<template>
    <div class="main">
        <header-bar />
        <main-content />
        <modal-box />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapMutations } from 'vuex';

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

    async created() {
        // Set locale
        const res = await getLocale();
        if (res.error === 0 && res.data === 'zh-Hans') {
            this.$root!.$i18n.locale = 'zh';
            this.setLocale('zh');
        } else {
            this.$root!.$i18n.locale = 'en';
            this.setLocale('en');
        }
    },

    methods: {
        ...mapMutations(['setLocale'])
    }
});
</script>
