<template>
    <div class="history">
        <a-spin :spinning="loading">
            <a-tabs type="line" class="tab-wrap" v-model:activeKey="activeKey">
                <a-tab-pane :key="tab.key" :tab="$t(tab.name)" v-for="tab in tabList">
                    <v-chart class="line-chart" :option="temOption" v-if="activeKey === tab.key" />
                    <v-chart class="line-chart" :option="humOption" v-if="activeKey === tab.key" />
                </a-tab-pane>
            </a-tabs>
        </a-spin>

        <div class="download">
            <a-button type="link" @click="download">
                {{ $t('modal.download') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import VChart from 'vue-echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { getDeviceTempHumHistory as getTempHumHistory } from '@/api/device';
import { useStore } from 'vuex';
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);
import { generateTimeList } from '@/utils/time';
import export2xlsx from '@/utils/xlsx';
import { i18n } from '@/locales';
import _ from 'lodash';

import moment from 'moment';
export default defineComponent({
    name: 'LineChartHistory',
    components: {
        VChart,
    },
    setup() {
        const store = useStore();
        const modalParams = computed(() => store.state.modalParams);
        const t = i18n.global.t;

        const tabList = [
            { key: 'oneDay', name: 'modal.day' },
            { key: 'oneMonth', name: 'modal.mo' },
            { key: 'halfYear', name: 'modal.half_yr' },
        ];
        const optionConfig = {
            oneDay: {
                interval: 5,
                legendData: [],
                xAxisName: '',
            },
            oneMonth: {
                interval: 4,
                legendData: [`${t('modal.highest')}`, `${t('modal.lowest')}`],
                xAxisName: t('modal.mo_day'),
            },
            halfYear: {
                interval: 0,
                legendData: [`${t('modal.highest')}`, `${t('modal.lowest')}`],
                xAxisName: t('modal.yr_mo'),
            },
        };
        //折线图
        const temOption = computed(() => {
            const option = {
                title: {
                    text: `${t('modal.temp')}(${isTemUnitF.value ? '°F' : '℃'})`,
                    textStyle: {
                        fontSize: 17,
                        fontWeight: 500,
                        color: '#424242',
                    },
                },
                legend: {
                    data: optionConfig[activeKey.value].legendData,
                    left: 'right',
                    icon: 'rect',
                    itemWidth: 24,
                    itemHeight: 4,
                    itemGap: 42, // 修改间距
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#999999',
                        padding: [0, 0, 0, 15], // 修改文字和图标距离
                    },
                },
                xAxis: {
                    type: 'category',
                    data: xAxis.value,
                    axisLabel: {
                        interval: optionConfig[activeKey.value].interval,
                        showMinLabel: true,
                        showMaxLabel: true,
                    },
                    axisTick: {
                        show: false,
                    },
                    // name: optionConfig[activeKey.value].xAxisName,
                },
                grid: {
                    left: 20,
                    right: 20,
                    bottom: '3%',
                    containLabel: true,
                },
                yAxis: {
                    type: 'value',
                    min: (value: any) => Math.floor(value.min),
                    max: (value: any) => Math.ceil(value.max),
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (arg: any) => {
                        const unit = isTemUnitF.value ? '°F' : '℃';

                        if (activeKey.value === 'oneDay') {
                            return [`${t('modal.time')}：${arg[0].name}`, `${t('modal.temp')}：${arg[0].value ?? '--'}${unit}`].join('\n');
                        } else {
                            return [
                                `${t('modal.time')}：${arg[0].name}`,
                                `${t('modal.highest')}：${arg[0].value ?? '--'}${unit}`,
                                `${t('modal.lowest')}：${arg[1].value ?? '--'}${unit}`,
                            ].join('\n');
                        }
                    },
                    extraCssText: 'width:140px; white-space:pre-wrap',
                },
                series: [
                    {
                        name: `${t('modal.highest')}`,
                        data: temDataObj.value.maxList,
                        type: 'line',
                        color: '#E25A08',
                        symbolSize: [1, 1],
                    },
                    {
                        name: `${t('modal.lowest')}`,
                        data: temDataObj.value.minList,
                        type: 'line',
                        color: '#F0971E',
                        symbolSize: [1, 1],
                    },
                ],
            };

            if (activeKey.value === 'oneDay') {
                option.series = [
                    {
                        name: `${t('modal.temp')}(${isTemUnitF.value ? '°F' : '℃'})`,
                        data: temDataObj.value.dayList,
                        type: 'line',
                        color: '#F0971E',
                        symbolSize: [0, 0],
                    },
                ];
            }

            return option;
        });

        const humOption = computed(() => {
            const option = {
                title: {
                    text: `${t('modal.hum')}(%RH)`,
                    textStyle: {
                        fontSize: 17,
                        fontWeight: 500,
                        color: '#424242',
                    },
                },
                legend: {
                    data: optionConfig[activeKey.value].legendData,
                    left: 'right',
                    icon: 'rect',
                    itemWidth: 24,
                    itemHeight: 4,
                    itemGap: 42, // 修改间距
                    textStyle: {
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#999999',
                        padding: [0, 0, 0, 15], // 修改文字和图标距离
                    },
                },
                xAxis: {
                    type: 'category',
                    data: xAxis.value,
                    axisLabel: {
                        interval: optionConfig[activeKey.value].interval,
                        showMinLabel: true,
                        showMaxLabel: true,
                    },
                    axisTick: {
                        show: false,
                    },
                    // name: optionConfig[activeKey.value].xAxisName,
                },
                grid: {
                    left: 20,
                    right: 20,
                    bottom: '3%',
                    containLabel: true
                },
                yAxis: {
                    type: 'value',
                    min: (value: any) => Math.floor(value.min),
                    max: (value: any) => Math.ceil(value.max),
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: (arg: any) => {


                        if (activeKey.value === 'oneDay') {
                            return [`${t('modal.time')}：${arg[0].name}`, `${t('modal.hum')}：${arg[0].value ?? '--'}%`].join('\n');
                        } else {
                            return [
                                `${t('modal.time')}：${arg[0].name}`,
                                `${t('modal.highest')}：${arg[0].value ?? '--'}%`,
                                `${t('modal.lowest')}：${arg[1].value ?? '--'}%`,
                            ].join('\n');
                        }
                    },
                    extraCssText: 'width:140px; white-space:pre-wrap',
                },
                series: [
                    {
                        name: `${t('modal.highest')}`,
                        data: humDataObj.value.maxList,
                        type: 'line',
                        color: '#2DADFE',
                        symbolSize: [1, 1],
                    },
                    {
                        name: `${t('modal.lowest')}`,
                        data: humDataObj.value.minList,
                        type: 'line',
                        color: '#A1CCFB',
                        symbolSize: [1, 1],
                    },
                ],
            };
            if (activeKey.value === 'oneDay') {
                option.series = [
                    {
                        name: `${t('modal.hum')}(%RH)`,
                        data: humDataObj.value.dayList,
                        type: 'line',
                        color: '#A1CCFB',
                        symbolSize: [0, 0],
                    },
                ];
            }
            return option;
        });

        const activeKey = ref<'oneDay' | 'oneMonth' | 'halfYear'>('oneDay');

        onMounted(() => {
            getTemHumHistory();
        });

        const xAxis = computed(() => {
            return generateTimeList(activeKey.value);
        });

        const isTemUnitF = computed(() => modalParams.value.params.tempUnit === 1);

        const temDataObj = computed(() => {
            let dayList: number[] = [];
            let minList: number[] = [];
            let maxList: number[] = [];
            const historyData = _.cloneDeep(historyDataOrigin.value);
            if (!historyData.tempHistory)
                return {
                    dayList,
                    minList,
                    maxList,
                };
            if (activeKey.value === 'oneDay') {
                dayList = historyData.tempHistory?.hourly.reverse();
                dayList = [...new Array(xAxis.value.length - dayList.length).fill(null), ...dayList];
            }

            if (activeKey.value === 'oneMonth') {
                maxList = historyData.tempHistory?.daily.map((item) => item?.max ?? null).reverse();
                minList = historyData.tempHistory?.daily.map((item) => item?.min ?? null).reverse();
            }

            if (activeKey.value === 'halfYear') {
                maxList = historyData.tempHistory?.monthly.map((item) => item?.max ?? null).reverse();
                minList = historyData.tempHistory?.monthly.map((item) => item?.min ?? null).reverse();
            }
            //转化为华氏度
            if (isTemUnitF.value) {
                dayList = dayList.map((item: number) => Number((1.8 * item + 32).toFixed(1)));
                maxList = maxList.map((item: number) => Number((1.8 * item + 32).toFixed(1)));
                minList = minList.map((item: number) => Number((1.8 * item + 32).toFixed(1)));
            }

            //填充没有的数据
            maxList = [...new Array(xAxis.value.length - maxList.length).fill(null), ...maxList];
            minList = [...new Array(xAxis.value.length - minList.length).fill(null), ...minList];
            return {
                dayList,
                minList,
                maxList,
            };
        });

        const humDataObj = computed(() => {
            let dayList: number[] = [];
            let minList: number[] = [];
            let maxList: number[] = [];
            const historyData = _.cloneDeep(historyDataOrigin.value);
            if (!historyData.humHistory)
                return {
                    dayList,
                    minList,
                    maxList,
                };
            if (activeKey.value === 'oneDay') {
                dayList = historyData.humHistory?.hourly.reverse();
                dayList = [...new Array(xAxis.value.length - dayList.length).fill(null), ...dayList];
            }

            if (activeKey.value === 'oneMonth') {
                maxList = historyData.humHistory?.daily.map((item) => item?.max ?? null).reverse();
                minList = historyData.humHistory?.daily.map((item) => item?.min ?? null).reverse();
            }

            if (activeKey.value === 'halfYear') {
                maxList = historyData.humHistory?.monthly.map((item) => item?.max ?? null).reverse();
                minList = historyData.humHistory?.monthly.map((item) => item?.min ?? null).reverse();
            }

            //填充没有的数据
            maxList = [...new Array(xAxis.value.length - maxList.length).fill(null), ...maxList];
            minList = [...new Array(xAxis.value.length - minList.length).fill(null), ...minList];

            return {
                dayList,
                minList,
                maxList,
            };
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
        const loading = ref(false);
        const historyDataOrigin = ref<ITemHumData>({});
        const getTemHumHistory = async () => {
            loading.value = true;
            const { deviceId } = modalParams.value;
            const params = {
                deviceid: deviceId,
            };
            const res = await getTempHumHistory(params);
            if (res && res.data) {
                historyDataOrigin.value = res.data;
            }

            loading.value = false;
        };

        const download = async () => {
            const { deviceId } = modalParams.value;
            const params = {
                deviceid: deviceId,
                format: 'origin',
            };
            const res = await getTempHumHistory(params);
            if (!res || !res.data) return;
            const tableData = res.data.originalTempHumHistory.reverse();
            //时区转换
            const data = tableData.map((item: any) => {
                const hour = item.time.split(':')[0];
                const time = hour.padStart(2, '0') + ':00:00';
                //化成utc格式
                const timeStr = item.date.replace(/\//g, '-') + 'T' + time;

                const timeZone = _.get(modalParams.value.params, 'timeZone');

                const dateTime = moment.utc(timeStr);

                item.date = dateTime.utcOffset(timeZone).format('YYYY/MM/DD');
                item.time = dateTime.utcOffset(timeZone).format('HH:00');
                return item;
            });

            const header = {
                date: t('modal.date'),
                time: t('modal.time'),
                temperature: t('card.temperature') + '/' + (isTemUnitF.value ? '°F' : '℃'),
                humidity: t('card.humidity') + '/%RH',
            };

            const filename = t('modal.history');

            export2xlsx({ data, header, filename });
        };

        return {
            activeKey,
            temOption,
            humOption,
            download,
            tabList,
            loading,
        };
    },
});
</script>

<style lang="stylus" scoped>
.history {
    .tab-wrap {
        :deep(.ant-tabs-tab) {
            width: 109px !important;
            text-align: center;
            margin: 0 !important;
        }

        .ant-tabs-tab:first-child {
            margin-right: 112px !important;
        }

        .ant-tabs-tab:last-child {
            margin-left: 112px !important;
        }
    }

    .line-chart {
        width: 100%;
        height: 386px;
    }
    .download {
        display: flex;
        justify-content: flex-end;
    }
}
</style>
