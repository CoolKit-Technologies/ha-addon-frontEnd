<template>
    <div class="device-grid">
        <div class="col-3x" v-if="windowSize === 'lg'">
            <div class="col">
                <device-card
                    class="col-item"
                    v-for="item in deviceCardList.filter((v, index) => index % 3 === 0)"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
            <div class="col">
                <device-card
                    class="col-item"
                    v-for="item in deviceCardList.filter((v, index) => index % 3 === 1)"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
            <div class="col">
                <device-card
                    class="col-item"
                    v-for="item in deviceCardList.filter((v, index) => index % 3 === 2)"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
        </div>
        <div class="col-2x" v-else-if="windowSize === 'md'">
            <div class="col">
                <device-card
                    class="col-item"
                    v-for="item in deviceCardList.filter((v, index) => index % 2 === 0)"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
            <div class="col">
                <device-card
                    class="col-item"
                    v-for="item in deviceCardList.filter((v, index) => index % 2 === 1)"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
        </div>
        <div class="col-1x" v-else>
            <div class="col" :style="{ 'width': windowSize === 'xm' ? '100%' : 'auto' }">
                <device-card
                    class="col-item"
                    :style="{ 'min-width': windowSize === 'xm' ? '0' : '480px' }"
                    v-for="item in deviceCardList"
                    :key="item.cardId"
                    :cardData="item"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapGetters, mapMutations } from 'vuex';
import { message } from 'ant-design-vue';

import { getDeviceListInit } from '@/api/device';
import DeviceCard from '@/components/DeviceCard/index.vue';

export default defineComponent({
    name: 'DeviceGrid',

    components: {
        DeviceCard
    },

    async created() {
        // TEST: uncomment for test
        return;
        const res = await getDeviceListInit();
        if (res.error === 0) {
            this.setOriginDeviceList(res.data);
        } else {
            message.error(this.$t('common.error.getdevice'));
        }
    },

    computed: {
        ...mapState(['windowSize']),
        ...mapGetters(['deviceCardList'])
    },

    methods: {
        ...mapMutations(['setOriginDeviceList'])
    }
});
</script>

<style lang="stylus" scoped>
.device-grid
    padding 0 7px
    .col-3x,
    .col-2x,
    .col-1x
        display flex
        justify-content center
        .col
            padding 0 7px
            .col-item
                min-width 480px
                margin 14px 0
</style>
