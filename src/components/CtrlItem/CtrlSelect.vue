<template>
    <div class="ctrl-select">
        <div class="title">{{ title }}</div>
        <a-select
            v-model:value="value"
            style="min-width:120px;"
            size="small"
            @change="handleChange"
        >
            <a-select-option
                v-for="item in options"
                :key="item.id"
                :value="item.value"
            >{{ item.text }}</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import { isMultiChannelDevice, isOneChannelSwOrSockCPDevice } from '@/utils/etc';
import { setPowerOnState, setCloudDevice } from '@/api/device';

const twoColorLightMap: any = {
    bright: {
        ltype: 'bright',
        bright: {
            br: 100,
            ct: 255
        }
    },
    read: {
        ltype: 'read',
        read: {
            br: 50,
            ct: 0
        }
    },
    computer: {
        ltype: 'computer',
        computer: {
            br: 20,
            ct: 255
        }
    },
    nightLight: {
        ltype: 'nightLight',
        nightLight: {
            br: 5,
            ct: 0
        }
    }
};

const fiveColorBulbLightMap: any = [
    {
        a: 'b'
    },
    {
        b: 'c'
    },
    {
        c: 'd'
    },
    /* above useless */
    {
        channel0: '0',
        channel1: '0',
        channel2: '189',
        channel3: '118',
        channel4: '0',
        zyx_mode: 3,
        type: 'middle'
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '255',
        channel3: '255',
        channel4: '255',
        zyx_mode: 4,
        type: 'middle'
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '207',
        channel3: '56',
        channel4: '3',
        zyx_mode: 5,
        type: 'middle'
    },
    {
        channel0: '0',
        channel1: '0',
        channel2: '56',
        channel3: '85',
        channel4: '179',
        zyx_mode: 6,
        type: 'middle'
    }
];

const fiveColorLightMap: any = {
    bright: {
        ltype: 'bright',
        bright: {
            r: 255,
            g: 255,
            b: 255,
            br: 100
        }
    },
    goodNight: {
        ltype: 'goodNight',
        goodNight: {
            r: 255,
            g: 254,
            b: 127,
            br: 25
        }
    },
    read: {
        ltype: 'read',
        read: {
            r: 255,
            g: 255,
            b: 255,
            br: 60
        }
    },
    nightLight: {
        ltype: 'nightLight',
        nightLight: {
            r: 255,
            g: 242,
            b: 226,
            br: 5
        }
    },
    party: {
        ltype: 'party',
        party: {
            r: 254,
            g: 132,
            b: 0,
            br: 45,
            tf: 1,
            sp: 1
        }
    },
    leisure: {
        ltype: 'leisure',
        leisure: {
            r: 0,
            g: 40,
            b: 254,
            br: 55,
            tf: 1,
            sp: 1
        }
    },
    soft: {
        ltype: 'soft',
        soft: {
            r: 38,
            g: 254,
            b: 0,
            br: 20,
            tf: 1,
            sp: 1
        }
    },
    colorful: {
        ltype: 'colorful',
        colorful: {
            r: 255,
            g: 0,
            b: 0,
            br: 100,
            tf: 1,
            sp: 1
        }
    }
};

