<template>
    <div class="device-ctrl">
        <device-name />
        <power-on-state />
        <temperature-unit v-if="modalParams.uiid === 15" />
        <ctrl-switch type="led" />
        <ctrl-switch type="lock" />
        <ctrl-switch type="disable" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from '@/components/CtrlItem/DeviceName.vue';
import PowerOnState from '@/components/CtrlItem/PowerOnState.vue';
import TemperatureUnit from '@/components/CtrlItem/TemperatureUnit.vue';
import CtrlSwitch from '@/components/CtrlItem/CtrlSwitch.vue';

export default defineComponent({
    name: 'DeviceCtrl',

    components:{
        DeviceName,
        PowerOnState,
        CtrlSwitch,
        TemperatureUnit
    },

    computed: {
        ...mapState(['modalParams'])
    }
});
</script>

<style lang="stylus" scoped>
.device-ctrl
    & > div:not(:first-child)
        margin-top 14px
</style>
