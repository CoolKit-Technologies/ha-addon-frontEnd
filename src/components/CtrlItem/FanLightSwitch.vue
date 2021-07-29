<template>
    <div class="fan-switch mg-14">
        <div class="icon">
            <img src="@/assets/fan.png" v-if="type === 'fan'" alt="fan-icon" />
            <img src="@/assets/fan_bulb.png" v-if="type === 'bulb'" alt="fan_bulb-icon" />
        </div>
        <div class="text">
            <p class="title">{{ title }}</p>
        </div>
        <div class="action">
            <a-switch :checked="stat" @change="toggle" :disabled="!cardData.online" />
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent } from 'vue';
import { setCloudDevice, setLanDevice } from '@/api/device';

export default defineComponent({
    name: 'ChannelSwitch',

    props: {
        title: {
            default: 'Fan',
        },
        type: {
            type: String,
        },
        stat: {
            required: true,
        },
        cardData: {
            required: true,
        },
    },

    methods: {
        async toggle(v: boolean, e: any) {
            e.stopPropagation();
            const { type, apikey, deviceId, params } = this.cardData as any;
            if (type === 4) {
                const switches = _.cloneDeep(params.switches);
                if (this.type === 'fan') {
                    switches[1].switch = v ? 'on' : 'off';
                } else {
                    switches[0].switch = v ? 'on' : 'off';
                }
                // Cloud
                await setCloudDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        switches,
                    },
                });
            } else {
                let params: any = {};
                if (this.type === 'fan') {
                    params.fan = v ? 'on' : 'off';
                } else {
                    params.light = v ? 'on' : 'off';
                }
                await setLanDevice({
                    id: deviceId,
                    apikey,
                    params,
                });
            }
        },
    },
});
</script>

<style lang="stylus" scoped>
.fan-switch
    display flex
    align-items center
    .icon
        display flex
        justify-content center
        align-items center
        width 18px
        height 18px
        img
            width 100%

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

.mg-14
    margin 14px 0
    &:last-child
        margin-bottom 0
</style>
