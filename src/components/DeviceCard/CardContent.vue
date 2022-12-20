<template>
    <div class="card-content">
        <div v-if="isUnsupport" class="unsupport">
            <p>{{ unsupportText }}</p>
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
                <div class="gauge" v-if="cardData.params.currentHumidity !== 'unavailable' || cardData.params.currentTemperature !== 'unavailable'">
                    <humi-gauge v-if="cardData.params.currentHumidity !== 'unavailable'" :value="cardData.params.currentHumidity" />
                    <temp-gauge v-if="cardData.params.currentTemperature !== 'unavailable'" :value="cardData.params.currentTemperature" :tempUnit="cardData.unit" />
                </div>
                <channel-mode class="mg-14" :mode="cardData.params.deviceType" />
                <channel-switch class="mg-14" :title="$t('card.channel')" :stat="cardData.params.switch === 'on' ? true : false" :cardData="cardData" />
            </div>
            <!-- power detection -->
            <div class="pw-det" v-else-if="isPwDet">
                <div class="chart">
                    <circle-chart width="180px" height="180px" color="blue" />
                    <span class="title">{{ $t('card.realtimestats') }}</span>
                    <span class="value">{{ cardData.params.power }}W</span>
                </div>
                <channel-switch class="mg-14" :title="$t('card.channel')" :stat="cardData.params.switch === 'on' ? true : false" :cardData="cardData" />
            </div>
            <!-- power voltage current socket -->
            <div class="pvc-sct" v-else-if="isPvcSct">
                <div class="chart-grp">
                    <div class="chart" v-for="item in pvcSctData" :key="item.key">
                        <circle-chart width="110px" height="110px" :color="item.color" />
                        <span class="title">{{ item.title }}</span>
                        <span class="value">{{ item.value }}</span>
                    </div>
                </div>
                <channel-switch class="mg-14" :title="$t('card.channel')" :stat="cardData.params.switch === 'on' ? true : false" :cardData="cardData" />
            </div>
            <!-- dual power switch -->
            <div class="dual-pw-sw" v-else-if="isDualPwSw">
                <div class="chart-grp">
                    <div class="chart" v-for="item in dualPwSwData" :key="item.key">
                        <circle-chart width="110px" height="110px" :color="item.color" />
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
            <!-- five color bulb light or five color light -->
            <div v-else-if="(isFiveColorBulbLt && cardData.params.state === 'on') || (isFiveColorLt && cardData.params.switch === 'on') || (isZigbeeFiveColorLt && cardData.params.switch === 'on')">
                <five-color-light-content :cardData="cardData" />
            </div>
            <!-- wifi door sensor  -->
            <div v-else-if="isWifiDoorSensor">
                <content-item type="doorSensor" :params="cardData.params"></content-item>
            </div>
            <!-- two color light -->
            <div v-else-if="isTwoColorLt && cardData.params.switch === 'on'">
                <ctrl-slider class="mg-14" type="brightness" :cardData="cardData" />
                <ctrl-slider class="mg-14" type="color-temp" :cardData="cardData" />
            </div>
            <!-- rhythm light strip -->
            <div v-else-if="isRhythmLtStrip && cardData.params.switch === 'on'">
                <color-picker class="mg-14" :cardData="cardData" />
                <ctrl-slider class="mg-14" type="brightness" :cardData="cardData" />
                <ctrl-slider class="mg-14" type="color-temp" :cardData="cardData" />
                <rhythm-switch class="mg-14" :cardData="cardData" />
            </div>
            <!-- elec curtain -->
            <div v-else-if="isCurtain">
                <curtain class="mg-14" :cardData="cardData" />
            </div>
            <!--  RF Brige  -->
            <div v-else-if="isRFGateway">
                <rf-gateway :tags="cardData.tags" :online="cardData.online" />
            </div>
            <!-- rf-bridge-child-device -->
            <div v-else-if="isRFBridge">
                <r-f-bridge-content :cardData="cardData" />
            </div>
            <!--  zigbee temprature and humidity -->
            <div class="zigbee-th" v-else-if="isZigbeeTempAndHumi">
                <div class="gauge" v-if="cardData.params.humidity !== 'unavailable' || cardData.params.temperature !== 'unavailable'">
                    <!-- <humi-gauge v-if="cardData.params.humidity !== 'unavailable'" :value="cardData.params.humidity / 100" />
                    <temp-gauge v-if="cardData.params.temperature !== 'unavailable'" :value="cardData.params.temperature / 100" /> -->
                    <humi-gauge v-if="cardData.params.humidity !== 'unavailable'" :value="cardData.params.humidity / 100" />
                    <temp-gauge v-if="cardData.params.temperature !== 'unavailable'" :value="cardData.params.temperature / 100" tempUnit="c" />
                </div>
            </div>
            <!--  other zigbee  -->
            <div v-else-if="isZigbeeOther">
                <other-zigbee-item class="mg-14" :uiid="cardData.uiid" :cardData="cardData" />
            </div>

            <!-- fan-light -->
            <div v-else-if="isFanLight">
                <fan class="mg-14" :uiid="cardData.uiid" :cardData="cardData" />
            </div>

            <!-- dimming -->
            <div v-else-if="isDimming">
                <ctrl-slider type="brightness" class="mg-14" :uiid="cardData.uiid" :cardData="cardData" />
            </div>

            <!-- NSPanel -->
            <div class="nspanel" v-else-if="isNSPanel">
                <div class="gauge">
                    <temp-gauge :value="nspanelTempValue" :tempUnit="nspanelTempUnit"></temp-gauge>
                </div>
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

            <!-- UIID 181 -->
            <div class="uiid-181" v-else-if="isUiid181" style="padding-top: 20px;">
                <constant-tem-and-hum :cardData="cardData" />
                <channel-mode class="mg-14" :mode="uiid181Mode" />
                <channel-switch
                    class="mg-14"
                    :title="`${$t('card.channel')} 1`"
                    :stat="cardData.params.switch === 'on' ? true : false"
                    :cardData="cardData"
                    :index="cardData.cardIndex"
                />
            </div>

            <!-- UIID 190 -->
            <div class="uiid-190" v-else-if="cardData.uiid === 190">
				<div class="chart-grp">
                    <div class="chart">
                        <circle-chart
                            width="110px"
                            height="110px"
                            color="blue"
                        />
                        <span class="title">{{ $t('card.uiid190chart.today') }}</span>
                        <span class="value">{{ uiid190DayConsumption }}kWh</span>
                    </div>
                    <div class="chart">
                        <circle-chart
                            width="110px"
                            height="110px"
                            color="green"
                        />
                        <span class="title">{{ $t('card.uiid190chart.currentMonth') }}</span>
                        <span class="value">{{ uiid190MonConsumption }}kWh</span>
                    </div>
                    <div class="chart">
                        <circle-chart
                            width="110px"
                            height="110px"
                            color="yellow"
                        />
                        <span class="title">{{ $t('card.uiid190chart.power') }}</span>
                        <span class="value">{{ uiid190Power }}W</span>
                    </div>
                </div>
                <channel-switch
                    class="mg-14"
                    :title="`${$t('card.channel')} 1`"
                    :stat="cardData.params.switches[0].switch === 'on' ? true : false"
                    :cardData="cardData"
                    :index="cardData.cardIndex"
                />
            </div>

            <!-- UIID 160 -->
            <div class="uiid-160" v-else-if="uiid === 160">
                <channel-switch
                    class="mg-14"
                    :title="$t('card.channel')"
                    :stat="cardData.params.switches[0].switch === 'on' ? true : false"
                    :cardData="cardData"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';

