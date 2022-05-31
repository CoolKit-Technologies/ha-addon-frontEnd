<template>
    <!-- UIID 181 图表 -->
    <div class="line-chart-wrap">
        <v-chart class="line-chart" :option="option" :auto-resize="true" ref="lineChartRef" />
        <div class="history" @click.stop="() => goToHistory()">
            <span> {{ $t('modal.history') }}</span>
            <RightOutlined class="icon-arrow" />
        </div>
    </div>
    <div class="wrap">
        <div>
            <div class="value avalible-font">{{ currentTemperature === 'unavailable' ? '--' : currentTemperature }}{{ tempUnit }}</div>
            <div class="label avalible-font">{{ $t('modal.curTemp') }}</div>
        </div>
        <div class="middle-line"></div>
        <div>
            <div class="value avalible-font">{{ currentHumidity === 'unavailable' ? '--' : currentHumidity }}%RH</div>
            <div class="label avalible-font">{{ $t('modal.curHumd') }}</div>
        </div>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, ref, onBeforeUnmount } from 'vue';
import _ from 'lodash';
import { useStore } from 'vuex';
import VChart from 'vue-echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { RightOutlined } from '@ant-design/icons-vue';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import 'echarts/lib/component/markPoint';
import { use } from 'echarts/core';
import { getDeviceTempHumHistory as getTempHumHistory } from '@/api/device';
import { generateTimeList } from '@/utils/time';
import { i18n } from '@/locales';

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);

