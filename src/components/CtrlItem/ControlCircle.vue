<template>
    <div class="control-circle" :style="circleColor">
        <div v-if="$props.type === 'bulb'">
            <img class="bulb" src="@/assets/bulb-blue.png" alt="bulb" v-if="$props.color === 'blue'">
            <img class="bulb" src="@/assets/bulb-yellow.png" alt="bulb" v-else-if="$props.color === 'yellow'">
            <img class="bulb" src="@/assets/bulb-red.png" alt="bulb" v-else-if="$props.color === 'red'">
            <img class="bulb" src="@/assets/bulb-gray.png" alt="bulb" v-else-if="$props.color === 'gray'">
        </div>
        <div v-if="$props.type === 'curtain'">

        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name:'ControlCircle',
    props:{
        type:{
            type:String,
            required:true,
        },
        color:{
            type:String,
            required:true
        },
    },
    data(){
        return{
            backgroundColor:{},
            border:{}
        }
    },
    computed:{
        circleColor(){
            switch(this.$props.color){
                case 'blue':
                    return {
                        background:'rgba(24, 144, 255, 0.1)',
                        border:'4px solid #1890FF'
                    }
                case 'yellow':
                    return {
                        background:'rgba(252, 220, 92, 0.1)',
                        border:'4px solid #FCDC5C'
                    }
                case 'red':
                    return {
                        background:'rgba(230, 1, 1, 0.1)',
                        border:'4px solid #E60101'
                    }
                default:
                    return {
                        border:'4px solid #BFBFBF'
                    }
            }
        }
    },
    mounted(){
        // this.circleColor()
    },
    methods:{
    }
})
</script>
<style lang="stylus">
.control-circle
    width: 100px;
    height: 100px;
    border-radius: 50%;
    display flex
    justify-content center
    align-items center
    .bulb
        width 27px
        height 39px
</style>
