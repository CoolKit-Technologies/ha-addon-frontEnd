<template>
    <div class="other-zigbee-item">
        <template v-if="$props.uiid === 1000">
            <content-item type="zigbeeButtons" :params="$props.cardData.params" />
        </template>
        <template v-if="$props.uiid === 2026">
            <content-item type="zigbeeMobileSensor" :params="$props.cardData.params"/>
        </template>
        <template v-if="$props.uiid === 3026">
            <content-item type="zigbeeDoorSensor" :params="$props.cardData.params"/>
        </template>
        <template v-if="$props.uiid === 4026">
            <content-item type="zigbeeWaterSensor" :params="$props.cardData.params"/>
        </template>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import ContentItem from '@/components/CtrlItem/ContentItem.vue';
export default defineComponent({
    name:'OtherZigbeeItem',
    props:{
        cardData:{
            required:true
        },
        //  1000
        //  2026
        //  3026
        //  4026
        uiid:{
            required:true
        }
    },
    components:{
        ContentItem
    },
    methods:{

    }
})
</script>
<style lang="stylus" scoped>

</style>
