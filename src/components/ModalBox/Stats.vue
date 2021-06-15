<template>
    <div class="stats">
        <a-tabs type="line">
            <a-tab-pane key="1" :tab="$t('modal.realtimeStats')">
                <statistics-item />
            </a-tab-pane>
            <a-tab-pane key="2" :tab="$t('modal.history')">
                <history-item />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import StatisticsItem from '@/components/CtrlItem/StatisticsItem.vue';
import HistoryItem from '@/components/CtrlItem/HistoryItem.vue';

export default defineComponent({
    name: 'Stats',

    components: {
        StatisticsItem,
        HistoryItem,
    }
});
</script>

<style lang="stylus" scoped>
.stats
    margin-top -20px
    .ant-tabs-nav-list,
    .ant-tabs-tab
        width auto
</style>
