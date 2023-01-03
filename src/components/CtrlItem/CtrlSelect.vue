<template>
    <div class="ctrl-select">
        <div class="title">
            <!-- fan-light -->
            <img class="fan-light-icon" v-if="modalParams.uiid === 34 && index === 0" src="@/assets/fan_bulb.png" alt="fan" />
            <img class="fan-light-icon" v-if="modalParams.uiid === 34 && index === 1" src="@/assets/fan.png" alt="fan" />
            {{ title }}
        </div>

        <!-- 单选选择 -->
        <a-select v-if="selectType === 'radio'" v-model:value="value" style="min-width:120px;" size="small" @change="handleChange" :disabled="disabled">
            <a-select-option v-for="item in options" :key="item.id" :value="item.value">{{ item.text }}</a-select-option>
        </a-select>

        <!-- 级联选择 -->
        <a-cascader
            v-else-if="selectType === 'cascader'"
            style="min-width:120px;"
            size="small"
            v-model:value="cascaderValue"
            :options="cascaderOptions"
            expand-trigger="hover"
            :disabled="cascaderDisabled"
            @change="handleChange"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapState } from 'vuex';

import { isMultiChannelDevice, isOneChannelSwOrSockCPDevice } from '@/utils/etc';
import { setPowerOnState, setCloudDevice } from '@/api/device';

const twoColorLightMap: any = {
    bright: {
        ltype: 'bright',
        bright: {
            br: 100,
            ct: 255,
        },
    },
    read: {
        ltype: 'read',
        read: {
            br: 50,
            ct: 0,
        },
    },
    computer: {
        ltype: 'computer',
        computer: {
            br: 20,
            ct: 255,
        },
    },
    nightLight: {
        ltype: 'nightLight',
        nightLight: {
            br: 5,
            ct: 0,
        },
    },
};

const fiveColorBulbLightMap: any = [
    {
        a: 'b',
    },
    {
        b: 'c',
    },
    {
        c: 'd',
    },
    /* above useless */
    {
        channel0: '0',
        channel1: '0',
        channel2: '189',
        channel3: '118',
        channel4: '0',
        zyx_mode: 3,
        type: 'middle',
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '255',
        channel3: '255',
        channel4: '255',
        zyx_mode: 4,
        type: 'middle',
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '207',
        channel3: '56',
        channel4: '3',
        zyx_mode: 5,
        type: 'middle',
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '56',
        channel3: '85',
        channel4: '179',
        zyx_mode: 6,
        type: 'middle',
    },
];

const fiveColorLightMap: any = {
    bright: {
        ltype: 'bright',
        bright: {
            r: 255,
            g: 255,
            b: 255,
            br: 100,
        },
    },
    goodNight: {
        ltype: 'goodNight',
        goodNight: {
            r: 255,
            g: 254,
            b: 127,
            br: 25,
        },
    },
    read: {
        ltype: 'read',
        read: {
            r: 255,
            g: 255,
            b: 255,
            br: 60,
        },
    },
    nightLight: {
        ltype: 'nightLight',
        nightLight: {
            r: 255,
            g: 242,
            b: 226,
            br: 5,
        },
    },
    party: {
        ltype: 'party',
        party: {
            r: 254,
            g: 132,
            b: 0,
            br: 45,
            tf: 1,
            sp: 1,
        },
    },
    leisure: {
        ltype: 'leisure',
        leisure: {
            r: 0,
            g: 40,
            b: 254,
            br: 55,
            tf: 1,
            sp: 1,
        },
    },
    soft: {
        ltype: 'soft',
        soft: {
            r: 38,
            g: 254,
            b: 0,
            br: 20,
            tf: 1,
            sp: 1,
        },
    },
    colorful: {
        ltype: 'colorful',
        colorful: {
            r: 255,
            g: 0,
            b: 0,
            br: 100,
            tf: 1,
            sp: 1,
        },
    },
};

