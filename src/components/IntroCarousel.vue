<template>
    <a-carousel class="intro-carousel" autoplay>
        <img
            class="item"
            v-for="card in cardList"
            :key="card.pageid"
            :src="card.thumbnail"
            alt="introduction card picture"
            @click="open(card.link)"
        />
    </a-carousel>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { openWindow } from '@/utils/etc';

export default defineComponent({
    name: 'IntroCarousel',

    props: {
        cardList: {
            default: []
        }
    },

    methods: {
        open(link: string) {
            openWindow(link);
        }
    }
});
</script>

<style scoped>
.intro-carousel {
    max-width: 500px;
    margin: 0 auto;
}

.item {
    object-fit: contain;
    width: min(500px, 100vw);
}
</style>
