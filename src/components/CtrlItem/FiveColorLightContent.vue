<template>
    <div class="container">
        <div class="content">
            <div class="color" v-if="mode === 'color'">
                <color-picker class="mg-14" :cardData="cardData" />
                <ctrl-slider class="mg-14" type="brightness" v-if="isFiveLt" :cardData="cardData"/>
                <ctrl-slider class="mg-14" type="saturation" v-if="isZigbeeColorLT" :cardData="cardData" />
            </div>
            <div class="white" v-else-if="mode === 'white'">
                <five-bulb-light class="mg-14" v-if="isFiveBulbLt" :cardData="cardData"/>
                <ctrl-slider class="mg-14" type="color-temp" v-if="isFiveLt" :cardData="cardData"/>
                <ctrl-slider class="mg-14" type="brightness" :cardData="cardData" />
            </div>
        </div>
        <div class="tab mg-14">
            <div class="tab-content" @click="handleClick">
                <div class="wrapper on" v-if="mode === 'white'">
                    <img
                        src="@/assets/white-light-on.png"
                        alt="white mode"
                    />
                </div>
                <div class="wrapper" v-if="mode === 'white'" @click="changeMode('color')">
                    <img
                        src="@/assets/colorful-light-off.png"
                        alt="white mode"
                    />
                </div>

                <div class="wrapper" v-if="mode === 'color'" @click="changeMode('white')">
                    <img
                        src="@/assets/white-light-off.png"
                        alt="white mode"
                    />
                </div>
                <div class="wrapper on" v-if="mode === 'color'">
                    <img
                        src="@/assets/colorful-light-on.png"
                        alt="white mode"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ColorPicker from '@/components/CtrlItem/ColorPicker.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';
import FiveBulbLight from '@/components/CtrlItem/FiveBulbLight.vue';
import { setFiveLtMode } from '@/api/device'
export default defineComponent({
    name: 'FiveColorLightContent',

    components: {
        ColorPicker,
        CtrlSlider,
        FiveBulbLight,
    },

    props: {
        // uiid: 22
        // uiid: 104
        cardData:{
            required:true
        }
    },

    data() {
        return {
            // 'white'
            // 'color'
            mode: 'color'
        };
    },

    watch: {
        cardData() {
            this.setMode();
        }
    },

    computed:{
        // 五色球泡灯(已停产)
        isFiveBulbLt(){
            const { uiid } = this.$props.cardData as any;
            return uiid === 22;
        },
        // 五色灯
        isFiveLt(){
            const { uiid } = this.$props.cardData as any;
            return uiid === 104 || uiid === 3258;
        },
		//	zigbee五色灯
		isZigbeeColorLT(){
            const { uiid } = this.$props.cardData as any;
            return uiid === 3258;
		}
    },
    methods: {
        async changeMode(mode: string) {
			if(mode === this.mode) return;
            this.mode = mode;
            await setFiveLtMode(this.$props.cardData,this.mode);
        },
        handleClick(e: any) {
            e.stopPropagation();
        },
        setMode() {
            const { uiid, params } = this.cardData as any;
            if ((uiid === 22 && params.zyx_mode === 1) || (uiid === 104 && params.ltype === 'white')) {
                this.mode = 'white';
            } else if(uiid === 3258){
				this.mode = params.colorMode === 'cct' ? 'white' : 'color'
			} else {
                this.mode = 'color';
            }
        }
    },
    created() {
        this.setMode();
    }
});
</script>

<style lang="stylus" scoped>
.container
    .tab
        display flex
        justify-content center
        .tab-content
            display flex
            .wrapper
                display flex
                justify-content center
                align-items center
                width 40px
                height 40px
                margin 0 10px
                img
                    width 24px
                    height 24px

.on
    background rgba(24, 144, 255, 0.1)
    border-radius 50%

.mg-14
    margin 14px 0
    &:last-child
        margin-bottom 0
</style>
