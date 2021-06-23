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
            <a-switch
                :checked="stat"
                @change="toggle"
                :disabled="!cardData.online"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { setCloudDevice } from '@/api/device';

export default defineComponent({
    name: 'RhythmSwitch',

    props: {
        cardData: {
            required: true
        }
    },

    computed: {
        stat() {
            const { params } = this.cardData as any;
            return params.mode === 12;
        }
    },

    methods: {
        async toggle(v: boolean, e: any) {
            const { apikey, deviceId } = this.cardData as any;
            e.stopPropagation();
            await setCloudDevice({
                apikey,
                id: deviceId,
                params: {
                    mode: 12,
                    switch: v ? 'on' : 'off'
                }
            });
        }
    }
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