export default defineComponent({
    components: {
        VChart,
        RightOutlined
    },
    props: {
        cardData: {
            required: true
        }
    },
    setup(props) {
        const store = useStore();
        const goToHistory = () => {
            store.dispatch('openModal', {
                type: 'uiid181-history',
                params: props.cardData
            });
        };
        //折线图
        const option = computed(() => {
            return {
                legend: {
                    data: [`${i18n.global.t('card.temperature')}(${tempUnit.value})`, `${i18n.global.t('card.humidity')}(%RH)`],
                    left: 'left',
                    icon: 'rect',
                    itemWidth: 24,
                    itemHeight: 4,
                    itemGap: 22, // 修改间距
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#999999',
                        padding: [0, 0, 0, 7], // 修改文字和图标距离
                    },
                    selectedMode: false,
                },
                xAxis: {
                    type: 'category',
                    data: xAxis,
                    //横轴刻度
                    axisTick: {
                        show: false,
                    },
                    axisLabel: {
                        interval: 5,
                        showMinLabel: true,
                        showMaxLabel: true,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#C9C8C8',
                        },
                    },
                },
                yAxis: {
                    type: 'value',
                    min: (value: any) => Math.floor(value.min),
                    max: (value: any) => Math.ceil(value.max),
                    splitLine: {
                        lineStyle: {
                            color: '#E1E1E1',
                        },
                    },
                    axisLine: {
                        show: false,
                    },
                    axisLabel: {
                        show: false,
                    },
                },
                tooltip: {
                    trigger: 'axis',
                },
                series: [
                    {
                        name: `${i18n.global.t('card.temperature')}(${tempUnit.value})`,
                        data: temDataList.value,
                        type: 'line',
                        color: '#F0971E',
                        symbolSize: [0, 0],
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 8, // 容器大小
                            data: [
                                { type: 'max', name: 'Max' },
                                { type: 'min', name: 'Min' },
                            ],
                            label: {
                                position: 'insideTop',
                                offset: [0, -20],
                                textStyle: {
                                    color: '#F0971E',
                                    fontSize: 17,
                                },
                                formatter: (arg: any) => arg.value + tempUnit.value,
                            },
                            itemStyle: {
                                borderWidth: 8,
                                borderColor: 'rgba(240, 151, 30, 0.2)',
                            },
                        },
                    },
                    {
                        name: `${i18n.global.t('card.humidity')}(%RH)`,
                        data: humDataList.value,
                        type: 'line',
                        color: '#77B7FF',
                        symbolSize: [0, 0],
                        markPoint: {
                            symbol: 'circle',
                            symbolSize: 8, // 容器大小
                            data: [
                                { type: 'max', name: 'Max' },
                                { type: 'min', name: 'Min' },
                            ],
                            label: {
                                offset: [0, -20],
                                textStyle: {
                                    color: '#77B7FF',
                                    fontSize: 17,
                                },
                                formatter: (v: any) => v.value + '%',
                            },
                            itemStyle: {
                                borderWidth: 8,
                                borderColor: 'rgba(119, 183, 255, 0.2)',
                            },
                        },
                    },
                ],
                grid: {
                    left: 20,
                    right: 20,
                    bottom: '3%',
                    containLabel: true,
                },
            };
        });
        const lineChartRef = ref();

        const lineChartResize = () => {
            lineChartRef.value.resize();
        };
        onMounted(() => {
            window.addEventListener('resize', lineChartResize);
            getTemHumHistory();
        });

        onBeforeUnmount(() => {
            window.removeEventListener('resize', lineChartResize);
        });
        interface ITemHumData {
            tempHistory?: {
                hourly: number[];
                daily: { min: number; max: number }[];
                monthly: { min: number; max: number }[];
            };
            humHistory?: {
                hourly: number[];
                daily: { min: number; max: number }[];
                monthly: { min: number; max: number }[];
            };
        }
        let temHumData = ref<ITemHumData | null>(null);

        const getTemHumHistory = async () => {
            const { deviceId } = props.cardData as any;
            const params = {
                deviceid: deviceId,
            };
            const res = await getTempHumHistory(params);
            if (res && res.data) {
                temHumData.value = res.data as ITemHumData;
                if (temHumData.value.tempHistory) {
                    temHumData.value.tempHistory.hourly = temHumData.value.tempHistory.hourly.reverse()
                }

                if (temHumData.value.humHistory) {
                    temHumData.value.humHistory.hourly = temHumData.value.humHistory.hourly.reverse()
                }
            }
        };

        const xAxis = generateTimeList('oneDay');
        const temDataList = computed(() => {
            if (!temHumData.value) return [];

            let valueArr = temHumData.value.tempHistory?.hourly;
            //温度值转化
            if (tempUnit.value === '°F' && valueArr) {
                valueArr = valueArr.map((item) => Number((1.8 * item + 32).toFixed(1)));
            }

            return valueArr;
        });
        const humDataList = computed(() => {
            if (temHumData.value) {
                const valueArr = temHumData.value.humHistory?.hourly;
                return valueArr;
            }
            return [];
        });

        //底部
        const tempUnit = computed(() => ((props.cardData as any).params.tempUnit === 0 ? '℃' : '°F'));

        const currentTemperature = computed(() => {
            let temperature = (props.cardData as any).params.currentTemperature;

            if (tempUnit.value === '°F' && temperature !== 'unavailable') {
                temperature = (1.8 * temperature + 32).toFixed(1);
            }
            return temperature;
        });
        const currentHumidity = computed(() => (props.cardData as any).params.currentHumidity);

        return {
            option,
            tempUnit,
            currentTemperature,
            currentHumidity,
            lineChartRef,
            goToHistory,
        };
    },
});
</script>
<style lang="stylus" scoped>
.history {
    position: absolute;
    right: 0;
    top: -1px;
    font-size: 15px;
    font-weight: 500;
    color: #2dadfe;
    z-index: 0;

    .icon-arrow {
        margin-left: 4px;
        font-size: 12px;
    }
}

.line-chart-wrap {
    display: flex;
    justify-content: center;
    position: relative;

    .line-chart {
        width: 100%;
        height: 400px;
    }
}

.wrap {
    display: flex;
    justify-content: center;
    align-items: center;

    .middle-line {
        width: 1px;
        height: 43px;
        background: #e9e9e9;
        margin: 0 25px;
    }

    .value {
        font-size: 23px;
        font-weight: bold;
        color: #090909;
        text-align: center;
    }

    .label {
        font-size: 14px;
        font-weight: 500;
        color: #8c8c8c;
        text-align: center;
    }
}
</style>
