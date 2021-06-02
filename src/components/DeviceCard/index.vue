<template>
    <div class="device-card">
        card ...
        <a-button @click="handleClick">send</a-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getConfig } from '@/utils/config';
import { sendHttpRequest } from '@/utils/http';

export default defineComponent({
    name: 'DeviceCard',

    created() {
        console.log('>>> config', getConfig());
    },

    methods: {
        handleClick() {
            console.log('hello');
        }
    }
});
</script>

<style lang="stylus" scoped>
.device-card
    background-color tomato
</style>
