<template>
    <div class="card-header">
        <card-icon :cardData="cardData" />
        <span class="title">{{ cardData.deviceName || cardData.deviceId }}</span>
        <card-action :cardData="cardData" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CardIcon from './CardIcon.vue';
import CardAction from './CardAction.vue';

export default defineComponent({
    name: 'CardHeader',

    components: {
        CardIcon,
        CardAction
    },

    props: {
        cardData: {
            required: true
        }
    }
});
</script>

<style lang="stylus" scoped>
.card-header
    display flex
    align-items center

    .title
        flex 1
        margin-left 14px
        font-size 22px
</style>
