<template>
    <div class="card-action">
        <sync-outlined
            v-if="hasRefreshFunc"
            class="action-icon"
            :spin="spin"
            @click.stop="refresh"
        />
        <a-switch
            v-else-if="hasAllToggleFunc"
            @change="toggle"
            :disabled="!cardData.online"
            :checked="allOn"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SyncOutlined } from '@ant-design/icons-vue';
import _ from 'lodash';

import { toggleAllChannels, refreshUi } from '@/api/device';
import {
    isMultiChannelDevice,
    isTwoChannelDevice,
    isThreeChannelDevice,
    isFourChannelDevice,
    hasRefreshUiDevice
} from '@/utils/etc';

export default defineComponent({
    name: 'CardAction',

    props: {
        cardData: {
            required: true
        }
    },

    components: {
        SyncOutlined
    },

    data() {
        return {
            spin: false
        };
    },

    computed: {
        hasRefreshFunc() {
            const { uiid } = this.cardData as any;

            return hasRefreshUiDevice(uiid);
        },
        hasAllToggleFunc() {
            const { uiid, params } = this.cardData as any;

            if (params) {
                const isLock = params.lock === 1;
                return isMultiChannelDevice(uiid) && !isLock;
            } else {
                return isMultiChannelDevice(uiid);
            }
        },
        allOn() {
            const { uiid, params } = this.cardData as any;
            let cnt = 0;

            if (isTwoChannelDevice(uiid)) {
                // 2 channels
                cnt = 2;
            } else if (isThreeChannelDevice(uiid)) {
                // 3 channels
                cnt = 3;
            } else if (isFourChannelDevice(uiid)) {
                // 4 channels
                cnt = 4;
            }

            const channels = params.switches.slice(0, cnt) as any[];
            return channels.every((channel) => channel.switch === 'on');
        }
    },

    methods: {
        async refresh() {
            const { online } = this.cardData as any;
            if (online) {
                this.spin = true;
                setTimeout(() => {
                    this.spin = false;
                }, 2000);
                await refreshUi(this.cardData);
            }
        },
        async toggle(v: boolean, e: any) {
            e.stopPropagation();
            await toggleAllChannels(v, this.cardData);
        }
    },

    mounted() {
        this.refresh = _.throttle(this.refresh, 2200, { 'leading': true, 'trailing': false }) as any;
    }
});
</script>

<style lang="stylus" scoped>
.card-action
    display flex
    justify-content center
    align-items center
    margin-right 6px

    .action-icon
        color #04a9f1
        font-size 22px
        padding 6px
        border-radius 50%
        &:hover
            background-color #f7f7f7
</style>