export default defineComponent({
    name: 'CtrlSelect',

    props: {
        // 'power-on-state'
        // 'five-color-light'
        // 'five-color-bulb-light'
        // 'rhythm-light-strip'
        // 'two-color-light'
        type: {
            required: true
        },
        index: {
            default: 0
        }
    },

    data() {
        return {
            value: ''
        };
    },

    computed: {
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
                        text: $t('modal.powerOnState.on')
                    },
                    {
                        id: 1,
                        value: 'off',
                        text: $t('modal.powerOnState.off')
                    },
                    {
                        id: 2,
                        value: 'stay',
                        text: $t('modal.powerOnState.stay')
                    }
                ];
            } else if (type === 'five-color-bulb-light') {
                return [
                    {
                        id: 0,
                        value: 3,
                        text: $t('modal.modeOps.sleep')
                    },
                    {
                        id: 1,
                        value: 4,
                        text: $t('modal.modeOps.reading')
                    },
                    {
                        id: 2,
                        value: 5,
                        text: $t('modal.modeOps.party')
                    },
                    {
                        id: 3,
                        value: 6,
                        text: $t('modal.modeOps.relax')
                    },
                ];
            } else if (type === 'rhythm-light-strip') {
                return [
                    {
                        id: 0,
                        value: 1,
                        text: $t('modal.modeOps.colorful')
                    },
                    {
                        id: 1,
                        value: 2,
                        text: $t('modal.modeOps.colorfulgra')
                    },
                    {
                        id: 2,
                        value: 3,
                        text: $t('modal.modeOps.colorfulbre')
                    },
                    {
                        id: 3,
                        value: 11,
                        text: $t('modal.modeOps.rgbstr')
                    },
                    {
                        id: 4,
                        value: 8,
                        text: $t('modal.modeOps.rgbgra')
                    },
                    {
                        id: 5,
                        value: 9,
                        text: $t('modal.modeOps.rgbpul')
                    },
                    {
                        id: 6,
                        value: 10,
                        text: $t('modal.modeOps.rgbbre')
                    },
                    {
                        id: 7,
                        value: 5,
                        text: $t('modal.modeOps.diypul')
                    },
                    {
                        id: 8,
                        value: 6,
                        text: $t('modal.modeOps.diybre')
                    },
                    {
                        id: 9,
                        value: 4,
                        text: $t('modal.modeOps.diygra')
                    },
                    {
                        id: 10,
                        value: 7,
                        text: $t('modal.modeOps.diystr')
                    },
                ];
            } else if (type === 'five-color-light') {
                return [
                    {
                        id: 0,
                        value: 'bright',
                        text: $t('modal.modeOps.bright')
                    },
                    {
                        id: 1,
                        value: 'goodNight',
                        text: $t('modal.modeOps.sleep')
                    },
                    {
                        id: 2,
                        value: 'read',
                        text: $t('modal.modeOps.reading')
                    },
                    {
                        id: 3,
                        value: 'party',
                        text: $t('modal.modeOps.party')
                    },
                    {
                        id: 4,
                        value: 'nightLight',
                        text: $t('modal.modeOps.night')
                    },
                    {
                        id: 5,
                        value: 'leisure',
                        text: $t('modal.modeOps.relax')
                    },
                    {
                        id: 6,
                        value: 'soft',
                        text: $t('modal.modeOps.soft')
                    },
                    {
                        id: 7,
                        value: 'colorful',
                        text: $t('modal.modeOps.vivid')
                    },
                ];
            } else if (type === 'two-color-light') {
                return [
                    {
                        id: 0,
                        value: 'bright',
                        text: $t('modal.modeOps.bright')
                    },
                    {
                        id: 1,
                        value: 'read',
                        text: $t('modal.modeOps.read')
                    },
                    {
                        id: 2,
                        value: 'computer',
                        text: $t('modal.modeOps.computer')
                    },
                    {
                        id: 3,
                        value: 'nightLight',
                        text: $t('modal.modeOps.nightlight')
                    }
                ];
            }
            return [];
        },
        ...mapState(['modalParams'])
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
                    params: twoColorLightMap[this.value]
                });
            } else if (this.type === 'rhythm-light-strip') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: this.value,
                        switch: 'on'
                    }
                });
            } else if (this.type === 'five-color-bulb-light') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: fiveColorBulbLightMap[this.value]
                });
            } else if (this.type === 'five-color-light') {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: fiveColorLightMap[this.value]
                });
            }
        },
        initPowerOnStateValue() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
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
            }
        }
    },

    created() {
        this.initValue();
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
</style>
