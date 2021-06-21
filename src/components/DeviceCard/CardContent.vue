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
                <channel-switch
                    v-for="item in channels"
                    :key="item.key"
                    :index="item.key"
                    :title="item.name"
                    :stat="item.stat === 'on' ? true : false"
                    :cardData="cardData"
                    class="mg-14"
                />
            </div>
            <!-- temperature or thermal switch -->
            <div class="th-sw" v-else-if="isThSw">
                <div class="gauge"
                    v-if="cardData.params.currentHumidity !== 'unavailable' || cardData.params.currentTemperature !== 'unavailable'"
                >
                    <humi-gauge
                        v-if="cardData.params.currentHumidity !== 'unavailable'"
                        :value="cardData.params.currentHumidity"
                    />
                    <temp-gauge
                        v-if="cardData.params.currentTemperature !== 'unavailable'"
                        :value="cardData.params.currentTemperature"
                        :tempUnit="cardData.unit"
                    />
                </div>
                <channel-mode
                    class="mg-14"
                    :mode="cardData.params.deviceType"
                />
                <channel-switch
                    class="mg-14"
                    :title="$t('card.channel')"
                    :stat="cardData.params.switch === 'on' ? true : false"
                    :cardData="cardData"
                />
            </div>
            <!-- power detection -->
            <div class="pw-det" v-else-if="isPwDet">
                <div class="chart">
                    <circle-chart
                        width="180px"
                        height="180px"
                        color="blue"
                    />
                    <span class="title">{{ $t('card.realtimestats') }}</span>
                    <span class="value">{{ cardData.params.power }}W</span>
                </div>
                <channel-switch
                    class="mg-14"
                    :title="$t('card.channel')"
                    :stat="cardData.params.switch === 'on' ? true : false"
                    :cardData="cardData"
                />
            </div>
            <!-- power voltage current socket -->
            <div class="pvc-sct" v-else-if="isPvcSct">
                <div class="chart-grp">
                    <div
                        class="chart"
                        v-for="item in pvcSctData"
                        :key="item.key"
                    >
                        <circle-chart
                            width="110px"
                            height="110px"
                            :color="item.color"
                        />
                        <span class="title">{{ item.title }}</span>
                        <span class="value">{{ item.value }}</span>
                    </div>
                </div>
                <channel-switch
                    class="mg-14"
                    :title="$t('card.channel')"
                    :stat="cardData.params.switch === 'on' ? true : false"
                    :cardData="cardData"
                />
            </div>
            <!-- dual power switch -->
            <div class="dual-pw-sw" v-else-if="isDualPwSw">
                <div class="chart-grp">
                    <div
                        class="chart"
                        v-for="item in dualPwSwData"
                        :key="item.key"
                    >
                        <circle-chart
                            width="110px"
                            height="110px"
                            :color="item.color"
                        />
                        <span class="title">{{ item.title }}</span>
                        <span class="value">{{ item.value }}</span>
                    </div>
                </div>
                <div class="data-stat">
                    <div class="vol">
                        <p class="key">{{ $t('card.voltage') }}</p>
                        <p class="value">{{ cardData.params[`voltage_0${cardData.cardIndex}`] / 100 }}V</p>
                    </div>
                    <div class="divided"></div>
                    <div class="cur">
                        <p class="key">{{ $t('card.current') }}</p>
                        <p class="value">{{ cardData.params[`current_0${cardData.cardIndex}`] / 100 }}A</p>
                    </div>
                </div>
                <channel-switch
                    class="mg-14"
                    :title="`${$t('card.channel')} ${cardData.cardIndex + 1}`"
                    :stat="cardData.params.switches[cardData.cardIndex].switch === 'on' ? true : false"
                    :cardData="cardData"
                    :index="cardData.cardIndex"
                />
            </div>
            <!-- five color bulb light -->
            <div v-else-if="isFiveColorBulbLt">
                <color-picker class="mg-14" />
                <five-bulb-light class="mg-14" />
            </div>
            <!-- wifi door sensor  -->
            <div v-else-if="isWifiDoorSensor">
                <content-item
                    type='doorSensor'
                    :switch="cardData.params.switch"
                ></content-item>
            </div>
            <!-- five color light -->
            <div v-else-if="isFiveColorLt">
                <five-color-light class="mg-14"/>
            </div>
            <!-- two color light -->
            <div v-else-if="isTwoColorLt">
                <ctrl-slider
                    class="mg-14"
                    type="brightness"
                />
                <ctrl-slider
                    class="mg-14"
                    type="color-temp"
                />
            </div>
            <!-- elec curtain -->
            <div v-else-if="isCurtain">
                <curtain></curtain>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    isSupportedDevice,
    isPureSwOrSockDevice,
    isOneChannelSwOrSockSPDevice,
    isOneChannelSwOrSockCPDevice,
    isTwoChannelDevice,
    isThreeChannelDevice,
    isFourChannelDevice
} from '@/utils/etc';
import ChannelSwitch from '@/components/CtrlItem/ChannelSwitch.vue';
import ChannelMode from '@/components/CtrlItem/ChannelMode.vue';
import ContentItem from '@/components/CtrlItem/ContentItem.vue'
import FiveBulbLight from '@/components/CtrlItem/FiveBulbLight.vue'
import Curtain from '@/components/CtrlItem/Curtain.vue'
import HumiGauge from '@/components/GaugeChart/Humidity.vue';
import TempGauge from '@/components/GaugeChart/Temperature.vue';
import CircleChart from '@/components/CircleChart.vue';
import ColorPicker from '@/components/CtrlItem/ColorPicker.vue';
import FiveColorLight from '@/components/CtrlItem/FiveColorLight.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';

