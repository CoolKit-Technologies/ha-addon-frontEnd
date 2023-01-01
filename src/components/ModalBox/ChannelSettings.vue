<template>
    <div class="channel-settings">

        <channel-status-setting
            v-if="[130].includes(modalParams.uiid)"
        />

        <channel-item
            v-else
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
import ChannelStatusSetting from '../CtrlItem/ChannelStatusSetting.vue';
import {
    isTwoChannelDevice,
    isThreeChannelDevice,
    isFourChannelDevice
} from '@/utils/etc';

export default defineComponent({
    name: 'ChannelSettings',

    components: {
        ChannelItem,
        ChannelStatusSetting
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
