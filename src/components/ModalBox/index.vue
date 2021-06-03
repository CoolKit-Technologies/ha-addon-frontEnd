<template>
    <a-modal :visible="modalVisible">
        <login-form />
        <template #footer>
        </template>
    </a-modal>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';

import LoginForm from './LoginForm.vue';

export default defineComponent({
    name: 'ModalBox',

    components: {
        LoginForm
    },

    computed: {
        ...mapState(['modalVisible'])
    },

    methods: {
        handleClick() {
            this.setModalVisible(false);
        },
        ...mapMutations(['setModalVisible'])
    }
});
</script>
