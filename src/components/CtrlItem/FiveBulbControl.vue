<template>
    <div class="five-bulb-control">
        <div class="icon">
            <img class="control" src="@/assets/lignt-bulb-control.png" alt="control">
        </div>
        <div class="text">
            Brightness
        </div>
        <div class="slide">
            <a-slider v-model:value="value" @afterChange='afterChange' />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'FiveBulbControl',
    data(){
        return {
            value:0
        }
    },
    computed:{
    },
    methods:{
        afterChange(value:any){
            console.log(`ML ~ file: FiveBulbControl.vue ~ line 26 ~ afterChange ~ value`, value);
            this.value = value
        }
    }
})
</script>
<style lang="stylus" scoped>
.five-bulb-control
    display flex
    justify-content center
    align-items center
    .icon
        margin-right 20px
        .control
            width 20px
            height 20px
    .text
        margin-right 20px
    .slide
        width 200px
</style>
