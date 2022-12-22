<template>
    <div class="device-ctrl">
        <!-- Set device name -->
        <device-name v-if="!isRfSub" />

        <!-- Set remote and button name -->
        <template v-if="isRfSub">
            <device-name type="remote" />
            <device-name type="button" v-for="(item, i) in modalParams.tags.zyx_info[modalParams.cardIndex].buttonName" :key="i" :index="i" />
        </template>

        <!-- disable entity -->
        <ctrl-switch v-if="!(isDiyDevice || isOldUiid15Device || isLight || isZigbee || isWifiDoorSensor || isRfSub || isFanLight || isDimming || isNSPanel || isZigbeeMultiSwitch)" type="led" />

        <!-- Control Button indicator light -->
        <ButtonIndicatorLight v-if="[160, 161, 162].includes(uiid)" />

        <!-- Toggle multi-channel device interlock -->
        <ctrl-switch v-show="![161, 162].includes(uiid)" v-if="isMultiChannel && !isZigbee && !isWifiDoorSensor && !isRfGw && !isRfSub && !isMiniR3 && !isZigbeeMultiSwitch" type="lock" />

        <!-- Set device power on state -->
        <ctrl-select
            v-if="!(isMultiChannel || isOldUiid15Device || isLight || isCurtain || isZigbee || isWifiDoorSensor || isRfGw || isRfSub || isFanLight)"
            type="power-on-state"
        />

        <!-- Set device inching mode -->
        <inching-mode
            v-if="
                !(
                    isMultiChannel ||
                    isOldUiid15Device ||
                    isLight ||
                    isCurtain ||
                    modalParams.uiid === 5 ||
                    isZigbee ||
                    isWifiDoorSensor ||
                    isRfGw ||
                    isRfSub ||
                    isFanLight ||
                    isDimming
                )
            "
        />

        <!-- UIID 160 161 162 disable entity -->
        <ctrl-switch type="disable" v-if="[160, 161, 162, 138].includes(uiid)" />

        <!-- fanlight power on state -->
        <template v-if="isFanLight">
            <ctrl-select :index="0" type="power-on-state" />
            <ctrl-select :index="1" type="power-on-state" />
        </template>

        <!-- UIID 190 Reset Consumption -->
        <reset-consumption v-if="isUiid190" :cardData="modalParams" />

        <!-- Set temperature unit -->
        <temperature-unit v-if="modalParams.uiid === 15 && hasCurTempFunc" />

        <!-- Set rhythm light strip mode -->
        <ctrl-select v-if="modalParams.uiid === 59" type="rhythm-light-strip" />

        <!-- Set five color bulb light mode -->
        <ctrl-select v-if="modalParams.uiid === 22" type="five-color-bulb-light" />

        <!-- Set Dimming mode -->
        <ctrl-select v-if="isDimming" type="dimming" />

        <!-- Set Dimming Darkest -->
        <ctrl-slider v-if="isDimming" type="darkest" :cardData="modalParams" />

        <ctrl-select v-if="modalParams.uiid === 103" type="two-color-light" />

        <!-- Set five color light mode -->
        <ctrl-select v-if="modalParams.uiid === 104" type="five-color-light" />

        <!-- NS Panel 温度单位控制 -->
        <ctrl-temp v-if="isNSPanel" :cardData="modalParams"></ctrl-temp>

        <!-- single-switch mini-R3 -->
        <!-- <scenes-item v-if="modalParams.uiid === 138" /> -->

        <mulit-lock v-if="isMiniR3" />

        <!-- Set device disable -->
        <!-- v1.3.2 版本移除该功能
        <ctrl-switch type="disable" v-if="!isRfSub && !isRfGw" />
        -->

        <!-- Upgrade device firmware -->
        <firmware-upgrade v-if="!isDiyDevice && !isZigbee && !isRfSub && !isZigbeeMultiSwitch" />

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from '@/components/CtrlItem/DeviceName.vue';
import InchingMode from '@/components/CtrlItem/InchingMode.vue';
import TemperatureUnit from '@/components/CtrlItem/TemperatureUnit.vue';
import CtrlSwitch from '@/components/CtrlItem/CtrlSwitch.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';
import FirmwareUpgrade from '@/components/CtrlItem/FirmwareUpgrade.vue';
import CtrlSelect from '@/components/CtrlItem/CtrlSelect.vue';
import ScenesItem from '@/components/CtrlItem/ScenesItem.vue';
import MulitLock from '@/components/CtrlItem/MulitLock/MulitLock.vue';
import { isMultiChannelDevice, isZigbeeDevice } from '@/utils/etc';
import CtrlTemp from '@/components/CtrlItem/CtrlTemp.vue';
import ResetConsumption from '@/components/CtrlItem/ResetConsumption.vue';
import ButtonIndicatorLight from '@/components/CtrlItem/ButtonIndicatorLight.vue'

export default defineComponent({
    name: 'DeviceCtrl',

    components: {
        DeviceName,
        CtrlSwitch,
        TemperatureUnit,
        InchingMode,
        FirmwareUpgrade,
        CtrlSelect,
        CtrlSlider,
        ScenesItem,
        MulitLock,
        CtrlTemp,
        ResetConsumption,
        ButtonIndicatorLight
    },

    computed: {
        uiid() {
            const { uiid } = this.modalParams as any;
            return uiid;
        },
        isDiyDevice() {
            const { type, uiid } = this.modalParams as any;
            return type === 1 && uiid === 1;
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
            return params.currentHumidity === 'unavailable' && params.currentTemperature === 'unavailable';
        },
        isMultiChannel() {
            const { uiid } = this.modalParams as any;
            return isMultiChannelDevice(uiid);
        },
        isLight() {
            const { uiid } = this.modalParams as any;
            return uiid === 59 || uiid === 22 || uiid === 103 || uiid === 104;
        },
        isCurtain() {
            const { uiid } = this.modalParams as any;
            return uiid === 11;
        },
        isZigbee() {
            const { uiid } = this.modalParams as any;
            return isZigbeeDevice(uiid);
        },
        isWifiDoorSensor() {
            const { uiid } = this.modalParams as any;
            return uiid === 102;
        },
        isFanLight() {
            const { uiid } = this.modalParams as any;
            return uiid === 34;
        },
        isDimming() {
            const { uiid } = this.modalParams as any;
            return uiid === 44;
        },

        isMiniR3() {
            const { uiid } = this.modalParams as any;
            return uiid > 138 && uiid <= 141;
        },
        // is RF gateway
        isRfGw() {
            const { uiid, cardIndex } = this.modalParams as any;
            return uiid === 28 && cardIndex === -1;
        },
        // is RF sub-device
        isRfSub() {
            const { uiid, cardIndex } = this.modalParams as any;
            return uiid === 28 && cardIndex !== -1;
        },
        isNSPanel() {
            const { uiid, cardIndex } = this.modalParams as any;
            return uiid === 133 || uiid === 181;
        },
        isUiid190() {
            const { uiid, cardIndex } = this.modalParams as any;
            return uiid === 190;
        },
		isZigbeeMultiSwitch(){
			const { uiid } = this.modalParams as any;
            return uiid === 2256 || uiid === 3256 || uiid === 4256;
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
