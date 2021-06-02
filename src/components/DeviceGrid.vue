<template>
    <div class="device-grid">
        <device-card />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import DeviceCard from '@/components/DeviceCard/index.vue';

export default defineComponent({
    name: 'DeviceGrid',

    components: {
        DeviceCard
    }
});
</script>