import {
    isSupportedDevice,
    isPureSwOrSockDevice,
    isOneChannelSwOrSockSPDevice,
    isOneChannelSwOrSockCPDevice,
    isTwoChannelDevice,
    isThreeChannelDevice,
    isFourChannelDevice,
} from '@/utils/etc';
import ChannelSwitch from '@/components/CtrlItem/ChannelSwitch.vue';
import ChannelMode from '@/components/CtrlItem/ChannelMode.vue';
import ContentItem from '@/components/CtrlItem/ContentItem.vue';
import FiveBulbLight from '@/components/CtrlItem/FiveBulbLight.vue';
import Curtain from '@/components/CtrlItem/Curtain.vue';
import HumiGauge from '@/components/GaugeChart/Humidity.vue';
import TempGauge from '@/components/GaugeChart/Temperature.vue';
import CircleChart from '@/components/CircleChart.vue';
import ColorPicker from '@/components/CtrlItem/ColorPicker.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';
import FiveColorLightContent from '@/components/CtrlItem/FiveColorLightContent.vue';
import RhythmSwitch from '@/components/CtrlItem/RhythmSwitch.vue';
import OtherZigbeeItem from '@/components/CtrlItem/OtherZigbeeItem.vue';
import RfGateway from '@/components/CtrlItem/RfGateway.vue';
import RFBridgeContent from '@/components/CtrlItem/RFBridgeContent.vue';
import Fan from '@/components/CtrlItem/Fan.vue';
import ConstantTemAndHum from '@/components/CtrlItem/ConstantTemAndHum.vue';
import { i18n } from '@/locales';
import type { CardData } from '@/types'

