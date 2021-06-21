<template>
    <div class="content-item">
        <template v-if="$props.type === 'doorSensor'">
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
            <div class="action">
                <span>{{ switchAttr }}</span>
            </div>
        </template>
        <template v-else-if="$props.type === 'zigbeeDoorSensor'">
            <div class="icon">
                <img
                    alt="door-sensor icon"
                    src="@/assets/zigbee-door-sensor.png"
                    class="door"
                />
            </div>
            <div class="text">
                <span>Door and window sensor</span>
            </div>
            <div class="action">
                <span>{{ switchAttr }}</span>
            </div>
        </template>
        <template v-else-if="$props.type === 'zigbeeMobileSensor'">
            <div class="icon">
                <img
                    alt="door-sensor icon"
                    src="@/assets/zigbee-mobile-sensor.png"
                    class="door"
                />
            </div>
            <div class="text">
                <span>Mobile sensor</span>
            </div>
            <div class="action">
                <span>{{ switchAttr }}</span>
            </div>
        </template>
        <template v-else-if="$props.type === 'zigbeeButtons'">
            <div class="icon">
                <img
                    alt="door-sensor icon"
                    src="@/assets/zigbee-buttons.png"
                    class="door"
                />
            </div>
            <div class="text">
                <span>Unlimited buttons(1000)</span>
            </div>
            <div class="action">
                <span>{{ switchAttr }}</span>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ContentItem',

    props: {
        switch: {
            required: true
        },
        type:{
            required:true,
            type:String
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
.content-item
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

    .action
        margin-right 6px
</style>
