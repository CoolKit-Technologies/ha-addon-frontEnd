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
        </div>
        <div class="text">
            <span class="title">{{ title }}</span>
        </div>
        <div class="action" :style="actionStyle" @click="handleClick">
            <a-slider />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CtrlSlider',

    props: {
        // 'brightness'
        // 'color-temp'
        // 'curtain'
        type: {
            required: true
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
            const { type, $t } = this as any;
            if (type === 'brightness') {
                return $t('card.brightness');
            } else if (type === 'color-temp') {
                return $t('card.colortemp');
            } else {
                return '';
            }
        }
    },

    methods: {
        handleClick(e: any) {
            e.stopPropagation();
        }
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
