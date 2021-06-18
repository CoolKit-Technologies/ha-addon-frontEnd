<template>
    <div class="door-sensor">
        <div class="icon">
            <img
                alt="door-sensor icon"
                src="@/assets/door-sensor.png"
                class="door"
            />
        </div>
        <div class="text">
            <span>{{ $t('card.doorsensor') }}</span>
        </div>
        <div class="switch">
            <span>{{ switchAttr }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'DoorSensor',

    props: {
        switch: {
            required: true
        }
    },
    computed:{
        switchAttr():string{
            return this.$props.switch === 'on' ? this.$t('card.doorsensoropen') : this.$t('card.doorsensorclose');
        }
    }
});
</script>

<style lang="stylus" scoped>
.door-sensor
    display flex
    align-items center
    margin-top 20px
    .icon
        display flex
        justify-content center
        align-items: center
        width 32px
        height 32px
        .door
            width 20px
            height 20px

    .text
        flex 1
        margin-left 14px

    .switch
        margin-right 6px
</style>
