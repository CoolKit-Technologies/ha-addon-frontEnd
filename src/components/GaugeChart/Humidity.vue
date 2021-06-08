<template>
    <gauge-chart type="humi" :value="value" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GaugeChart from './index.vue';

export default defineComponent({
    name: 'HumidityGauge',

    components: {
        GaugeChart
    },

    props: {
        value: {
            required: true,
            default: 0
        }
    }
});
</script>
