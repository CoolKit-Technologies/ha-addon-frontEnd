<template>
    <div class="device-ctrl">
        <p>you should see a button here</p>
        <p>{{ modalParams.cardId }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';

export default defineComponent({
    name: 'DeviceCtrl',

    computed: {
        ...mapState(['modalParams'])
    }
});
</script>
