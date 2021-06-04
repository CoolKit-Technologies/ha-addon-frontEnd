<template>
    <div class="card-icon">
        <!--
            type 1 - DIY
            type 2 - LAN
            type 4 - CLOUD
        -->
        <img
            v-if="cardData.online && cardData.type === 1"
            src="@/assets/diy-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!cardData.online && cardData.type === 1"
            src="@/assets/diy-offline.svg"
            :alt="alt"
        />
        <img
            v-else-if="cardData.online && cardData.type === 2"
            src="@/assets/lan-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!cardData.online && cardData.type === 2"
            src="@/assets/lan-offline.svg"
            :alt="alt"
        />
        <img
            v-else-if="cardData.online && cardData.type === 4"
            src="@/assets/cloud-online.svg"
            :alt="alt"
        />
        <img
            v-else-if="!cardData.online && cardData.type === 4"
            src="@/assets/cloud-offline.svg"
            :alt="alt"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
