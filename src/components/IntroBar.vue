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
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { Content } from "@/api/content";
import IntroCard from "@/components/IntroCard.vue";
import IntroCarousel from "@/components/IntroCarousel.vue";

export default defineComponent({
    name: "IntroBar",

    data() {
        return {} as {};
    },
    components: {
        IntroCard,
        IntroCarousel,
    },

    computed: {
        smallScreen() {
            const { windowSize } = this as any;
            return windowSize === "xm" || windowSize === "sm";
        },
        ...mapState(["locale", "windowSize", "cmsInfo"]),
        cardList() {
            let cardList = [];
            const { top, push } = this.cmsInfo as unknown as any;
            if (top) {
                cardList.push(top);
                cardList.push(...push);
                return cardList as Array<Content>;
            } else {
                return [];
            }
        },
    },
});
</script>

<style lang="stylus" scoped>
.intro-bar {
    padding: 10px;

    .wrapper {
        display: flex;

        .intro-card {
            flex: 1;
            max-width: calc(((100% - 40px) / 5));

            &:not(:last-child) {
                margin-right: 10px;
            }
        }
    }
}
</style>
