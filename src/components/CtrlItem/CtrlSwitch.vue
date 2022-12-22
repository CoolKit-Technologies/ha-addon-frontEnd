<template>
    <div class="ctrl-switch">
        <div class="text">
            <p class="title">{{ title }}</p>
            <p class="desc">{{ desc }}</p>
        </div>
        <div class="action">
            <a-switch
                :checked="stat"
                @change="toggle"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapState } from 'vuex';

import { disableDevice, toggleNetworkLed, toggleLock } from '@/api/device';

export default defineComponent({
    name: 'CtrlSwitch',

    props: {
        type: {
            type: String as PropType<'led' | 'lock' | 'enable' | 'disable'>,
            required: true
        }
    },

    computed: {
        title() {
            let result = '';
            switch (this.type) {
                case 'disable':
                    result = this.$t('modal.entitydisable');
                    break;
                case 'lock':
                    result = this.$t('modal.interlock');
                    break;
                case 'led':
                    result = this.$t('modal.netled');
                    // fall through
                default:
                    break;
            }
            return result;
        },
        desc() {
            let result = '';
            switch (this.type) {
                case 'disable':
                    result = this.$t('modal.entitydisabletip');
                    break;
                case 'lock':
                    result = this.$t('modal.interlocktip');
                    break;
                case 'led':
                    result = '';
                    // fall through
                default:
                    break;
            }
            return result;
        },
        stat() {
            const { params, type, uiid, disabled } = this.modalParams as any;

            if (this.type === 'led') {
                if (type === 1 && uiid === 1) {
                    return params.data1.sledOnline === 'on';
                } else if (uiid === 126) {
                    return params.sledBright !== 0;
                } else {
                    return params.sledOnline === 'on';
                }
            } else if (this.type === 'disable') {
                return disabled;
            } else if (this.type === 'lock') {
                return params.lock === 1;
            }
        },
        ...mapState(['modalParams'])
    },

    methods: {
        async toggle(v: boolean) {
            if (this.type === 'led') {
                await toggleNetworkLed(v, this.modalParams);
            } else if (this.type === 'disable') {
                await disableDevice({
                    id: this.modalParams.deviceId,
                    disabled: v
                });
            } else if (this.type === 'lock') {
                await toggleLock(v, this.modalParams);
            }
        }
    }
});
</script>

<style lang="stylus" scoped>
.ctrl-switch
    display flex
    align-items center

    .text
        flex 1
        display flex
        justify-content flex-start
        align-items center
        & > p
            margin 0
        .title
            color #212121
        .desc
            margin-left 30px
            margin-right 20px
            font-size 12px
            color #727272
</style>
