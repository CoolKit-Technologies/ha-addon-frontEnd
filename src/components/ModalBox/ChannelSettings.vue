<template>
    <div class="channel-settings">
        <channel-item
            v-for="item in getMaxChannel"
            :key="item"
            :index="item"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import ChannelItem from '@/components/CtrlItem/ChannelItem.vue';

export default defineComponent({
    name: 'ChannelSettings',

    components: {
        ChannelItem,
    },

    computed: {
        getMaxChannel() {
            const { modalParams } = this as any;
            const channelMap = new Map<number, number>([
                [2, 2], // 双通道插座
                [3, 3], // 三通道插座
                [4, 4], // 四通道插座
                [7, 2], // 双通道开关
                [8, 3], // 三通道开关
                [9, 4], // 四通道开关
                [113, 2], // 双通道开关微波雷达版
                [114, 3], // 三通道开关微波雷达版
            ]);
            return channelMap.get(modalParams.uiid) || 0;
        },
        ...mapState(['modalParams']),
    },
});
</script>

<style lang="stylus" scoped>
.channel-settings
    margin-top -20px
</style>