const dimmingMap: { mode: number; switch: string; brightness: number }[] = [
    // useless-params
    { mode: 0, switch: 'on', brightness: 5 },
    // night
    { mode: 1, switch: 'on', brightness: 5 },
    // work
    { mode: 2, switch: 'on', brightness: 20 },
    // reading
    { mode: 3, switch: 'on', brightness: 50 },
    // bright
    { mode: 4, switch: 'on', brightness: 100 },
];
export default defineComponent({
    name: 'CtrlSelect',

    props: {
        type: {
            type: String as PropType<
                | 'power-on-state' // 开关类设备的通电反应设置
                | 'five-color-light' // UIID104 五色灯
                | 'five-color-bulb-light' // UIID22 五色电灯泡
                | 'rhythm-light-strip' // UIID59 律动灯带
                | 'rhythm-light-strip-bluetooth' // UIID137 律动灯带-蓝牙版
                | 'rhythm-light-strip-vivid' // UIID173 律动灯带-炫彩版
                | 'two-color-light' // UIID103 双色灯
                | 'dimming' // UIID44 单路调光灯
            >,
            required: true,
        },
        index: {
            default: 0,
        },
    },

    data(): {
        value: string,
        cascaderValue: any[]
    } {
        return {
            value: '',
            cascaderValue: ['', -1],
        };
    },

    computed: {
        uiid() {
            return this.modalParams.uiid
        },
        selectType() {
            const { uiid } = this.modalParams;
            if ([173].includes(uiid)) {
                return 'cascader';
            }
            return 'radio';
        },
        cascaderDisabled() {
            return this.modalParams.params?.switch !== 'on';
        },
        title() {
            const { type, $t } = this as any;
            if (type === 'power-on-state') {
                return $t('modal.powerOnState.name');
            }
            return $t('modal.mode');
        },
        options() {
            const { type, $t } = this as any;
            if (type === 'power-on-state') {
                return [
                    {
                        id: 0,
                        value: 'on',
                        text: $t('modal.powerOnState.on'),
                    },
                    {
                        id: 1,
                        value: 'off',
                        text: $t('modal.powerOnState.off'),
                    },
                    {
                        id: 2,
                        value: 'stay',
                        text: $t('modal.powerOnState.stay'),
                    },
                ];
            } else if (type === 'five-color-bulb-light') {
                return [
                    {
                        id: 0,
                        value: 3,
                        text: $t('modal.modeOps.sleep'),
                    },
                    {
                        id: 1,
                        value: 4,
                        text: $t('modal.modeOps.reading'),
                    },
                    {
                        id: 2,
                        value: 5,
                        text: $t('modal.modeOps.party'),
                    },
                    {
                        id: 3,
                        value: 6,
                        text: $t('modal.modeOps.relax'),
                    },
                ];
            } else if (type === 'rhythm-light-strip') {
                return [
                    {
                        id: 0,
                        value: 1,
                        text: $t('modal.modeOps.colorful'),
                    },
                    {
                        id: 1,
                        value: 2,
                        text: $t('modal.modeOps.colorfulgra'),
                    },
                    {
                        id: 2,
                        value: 3,
                        text: $t('modal.modeOps.colorfulbre'),
                    },
                    {
                        id: 3,
                        value: 11,
                        text: $t('modal.modeOps.rgbstr'),
                    },
                    {
                        id: 4,
                        value: 8,
                        text: $t('modal.modeOps.rgbgra'),
                    },
                    {
                        id: 5,
                        value: 9,
                        text: $t('modal.modeOps.rgbpul'),
                    },
                    {
                        id: 6,
                        value: 10,
                        text: $t('modal.modeOps.rgbbre'),
                    },
                    {
                        id: 7,
                        value: 5,
                        text: $t('modal.modeOps.diypul'),
                    },
                    {
                        id: 8,
                        value: 6,
                        text: $t('modal.modeOps.diybre'),
                    },
                    {
                        id: 9,
                        value: 4,
                        text: $t('modal.modeOps.diygra'),
                    },
                    {
                        id: 10,
                        value: 7,
                        text: $t('modal.modeOps.diystr'),
                    },
                ];
            } else if (type === 'rhythm-light-strip-bluetooth') {
                return [
                    { id: 0, value: 7, text: $t('modal.modeOps.reading') },
                    { id: 1, value: 18, text: $t('modal.modeOps.work') },
                    { id: 2, value: 20, text: $t('modal.modeOps.creek') },
                    { id: 3, value: 19, text: $t('modal.modeOps.ocean') },
                    { id: 4, value: 13, text: $t('modal.modeOps.candle') },
                    { id: 5, value: 25, text: $t('modal.modeOps.moonlight') },
                    { id: 6, value: 14, text: $t('modal.modeOps.goodnight') },
                    { id: 7, value: 6, text: $t('modal.modeOps.vivid') },
                    { id: 8, value: 8, text: $t('modal.modeOps.relax') },
                    { id: 9, value: 9, text: $t('modal.modeOps.sunrise') },
                    { id: 10, value: 10, text: $t('modal.modeOps.sunshine') },
                    { id: 11, value: 11, text: $t('modal.modeOps.radiant') },
                    { id: 12, value: 12, text: $t('modal.modeOps.dreamy') },
                    { id: 13, value: 15, text: $t('modal.modeOps.sunny') },
                    { id: 14, value: 16, text: $t('modal.modeOps.festive') },
                    { id: 15, value: 17, text: $t('modal.modeOps.gorgeous') },
                    { id: 16, value: 21, text: $t('modal.modeOps.gentle') },
                    { id: 17, value: 22, text: $t('modal.modeOps.passion') },
                    { id: 18, value: 23, text: $t('modal.modeOps.joy') },
                    { id: 19, value: 24, text: $t('modal.modeOps.rainbow') },
                    { id: 20, value: 26, text: $t('modal.modeOps.sunset') },
                ];
            } else if (type === 'five-color-light') {
                return [
                    {
                        id: 0,
                        value: 'bright',
                        text: $t('modal.modeOps.bright'),
                    },
                    {
                        id: 1,
                        value: 'goodNight',
                        text: $t('modal.modeOps.sleep'),
                    },
                    {
                        id: 2,
                        value: 'read',
                        text: $t('modal.modeOps.reading'),
                    },
                    {
                        id: 3,
                        value: 'party',
                        text: $t('modal.modeOps.party'),
                    },
                    {
                        id: 4,
                        value: 'nightLight',
                        text: $t('modal.modeOps.night'),
                    },
                    {
                        id: 5,
                        value: 'leisure',
                        text: $t('modal.modeOps.relax'),
                    },
                    {
                        id: 6,
                        value: 'soft',
                        text: $t('modal.modeOps.soft'),
                    },
                    {
                        id: 7,
                        value: 'colorful',
                        text: $t('modal.modeOps.vivid'),
                    },
                ];
            } else if (type === 'two-color-light') {
                return [
                    {
                        id: 0,
                        value: 'bright',
                        text: $t('modal.modeOps.bright'),
                    },
                    {
                        id: 1,
                        value: 'read',
                        text: $t('modal.modeOps.read'),
                    },
                    {
                        id: 2,
                        value: 'computer',
                        text: $t('modal.modeOps.computer'),
                    },
                    {
                        id: 3,
                        value: 'nightLight',
                        text: $t('modal.modeOps.nightlight'),
                    },
                ];
            } else if (type === 'dimming') {
                return [
                    {
                        id: 0,
                        value: 4,
                        text: $t('modal.modeOps.bright'),
                    },
                    {
                        id: 1,
                        value: 3,
                        text: $t('modal.modeOps.read'),
                    },
                    {
                        id: 2,
                        value: 2,
                        text: $t('modal.modeOps.work'),
                    },
                    {
                        id: 3,
                        value: 1,
                        text: $t('modal.modeOps.nightlight'),
                    },
                ];
            }
            return [];
        },
        cascaderOptions() {
            if (this.type === 'rhythm-light-strip-vivid') {
                return [
                    {
                        value: 'colorStripe',
                        label: this.$t('modal.modeOps.scene_ble_magic'),
                        children: [
                            { value: 7, label: this.$t('modal.modeOps.scene_ble_rhy2') },
                            { value: 8, label: this.$t('modal.modeOps.scene_ble_rhy3') },
                        ],
                    },
                    {
                        value: 'wave',
                        label: this.$t('modal.modeOps.scene_ble_wave'),
                        children: [
                            { value: 35, label: this.$t('modal.modeOps.scene_ble_rhy30') },
                            { value: 36, label: this.$t('modal.modeOps.scene_ble_rhy31') },
                            { value: 37, label: this.$t('modal.modeOps.scene_ble_rhy32') },
                            { value: 38, label: this.$t('modal.modeOps.scene_ble_rhy33') },
                            { value: 39, label: this.$t('modal.modeOps.scene_ble_rhy34') },
                            { value: 40, label: this.$t('modal.modeOps.scene_ble_rhy35') },
                        ],
                    },
                    {
                        value: 'followSpot',
                        label: this.$t('modal.modeOps.scene_ble_race'),
                        children: [
                            { value: 29, label: this.$t('modal.modeOps.scene_ble_rhy24') },
                            { value: 30, label: this.$t('modal.modeOps.scene_ble_rhy25') },
                            { value: 31, label: this.$t('modal.modeOps.scene_ble_rhy26') },
                            { value: 32, label: this.$t('modal.modeOps.scene_ble_rhy27') },
                            { value: 33, label: this.$t('modal.modeOps.scene_ble_rhy28') },
                            { value: 34, label: this.$t('modal.modeOps.scene_ble_rhy29') },
                        ],
                    },
                    {
                        value: 'colorWash',
                        label: this.$t('modal.modeOps.scene_ble_flush'),
                        children: [
                            { value: 41, label: this.$t('modal.modeOps.scene_ble_rhy36') },
                            { value: 42, label: this.$t('modal.modeOps.scene_ble_rhy37') },
                            { value: 43, label: this.$t('modal.modeOps.scene_ble_rhy38') },
                            { value: 44, label: this.$t('modal.modeOps.scene_ble_rhy39') },
                            { value: 45, label: this.$t('modal.modeOps.scene_ble_rhy40') },
                            { value: 46, label: this.$t('modal.modeOps.scene_ble_rhy41') },
                            { value: 47, label: this.$t('modal.modeOps.scene_ble_rhy42') },
                            { value: 48, label: this.$t('modal.modeOps.scene_ble_rhy43') },
                            { value: 49, label: this.$t('modal.modeOps.scene_ble_rhy44') },
                            { value: 50, label: this.$t('modal.modeOps.scene_ble_rhy45') },
                            { value: 51, label: this.$t('modal.modeOps.scene_ble_rhy46') },
                            { value: 52, label: this.$t('modal.modeOps.scene_ble_rhy47') },
                        ],
                    },
                    {
                        value: 'loop',
                        label: this.$t('modal.modeOps.scene_ble_marquee'),
                        children: [
                            { value: 22, label: this.$t('modal.modeOps.scene_ble_rhy17') },
                            { value: 23, label: this.$t('modal.modeOps.scene_ble_rhy18') },
                            { value: 24, label: this.$t('modal.modeOps.scene_ble_rhy19') },
                            { value: 25, label: this.$t('modal.modeOps.scene_ble_rhy20') },
                            { value: 26, label: this.$t('modal.modeOps.scene_ble_rhy21') },
                            { value: 27, label: this.$t('modal.modeOps.scene_ble_rhy22') },
                            { value: 28, label: this.$t('modal.modeOps.scene_ble_rhy23') },
                        ],
                    },
                    {
                        value: 'jump',
                        label: this.$t('modal.modeOps.scene_ble_jump'),
                        children: [
                            { value: 10, label: this.$t('modal.modeOps.scene_ble_rhy5') },
                            { value: 11, label: this.$t('modal.modeOps.scene_ble_rhy6') },
                            { value: 12, label: this.$t('modal.modeOps.scene_ble_rhy7') },
                        ],
                    },
                    {
                        value: 'gradualChange',
                        label: this.$t('modal.modeOps.scene_ble_gradual'),
                        children: [
                            { value: 16, label: this.$t('modal.modeOps.scene_ble_rhy11') },
                            { value: 17, label: this.$t('modal.modeOps.scene_ble_rhy12') },
                            { value: 18, label: this.$t('modal.modeOps.scene_ble_rhy13') },
                            { value: 19, label: this.$t('modal.modeOps.scene_ble_rhy14') },
                            { value: 20, label: this.$t('modal.modeOps.scene_ble_rhy15') },
                            { value: 21, label: this.$t('modal.modeOps.scene_ble_rhy16') },
                        ],
                    },
                    {
                        value: 'strobe',
                        label: this.$t('modal.modeOps.scene_ble_strobe'),
                        children: [
                            { value: 13, label: this.$t('modal.modeOps.scene_ble_rhy8') },
                            { value: 14, label: this.$t('modal.modeOps.scene_ble_rhy9') },
                            { value: 15, label: this.$t('modal.modeOps.scene_ble_rhy10') },
                        ],
                    },
                ];
            }

            return []
        },
        disabled() {

            if ([137].includes(this.uiid)) {
                // 137灯带关闭的时，不允许修改模式
                return this.modalParams.params.switch === 'off'
            }

            return false
        },
        ...mapState(['modalParams']),
    },

    methods: {
        async handleChange() {
            const { uiid, cardIndex, deviceId, apikey } = this.modalParams;
            if (this.type === 'power-on-state') {
                await setPowerOnState(this.value, this.modalParams, uiid === 126 ? cardIndex : this.index);
            } else if (this.type === 'two-color-light') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: twoColorLightMap[this.value],
                });
            } else if (this.type === 'rhythm-light-strip') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: this.value,
                        switch: 'on',
                    },
                });
            } else if (this.type === 'five-color-bulb-light') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: fiveColorBulbLightMap[this.value],
                });
            } else if (this.type === 'five-color-light') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: fiveColorLightMap[this.value],
                });
            } else if (this.type === 'dimming') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: dimmingMap[+this.value],
                });
            } else if (this.type === 'rhythm-light-strip-bluetooth') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: this.value,
                        switch: 'on'
                    }
                });
            } else if (this.type === 'rhythm-light-strip-vivid') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: this.cascaderValue[1],
                        switch: 'on'
                    }
                })
            }
        },
        initPowerOnStateValue() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
            if (type === 1 && uiid === 1) {
                // DIY device
                this.value = params.data1.startup;
            } else if (uiid === 190) {
                this.value = params.configure[0].startup;
            } else if (isMultiChannelDevice(uiid) || isOneChannelSwOrSockCPDevice(uiid) || uiid === 34) {
                // Multi-channel
                this.value = params.configure[this.index].startup;
            } else if (uiid === 126) {
                // Dual R3
                this.value = params.configure[cardIndex].startup;
            } else if (uiid === 160) {
                this.value = params.configure[0].startup;
            } else {
                // Single channel
                this.value = params.startup;
            }
        },
        initTwoColorLightValue() {
            if (this.modalParams.params.ltype !== 'white') {
                this.value = this.modalParams.params.ltype;
            }
        },
        initRhythmLightStripValue() {
            if (this.modalParams.params.mode !== 12) {
                this.value = this.modalParams.params.mode;
            }
        },
        initFiveColorBulbLightValue() {
            if (this.modalParams.params.zyx_mode !== 1 && this.modalParams.params.zyx_mode !== 2) {
                this.value = this.modalParams.params.zyx_mode;
            }
        },
        initFiveColorLightValue() {
            if (this.modalParams.params.ltype !== 'white') {
                this.value = this.modalParams.params.ltype;
            }
        },
        initDimmingValue() {
            if (this.modalParams.params.mode !== 0) {
                this.value = this.modalParams.params.mode;
            }
        },
        initRhythmLightStripBluetoothValue() {
            const { mode } = this.modalParams.params;
            if (![1, 2, 3].includes(mode)) {
                this.value = this.modalParams.params.mode;
            }
        },
        initRhythmLightStripVividValue() {
            const { mode } = this.modalParams.params
            const o = this.cascaderOptions.find(option => option.children.some(child => child.value === mode))
            if (o) {
               this.cascaderValue[0] = o.value
               this.cascaderValue[1] = (o.children.find(c => c.value === mode))!.value
            }
        },
        initValue() {
            if (this.type === 'power-on-state') {
                this.initPowerOnStateValue();
            } else if (this.type === 'two-color-light') {
                this.initTwoColorLightValue();
            } else if (this.type === 'rhythm-light-strip') {
                this.initRhythmLightStripValue();
            } else if (this.type === 'five-color-bulb-light') {
                this.initFiveColorBulbLightValue();
            } else if (this.type === 'five-color-light') {
                this.initFiveColorLightValue();
            } else if (this.type === 'dimming') {
                this.initDimmingValue();
            } else if (this.type === 'rhythm-light-strip-bluetooth') {
                this.initRhythmLightStripBluetoothValue();
            } else if (this.type === 'rhythm-light-strip-vivid') {
                this.initRhythmLightStripVividValue()
            }
        }
    },

    created() {
        this.initValue();
    },

    watch: {
        'modalParams.params': function(params) {
            params && this.initValue();
        }
    }
});
</script>

<style lang="stylus" scoped>
.ctrl-select
    display flex
    justify-content space-between
    align-items center
    .title
        color #212121
        font-size 14px
        .fan-light-icon
            width 18px
            margin-right 4px
</style>
