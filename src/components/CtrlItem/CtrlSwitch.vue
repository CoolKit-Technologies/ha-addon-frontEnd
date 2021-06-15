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
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import { disableDevice, setLanDevice, setCloudDevice } from '@/api/device';

export default defineComponent({
    name: 'CtrlSwitch',

    props: {
        type: {     // 'led', 'lock', 'enable'
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
            const { disabled, params } = this.modalParams as any;
            let result = false;

            switch (this.type) {
                case 'lock':
                    result = params.lock === 1;
                    break;
                case 'led':
                    result = params.sledOnline === 'on' || params.sledBright !== 0;
                    break;
                case 'disable':
                    result = disabled;
                    // fall through
                default:
                    break;
            }
            return result;
        },
        ...mapState(['modalParams'])
    },

    methods: {
        async toggle(v: boolean) {
            const { deviceId, type, apikey } = this.modalParams as any;

            if (this.type === 'disable') {
                await disableDevice({
                    id: deviceId,
                    disabled: v
                });
            } else if (this.type === 'led') {
                if (type === 2) {
                    await setLanDevice({
                        apikey,
                        id: deviceId,
                        params: {
                            sledOnline: v ? 'on' : 'off'
                        }
                    });
                } else if (type === 4) {
                    await setCloudDevice({
                        apikey,
                        id: deviceId,
                        params: {
                            sledOnline: v ? 'on' : 'off'
                        }
                    });
                }
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
        justify-content space-between
        align-items center
        & > p
            margin 0
        .title
            margin-right 10px
            color #212121
        .desc
            margin-right 20px
            font-size 12px
            color #727272
</style>
