<template>
    <div class="color-picker">
        <div class="icon-wrapper">
            <img
                class="icon"
                src="@/assets/color-palette.png"
                alt="color palette"
            />
        </div>
        <p class="title">颜色</p>
        <input
            ref="color-input"
            class="color-input-hide"
            type="color"
        />
        <div class="color-box" @click.stop="firePickColor">
            <div class="color" :style="{ backgroundColor: bgColor }"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';

export default defineComponent({
    name: 'ColorPicker',

    data() {
        return {
            bgColor: ''
        };
    },

    mounted() {
        // Register event
        const colorInput = this.$refs['color-input'] as any;
        colorInput.addEventListener('click', this.stopClickPropagation);
        colorInput.addEventListener('input', this.handleInput);

        this.changeColor = _.throttle(this.changeColor, 2000, { 'leading': false, 'trailing': true });
    },

    beforeUnmount() {
        // Unregister event
        const colorInput = this.$refs['color-input'] as any;
        colorInput.removeEventListener('click', this.stopClickPropagation);
        colorInput.removeEventListener('input', this.handleInput);
    },

    created() {
        this.bgColor = '#ccccff';
    },

    methods: {
        firePickColor(e: any) {
            const colorInput = this.$refs['color-input'] as any;
            colorInput.click();
        },
        stopClickPropagation(e: any) {
            e.stopPropagation();
        },
        handleInput(e: any) {
            console.log('input event', e.target.value);
            this.bgColor = e.target.value;
            this.changeColor();
        },
        changeColor() {
            console.log('change change color');
        }
    }
});
</script>

<style lang="stylus" scoped>
.color-picker
    display flex
    align-items center

    .icon-wrapper
        width 32px
        height 32px
        display flex
        justify-content center
        align-items center
        .icon
            width 22px
            height 22px

    .color-input-hide
        visibility hidden

    .title
        margin 0
        flex 1
        margin 0 14px

    .color-box
        width 54px
        height 34px
        border 1px solid #c8c8c8
        border-radius 2px
        padding 5px
        cursor pointer
        transition all 0.3s
        &:hover
            box-shadow 0 0 4px 2px #f2f2f2
        .color
            cursor pointer
            width 100%
            height 100%
            border-radius 2px
            background-color tomato
</style>
