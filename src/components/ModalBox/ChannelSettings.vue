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
import {
    isTwoChannelDevice,
    isThreeChannelDevice,
    isFourChannelDevice
} from '@/utils/etc';

export default defineComponent({
    name: 'ChannelSettings',

    components: {
        ChannelItem,
    },

    computed: {
        getMaxChannel() {
            const { uiid } = this.modalParams;
            if (isTwoChannelDevice(uiid)) {
                return 2;
            } else if (isThreeChannelDevice(uiid)) {
                return 3;
            } else if (isFourChannelDevice(uiid)) {
                return 4;
            } else {
                return 0;
            }
        },
        ...mapState(['modalParams']),
    },
});
</script>

<style lang="stylus" scoped>
.channel-settings
    margin-top -20px
</style>
