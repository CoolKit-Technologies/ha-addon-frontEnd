<template>
    <div class="main">
        <loading-page v-if="pageLoading" />
        <home-page v-else />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import HomePage from '@/components/HomePage.vue';
import LoadingPage from '@/components/LoadingPage.vue';

export default defineComponent({
    name: 'App',

    components: {
        HomePage,
        LoadingPage
    },

    computed: {
        ...mapState(['pageLoading'])
    }
});
</script>
