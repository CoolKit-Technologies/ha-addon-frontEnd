<template>
    <div class="five-bulb-light">
        <div class="mode1" v-if="mode === 'mode1'">
            <div class="bulbs">
                <control-circle type="bulb" :color="color[0]" />
                <control-circle type="bulb" :color="color[1]" />
                <control-circle type="bulb" :color="color[2]" />
            </div>
            <div class="control">
                <slide-control type="bulb" value="20"/>
            </div>
        </div>
        <div class="mode2" v-if="mode === 'mode2'">
            mode2
        </div>
        <div class="icon">
            <img src="@/assets/colorful-light-on.png" alt="" class="control left" v-if="mode === 'mode1'" >
            <img src="@/assets/colorful-light-off.png" alt="" class="control left" v-if="mode === 'mode2'" @click="()=>changeMode('mode1')">
            <img src="@/assets/white-light-on.png" alt="" class="control right" v-if="mode === 'mode2'" >
            <img src="@/assets/white-light-off.png" alt="" class="control right" v-if="mode === 'mode1'" @click="()=>changeMode('mode2')">
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ControlCircle from '@/components/CtrlItem/ControlCircle.vue'
import SlideControl from '@/components/CtrlItem/SlideControl.vue'
export default defineComponent({
    name:'FiveBulbLight',
    components:{
        ControlCircle,
        SlideControl
    },
    props:{
        cardData: {
            required: true
        }
    },
    data(){
        return {
            mode:'mode1'
        }
    },
    computed:{
        color(){
            const { params } = this.$props.cardData as any;
            if(!params) return[]
            if(params.channel0 === params.channel1 ){
                return ['gray','yellow','gray']
            }
            if(params.channel0 < params.channel1 ){
                return ['gray','gary','blue']
            }
            if(params.channel0 > params.channel1 ){
                return ['red','gary','gray']
            }
        }
    },
    mounted(){
        console.log('-------------',this.$props.cardData);
    },
    methods:{
        changeMode(mode:string){
            this.mode = mode;
        }
    }
})
</script>
<style lang="stylus" scoped>
.five-bulb-light
    display flex
    flex-direction column
    justify-content space-between
    margin 20px 0
    .bulbs
        display flex
        justify-content space-between
        align-items center
    .icon
        display flex
        justify-content center
        align-items center
        .control
            width 20px
            height 20px
        .left
            margin-right 20px
</style>
