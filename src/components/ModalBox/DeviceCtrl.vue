<template>
    <div class="device-ctrl">
        <!-- Set device name -->
        <device-name />

        <!-- Toggle device network LED -->
        <ctrl-switch
            v-if="!(isDiyDevice || isOldUiid15Device || isLight)"
            type="led"
        />

        <!-- Toggle multi-channel device interlock -->
        <ctrl-switch
            v-if="isMultiChannel"
            type="lock"
        />

        <!-- Set device inching mode -->
        <inching-mode
            v-if="!(isMultiChannel || isOldUiid15Device || isLight || modalParams.uiid === 5)"
        />

        <!-- Set device power on state -->
        <ctrl-select
            v-if="!(isMultiChannel || isOldUiid15Device || isLight)"
            type="power-on-state"
        />

        <!-- Set temperature unit -->
        <temperature-unit v-if="modalParams.uiid === 15 && hasCurTempFunc" />

        <!-- Set rhythm light strip mode -->
        <ctrl-select
            v-if="modalParams.uiid === 59"
            type="rhythm-light-strip"
        />

        <!-- Set five color bulb light mode -->
        <ctrl-select
            v-if="modalParams.uiid === 22"
            type="five-color-bulb-light"
        />

        <!-- Set five color light mode -->
        <ctrl-select
            v-if="modalParams.uiid === 104"
            type="five-color-light"
        />

        <!-- Set device disable -->
        <ctrl-switch type="disable" />

        <!-- Upgrade device firmware -->
        <firmware-upgrade v-if="!isDiyDevice" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from '@/components/CtrlItem/DeviceName.vue';
import InchingMode from '@/components/CtrlItem/InchingMode.vue';
import TemperatureUnit from '@/components/CtrlItem/TemperatureUnit.vue';
import CtrlSwitch from '@/components/CtrlItem/CtrlSwitch.vue';
import FirmwareUpgrade from '@/components/CtrlItem/FirmwareUpgrade.vue';
import CtrlSelect from '@/components/CtrlItem/CtrlSelect.vue';
import { isMultiChannelDevice } from '@/utils/etc';

export default defineComponent({
    name: 'DeviceCtrl',

    components: {
        DeviceName,
        CtrlSwitch,
        TemperatureUnit,
        InchingMode,
        FirmwareUpgrade,
        CtrlSelect
    },

    computed: {
        isDiyDevice() {
            const { type, uiid } = this.modalParams as any;
            return (type === 1 && uiid === 1);
        },
        hasCurTempFunc() {
            const { params } = this.modalParams as any;
            return params.currentTemperature !== 'unavailable';
        },
        hasCurHumiFunc() {
            const { params } = this.modalParams as any;
            return params.currentHumidity !== 'unavailable';
        },
        isOldUiid15Device() {
            const { params } = this.modalParams as any;
            return (params.currentHumidity === 'unavailable' && params.currentTemperature === 'unavailable');
        },
        isMultiChannel() {
            const { uiid } = this.modalParams as any;
            return isMultiChannelDevice(uiid);
        },
        isLight() {
            const { uiid } = this.modalParams as any;
            return (uiid === 59 || uiid === 22 || uiid === 103 || uiid === 104);
        },
        ...mapState(['modalParams']),
    },
});
</script>

<style lang="stylus" scoped>
.device-ctrl
    margin-top -20px
    & > div:not(:first-child)
        margin-top 14px
</style>
