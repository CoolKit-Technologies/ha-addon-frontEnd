<template>
    <div class="content-item">
        <div class="icon">
            <img
                alt="door-sensor icon"
                src="@/assets/door-sensor.png"
                class="door"
                v-if="$props.type === 'doorSensor'"
            />
            <img
                alt="zigbee-door-sensor icon"
                src="@/assets/zigbee-door-sensor.png"
                class="door"
                v-else-if="$props.type === 'zigbeeDoorSensor'"
            />
            <img
                alt="zigbee-mobile-sensor icon"
                src="@/assets/zigbee-mobile-sensor.png"
                class="door"
                v-else-if="$props.type === 'zigbeeMobileSensor'"
            />
            <img
                alt="zigbee-buttons icon"
                src="@/assets/zigbee-buttons.png"
                class="door"
                v-else-if="$props.type === 'zigbeeButtons'"
            />
        </div>
        <div class="text">
            <span>
                {{ title }}
            </span>
        </div>
        <div class="action">
            <span>{{ action }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'ContentItem',

    props: {
        params: {
            required: true
        },
        type:{
            required:true,
            type:String
        }
    },
    computed:{
        title(){
            const { $t, type } = this as any;
            switch(type){
                case 'doorSensor':
                    return $t('card.doorsensor');
                case 'zigbeeDoorSensor':
                    return  $t('card.zigbee.zigbeedoorsensor')
                case 'zigbeeMobileSensor':
                    return $t('card.zigbee.mobilesensor')
                case 'zigbeeButtons':
                    return $t('card.zigbee.unlimitedbutton')
            }
        },
        action(){
            const { $t, type, params } = this as any;
            switch(type){
                case 'doorSensor':
                    return params && params.switch === 'on' ? $t('card.doorsensoropen') : $t('card.doorsensorclose');
                case 'zigbeeDoorSensor':
                    return params && params.lock === 1 ? $t('card.zigbee.dooropen') : $t('card.zigbee.doorlock');
                case 'zigbeeMobileSensor':
                    return '12:58'
                case 'zigbeeButtons':
                    switch (params && params.key){
                        case 1:
                            return $t('card.zigbee.doubleclick');
                        case 2:
                            return $t('card.zigbee.longclick')
                        default:
                            return $t('card.zigbee.click');
                    }
                default:
                    return ''
            }
        },
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
