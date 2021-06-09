<template>
    <div :class="{ 'device-card': true, 'disabled': !cardData.online }" @click="openModalBox">
        <card-header :cardData="cardData" />
        <card-content :cardData="cardData" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

import { isSupportedDevice } from '@/utils/etc';
import CardHeader from './CardHeader.vue';
import CardContent from './CardContent.vue';

export default defineComponent({
    name: 'DeviceCard',

    components: {
        CardHeader,
        CardContent
    },

    props: {
        cardData: {
            required: true
        }
    },

    methods: {
        openModalBox() {
            const { uiid, online } = this.cardData as any;
            if (isSupportedDevice(uiid) && online) {
                this.openModal({
                    type: 'device',
                    params: this.cardData
                });
            }
        },
        ...mapActions(['openModal'])
    }
});
</script>

<style lang="stylus" scoped>
$color-white = #ffffff
$color-grey = #e3e3e3
$color-grey-dark = #eaeaea
$color-grey-light = #f5f5f5

.device-card
    background-color $color-white
    padding 14px
    border: 1px solid $color-grey
    border-radius: 4px
    transition all 0.3s
    // TODO: remove margin
    margin-bottom 20px
    &:hover
        box-shadow 0 2px 4px 2px $color-grey-dark
        cursor pointer
    &.disabled
        background-color $color-grey-light
        box-shadow none
</style>
