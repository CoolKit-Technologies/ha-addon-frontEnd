<template>
    <div class="main-content">
        <intro-bar />
        <p>hello, world</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import IntroBar from '@/components/IntroBar.vue';

export default defineComponent({
    name: 'MainContent',

    components: {
        IntroBar
    }
});
</script>

<style lang="stylus" scoped>
.main-content
    max-width 1500px
    margin 0 auto
    background-color #ccc
</style>
