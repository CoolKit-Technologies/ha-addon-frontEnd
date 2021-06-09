<template>
    <div class="card-content">
        <div
            v-if="isUnsupport"
            class="unsupport"
        >
            <p>{{ $t('card.unsupport') }}</p>
        </div>
        <div v-else class="content">
            <!-- switch or socket devices -->
            <div class="sw-sock" v-if="isSwSock">
                <single-switch
                    v-for="item in channels"
                    :key="item.key"
                    :icon="item.stat"
                    :title="item.name"
                    desc="hello, world"
                    class="mg-14"
                />
            </div>
            <!-- temperature or thermal switch -->
            <div class="th-sw" v-else-if="isThSw">
                <div class="gauge">
                    <humi-gauge
                        :value="cardData.params.currentHumidity"
                    />
                    <temp-gauge
                        :value="cardData.params.currentTemperature"
                        :tempUnit="cardData.unit"
                    />
                </div>
                <single-mode
                    class="mg-14"
                    :mode="cardData.params.deviceType"
                />
                <single-switch
                    class="mg-14"
                    icon="on"
                    :title="$t('card.channel')"
                />
            </div>
            <!-- power detection -->
            <div class="pw-det" v-else-if="isPwDet">
                <div class="chart">
                    <!-- <span class="title">{{ $t('card.realtimestats') }}</span>
                    <span class="value">140W</span> -->
                </div>
                <single-switch
                    class="mg-14"
                    icon="on"
                    :title="$t('card.channel')"
                />
            </div>
            <!-- power voltage current socket -->
            <div class="pvc-sct" v-else-if="isPvcSct">
                <div class="chart-grp">
                    <div class="chart">
                    </div>
                </div>
                <single-switch
                    class="mg-14"
                    icon="on"
                    :title="$t('card.channel')"
                />
            </div>
            <!-- dual power switch -->
            <div class="dual-pw-sw" v-else-if="isDualPwSw">
                <div class="data-stat">
                    <div class="vol">
                        <p class="key">{{ $t('card.voltage') }}</p>
                        <p class="value">220V</p>
                    </div>
                    <div class="divided"></div>
                    <div class="cur">
                        <p class="key">{{ $t('card.current') }}</p>
                        <p class="value">1.0A</p>
                    </div>
                </div>
                <single-switch
                    class="mg-14"
                    icon="on"
                    :title="$t('card.channel')"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { isSupportedDevice, SW_SOCK_UIID } from '@/utils/etc';
import SingleSwitch from '@/components/CtrlItem/SingleSwitch.vue';
import SingleMode from '@/components/CtrlItem/SingleMode.vue';
import HumiGauge from '@/components/GaugeChart/Humidity.vue';
import TempGauge from '@/components/GaugeChart/Temperature.vue';

export default defineComponent({
    name: 'CardContent',

    components: {
        SingleSwitch,
        SingleMode,
        HumiGauge,
        TempGauge
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
        // Current device is switch or socket
        isSwSock() {
            const { uiid } = this.cardData as any;
            return SW_SOCK_UIID.indexOf(uiid) !== -1;
        },
        // Current device is temperature / thermal switch
        isThSw() {
            const { uiid } = this.cardData as any;
            return uiid === 15;
        },
        // Current device is power detection socket
        isPwDet() {
            const { uiid } = this.cardData as any;
            return uiid === 5;
        },
        // Current device is power voltage current socket
        isPvcSct() {
            const { uiid } = this.cardData as any;
            return uiid === 32;
        },
        // Current device is dual power detection switch
        isDualPwSw() {
            const { uiid } = this.cardData as any;
            return uiid === 126;
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

    .th-sw
        .gauge
            display flex
            justify-content space-between
            align-items center

    .pw-det
        .chart
            display flex
            justify-content center
            align-items center
            position relative
            .title,
            .value
                position absolute
                text-align center
            .title
                top 34px
                font-size 14px
                color #C8C8C8
            .value
                top 56px
                font-size 26px
                color #222222

    .dual-pw-sw
        .data-stat
            display flex
            margin 20px 0
            .divided
                width 2px
                background-color #bbbbbb
                margin 10px 20px
            .vol
                flex 1
                .key
                    text-align right
                    color #bbbbbb
                .value
                    text-align right
                    font-size 26px
            .cur
                flex 1
                .key
                    color #bbbbbb
                .value
                    font-size 26px
            p
                margin 0

.mg-14
    margin 14px 0
    &:last-child
        margin-bottom 0
</style>
