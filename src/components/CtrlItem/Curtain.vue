<template>
    <div class="curtain">
        <div class="icon-item">
            <control-circle type="curtain" curtainType="alloff" @click="click"/>
            <control-circle type="curtain" curtainType="allon" />
            <control-circle type="curtain" curtainType="pause"/>
            <control-circle type="curtain" curtainType="off"/>
            <control-circle type="curtain" curtainType="on" />
        </div>
        <div class="status">
            <div class="topText">
                Status
            </div>
            <div class="curtain-status">
                All On
            </div>
        </div>
        <div class="slide">
            <slide-control type="curtain" :value="50"/>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

import ControlCircle from '@/components/CtrlItem/ControlCircle.vue';
import SlideControl from '@/components/CtrlItem/SlideControl.vue';

export default defineComponent({
    name:'Curtain',
    components:{
        SlideControl,
        ControlCircle
    },
    methods:{
        click(){
            console.log('=-=-=-=-=-=-=');
        }
    }
})
</script>
<style lang="stylus" scoped>
.curtain
    display flex
    flex-direction column
    justify-content center
    align-items center
    .icon-item
        width 100%
        display flex
        justify-content space-between
        align-items center
    .status
        display flex
        flex-direction column
        justify-content center
        .topText
            text-align center
            font-size 18px
            color: #8C8C8C;
        .curtain-status
            font-size 32px
            color: #212121;
    .slide
        width 100%
</style>