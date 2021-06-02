<template>
    <div class="main">
        <header-bar />
        <main-content />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderBar from '@/components/HeaderBar.vue';
import MainContent from '@/components/MainContent.vue';

export default defineComponent({
    name: 'App',

    components: {
        HeaderBar,
        MainContent
    }
});
</script>
