<template>
    <div class="container">
        <div class="content">
            <div class="color" v-if="mode === 'color'">
                <color-picker />
                <ctrl-slider type="color-temp" />
            </div>
            <div class="white" v-else-if="mode === 'white'">
                <ctrl-slider type="brightness" />
                <ctrl-slider type="color-temp" />
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

export default defineComponent({
    name: 'FiveColorLightContent',

    components: {
        ColorPicker,
        CtrlSlider
    },

    props: {
        // uiid: 22
        // uiid: 104
        uiid: {
            required: true
        }
    },

    data() {
        return {
            // 'white'
            // 'color'
            mode: 'white'
        };
    },

    methods: {
        changeMode(mode: string) {
            this.mode = mode;
        },
        handleClick(e: any) {
            e.stopPropagation();
        }
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
