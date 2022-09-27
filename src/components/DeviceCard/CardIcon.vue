<template>
    <div class="card-icon">
        <!--
            type 1 - DIY
            type 2 - LAN
            type 4 - CLOUD
            type 8 - Zigbee
        -->
        <img
            v-if="online && cardData.uiid===28 && cardData.cardIndex !== -1"
            style="width:26px; height:24px;"
            src="@/assets/rf.png"
            :alt="alt"
        />
        <img
            v-else-if="online && cardData.type === 1"
            src="@/assets/diy-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!online && cardData.type === 1"
            src="@/assets/diy-offline.svg"
            :alt="alt"
        />

        <img
            v-else-if="online && cardData.type === 2"
            src="@/assets/lan-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!online && cardData.type === 2"
            src="@/assets/lan-offline.svg"
            :alt="alt"
        />

        <img
            v-else-if="online && cardData.type === 4"
            src="@/assets/cloud-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!online && cardData.type === 4"
            src="@/assets/cloud-offline.svg"
            :alt="alt"
        />

        <img
            v-else-if="online && cardData.type === 8"
            src="@/assets/zigbee-online.png"
            :alt="alt"
            style="width:26px; height:24px;"
        />
        <img
            v-else-if="!online && cardData.type === 8"
            src="@/assets/zigbee-offline.png"
            :alt="alt"
            style="width:26px; height:24px;"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { isDeviceOnline } from '@/utils/etc';
export default defineComponent({
    name: 'CardIcon',

    props: {
        cardData: {
            required: true
        }
    },

    data() {
        return {
            alt: 'device card icon'
        };
    },
	computed:{
		online(){
			return isDeviceOnline(this.cardData)
		}
	}
});
</script>

<style lang="stylus" scoped>
.card-icon
    display flex
    justify-content center
    align-items: center
    width 32px
    height 32px
</style>
