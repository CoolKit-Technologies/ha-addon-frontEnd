<template>
    <div class="main-content">
        <intro-bar />
        <device-grid />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import IntroBar from '@/components/IntroBar.vue';
import DeviceGrid from '@/components/DeviceGrid.vue';

export default defineComponent({
    name: 'MainContent',

    components: {
        IntroBar,
        DeviceGrid
    }
});
</script>

<style lang="stylus" scoped>
.main-content
    max-width 1500px
    margin 0 auto
    // background-color #ccc
</style>
