// todo
<template>
    <div class="fan">
        <div class="icon-item">
            <control-circle :class="fanStatus === 'low' && 'active'" type="fan" fanType="low" :active="!!fanStatus" @click.stop="fanAction('low')" />
            <control-circle :class="fanStatus === 'mid' && 'active'" type="fan" fanType="mid" :active="!!fanStatus" @click.stop="fanAction('mid')" />
            <control-circle :class="fanStatus === 'high' && 'active'" type="fan" fanType="high" :active="!!fanStatus" @click.stop="fanAction('high')" />
        </div>
        <div class="control-item">
            <fan-light-switch :stat="fanStatus !== ''" type="fan" :title="$t('card.fanSwitch')" :cardData="cardData" />
            <fan-light-switch :stat="lightStatus" type="bulb" :title="$t('card.lightSwitch')" :cardData="cardData" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';
import ControlCircle from '@/components/CtrlItem/ControlCircle.vue';
import SlideControl from '@/components/CtrlItem/SlideControl.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';
import FanLightSwitch from '@/components/CtrlItem/FanLightSwitch.vue';
import { setCloudDevice, setLanDevice } from '@/api/device';

/**
 * @description UIID34 风扇灯
 */
export default defineComponent({
    name: 'fan',
    components: {
        SlideControl,
        ControlCircle,
        CtrlSlider,
        FanLightSwitch,
    },
    data() {},
    props: {
        cardData: {
            required: true,
        },
    },
    computed: {
        fanStatus(): string {
            const switches = _.get(this, ['cardData', 'params', 'switches'], []);
            let fanState = switches[1].switch;
            if (fanState === 'off') {
                return '';
            }
            let presetMode = 'low';
            if (switches[2].switch === 'on') {
                presetMode = 'mid';
            }
            if (switches[3].switch === 'on') {
                presetMode = 'high';
            }
            return presetMode;
        },
        lightStatus(): boolean {
            const light = _.get(this, ['cardData', 'params', 'switches', 0], {});
            return light.switch === 'on';
        },
    },
    methods: {
        async fanAction(action: string) {
            const { type, apikey, deviceId, params } = this.cardData as any;
            const switches = [
                {
                    switch: _.get(params, ['switches', 0, 'switch'], 'off'),
                    outlet: 0,
                },
                {
                    switch: 'off',
                    outlet: 1,
                },
                {
                    switch: 'off',
                    outlet: 2,
                },
                {
                    switch: 'off',
                    outlet: 3,
                },
            ];
            if (action === 'low') {
                switches[1].switch = 'on';
            } else if (action === 'mid') {
                switches[1].switch = 'on';
                switches[2].switch = 'on';
            } else if (action === 'high') {
                switches[1].switch = 'on';
                switches[3].switch = 'on';
            }
            if (type === 4) {
                // Cloud
                await setCloudDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        switches,
                    },
                });
            } else {
                // Lan
                const speedMap = new Map([
                    ['low', 1],
                    ['mid', 2],
                    ['high', 3],
                ]);
                await setLanDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        fan: 'on',
                        speed: speedMap.get(action),
                    },
                });
            }
        },
    },
});
</script>
<style lang="stylus" scoped>
.fan
    margin-top 14px
    display flex
    flex-direction column
    justify-content center
    align-items center
    .icon-item
        width 100%
        display flex
        justify-content space-between
        align-items center
    .active
        background: rgba(24, 144, 255, 0.1)
        border-color #1890FF !important

    .control-item
        width 100%
</style>
