<template>
    <div class="intro-bar">
        <intro-card
            class="intro-card"
            v-for="card in cardList"
            :key="card.pageid"
            :cardData="card"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { message } from 'ant-design-vue';

import { getContent, Content } from '@/api/content';
import IntroCard from '@/components/IntroCard.vue';

export default defineComponent({
    name: 'IntroBar',

    data() {
        return {
            cardList: []
        } as {
            cardList: Array<Content>
        };
    },

    components: {
        IntroCard
    },

    async created() {
        const res = await getContent();
        if (res.error === 0) {
            const { top, push } = res.data;
            this.cardList.push(top);
            this.cardList.push(...push);
        } else {
            message.error(this.$t('common.error.getcontent'));
        }
    }
});
</script>

<style lang="stylus" scoped>
.intro-bar
    display flex
    padding 20px 10px

    .intro-card
        flex 1
        max-width calc((100% - 40px) / 5)
        &:not(:last-child)
            margin-right 10px
</style>
