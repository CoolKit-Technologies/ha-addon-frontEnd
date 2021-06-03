<template>
    <a-card hoverable @click="open">
        <template #cover>
            <img
                alt="introduction card picture"
                :src="cardData.thumbnail"
            />
        </template>
        <a-card-meta :title="cardData.title" />
    </a-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { openWindow } from '@/utils/etc';
import { Content } from '@/api/content';

export default defineComponent({
    name: 'IntroCard',

    props: {
        cardData: {
            type: Object as PropType<Content>,
            required: true
        }
    },

    methods: {
        open() {
            openWindow(this.cardData.link);
        }
    }
});
</script>
