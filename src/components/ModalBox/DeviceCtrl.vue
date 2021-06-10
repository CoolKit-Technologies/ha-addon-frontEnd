<template>
    <div class="device-ctrl">
        <p>you should see a button here</p>
        <p>{{ modalParams.cardId }}</p>
        <device-name :cardData="modalParams" />
        <inching-mode :cardData="modalParams" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

import DeviceName from '@/components/CtrlItem/DeviceName.vue';
import InchingMode from '@/components/CtrlItem/InchingMode.vue'
export default defineComponent({
    name: 'DeviceCtrl',

    components:{
        DeviceName,
        InchingMode
    },

    computed: {
        ...mapState(['modalParams'])
    }
});
</script>
