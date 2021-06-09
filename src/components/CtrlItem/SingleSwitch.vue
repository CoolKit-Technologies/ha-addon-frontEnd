<template>
    <div class="single-switch">
        <div class="icon" v-if="icon !== ''">
            <!-- icon: flash -->
            <img
                v-if="icon === 'flash' && stat"
                src="@/assets/flash-on.svg"
                alt="flash icon"
            />
            <img
                v-else-if="icon === 'flash' && !stat"
                src="@/assets/flash-off.svg"
                alt="flash icon"
            />
        </div>
        <div class="text">
            <p class="title">{{ title }}</p>
            <p class="desc">{{ desc }}</p>
        </div>
        <div class="action">
            <a-switch
                :checked="stat"
                @change="toggle"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SingleSwitch',

    props: {
        icon: {
            default: ''
        },
        title: {
            default: ''
        },
        desc: {
            default: ''
        },
        stat: {
            required: true
        }
    },

    methods: {
        toggle(v: boolean, e: any) {
            // TODO: send request
            e.stopPropagation();
            console.log('>_<', v);
        }
    }
});
</script>

<style lang="stylus" scoped>
.single-switch
    display flex
    align-items center

    .icon
        display flex
        justify-content center
        align-items: center
        width 32px
        height 32px

    .text
        flex 1
        display flex
        justify-content space-between
        align-items center
        margin 0 14px
        & > p
            margin 0
        .title
            margin-right 14px

    .action
        display flex
        justify-content center
        align-items: center
        margin-right 6px
</style>
