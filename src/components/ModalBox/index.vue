<template>
    <a-modal
        :visible="modalVisible"
        :footer="null"
        :destroyOnClose="true"
        :maskClosable="false"
        @cancel="handleClose"
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
        ...mapState(['modalVisible', 'modalType'])
    },

    methods: {
        handleClose() {
            this.closeModal();
        },
        ...mapActions(['closeModal'])
    }
});
</script>
