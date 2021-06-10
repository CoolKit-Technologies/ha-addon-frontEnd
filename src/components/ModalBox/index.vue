<template>
    <a-modal
        :visible="modalVisible"
        :footer="null"
        :destroyOnClose="true"
        :maskClosable="false"
        :title="modalType === 'device' ? modalParams.deviceName : ' '"
        @cancel="handleClose"
        class="modal-box"
    >
        <login-form v-if="modalType === 'login'" />
        <device-ctrl v-if="modalType === 'device'" />
    </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapActions } from 'vuex';

import LoginForm from './LoginForm.vue';
import DeviceCtrl from './DeviceCtrl.vue';

export default defineComponent({
    name: 'ModalBox',

    components: {
        LoginForm,
        DeviceCtrl
    },

    computed: {
        ...mapState(['modalVisible', 'modalType', 'modalParams'])
    },

    methods: {
        handleClose() {
            this.closeModal();
        },
        ...mapActions(['closeModal'])
    }
});
</script>

<style lang="stylus">
.modal-box
    .ant-modal-header
        border-bottom none
        .ant-modal-title
            text-indent 30px
    .ant-modal-content
        border-radius 4px
    button.ant-modal-close
        left 0
</style>