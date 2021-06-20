<template>
    <div class="intro-bar">
        <intro-carousel v-if="smallScreen" :cardList="cardList" />
        <div class="wrapper" v-else>
            <intro-card
                class="intro-card"
                v-for="card in cardList"
                :key="card.pageid"
                :cardData="card"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { message } from 'ant-design-vue';

import { getContent, Content } from '@/api/content';
import IntroCard from '@/components/IntroCard.vue';
import IntroCarousel from '@/components/IntroCarousel.vue';

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
        IntroCard,
        IntroCarousel
    },

    computed: {
        smallScreen() {
            const { windowSize } = this as any;
            return windowSize === 'xm' || windowSize === 'sm';
        },
        ...mapState(['locale', 'windowSize'])
    },

    async created() {
        return;
        const res = await getContent(this.locale);
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
    padding 10px
    .wrapper
        display flex

        .intro-card
            flex 1
            max-width calc((100% - 40px) / 5)
            &:not(:last-child)
                margin-right 10px
</style>
