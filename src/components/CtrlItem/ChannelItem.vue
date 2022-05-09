<template>
    <div class="channel-item">
        <device-name type="channel" :index="index - 1" />
        <inching-mode v-if="showInchingMode" :index="index - 1" />
        <ctrl-select type="power-on-state" v-if="showPowerOnState" :index="index - 1" />
        <!-- <scenes-item v-if="isMiniR3" :index="index - 1" /> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from './DeviceName.vue';
import InchingMode from './InchingMode.vue';
import CtrlSelect from './CtrlSelect.vue';
import ScenesItem from './ScenesItem.vue';

export default defineComponent({
    name: 'ChannelItem',

    components: {
        DeviceName,
        InchingMode,
        CtrlSelect,
        ScenesItem,
    },

    props: {
        index: {
            required: true,
            type: Number,
        },
    },
    computed: {
        ...mapState(['modalParams']),
        showInchingMode() {
            const modalParams = this.modalParams as any;
            if (this.isMiniR3()) {
                // 没有设置过互锁
                if (!modalParams.params.locks || modalParams.params.locks.length === 0) {
                    return true;
                } else {
                    for (let i = 0; i < modalParams.params.locks.length; i++) {
                        const lock = modalParams.params.locks[i];
                        if (lock.enabled && ~lock.outlets.indexOf(this.index - 1)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return modalParams.params.lock === 0;
        },
        showPowerOnState() {
            const modalParams = this.modalParams as any;
            if (this.isMiniR3()) {
                // 没有设置过互锁
                if (!modalParams.params.locks || modalParams.params.locks.length === 0) {
                    return true;
                } else {
                    for (let i = 0; i < modalParams.params.locks.length; i++) {
                        const lock = modalParams.params.locks[i];
                        if (lock.enabled && ~lock.outlets.indexOf(this.index)) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return modalParams.params.lock === 0;
        },
    },
    methods: {
        isMiniR3() {
            const modalParams = this.modalParams as any;
            if (modalParams.uiid > 138 && modalParams.uiid <= 141) {
                return true;
            }
            return false;
        },
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
