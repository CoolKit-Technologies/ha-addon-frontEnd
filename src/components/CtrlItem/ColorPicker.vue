<template>
    <div class="color-picker">
        <div class="icon-wrapper">
            <img
                class="icon"
                src="@/assets/color-palette.png"
                alt="color palette"
            />
        </div>
        <p class="title">{{ $t('card.color') }}</p>
        <input
            ref="color-input"
            class="color-input-hide"
            type="color"
            :value="bgColor"
            :disabled="!cardData.online"
        />
        <div class="color-box" @click.stop="firePickColor">
            <div class="color" :style="{ backgroundColor: bgColor }"></div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import _ from 'lodash';
import { setPickerColor }from '@/api/device'
import convert from 'color-convert'
import { CardData } from '@/types';

type RGB = [number,number,number];

export default defineComponent({
    name: 'ColorPicker',

    data() {
        return {
            bgColor: ''
        };
    },
    props:{
        cardData:{
            type: Object as PropType<CardData>,
            required:true
        }
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
        this.bgColor = this.dealPropColor();
    },
    watch:{
        '$props.cardData':function (newV,oldV){
            this.bgColor = this.dealPropColor()
        }
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
            const obj = this.deal16Color(this.bgColor);
            console.log(`ML ~ file: ColorPicker.vue ~ line 71 ~ changeColor ~ obj`, obj);
            setPickerColor(this.$props.cardData,obj)
        },
        dealPropColor(){
            if(!this.$props.cardData) return '#000000';
            const { params, uiid } = this.$props.cardData as any;
            if(uiid === 22){
                const {channel2,channel3,channel4} = params;
                return this.dealRGBColor({
                    r:parseInt(channel2),g:parseInt(channel3),b:parseInt(channel4)
                })
            }else if(uiid === 104){
                const {r,g,b} = params.color;
                return this.dealRGBColor({
                    r,g,b
                })
            }else if([59, 137, 173].includes(uiid)){
                const { colorR, colorG, colorB } = params;
                return this.dealRGBColor({
                    r:colorR,g:colorG,b:colorB
                })
            }else if(uiid === 3258){
				const { hue = 1 } = params;
				return this.hsvToString(hue);
			}else{
                return '#000000'
            }
        },
        dealRGBColor(data:any){
            const { r, g, b } = data;
            return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
        },
        deal16Color(color:string){
            const { uiid } = this.$props.cardData as any;
			if(uiid === 3258){
				return this.hexToHsv(color)
			}
            const rgb = color.substring(1,7)
            const r = parseInt(rgb.substring(0,2),16);
            const g = parseInt(rgb.substring(2,4),16);
            const b = parseInt(rgb.substring(4,6),16);
            return {
                r,g,b
            }
        },
		hsvToString(h:number){
			let hsv = [h,100,100] as RGB;
			return `#${convert.hsv.hex(hsv)}`;
		},
		hexToHsv(hex:string){
			const [hue,s,v] = convert.hex.hsv(hex)
			return{
				hue,
			}
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
