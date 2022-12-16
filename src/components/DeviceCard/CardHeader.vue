<template>
    <div class="card-header">
        <card-icon :cardData="cardData" />
        <span class="title">{{ title }}</span>
        <card-action :cardData="cardData" />
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent, PropType } from 'vue';

import CardIcon from './CardIcon.vue';
import CardAction from './CardAction.vue';
import type { CardData } from '@/types'

export default defineComponent({
    name: 'CardHeader',

    components: {
        CardIcon,
        CardAction,
    },

    props: {
        cardData: {
            type: Object as PropType<CardData>,
            required: true,
        },
    },
    computed: {
        title() {
            const cardData = this.cardData as any;
            if (cardData.uiid === 28 && cardData.cardIndex !== -1) {
                const zyxInfo = _.get(cardData, ['tags', 'zyx_info'], []);
                const index = _.get(cardData, ['cardIndex']);
                return _.get(zyxInfo, [index, 'name']);
            }
            return cardData.deviceName || cardData.deviceId;
        },
    },
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
