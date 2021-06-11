<template>
    <a-modal :visible="modalVisible" :footer="null" :destroyOnClose="true" :maskClosable="false" @cancel="handleClose" class="modal-box">
        <template #title v-if="`${modalType && modalType !== 'login'}`">
            {{ modalParams.deviceName }}
            <span class="more" v-if="showStats()" @click="() => setModalType('stats')">{{ $t('modal.stats') }}</span>
            <span class="more" v-if="showChannelSettings()" @click="() => setModalType('channelSettings')">{{ $t('modal.channelSettings') }}</span>
            <span class="more" v-if="modalType !== 'device'" @click="() => setModalType('device')">{{ $t('modal.deviceSettings') }}</span>
        </template>

        <stats v-if="modalType === 'stats'" />
        <login-form v-if="modalType === 'login'" />
        <device-ctrl v-if="modalType === 'device'" />
        <channel-settings v-if="modalType === 'channelSettings'" />
    </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import _ from 'lodash';
import { mapState, mapMutations, mapActions } from 'vuex';

import LoginForm from './LoginForm.vue';
import DeviceCtrl from './DeviceCtrl.vue';
import ChannelSettings from './ChannelSettings.vue';
import Stats from './Stats.vue';

export default defineComponent({
    name: 'ModalBox',

    components: {
        LoginForm,
        DeviceCtrl,
        ChannelSettings,
        Stats,
    },

    computed: {
        ...mapState(['modalVisible', 'modalType', 'modalParams']),
    },

    methods: {
        handleClose() {
            this.closeModal();
        },
        showStats() {
            const uiids = new Set<number>([5, 32, 126]);
            return this.modalType !== 'stats' && uiids.has(_.get(this, ['modalParams', 'uiid']));
        },
        showChannelSettings() {
            const uiids = new Set<number>([
                2, // 双通道插座
                3, // 三通道插座
                4, // 四通道插座
                7, // 双通道开关
                8, // 三通道开关
                77, // 单通道插座-多通道版
                112, // 单通道开关微波雷达版
                113, // 双通道开关微波雷达版
                114, // 三通道开关微波雷达版
            ]);
            return this.modalType !== 'channelSettings' && uiids.has(_.get(this, ['modalParams', 'uiid']));
        },
        showDeviceSettings() {
            return this.modalType === 'stats' || this.modalType === 'channelSettings';
        },
        ...mapMutations(['setModalType']),
        ...mapActions(['closeModal']),
    },
});
</script>

<style lang="stylus">
.modal-box
    .ant-modal-header
        border-bottom none
        .ant-modal-title
            text-indent 30px
            .more
                cursor pointer
                float right
                color #03A9F4
                font-size 14px
                transition all 0.5s
                &:hover
                    filter brightness(0.8)
    .ant-modal-content
        border-radius 4px
    button.ant-modal-close
        left 0
</style>
