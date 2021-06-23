<template>
    <div class="container">
        <div class="content">
            <div class="color" v-if="mode === 'color'">
                <color-picker />
                <ctrl-slider type="brightness" v-if="isFiveLt"/>
            </div>
            <div class="white" v-else-if="mode === 'white'">
                <five-bulb-light v-if="isFiveBulbLt" :cardData="$props.cardData"/>
                <ctrl-slider type="color-temp" v-if="isFiveLt"/>
                <ctrl-slider type="brightness" />
            </div>
        </div>
        <div class="tab">
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
    mounted(){
        // console.log(this.$props.cardData);
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
            return uiid === 104
        }
    },
    methods: {
        changeMode(mode: string) {
            this.mode = mode;
        },
        handleClick(e: any) {
            e.stopPropagation();
        },
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
</style>
