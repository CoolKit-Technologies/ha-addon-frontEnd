<template>
    <div class="device-ctrl">
        <p>you should see a button here</p>
        <p>{{ modalParams.cardId }}</p>
        <device-name />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import DeviceName from '@/components/CtrlItem/DeviceName.vue';
export default defineComponent({
    name: 'DeviceCtrl',

    components:{
        DeviceName
    },

    computed: {
        ...mapState(['modalParams'])
    }
});
</script>
