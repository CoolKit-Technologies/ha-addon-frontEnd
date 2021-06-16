<template>
    <div class="channel-item">
        <device-name type="channel" :index="index - 1" />
        <inching-mode v-if="modalParams.params.lock === 0" :index="index - 1" />
        <power-on-state v-if="modalParams.params.lock === 0" :index="index - 1" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from './DeviceName.vue';
import InchingMode from './InchingMode.vue';
import PowerOnState from './PowerOnState.vue';

export default defineComponent({
    name: 'ChannelItem',

    components: {
        DeviceName,
        InchingMode,
        PowerOnState,
    },

    props: {
        index: {
            required: true,
        },
    },

    computed: {
        ...mapState(['modalParams']),
    }
});
</script>

<style lang="stylus" scoped>
.channel-item
    &:not(:first-child)
        margin-top 28px;
    & > div:not(:first-child)
        margin-top 14px
</style>
