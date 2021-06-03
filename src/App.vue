<template>
    <div class="main">
        <header-bar />
        <main-content />
        <modal-box />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import HeaderBar from '@/components/HeaderBar.vue';
import MainContent from '@/components/MainContent.vue';
import ModalBox from '@/components/ModalBox/index.vue';

export default defineComponent({
    name: 'App',

    components: {
        HeaderBar,
        MainContent,
        ModalBox
    }
});
</script>
