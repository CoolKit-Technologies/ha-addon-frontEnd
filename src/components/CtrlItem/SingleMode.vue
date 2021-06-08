<template>
    <div class="single-mode">
        <div class="icon">
            <img
                alt="tune icon"
                src="@/assets/tune.svg"
            />
        </div>
        <div class="text">
            <span>{{ $t('card.mode') }}</span>
        </div>
        <div class="mode">
            <span>{{ mode }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'SingleMode',

    props: {
        mode: {
            required: true,
            default: ''
        }
    }
});
</script>

<style lang="stylus" scoped>
.single-mode
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
        margin-left 14px

    .mode
        margin-right 6px
</style>
