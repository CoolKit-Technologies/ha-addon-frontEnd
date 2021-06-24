<template>
    <div class="ctrl-slider">
        <div class="icon">
            <img
                v-if="type === 'brightness'"
                src="@/assets/light-brightness.png"
                alt="Light brightness"
            />
            <img
                v-else-if="type === 'color-temp'"
                src="@/assets/color-temp.png"
                alt="Color temperature"
            />
            <img
                v-else-if="type === 'curtain'"
                src="@/assets/curtain.png"
                alt="Curtain"
            />
        </div>
        <div class="text">
            <span class="title">{{ title }}</span>
        </div>
        <div class="action" :style="actionStyle" @click="handleClick">
            <a-slider
                v-model:value="progressValue"
                :disabled="!cardData.online"
                :min="min"
                :max="max"
                @afterChange="handleChange"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';

import { setCloudDevice } from '@/api/device';

export default defineComponent({
    name: 'CtrlSlider',

    props: {
        // 'brightness'
        // 'color-temp'
        // 'curtain'
        type: {
            required: true
        },
        cardData: {
            required: true
        }
    },
    data(){
        return {
            progressValue:0
        }
    },

    computed: {
        actionStyle() {
            const { type } = this as any;
            return {
                background: type === 'color-temp' ? 'linear-gradient(to right, #AAD3FF 0%, #FBFDFF 50%, #FFA205 100%)' : 'auto'
            };
        },
        title() {
            const { type, $t, } = this as any;
            if (type === 'brightness') {
                return $t('card.brightness');
            } else if (type === 'color-temp') {
                return $t('card.colortemp');
            } else if (type === 'curtain') {
                return 'manual';
            } else {
                return '';
            }
        },
        min() {
            const { uiid } = this.$props.cardData as any;
            if (this.type === 'brightness') {
                if(uiid === 22){
                    return 25
                }else{
                    return 1;
                }
            } else {
                return 0;
            }
        },
        max() {
            const { uiid } = this.$props.cardData as any;
            if (this.type === 'color-temp' || uiid === 22) {
                return 255;
            } else {
                return 100;
            }
        },
        value() {
            const { uiid, params} = this.cardData as any;

            if (this.type === 'brightness') {
                if (uiid === 103) {
                    return params[params.ltype].br;
                }
            } else if (this.type === 'color-temp') {
                if (uiid === 103) {
                    return 255 - params[params.ltype].ct;
                }
            } else if (this.type === 'curtain') {
                return params.setclose;
            }
        }
    },
    methods: {
        handleClick(e: any) {
            e.stopPropagation();
        },
        setDefaultValue(){
            const { uiid, params} = this.cardData as any;

            if (this.type === 'brightness') {
                if (uiid === 103 || uiid === 104) {
                    this.progressValue = params[params.ltype].br;
                }else if(uiid === 22){
                    this.progressValue = Math.max(parseInt(params.channel0),parseInt(params.channel1))
                }
            } else if (this.type === 'color-temp') {
                if (uiid === 103) {
                    this.progressValue = 255 - params[params.ltype].ct;
                }
            } else if (this.type === 'curtain') {
                this.progressValue = params.setclose;
            }
        },
        handleChange(v: number) {
            if (this.type === 'brightness') {
                this.setBrightness(v);
            } else if (this.type === 'color-temp') {
                this.setColorTemp(v);
            } else if (this.type === 'curtain') {
                this.setCurtain(v);
            }
        },
        async setBrightness(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;

            if (uiid === 103 || uiid === 104) {
                await setCloudDevice({
                    apikey,
                    id: deviceId,
                    params: {
                        ltype: 'white',
                        white: {
                            br: v,
                            ct: params.white.ct
                        }
                    }
                });
            }else if(uiid === 22){
                let obj = {
                    apikey,
                    id: deviceId,
                    params: {}
                }
                console.log(`ML ~ file: CtrlSlider.vue ~ line 148 ~ setBrightness ~ params`, params);
                switch(params.type){
                    case 'warm':
                        _.assign(obj.params,{
                            channel0: '25',
                            channel1: `${v}`
                        })
                        break;
                    case 'middle':
                        _.assign(obj.params,{
                            channel0: `${v}`,
                            channel1: `${v}`
                        })
                        break;
                    case 'cold':
                        _.assign(obj.params,{
                            channel0: `${v}`,
                            channel1: '25'
                        })
                        break;
                }
                console.log(`ML ~ file: CtrlSlider.vue ~ line 161 ~ setBrightness ~ obj`, obj);
                await setCloudDevice(obj);
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
                            ct: 255 - v
                        }
                    }
                });
            }
        },
        async setCurtain(v: number) {
            const { uiid, params, deviceId, apikey } = this.cardData as any;
            console.log('set curtain',v);
            
            await setCloudDevice({
                id: deviceId,
                apikey:apikey,
                params: {
                    setclose:v
                },
            });
        }
    },

    mounted() {
        this.setBrightness = _.throttle(this.setBrightness, 500, { 'leading': false, 'trailing': true }) as any;
        this.setColorTemp = _.throttle(this.setColorTemp, 500, { 'leading': false, 'trailing': true }) as any;
        this.setCurtain = _.throttle(this.setCurtain, 500, { 'leading': false, 'trailing': true }) as any;
        this.setDefaultValue()
    }
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

    .text
        margin 0 14px
        min-width 80px

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
