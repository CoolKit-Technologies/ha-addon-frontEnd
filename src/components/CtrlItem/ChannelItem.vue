<template>
    <div class="channel-item">
        <device-name type="channel" :index="index-1" />
        <inching-mode />
        <power-on-state />
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

    data() {
        return {
            editable: false,
            value: '',
        };
    },

    props: {
        index: {
            required: true
        }
    },

    computed: {
        ...mapState(['modalParams']),
    },
    methods: {
        handleSave() {
            const status = this.editable;
            if (status) {
                // todo 接口请求
                // console.log(this.value);
            }
            this.editable = !status;
        },
    },

    created() {
        // console.log('o_o >>>', this.outlet);
    },
});
</script>

<style lang="stylus" scoped>
.channel-item
    &:not(:first-child)
        margin-top 28px;
    & > div:not(:first-child)
        margin-top 14px
</style>
