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

import { setLanDevice, setCloudDevice } from '@/api/device';

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
            // Only these types of device support
            const uiids = [126, 32, 5];
            const { uiid } = this.cardData as any;

            if (uiids.indexOf(uiid) === -1) {
                return false;
            } else {
                return true;
            }
        },
        hasAllToggleFunc() {
            // Only these types of device support
            const uiids = [2, 3, 4, 7, 8, 9, 113, 114];
            const { uiid, params } = this.cardData as any;

            if (params) {
                const isLock = params.lock === 1;
                return uiids.indexOf(uiid) !== -1 && !isLock;
            } else {
                return uiids.indexOf(uiid) !== -1;
            }
        },
        allOn() {
            const { uiid, params } = this.cardData as any;
            let cnt = 0;

            if (uiid === 2 || uiid === 7 || uiid === 113) {
                // 2 channels
                cnt = 2;
            } else if (uiid === 3 || uiid === 8 || uiid === 114) {
                // 3 channels
                cnt = 3;
            } else if (uiid === 4 || uiid === 9) {
                // 4 channels
                cnt = 4;
            }

            const channels = params.switches.slice(0, cnt) as any[];
            return channels.every((channel) => channel.switch === 'on');
        }
    },

    methods: {
        refresh() {
            const { online } = this.cardData as any;
            if (online) {
                this.spin = true;
                setTimeout(() => {
                    this.spin = false;
                }, 2000);
            }
        },
        async toggle(v: boolean, e: any) {
            // TODO: send request
            e.stopPropagation();

            const { type, deviceId, apikey } = this.cardData as any;
            const statList = [];
            let stat = 'on';

            if (v) {
                stat = 'on';
            } else {
                stat = 'off';
            }

            for (let i = 0; i < 4; i++) {
                statList.push({
                    switch: stat,
                    outlet: i
                });
            }

            const params = {
                apikey,
                id: deviceId,
                params: {
                    switches: statList
                }
            };
            if (type === 2) {       // If current device is LAN device
                await setLanDevice(params);
            } else {
                await setCloudDevice(params);
            }
        }
    },

    mounted() {
        this.refresh = _.throttle(this.refresh, 2200, { 'leading': true, 'trailing': false });
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