export default defineComponent({
    name: 'CardContent',

    components: {
        ConstantTemAndHum,
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
        FiveColorLightContent,
        RhythmSwitch,
        OtherZigbeeItem,
        RFBridgeContent,
        RfGateway,
        Fan,
    },

    props: {
        cardData: {
            type: Object as PropType<CardData>,
            required: true,
        },
    },

    computed: {
        uiid() {
            return this.cardData.uiid;
        },
        uiid190Power() {
            const { params } = this.cardData as any;
            return params.power / 100 || 0;
        },
        uiid190DayConsumption() {
            const { params } = this.cardData as any;
            return params.dayKwh / 100 || 0;
        },
        uiid190MonConsumption() {
            const { params } = this.cardData as any;
            return params.monthKwh / 100 || 0;
        },
        isUiid181() {
            const { uiid } = this.cardData as any;
            return uiid === 181;
        },
        unsupportText() {
            const { uiid } = this.cardData as any;
            const userIsLogin = this.isLogin;

            if (!userIsLogin) {
                return this.$t('card.unsupport.needsignin');
            } else if (!uiid) {
                return this.$t('card.unsupport.notbelong');
            } else {
                return this.$t('card.unsupport.notsupport');
            }
        },
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
                    key: 0,
                },
                {
                    title: $t('card.voltage'),
                    value: cardData.params.voltage + 'V',
                    color: 'green',
                    key: 1,
                },
                {
                    title: $t('card.current'),
                    value: cardData.params.current + 'A',
                    color: 'yellow',
                    key: 2,
                },
            ];
        },
        // Current device is dual power detection switch
        isDualPwSw() {
            const { uiid } = this.cardData as any;
            return uiid === 126;
        },
        isWifiDoorSensor() {
            const { uiid } = this.cardData as any;
            return uiid === 102;
        },
        isFiveColorLt() {
            const { uiid } = this.cardData as any;
            return uiid === 104;
        },
		isZigbeeFiveColorLt(){
            const { uiid } = this.cardData as any;
            return uiid === 3258;
		},
        isCurtain() {
            const { uiid } = this.cardData as any;
            return uiid === 11;
        },
        isZigbeeOther() {
            const { uiid } = this.cardData as any;
            return uiid === 1000 || uiid === 2026 || uiid === 3026 || uiid === 4026;
        },
        isZigbeeTempAndHumi() {
            const { uiid } = this.cardData as any;
            return uiid === 1770;
        },
        isRFBridge() {
            const { uiid, cardIndex } = this.cardData as any;
            return uiid === 28 && cardIndex !== -1;
        },
        isRFGateway() {
            const { uiid, cardIndex } = this.cardData as any;
            return uiid === 28 && cardIndex === -1;
        },
        dualPwSwData() {
            const { $t, cardData } = this as any;
            return [
                {
                    title: $t('card.realpower'),
                    value: cardData.params['actPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'blue',
                    key: 0,
                },
                {
                    title: $t('card.reactivepower'),
                    value: cardData.params['reactPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'green',
                    key: 1,
                },
                {
                    title: $t('card.apparentpower'),
                    value: cardData.params['apparentPow_0' + cardData.cardIndex] / 100 + 'W',
                    color: 'yellow',
                    key: 2,
                },
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
            return uiid === 103 || uiid === 1258;
        },
        // Current device is rhythm light strip
        isRhythmLtStrip() {
            const { uiid } = this.cardData as any;
            return uiid === 59;
        },
        isFanLight() {
            const { uiid } = this.cardData as any;
            return uiid === 34;
        },
        isDimming() {
            const { uiid } = this.cardData as any;
            return uiid === 44;
        },
        isNSPanel() {
            const { uiid } = this.cardData as any;
            return uiid === 133;
        },
        nspanelTempValue() {
            const { params } = this.cardData as any;
            return params.temperature;
        },
        nspanelTempUnit() {
            const { params } = this.cardData as any;
            return params.tempUnit === 0 ? 'c' : 'f';
        },
        channels() {
            const { uiid, type, params, tags } = this.cardData as any;
            const channelName = this.$t('card.channel');
            const result: Array<{ key: number; name: string; stat: string }> = [];
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
        },
        uiid181Mode() {
            function getTimezone() {
                const offset = new Date().getTimezoneOffset() / 60;
                return -parseFloat(offset.toFixed(2));
            }
            const { params } = this.cardData as any;
            const autoControlEnabled = _.get(params, 'autoControlEnabled');
            if (autoControlEnabled === 0)
                return i18n.global.t('card.uiid181mode.manual');

            interface IAutoControl {
                deviceType: 'temperature' | 'humidity';
                effTime: {
                    days: number[];
                    spanType: 'any' | 'range';
                    from: string;
                    to: string;
                };
            }
            const autoControl = _.get(params, 'autoControl') as IAutoControl[];
            const date = new Date();
            const nowWeekDay = date.getDay();
            const nowTime = date.getTime();
            //把小时分钟转换成时间戳
            const changeHourMinuToTimeStamp = (hhmm: string) => {
                const hh = Number(hhmm.split(':')[0]) + getTimezone();
                const mm = Number(hhmm.split(':')[1]);
                const date = new Date();
                const year = date.getFullYear();
                const month = date.getMonth();
                const day = date.getDate();

                return new Date(year, month, day, hh, mm, 0).getTime();
            };

            let mode = '';
            autoControl.forEach((item) => {
                if (item.effTime.days.includes(nowWeekDay)) {
                    if (item.effTime.spanType === 'any') {
                        mode = item.deviceType;
                    } else {
                        const fromTime = changeHourMinuToTimeStamp(item.effTime.from);
                        const toTime = changeHourMinuToTimeStamp(item.effTime.to);
                        //跨天情况用一天的结束时间
                        const endTime = changeHourMinuToTimeStamp('23:59');
                        //跨天情况
                        if (fromTime > toTime) {
                            if (nowTime > fromTime && nowTime < endTime) {
                                mode = item.deviceType;
                            }
                        } else {
                            //当前处于自动模式的生效时间
                            if (nowTime > fromTime && nowTime < toTime) {
                                mode = item.deviceType;
                            }
                        }
                    }
                }
            });

            //没匹配对应的自动模式，显示手动模式
            if (mode === 'temperature') {
                return i18n.global.t('card.uiid181mode.temp');
            } else if (mode === 'humidity') {
                return i18n.global.t('card.uiid181mode.humi');
            } else {
                return i18n.global.t('card.uiid181mode.manual');
            }
        },
        ...mapState(['isLogin']),
    },
});
</script>

<style lang="stylus" scoped>
.card-content

    .nspanel .gauge
        display flex
        justify-content center
        align-items center

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
    .zigbee-th
        .gauge
            display flex
            justify-content center
            align-items center
            margin -6px 0
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
