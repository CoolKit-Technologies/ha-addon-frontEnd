<template>
    <div class="card-content">
        <div
            v-if="isUnsupport"
            class="unsupport"
        >
            <p>{{ $t('card.unsupport') }}</p>
        </div>
        <div v-else class="control">
            <div class="sw-sock" v-if="isSwSock">
                <single-switch
                    v-for="item in channels"
                    :key="item.key"
                    :icon="item.stat"
                    :title="item.name"
                    desc="hello, world"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { isSupportedDevice, SW_SOCK_UIID } from '@/utils/etc';
import SingleSwitch from '@/components/CtrlItem/SingleSwitch.vue';

export default defineComponent({
    name: 'CardContent',

    components: {
        SingleSwitch
    },

    props: {
        cardData: {
            required: true
        }
    },

    computed: {
        isUnsupport() {
            const { uiid } = this.cardData as any;
            return !isSupportedDevice(uiid);
        },
        isSwSock() {
            const { uiid } = this.cardData as any;
            return SW_SOCK_UIID.indexOf(uiid) !== -1;
        },
        channels() {
            const { uiid, type, params, tags } = this.cardData as any;
            const channelName = this.$t('card.channel');
            const result: Array<{ key: number; name: string; stat: string; }> = [];
            let cnt = 0;

            if (uiid === 1 && type === 1) {
                // Single channel (DIY)
                result.push({ key: 0, name: channelName, stat: params.data1.switch });
            } else if (uiid === 1 || uiid === 6 || uiid === 14) {
                // Single channel (non-DIY)
                result.push({ key: 0, name: channelName, stat: params.switch });
            } else if (uiid === 77 || uiid === 78 || uiid === 112) {
                // Single channel (multi-channel protocol)
                result.push({ key: 0, name: channelName, stat: params.switches[0].switch });
            } else if (uiid === 2 || uiid === 7 || uiid === 113) {
                // 2 channels
                cnt = 2;
            } else if (uiid === 3 || uiid === 8 || uiid === 114) {
                // 3 channels
                cnt = 3;
            } else if (uiid === 4 || uiid === 9) {
                // 4 channels
                cnt = 4;
            }

            for (let i = 0; i < cnt; i++) {
                if (tags) {
                    result.push({ key: i, name: tags[i], stat: params.switches[i].switch });
                } else {
                    result.push({ key: i, name: channelName + ' ' + i, stat: params.switches[i].switch });
                }
            }

            return result;
        }
    }
});
</script>

<style lang="stylus" scoped>
.card-content

    .unsupport > p
        font-size 18px
        margin 0
        padding-top 14px
        padding-left 44px
        color #cccccc
</style>
