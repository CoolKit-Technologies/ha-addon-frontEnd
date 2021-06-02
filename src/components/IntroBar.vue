<template>
    <div class="intro-bar">
        <intro-card class="intro-card" />
        <intro-card class="intro-card" />
        <intro-card class="intro-card" />
        <intro-card class="intro-card" />
        <intro-card class="intro-card" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getContent } from '@/api/content';
import IntroCard from '@/components/IntroCard.vue';

export default defineComponent({
    name: 'IntroBar',

    components: {
        IntroCard
    },

    created() {
        getContent();
    }
});
</script>

<style lang="stylus" scoped>
.intro-bar
    display flex
    padding 20px 10px

    .intro-card
        flex 1
        max-width calc((100% - 40px) / 5)
        &:not(:last-child)
            margin-right 10px
</style>
