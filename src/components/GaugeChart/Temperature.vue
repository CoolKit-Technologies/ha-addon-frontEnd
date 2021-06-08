<template>
    <gauge-chart type="temp" :value="value" :tempUnit="tempUnit" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import GaugeChart from './index.vue';

export default defineComponent({
    name: 'TemperatureGauge',

    components: {
        GaugeChart
    },

    props: {
        value: {
            required: true,
            default: 0
        },
        tempUnit: {
            required: true,
            default: 'c'
        }
    }
});
</script>
