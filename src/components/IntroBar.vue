<template>
    <div class="intro-bar">
        intro bar
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getContent } from '@/api/content'

export default defineComponent({
    name: 'IntroBar',

    created() {
        getContent();
    }
});
</script>
