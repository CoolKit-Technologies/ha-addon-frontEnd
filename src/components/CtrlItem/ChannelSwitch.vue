<template>
    <div class="channel-switch">
        <div class="icon">
            <img
                v-if="stat"
                src="@/assets/flash-on.svg"
                alt="flash icon"
            />
            <img
                v-else-if="!stat"
                src="@/assets/flash-off.svg"
                alt="flash icon"
            />
        </div>
        <div class="text">
            <p class="title">{{ title }}</p>
            <p class="desc">{{ desc }}</p>
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

import { setDiyDevice, setCloudDevice, setLanDevice } from '@/api/device';

export default defineComponent({
    name: 'ChannelSwitch',

    props: {
        title: {
            default: ''
        },
        desc: {
            default: ''
        },
        index: {
            default: 0
        },
        stat: {
            required: true
        },
        cardData: {
            required: true
        }
    },

    methods: {
        async toggle(v: boolean, e: any) {
            e.stopPropagation();

            const { apikey, deviceId, uiid, type } = this.cardData as any;
            let params;

            if (uiid === 1 && type === 1) {
                // DIY device
                await setDiyDevice({
                    id: deviceId,
                    type: 'switch',
                    params: {
                        state: v ? 'on' : 'off'
                    }
                });
                return;
            } else if (
                uiid === 1 || uiid === 6 || uiid === 14 || uiid === 15
                || uiid === 5 || uiid === 32
            ) {
                // Single channel switch or socket, temperature thermal device,
                // power detection device, power voltage current detection,
                params = {
                    apikey,
                    id: deviceId,
                    params: {
                        switch: v ? 'on' : 'off'
                    }
                };
            } else {
                // Multi-channel switch or socket, dual power detection device
                params = {
                    apikey,
                    id: deviceId,
                    params: {
                        switches: [
                            {
                                outlet: this.index,
                                switch: v ? 'on' : 'off'
                            }
                        ]
                    }
                };
            }

            if (type === 2) {       // If current device is LAN device
                await setLanDevice(params);
            } else {
                await setCloudDevice(params);
            }
        }
    }
});
</script>

<style lang="stylus" scoped>
.channel-switch
    display flex
    align-items center

    .icon
        display flex
        justify-content center
        align-items: center
        width 32px
        height 32px

    .text
        flex 1
        display flex
        justify-content space-between
        align-items center
        margin 0 14px
        & > p
            margin 0
        .title
            margin-right 14px

    .action
        display flex
        justify-content center
        align-items: center
        margin-right 6px
</style>
