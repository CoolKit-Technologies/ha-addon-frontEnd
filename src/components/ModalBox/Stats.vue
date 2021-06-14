<template>
    <div class="stats">
        <a-tabs class=".ant-tabs-nav-list">
            <a-tab-pane key="status" :tab="status" class="ant-tabs-tab">
                <statastic-item />
            </a-tab-pane>
            <a-tab-pane key="history" :tab="history" class="ant-tabs-tab">
                <history-item />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import StatasticItem from '@/components/CtrlItem/StatasticItem.vue';
import HistoryItem from '@/components/CtrlItem/HistoryItem.vue';
export default defineComponent({
    name: 'Stats',

    components: {
        StatasticItem,
        HistoryItem,
    },
    data() {
        return {
            status: this.$t('modal.realtimeStats'),
            history: this.$t('modal.history'),
        };
    },
    created() {
        console.log('===============', this.modalParams);
    },
    computed: {
        ...mapState(['modalParams']),
    },
});
</script>

<style lang="stylus">
.ant-tabs-nav-list,.ant-tabs-tab
    width: 100%;
    justify-content: space-between;
</style>
