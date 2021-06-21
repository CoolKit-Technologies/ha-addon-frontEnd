<template>
    <div class="rhythm-sw">
        <div class="icon">
            <img
                src="@/assets/rhythm.png"
                alt="music icon"
            />
        </div>
        <div class="text">
            <span>Rhythm</span>
        </div>
        <div class="action">
            <a-switch/>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RhythmSwitch'
});
</script>

<style lang="stylus" scoped>
.rhythm-sw
    display flex
    align-items center

    .icon
        display flex
        justify-content center
        align-items center
        width 32px
        height 32px
        & > img
            width 22px
            height 22px

    .text
        flex 1
        display flex
        justify-content space-between
        align-items center
        margin 0 14px

    .action
        display flex
        justify-content center
        align-items: center
        margin-right 6px
</style>
