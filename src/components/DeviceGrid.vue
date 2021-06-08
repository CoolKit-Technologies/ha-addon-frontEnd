<template>
    <div class="device-grid">
        <device-card
            v-for="item in deviceCardList"
            :key="item.cardId"
            :cardData="item"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations } from 'vuex';
import { message } from 'ant-design-vue';

import { getDeviceListInit } from '@/api/device';
import DeviceCard from '@/components/DeviceCard/index.vue';

export default defineComponent({
    name: 'DeviceGrid',

    components: {
        DeviceCard
    },

    async created() {
        // TODO: uncomment for test
        // return;
        const res = await getDeviceListInit();
        if (res.error === 0) {
            this.setOriginDeviceList(res.data);
        } else {
            message.error(this.$t('common.error.getdevice'));
        }
    },

    computed: {
        ...mapGetters(['deviceCardList'])
    },

    methods: {
        ...mapMutations(['setOriginDeviceList'])
    }
});
</script>

<style lang="stylus" scoped>
.device-grid
    // background-color dodgerblue
    padding 20px
</style>
