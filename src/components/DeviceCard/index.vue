<template>
    <div :class="{ 'device-card': true, 'disabled': !deviceOnline }" @click="openModalBox">
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
import store from '@/store';
import { message } from 'ant-design-vue';

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

    computed: {
        deviceOnline() {
            const { uiid, online } = this.cardData as any;
            if (uiid === 102) {
                // WiFi 门磁判断在线或不在线的逻辑不同于其它设备
                const { params } = this.cardData as any;
                const now = Date.now();
                const timeout = 7500000;
                let { actionTime, lastUpdateTime } = params;
                actionTime = new Date(actionTime).valueOf();
                lastUpdateTime = new Date(lastUpdateTime).valueOf();
                return (now - actionTime < timeout) || (now - lastUpdateTime < timeout);
            } else {
                return online;
            }
        }
    },

    methods: {
        openModalBox() {
            const { uiid, apikey = '' } = this.cardData as any;
			const userApikey = store.state.userApikey;
			if(userApikey !== apikey){
				message.warn(this.$t('card.cantOptShareDevice'));
				return;
			}
            if (isSupportedDevice(uiid) && this.deviceOnline) {
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
