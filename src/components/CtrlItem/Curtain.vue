<template>
    <div class="curtain">
        <div class="icon-item">
            <control-circle type="curtain" />
            <control-circle type="curtain" />
            <control-circle type="curtain" />
        </div>
        <div class="status">
            <div class="topText">
                50%
            </div>
            <div class="curtain-status">
                All On
            </div>
        </div>
        <div class="slide">
            <slide-control type="curtain" />
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
    }
})
</script>
<style lang="stylus" scoped>
.curtain
    display flex
    flex-direction column
    justify-content center
    .icon-item
        display flex
        justify-content space-between
        align-items center
    .status
        display flex
        flex-direction column
        justify-content center
        .topText
            font-size 28px
            color: #8C8C8C;
        .curtain-status
            font-size 63px
            color: #212121;
</style>