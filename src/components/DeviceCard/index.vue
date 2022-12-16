<template>
    <div :class="{ 'device-card': true, 'disabled': !online }" @click="openModalBox">
        <card-header :cardData="cardData" />
        <card-content :cardData="cardData" />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { mapActions } from 'vuex';

import { isSupportedDevice } from '@/utils/etc';
import CardHeader from './CardHeader.vue';
import CardContent from './CardContent.vue';
import store from '@/store';
import { message } from 'ant-design-vue';
import { isDeviceOnline } from '@/utils/etc';
import type { CardData } from '@/types'

export default defineComponent({
    name: 'DeviceCard',

    components: {
        CardHeader,
        CardContent
    },

    props: {
        cardData: {
            type: Object as PropType<CardData>,
            required: true
        }
    },

    computed: {
		online(){
			return isDeviceOnline(this.cardData)
		}
    },

    methods: {
        openModalBox() {
			//	设备不在线
			if(!this.online) return;
			//	设备是否属于当前用户
            const { uiid, apikey = '' } = this.cardData as any;
            const userApikey = localStorage.getItem('userApikey');
			if(userApikey !== apikey){
				message.warn(this.$t('card.cantOptShareDevice'));
				return;
			}
            if (isSupportedDevice(uiid) && this.online) {
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
    &:hover
        box-shadow 0 2px 4px 2px $color-grey-dark
        cursor pointer
    &.disabled
        background-color $color-grey-light
        box-shadow none
</style>
