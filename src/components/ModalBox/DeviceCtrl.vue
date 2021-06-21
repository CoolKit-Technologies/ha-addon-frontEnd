<template>
    <div class="device-ctrl">
        <device-name />
        <!-- DIY device could not toggle network LED -->
        <ctrl-switch type="led" v-if="!(isDiyDevice || isOldUiid15Device)" />
        <ctrl-switch type="lock" v-if="isMultiChannel" />
        <inching-mode v-if="!isMultiChannel && !isOldUiid15Device && modalParams.uiid !== 5" />
        <ctrl-select type="power-on-state" v-if="!isMultiChannel && !isOldUiid15Device" />
        <temperature-unit v-if="modalParams.uiid === 15 && hasCurTempFunc" />
        <ctrl-switch type="disable" />
        <!-- DIY device could not upgrade firmware -->
        <firmware-upgrade v-if="!(modalParams.type === 1 && modalParams.uiid === 1)" />
        <ctrl-select type="five-color-bulb-light" />
        <ctrl-select type="five-color-light" />
        <ctrl-select type="rhythm-light-strip" />
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
