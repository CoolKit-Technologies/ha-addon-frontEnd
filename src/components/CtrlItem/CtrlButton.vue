<template>
    <div class="ctrl-button">
        <div class="text">
            <div v-if="type < 5" class="left-icon-box">
                <img v-if="iconStatus" src="@/assets/study_1.png" alt="" />
                <img v-else src="@/assets/study_0.png" alt="" />
            </div>
            <div v-else-if="type === 5" class="left-icon-box">
                <template v-if="channelData.index === 0">
                    <img v-if="iconStatus" src="@/assets/curtain_status_on_1.png" alt="" />
                    <img v-else src="@/assets/curtain_status_on_0.png" alt="" />
                </template>
                <template v-else-if="channelData.index === 1">
                    <img v-if="iconStatus" src="@/assets/curtain_status_pause_1.png" alt="" />
                    <img v-else src="@/assets/curtain_status_pause_0.png" alt="" />
                </template>
                <template v-else-if="channelData.index === 2">
                    <img v-if="iconStatus" src="@/assets/curtain_status_off_1.png" alt="" />
                    <img v-else src="@/assets/curtain.png" alt="" />
                </template>
            </div>
            <div v-else-if="type === 6" class="left-icon-box">
                <img v-if="iconStatus" src="@/assets/alert_1.png" alt="" />
                <img v-else src="@/assets/alert_0.png" alt="" />
            </div>
            <p class="title">{{ name }}</p>
        </div>
        <div class="action" @click="handleClick">
            <div v-if="type < 5">
                <img v-if="iconStatus" class="icon" src="@/assets/action_1.png" alt="" />
                <img v-else class="icon" src="@/assets/action_0.png" alt="" />
            </div>
            <div v-else-if="type === 5">
                <template v-if="channelData.index === 0">
                    <img v-if="iconStatus" class="icon" src="@/assets/curtain_on_1.png" alt="" />
                    <img v-else class="icon" src="@/assets/curtain_on_0.png" alt="" />
                </template>
                <template v-else-if="channelData.index === 1">
                    <img v-if="iconStatus" class="icon" src="@/assets/curtain_pause_1.png" alt="" />
                    <img v-else class="icon" src="@/assets/curtain_pause_0.png" alt="" />
                </template>
                <template v-else-if="channelData.index === 2">
                    <img v-if="iconStatus" class="icon" src="@/assets/curtain_off_1.png" alt="" />
                    <img v-else class="icon" src="@/assets/curtain_off_0.png" alt="" />
                </template>
            </div>
            <div v-else-if="type === 6">
                {{ trigDate }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import moment from 'moment';

import { setCloudDevice, setLanDevice } from '@/api/device';

export default defineComponent({
    name: 'CtrlButton',

    props: {
        cardData: {
            required: true,
            type: Object,
        },
        channelData: {
            required: true,
            type: Object,
        },
        name: {
            required: true,
            type: String,
        },
        type: {
            required: true,
            type: Number,
        },
    },

    computed: {
        iconStatus() {
            const { channelData } = this as any;
            return !!channelData.rfVal;
        },
        trigDate() {
            const {
                channelData: { rfTrig },
            } = this as any;
            if (rfTrig) {
                return moment(rfTrig).format('YYYY-MM-DD HH:mm');
            }
            return '';
        },
        ...mapState(['modalParams']),
    },
    created() {
        console.log(this.cardData);
    },
    methods: {
        handleClick(e: MouseEvent) {
            e.stopPropagation();
            if (this.type === 6) {
                return;
            }
            const { deviceId, apikey, type } = this.cardData;
            const { rfChl } = this.channelData;
            if (type === 4) {
                setCloudDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        cmd: 'transmit',
                        rfChl,
                    },
                });
            } else if(type===2) {
                setLanDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        rfChl,
                    },
                })
            }
        },
    },
});
</script>

<style lang="stylus" scoped>
.ctrl-button
    display flex
    align-items center
    justify-content space-between
    height 32px
    .text
        display flex
        align-items center
        justify-content center
        & > p
            margin 0
        .title
            color #212121
            margin-left 14px
    .icon
        width 26px

    .left-icon-box
        width 32px
        text-align center
        img
            width 18px
</style>
