<template>
    <div class="power-on-state">
        <div class="title">{{ $t('modal.powerOnState.name') }}</div>
        <a-select v-model:value="value" style="min-width: 120px" size="small" @change="handleChange">
            <a-select-option value="on">{{ $t('modal.powerOnState.on') }}</a-select-option>
            <a-select-option value="off">{{ $t('modal.powerOnState.off') }}</a-select-option>
            <a-select-option value="stay">{{ $t('modal.powerOnState.stay') }}</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';

import { isMultiChannelDevice, isOneChannelSwOrSockCPDevice } from '@/utils/etc';
import { setPowerOnState } from '@/api/device';

export default defineComponent({
    name: 'PowerOnState',

    props: {
        index: {
            default: 0,
        },
    },

    data() {
        return {
            value: '',
        };
    },

    computed: {
        ...mapState(['modalParams']),
    },

    methods: {
        handleChange() {
            const { uiid, cardIndex } = this.modalParams;
            setPowerOnState(this.value, this.modalParams, uiid === 126 ? cardIndex : this.index);
        },
    },

    created() {
        const { type, uiid, params, cardIndex } = this.modalParams;
        if (type === 1 && uiid === 1) {
            // DIY device
            this.value = params.data1.startup;
        } else if (isMultiChannelDevice(uiid) || isOneChannelSwOrSockCPDevice(uiid)) {
            // Multi-channel
            this.value = params.configure[this.index].startup;
        } else if (uiid === 126) {
            // Dual R3
            this.value = params.configure[cardIndex].startup;
        } else {
            // Single channel
            this.value = params.startup;
        }
    },
});
</script>

<style lang="stylus" scoped>
.power-on-state
    display flex
    justify-content space-between
    align-items center
    .title
        color #212121
        font-size 14px
</style>
