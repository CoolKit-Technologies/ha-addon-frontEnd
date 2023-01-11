<template>
    <div class="ctrl-slider">
        <div class="text-in-modal" v-if="type === 'darkest'">
            <span class="title">{{ title }}</span>
        </div>
        <div class="icon">
            <img v-if="type === 'brightness' || type === 'darkest'" src="@/assets/light-brightness.png" alt="Light brightness" />
            <img v-else-if="type === 'color-temp'" src="@/assets/color-temp.png" alt="Color temperature" />
            <img v-else-if="type === 'curtain'" src="@/assets/curtain.png" alt="Curtain" />
            <img v-else-if="type === 'saturation'" src="@/assets/color-saturation.png" alt="Saturation" />
        </div>
        <div class="text" v-if="type !== 'darkest'">
            <span class="title">{{ title }}</span>
        </div>
        <div class="action" :style="actionStyle" @click="handleClick">
            <a-slider v-model:value="progressValue" :disabled="!cardData.online" :min="min" :max="max" @afterChange="handleChange" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import _ from 'lodash';
import { setCloudDevice } from '@/api/device';
import { CardData } from '@/types';

/**
 * @description 灯带通过改变颜色来伪实现调节色温的功能
 * @description 数组从小到大 --> 色温冷到暖
 */
