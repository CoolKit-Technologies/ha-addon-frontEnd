<template>
    <v-chart class="chart" :option="option" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { GaugeChart } from 'echarts/charts';
import VChart from 'vue-echarts';
import _ from 'lodash';

import { tempC2F, fmtNum } from '@/utils/etc';

use([
    CanvasRenderer,
    GaugeChart
]);

export default defineComponent({
    name: 'GaugeChart',

    components: {
        VChart
    },

    props: {
        value: {
            required: true,
            default: 0
        },
        // type: humi - humidity
        // type: temp - temperature
        type: {
            required: true,
            default: 'humi'
        },
        // tempUnit: c - °C
        // tempUnit: f - °F
        tempUnit: {
            default: 'c'
        }
    },

    computed: {
        option() {
            const { type, value, tempUnit, $t } = this as any;
            const min = type === 'humi' ? 0 : 0;
            const max = type === 'humi' ? 100 : 40;
            const color = type === 'humi' ? '#52C41A' : '#1890FF';
            const name = type === 'humi' ? $t('card.humidity') : $t('card.temperature');
            const splitNumber = type === 'humi' ? 4 : 6;

            return {
                series: [{
                    type: 'gauge',
                    min,
                    max,
                    progress: {
                        show: true,
                        width: 8,
                        itemStyle: {
                            color
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            width: 8
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        distance: 13,
                        color: '#000000',
                        fontSize: 12,
                        formatter: (v: number) => {
                            const val = parseInt(v.toString());

                            if (type === 'humi') {
                                if (val === 25) {
                                    return $t('card.dry');
                                } else if (val === 75) {
                                    return $t('card.wet');
                                }
                            } else if (type === 'temp') {
                                if (val === 6) {
                                    return $t('card.cold');
                                } else if (val === 13) {
                                    return $t('card.cool');
                                } else if (val === 26) {
                                    return $t('card.warm');
                                } else if (val === 33) {
                                    return $t('card.hot');
                                }
                            }
                        }
                    },
                    splitLine: {
                        length: 5,
                        lineStyle: {
                            width: 2,
                            color
                        }
                    },
                    splitNumber,
                    anchor: {
                        show: true,
                        showAbove: false,
                        size: 6,
                        icon: 'circle',
                        itemStyle: {
                            borderWidth: 4,
                            number: 0,
                            color,
                            borderColor: color
                        }
                    },
                    pointer: {
                        length: '55%',
                        width: 3,
                        itemStyle: {
                            color
                        }
                    },
                    title: {
                        show: true,
                        fontSize: 12,
                        offsetCenter: [0, '55%']
                    },
                    detail: {
                        valueAnimation: true,
                        fontSize: 20,
                        offsetCenter: [0, '90%'],
                        formatter: (v: number) => {
                            if (type === 'humi') {
                                return fmtNum(v, 2) + '%';
                            } else if (type === 'temp' && tempUnit === 'c') {
                                return fmtNum(v, 2) + '°C';
                            } else if (type === 'temp' && tempUnit === 'f') {
                                return fmtNum(tempC2F(v), 2) + '°F';
                            }
                        }
                    },
                    data: [{
                        value,
                        name
                    }]
                }]
            };
        }
    }
});
</script>

<style lang="stylus" scoped>
.chart
    height 220px
    width 220px
</style>

