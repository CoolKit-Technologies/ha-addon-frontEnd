<template>
    <div class="five-bulb-light">
        <control-circle type="bulb" :color="color[0]" @click="(e)=>changeColorTemp(e,'cold')" />
        <control-circle type="bulb" :color="color[1]" @click="(e)=>changeColorTemp(e,'middle')"/>
        <control-circle type="bulb" :color="color[2]" @click="(e)=>changeColorTemp(e,'warm')"/>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ControlCircle from '@/components/CtrlItem/ControlCircle.vue'
import SlideControl from '@/components/CtrlItem/SlideControl.vue'
import { setFiveColorBulbTemp } from '@/api/device'
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
                return ['gray','gray','red']
            }
            if(params.channel0 > params.channel1 ){
                return ['blue','gray','gray']
            }
        }
    },
    mounted(){},
    methods:{
        async changeColorTemp(e:any,type:string){
            e.stopPropagation();
            console.log(`ML ~ file: FiveBulbLight.vue ~ line 46 ~ changeColorTemp ~ temp`, type);
            await setFiveColorBulbTemp(this.$props.cardData,type)
        }
    }
})
</script>
<style lang="stylus" scoped>
.five-bulb-light
    display flex
    justify-content space-between
    align-items center
    margin 20px 0
</style>
