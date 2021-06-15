<template>
    <div class="device-ctrl">
        <device-name />
        <!-- TODO: DIY device no led -->
        <ctrl-switch type="led" />
        <!-- TODO: multi-channel
        <ctrl-switch type="lock" />
        -->
        <power-on-state />
        <inching-mode />
        <temperature-unit v-if="modalParams.uiid === 15" />
        <ctrl-switch type="disable" />
        <firmware-upgrade />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from '@/components/CtrlItem/DeviceName.vue';
import PowerOnState from '@/components/CtrlItem/PowerOnState.vue';
import InchingMode from '@/components/CtrlItem/InchingMode.vue';
import TemperatureUnit from '@/components/CtrlItem/TemperatureUnit.vue';
import CtrlSwitch from '@/components/CtrlItem/CtrlSwitch.vue';
import FirmwareUpgrade from '@/components/CtrlItem/FirmwareUpgrade.vue';

export default defineComponent({
    name: 'DeviceCtrl',

    components: {
        DeviceName,
        PowerOnState,
        CtrlSwitch,
        TemperatureUnit,
        InchingMode,
        FirmwareUpgrade,
    },

    computed: {
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