export default defineComponent({
    name: 'CardContent',

    components: {
        ChannelSwitch,
        ChannelMode,
        HumiGauge,
        TempGauge,
        CircleChart,
        ColorPicker,
        ContentItem,
        FiveBulbLight,
        Curtain,
        CtrlSlider,
        FiveColorLight
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
            return isPureSwOrSockDevice(uiid);
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
        pvcSctData() {
            const { $t, cardData } = this as any;
            return [
                {
                    title: $t('card.power'),
                    value: cardData.params.power + 'W',
                    color: 'blue',
                    key: 0
                },
                {
                    title: $t('card.voltage'),
                    value: cardData.params.voltage + 'V',
                    color: 'green',
                    key: 1
                },
                {
                    title: $t('card.current'),
                    value: cardData.params.current + 'A',
                    color: 'yellow',
                    key: 2
                }
            ];
        },
        // Current device is dual power detection switch
        isDualPwSw() {
            const { uiid } = this.cardData as any;
            return uiid === 126;
        },
        isWifiDoorSensor(){
            const { uiid } = this.cardData as any;
            return uiid === 102;
        },
        isFiveColorLt(){
            const { uiid } = this.cardData as any;
            return uiid === 104;
        },
        isCurtain(){
            const { uiid } = this.cardData as any;
            return uiid === 11;
        },
        dualPwSwData() {
            const { $t, cardData } = this as any;
            return [
                {
                    title: $t('card.realpower'),
                    value: cardData.params['actPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'blue',
                    key: 0
                },
                {
                    title: $t('card.reactivepower'),
                    value: cardData.params['reactPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'green',
                    key: 1
                },
                {
                    title: $t('card.apparentpower'),
                    value: cardData.params['apparentPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'yellow',
                    key: 2
                }
            ];
        },
        // Current device is five color bulb light
        isFiveColorBulbLt() {
            const { uiid } = this.cardData as any;
            return uiid === 22;
        },
        // Current device is two color light
        isTwoColorLt() {
            const { uiid } = this.cardData as any;
            return uiid === 103;
        },
        channels() {
            const { uiid, type, params, tags } = this.cardData as any;
            const channelName = this.$t('card.channel');
            const result: Array<{ key: number; name: string; stat: string; }> = [];
            let cnt = 0;

            if (type === 1 && uiid === 1) {
                // Single channel (DIY)
                result.push({ key: 0, name: channelName, stat: params.data1.switch });
            } else if (isOneChannelSwOrSockSPDevice(uiid)) {
                // Single channel (non-DIY)
                result.push({ key: 0, name: channelName, stat: params.switch });
            } else if (isOneChannelSwOrSockCPDevice(uiid)) {
                // Single channel (multi-channel protocol)
                result.push({ key: 0, name: channelName, stat: params.switches[0].switch });
            } else if (isTwoChannelDevice(uiid)) {
                // 2 channels
                cnt = 2;
            } else if (isThreeChannelDevice(uiid)) {
                // 3 channels
                cnt = 3;
            } else if (isFourChannelDevice(uiid)) {
                // 4 channels
                cnt = 4;
            }

            for (let i = 0; i < cnt; i++) {
                if (tags) {
                    result.push({ key: i, name: tags[i], stat: params.switches[i].switch });
                } else {
                    result.push({ key: i, name: channelName + ' ' + (i + 1), stat: params.switches[i].switch });
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
            justify-content center
            align-items center
            margin -16px 0

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

/* -------- >8 -------- */

.mg-14
    margin 14px 0
    &:last-child
        margin-bottom 0

.chart-grp
    display flex
    justify-content space-between
    margin-top 18px
    padding 0 10px
    .chart
        display flex
        justify-content center
        align-items center
        position relative
        .title,
        .value
            position absolute
        .title
            top 20px
            font-size 12px
            color #C8C8C8
        .value
            top 38px
            font-size 16px
            color #222222
</style>