export const fakeTempList = [
    '214,225,255',
    '214,225,255',
    '217,225,255',
    '215,226,255',
    '218,226,255',
    '216,227,255',
    '219,226,255',
    '217,227,255',
    '220,227,255',
    '218,228,255',
    '221,228,255',
    '220,229,255',
    '223,229,255',
    '221,230,255',
    '224,230,255',
    '222,230,255',
    '225,231,255',
    '224,231,255',
    '227,232,255',
    '225,232,255',
    '228,233,255',
    '227,233,255',
    '229,233,255',
    '228,234,255',
    '231,234,255',
    '230,235,255',
    '233,236,255',
    '231,236,255',
    '234,237,255',
    '233,237,255',
    '236,238,255',
    '235,238,255',
    '238,239,255',
    '237,239,255',
    '239,240,255',
    '239,240,255',
    '241,241,255',
    '240,241,255',
    '243,243,255',
    '243,242,255',
    '245,244,255',
    '245,243,255',
    '247,245,255',
    '247,245,255',
    '250,247,255',
    '249,246,255',
    '252,248,255',
    '252,247,255',
    '254,250,255',
    '254,249,255',
    '255,249,253',
    '255,249,253',
    '255,249,251',
    '255,248,251',
    '255,248,248',
    '255,246,248',
    '255,247,245',
    '255,245,245',
    '255,246,243',
    '255,244,242',
    '255,245,240',
    '255,243,239',
    '255,244,237',
    '255,242,236',
    '255,243,234',
    '255,240,233',
    '255,241,231',
    '255,239,230',
    '255,240,228',
    '255,238,227',
    '255,239,225',
    '255,236,224',
    '255,238,222',
    '255,235,220',
    '255,237,218',
    '255,233,217',
    '255,235,215',
    '255,232,213',
    '255,234,211',
    '255,230,210',
    '255,232,208',
    '255,228,206',
    '255,231,204',
    '255,227,202',
    '255,229,200',
    '255,225,198',
    '255,228,196',
    '255,223,194',
    '255,226,192',
    '255,221,190',
    '255,225,188',
    '255,219,186',
    '255,223,184',
    '255,217,182',
    '255,221,180',
    '255,215,177',
    '255,219,175',
    '255,213,173',
    '255,217,171',
    '255,211,168',
    '255,215,166',
    '255,209,163',
    '255,213,161',
    '255,206,159',
    '255,211,156',
    '255,204,153',
    '255,208,151',
    '255,201,148',
    '255,206,146',
    '255,199,143',
    '255,203,141',
    '255,196,137',
    '255,201,135',
    '255,193,132',
    '255,198,130',
    '255,190,126',
    '255,195,124',
    '255,187,120',
    '255,192,118',
    '255,184,114',
    '255,189,111',
    '255,180,107',
    '255,185,105',
    '255,177,101',
    '255,182,98',
    '255,173,94',
    '255,178,91',
    '255,169,87',
    '255,174,84',
    '255,165,79',
    '255,170,77',
    '255,161,72',
    '255,166,69',
    '255,157,63',
    '255,162,60',
    '255,152,54',
    '255,157,51',
    '255,147,44',
    '255,152,41',
    '255,142,33',
    '255,146,29',
    '255,137,18',
    '255,141,11',
];
const FIVE_COLOR_BULB_LT_BRIGHTNWSS = [
    '25',
    '38',
    '40',
    '61',
    '85',
    '103',
    '117',
    '130',
    '141',
    '150',
    '159',
    '167',
    '174',
    '180',
    '186',
    '192',
    '197',
    '202',
    '207',
    '211',
    '255',
];
export default defineComponent({
    name: 'CtrlSlider',

    props: {
        // 'brightness'
        // 'color-temp'
        // 'curtain'
		// 'saturation'
        type: {
            required: true,
        },
        cardData: {
            type: Object as PropType<CardData>,
            required: true,
        },
    },
    data() {
        return {
            progressValue: 0,
        };
    },

    computed: {
        actionStyle() {
            const { type } = this as any;
            return {
                background: type === 'color-temp' ? 'linear-gradient(to right, #AAD3FF 0%, #FBFDFF 50%, #FFA205 100%)' : 'auto',
            };
        },
        title() {
            const { type, $t } = this as any;
            if (type === 'brightness') {
                return $t('card.brightness');
            } else if (type === 'color-temp') {
                return $t('card.colortemp');
            } else if (type === 'curtain') {
                return $t('card.manual');
            } else if (type === 'darkest') {
                return $t('card.darkest');
            } else if (type === 'saturation') {
                return $t('card.saturation');
            }  else {
                return '';
            }
        },
        min() {
            const { uiid } = this.$props.cardData as any;
            if (this.type === 'brightness') {
                return 1;
            } else {
                return 0;
            }
        },
        max() {
            const { uiid } = this.$props.cardData as any;
            if (this.type === 'color-temp') {
                if (uiid === 22 || uiid === 103 || uiid === 104) {
                    return 255;
                } else if (uiid === 59) {
                    return 142;
                }
            } else if (this.type === 'darkest') {
                return 255;
            } else if(this.type === 'brightness'){
				if (uiid === 22) {
                    return 21;
                }
				return 100
			} else {
                return 100;
            }
        },
    },
    watch: {
        '$props.cardData': function(newV, oldV) {
            const { uiid, params } = newV;
            if (this.type === 'brightness') {
                if (uiid === 103 || uiid === 104) {
                    this.progressValue = params[params.ltype].br;
                } else if (uiid === 22) {
					const five_color_bulb_brightness = FIVE_COLOR_BULB_LT_BRIGHTNWSS.findIndex((item, index) => {
                        if (item === `${Math.max(parseInt(params.channel0), parseInt(params.channel1))}`) {
                            return index;
                        }
                    });
					this.progressValue = typeof five_color_bulb_brightness === 'number' ? five_color_bulb_brightness + 1 : 0;
                    console.log("🚀 ~ file: CtrlSlider.vue ~ line 278 ~ this.progressValue", this.progressValue)
                    // this.progressValue = Math.max(parseInt(params.channel0), parseInt(params.channel1));
                } else if (uiid === 59) {
                    this.progressValue = params.bright;
                }else if (uiid === 44) {
                    this.progressValue = params.brightness;
                } else if (uiid === 1258){
					this.progressValue = params.brightness;
				} else if (uiid === 3258){
					const { colorMode } = params;
					this.progressValue = params[`${colorMode}Brightness`] ?? 1
				} else if ([137, 173].includes(uiid)) {
                    this.progressValue = params.bright;
                }
            } else if (this.type === 'color-temp') {
                if (uiid === 103 || uiid === 104) {
                    this.progressValue = 255 - params[params.ltype].ct;
                } else if (uiid === 59) {
                    const { colorR, colorG, colorB } = params;
                    const rgb = `${colorR},${colorG},${colorB}`;
                    const value = fakeTempList.indexOf(rgb);
                    this.progressValue = value ? value : 0;
                } else if(uiid === 1258){
					const { colorTemp = 1 } = params;
					this.progressValue = 100 - colorTemp
				} else if(uiid === 3258){
					const { colorTemp = 1 } = params;
					this.progressValue =  100 - colorTemp;
				} else if ([137, 173].includes(uiid)) {
                    const { colorTemp = 1 } = params;
                    this.progressValue = colorTemp;
                }
            } else if (this.type === 'curtain') {
                this.progressValue = params.setclose ?? 50;
            } else if (this.type === 'Darkest') {
                this.progressValue = params.brightMin;
            } else if (this.type === 'saturation') {
				const { saturation = 1 } = params;
                this.progressValue = saturation;
            }
        },
    },
    methods: {
        handleClick(e: any) {
            e.stopPropagation();
        },
        setDefaultValue() {
            const { uiid, params } = this.cardData as any;
            if (this.type === 'brightness') {
                if (uiid === 103 || uiid === 104) {
                    this.progressValue = params[params.ltype].br;
                } else if (uiid === 22) {
					const five_color_bulb_brightness = FIVE_COLOR_BULB_LT_BRIGHTNWSS.findIndex((item, index) => {
                        if (item === `${Math.max(parseInt(params.channel0), parseInt(params.channel1))}`) {
                            return index;
                        }
                    });
					this.progressValue = typeof five_color_bulb_brightness === 'number' ? five_color_bulb_brightness + 1 : 0;
                    console.log("🚀 ~ file: CtrlSlider.vue ~ line 317 ~ setDefaultValue ~ this.progressValue", this.progressValue)
                    // this.progressValue = Math.max(parseInt(params.channel0), parseInt(params.channel1));
                } else if (uiid === 59) {
                    this.progressValue = params.bright;
                } else if (uiid === 44 || uiid === 1258) {
                    this.progressValue = params.brightness;
                } else if(uiid === 3258){
					const { colorMode } = params;
					this.progressValue = params[`${colorMode}Brightness`] ?? 1
				} else if ([137, 173].includes(uiid)) {
                    const { bright } = params;
                    this.progressValue = bright;
                }
            } else if (this.type === 'color-temp') {
                if (uiid === 103 || uiid === 104) {
                    this.progressValue = 255 - params[params.ltype].ct;
                } else if (uiid === 59) {
                    const { colorR, colorG, colorB } = params;
                    const rgb = `${colorR},${colorG},${colorB}`;
                    const value = fakeTempList.indexOf(rgb);
                    this.progressValue = value ? value : 0;
                } else if(uiid === 1258){
					const { colorTemp = 1 } = params;
					this.progressValue = 100 - colorTemp
				} else if(uiid === 3258){
					const { colorTemp = 1 } = params;
					this.progressValue = 100 - colorTemp
				} else if ([137, 173].includes(uiid)) {
                    const { colorTemp = 1 } = params;
                    this.progressValue = colorTemp;
                }
            } else if (this.type === 'curtain') {
                this.progressValue = params.setclose ?? 50;
            } else if (this.type === 'darkest') {
                this.progressValue = params.brightMin;
            } else if (this.type === 'saturation') {
				const { saturation = 1 } = params;
                this.progressValue = saturation;
            }
        },
        handleChange(v: number) {
            if (this.type === 'brightness') {
                this.setBrightness(v);
            } else if (this.type === 'color-temp') {
                this.setColorTemp(v);
            } else if (this.type === 'curtain') {
                this.setCurtain(v);
            } else if (this.type === 'darkest') {
                this.setDarkest(v);
            } else if (this.type === 'saturation') {
                this.setSaturation(v);
            }
        },
        async setBrightness(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;

            if (uiid === 103 || uiid === 104) {
				const {ltype} = params;
				let tempParams = {
					apikey,
                    id: deviceId,
					params:{
						ltype,
						[ltype]: params[ltype] ?? {}
					}
				}
				Object.assign(tempParams.params[ltype],{ br: v })
                await setCloudDevice(tempParams);
            } else if (uiid === 22) {
                let obj = {
                    apikey,
                    id: deviceId,
                    params: {},
                };
                // console.log(`ML ~ file: CtrlSlider.vue ~ line 148 ~ setBrightness ~ params`, params);
				const brightness = FIVE_COLOR_BULB_LT_BRIGHTNWSS[v - 1];
                switch (params.type) {
                    case 'warm':
                        _.assign(obj.params, {
                            channel0: '25',
                            channel1: `${brightness}`,
                        });
                        break;
                    case 'middle':
                        _.assign(obj.params, {
                            channel0: `${brightness}`,
                            channel1: `${brightness}`,
                        });
                        break;
                    case 'cold':
                        _.assign(obj.params, {
                            channel0: `${brightness}`,
                            channel1: '25',
                        });
                        break;
                }
                console.log(`ML ~ file: CtrlSlider.vue ~ line 161 ~ setBrightness ~ obj`, obj);
                await setCloudDevice(obj);
            } else if (uiid === 59) {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: 1,
                        bright: v,
                    },
                });
            } else if (uiid === 44) {
                // dimming
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: 0,
                        brightness: v,
                    },
                });
            } else if(uiid === 1258){
				await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
						switch: 'on',
                        brightness: v,
                    },
                });
			}else if(uiid === 3258){
				const colorMode = params['colorMode'];
				await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
						switch: 'on',
						colorMode,
                        [`${colorMode}Brightness`]: v,
                    },
                });
			} else if ([137, 173].includes(uiid)) {
                const { mode, colorR, colorG, colorB, colorTemp } = params
                const p: any = {
                    mode: [1, 2, 3].includes(mode) ? mode : 1,
                    bright: v
                }

                if (p.mode === 1) {
                    p.colorR = colorR
                    p.colorG = colorG
                    p.colorB = colorB
                }

                if (p.mode === 2) {
                    p.colorTemp = colorTemp
                }

                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: p
                })
            }
        },
        async setColorTemp(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;

            if (uiid === 103 || uiid === 104) {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        ltype: 'white',
                        white: {
                            br: params.white.br,
                            ct: 255 - v,
                        },
                    },
                });
            } else if (uiid === 59) {
                const rgb = fakeTempList[v].split(',');
                console.log(`ML ~ file: CtrlSlider.vue ~ line 387 ~ setColorTemp ~ rgb`, rgb);
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        mode: 1,
                        light_type: 2,
                        colorR: parseInt(rgb[0]),
                        colorG: parseInt(rgb[1]),
                        colorB: parseInt(rgb[2]),
                    },
                });
            } else if(uiid === 1258){
				await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
						switch: 'on',
                        colorTemp: 100 - v,
						colorMode: params['colorMode']
                    },
                });
			} else if(uiid === 3258){
				await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
						switch: 'on',
                        colorTemp: 100 - v
                    },
                });
			} else if ([137, 173].includes(uiid)) {
                const { mode, bright } = params
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: { mode, bright, colorTemp: v }
                })
            }
        },
        async setCurtain(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;
            console.log('set curtain', v);

            await setCloudDevice({
                id: deviceId,
                apikey: apikey,
                params: {
                    setclose: v,
                },
            });
        },
        async setDarkest(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;
            console.log('set curtain', v);

            await setCloudDevice({
                id: deviceId,
                apikey: apikey,
                params: {
                    switch: 'on',
                    brightMin: v,
                    brightMax: 255,
                    brightness: 1,
                    mode: 0,
                },
            });
        },
		async setSaturation(v:number){
            const { params, deviceId, apikey } = this.cardData as any;
			const { hue = 1 } = params;
			await setCloudDevice({
                id: deviceId,
                apikey: apikey,
                params: {
                    switch: 'on',
					hue,
					saturation: v
                },
            });
		}
    },

    mounted() {
        this.setBrightness = _.throttle(this.setBrightness, 500, { leading: false, trailing: true }) as any;
        this.setColorTemp = _.throttle(this.setColorTemp, 500, { leading: false, trailing: true }) as any;
        this.setCurtain = _.throttle(this.setCurtain, 500, { leading: false, trailing: true }) as any;
        this.setDefaultValue();
    },
});
</script>

<style lang="stylus" scoped>
.ctrl-slider
    display flex
    align-items center

    .icon
        display flex
        justify-content center
        align-items center
        width 32px
        height 32px
        & > img
            width 22px
            height 22px

    .icon-right
        width 22px
        height 22px

    .text
        margin 0 14px
        min-width 80px
    .text-in-modal
        margin 0 48px 0 0;
    .action
        flex 1
        height 26px
        display flex
        justify-content center
        align-items center
        padding 0 6px
        border-radius 4px
        & > div
            flex 1
</style>

<style>
.ant-slider-disabled >.ant-slider-rail{
	background-color: #E4E4E4 !important
}
</style>