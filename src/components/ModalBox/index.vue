<template>
    <a-modal :visible="modalVisible" :footer="null" :destroyOnClose="true" :maskClosable="false" @cancel="handleClose" class="modal-box">
        <!-- modal title -->
        <template #title v-if="modalType && modalType !== 'login'">
            <span class="title">{{ modalParams && modalParams.deviceName }}</span>
            <span class="more" v-if="modalType !== 'device'" @click.stop="() => setModalType('device')">
                {{ $t('modal.deviceSettings') }}
            </span>
            <span class="more" v-else-if="showChannelSettings()" @click.stop="() => setModalType('channelSettings')">
                {{ $t('modal.channelSettings') }}
            </span>
            <span class="more" v-else-if="showStats()" @click.stop="() => setModalType('stats')">
                {{ $t('modal.stats') }}
            </span>
        </template>

        <!-- modal content -->
        <login-form v-if="modalType === 'login'" />
        <device-ctrl v-else-if="modalType === 'device'" />
        <channel-settings v-else-if="modalType === 'channelSettings'" />
        <stats v-else-if="modalType === 'stats'" />
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
import { isMultiChannelDevice, hasStatDevice } from '@/utils/etc';

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
            return this.modalType !== 'stats' && hasStatDevice(this.modalParams.uiid);
        },
        showChannelSettings() {
            return this.modalType !== 'channelSettings' && isMultiChannelDevice(this.modalParams.uiid);
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
            .title
                font-size 18px
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
    button
        width 56px
    button.ant-modal-close
        left 0
</style>
