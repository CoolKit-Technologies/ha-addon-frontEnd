<template>
    <div class="history">
        <a-spin :spinning="loading">
            <a-tabs type="line" class="tab-wrap" v-model:activeKey="activeKey">
                <a-tab-pane key="oneDay" :tab="$t('modal.day')">
                    <v-chart class="line-chart" :option="temOption" :auto-resize="true" />
                    <div class="date-select">
                        <LeftCircleOutlined v-if="hitDayStart" class="icon dead" />
                        <LeftCircleOutlined v-show="!hitDayStart" @click="() => changeDate('left')" class="icon active" />
                        <span class="date">{{ targetDay }}</span>
                        <RightCircleOutlined v-show="hitDayEnd" class="icon dead" />
                        <RightCircleOutlined v-show="!hitDayEnd" @click="() => changeDate('right')" class="icon active" />
                    </div>
                </a-tab-pane>
                <a-tab-pane key="oneMonth" :tab="$t('modal.mo')">
                    <v-chart class="line-chart" :option="temOption" :auto-resize="true" />
                    <div class="date-select">
                        <LeftCircleOutlined v-if="hitMonthStart" class="icon dead" />
                        <LeftCircleOutlined v-show="!hitMonthStart" @click="() => changeMonth('left')" class="icon active" />
                        <span class="date">{{ targetMonth }}</span>
                        <RightCircleOutlined v-show="hitMonthEnd" class="icon dead" />
                        <RightCircleOutlined v-show="!hitMonthEnd" @click="() => changeMonth('right')" class="icon active" />
                    </div>
                </a-tab-pane>
                <a-tab-pane key="halfYear" :tab="$t('modal.half_yr')">
                    <v-chart class="line-chart" :option="temOption" :auto-resize="true" />
                </a-tab-pane>
            </a-tabs>
            <div class="download" style="textAlign: right">
                <a @click="downloadExcel">{{ $t('modal.download') }}</a>
            </div>
        </a-spin>
    </div>
</template>

<script lang="ts" setup>
import VChart from 'vue-echarts';
import _ from 'lodash';
import moment from 'moment';
import { i18n } from '@/locales';
import { computed, onMounted, ref } from 'vue';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { use } from 'echarts/core';
import { getPowerHistory } from '@/api/device';
import { useStore } from 'vuex';
import export2xls from '@/utils/xlsx';

interface powerHistory {
    [propsName: string]: number[];
}

interface excelData {
    date: string;
    time: string;
    consumption: string;
}

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, TitleComponent, LegendComponent]);
const store = useStore();
const t = i18n.global.t;
const modalParams = computed(() => store.state.modalParams);

const loading = ref<boolean>(false);
const historyData = ref<powerHistory | null>(null);
const hitDayStart = ref<boolean>(false);
const hitMonthStart = ref<boolean>(false);
const hitDayEnd = ref<boolean>(false);
const hitMonthEnd = ref<boolean>(false);
const curDate = ref<string>(moment().format('YYYY/MM/DD'));
const curMonth = ref<string>(moment().format('YYYY/MM'));
const targetDay = computed(() => {
    curDate.value === moment().format('YYYY/MM/DD') && (hitDayEnd.value = true);
    // const locale = store.state.etcStore.locale;
    const locale = i18n.global.locale;
    return locale === 'zh' ? moment(curDate.value).format('M月D日') : moment(curDate.value).format('MMM Do');
});
const targetMonth = computed(() => {
    curMonth.value === moment().format('YYYY/MM') && (hitMonthEnd.value = true);
    // const locale = store.state.etcStore.locale;
    const locale = i18n.global.locale;
    return locale === 'zh' ? moment(curMonth.value).format('M月') : moment(curMonth.value).format('MMM');
});

const optionConfig = {
    oneDay: {
        interval: 5,
        legendData: [],
        xAxisName: ''
    },
    oneMonth: {
        interval: 4,
        legendData: [],
        xAxisName: ''
    },
    halfYear: {
        interval: 0,
        legendData: [],
        xAxisName: ''
    }
};
//折线图
const temOption = computed(() => {
    const option = {
        title: {
            text: `${t('modal.usage')}(${t('modal.kwh')})`,
            textStyle: {
                fontSize: 17,
                fontWeight: 500,
                color: '#424242'
            }
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
                padding: [0, 0, 0, 15] // 修改文字和图标距离
            }
        },
        xAxis: {
            type: 'category',
            data: xAxis.value,
            axisLabel: {
                interval: optionConfig[activeKey.value].interval,
                showMinLabel: true,
                showMaxLabel: true
            },
            axisTick: {
                show: false
            },
            name: optionConfig[activeKey.value].xAxisName
        },
        yAxis: {
            type: 'value',
            min: (value: any) => {
                return Math.floor(value.min);
            },
            max: (value: any) => {
                if (value.max < 0.1) {
                    return 0.1;
                }

                return value.max.toFixed(1);
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        series: [
            {
                name: t('modal.usage'),
                data: dataList.value,
                type: 'line',
                color: '#03B853',
                symbolSize: [0, 0]
            }
        ]
    };

    return option;
});

const activeKey = ref<'oneDay' | 'oneMonth' | 'halfYear'>('oneDay');

onMounted(() => {
    getTemHumHistory();
});

/** 初始化x轴 */
const xAxis = computed(() => {
    if (activeKey.value === 'oneDay') {
        return [
            '00:00',
            '01:00',
            '02:00',
            '03:00',
            '04:00',
            '05:00',
            '06:00',
            '07:00',
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '12:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00',
            '17:00',
            '18:00',
            '19:00',
            '20:00',
            '21:00',
            '22:00',
            '23:00'
        ];
    }

    if (activeKey.value === 'oneMonth') {
        return Array.from({
            length: moment(curMonth.value)
                .endOf('month')
                .date()
        }).map((arr, idx) => {
            return moment(curMonth.value)
                .startOf('month')
                .add(idx, 'day')
                .format('MM/DD');
        });
    }

    if (activeKey.value === 'halfYear') {
        return Array.from({ length: 6 }).map((arr, idx) => {
            return moment()
                .subtract(5, 'month')
                .add(idx, 'month')
                .format('YY/MM');
        });
    }
});

const dataList = computed(() => {
    let dataList: number[] = [];
    if (!historyData.value || _.isEmpty(historyData.value)) return [];
    if (activeKey.value === 'oneDay') {
        dataList = _.get(historyData.value, curDate.value);
    }

    if (activeKey.value === 'oneMonth') {
        // 获取整个月份的数据
        const curMonthKeys = Object.keys(historyData.value).filter(date => date.includes(moment(curMonth.value).format('YYYY/MM')));
        const result = curMonthKeys.map(date => {
            const hourStat = _.get(historyData.value, date);
            if (!hourStat) return [];
            return getSumByArray(hourStat);
        }) as number[];

        const curMonthLength = moment(curMonth.value)
            .endOf('month')
            .date();
        if (result.length !== curMonthLength) {
            const restLength = curMonthLength - result.length;
            dataList = _.concat(result.reverse(), Array.from({ length: restLength }).fill(0)) as number[];
        } else {
            dataList = result;
        }
    }

    if (activeKey.value === 'halfYear') {
        const monthPower: number[] = [];
        // 获取整个半年的月份
        const monthKeys = new Set(Object.keys(historyData.value).map(date => date.slice(0, date.lastIndexOf('/'))));
        monthKeys.forEach(key => {
            let curMonthPower = 0;
            for (const data in historyData.value!) {
                if (data.includes(key)) {
                    curMonthPower += getSumByArray(historyData.value[data]);
                }
            }
            monthPower.push(curMonthPower);
        });
        dataList = monthPower.reverse();
    }

    console.log('dataList----------', activeKey.value, dataList);
    return dataList;
});

const changeDate = (direction: 'left' | 'right') => {
    if (direction === 'left') {
        hitDayEnd.value = false;
        const changedDate = moment(curDate.value)
            .subtract(1, 'day')
            .format('YYYY/MM/DD');
        const sixMonthAgo = moment()
            .subtract(5, 'month')
            .startOf('month');

        moment(changedDate).isSame(sixMonthAgo) && (hitDayStart.value = true);

        curDate.value = changedDate;
    } else {
        hitDayStart.value = false;
        const changedDate = moment(curDate.value)
            .add(1, 'day')
            .format('YYYY/MM/DD');
        moment(changedDate).isSame(moment().format('YYYY/MM/DD')) && (hitDayEnd.value = true);
        curDate.value = changedDate;
    }
};

const changeMonth = (direction: 'left' | 'right') => {
    if (direction === 'left') {
        hitMonthEnd.value = false;
        const changeMonth = moment(curMonth.value)
            .subtract(1, 'month')
            .format('YYYY/MM');
        const sixMonthAgo = moment()
            .subtract(5, 'month')
            .format('YYYY/MM');

        changeMonth === sixMonthAgo && (hitMonthStart.value = true);

        curMonth.value = changeMonth;
    } else {
        hitMonthStart.value = false;
        const changeMonth = moment(curMonth.value)
            .add(1, 'month')
            .format('YYYY/MM');
        changeMonth === moment().format('YYYY/MM') && (hitMonthEnd.value = true);
        curMonth.value = changeMonth;
    }
};

const getTemHumHistory = async () => {
    loading.value = true;
    /** 一天间隔 */
    const DAY_POWER_RANGE = 24;
    /** 最小间隔 */
    const MIN_POWER_RANGE = 0;

    let start = MIN_POWER_RANGE;
    let end = MIN_POWER_RANGE;

    // 获取六个月的电量历史
    for (let i = 0; i < 6; i++) {
        if (i === 0) {
            const startPoint = moment()
                .startOf('hour')
                .format('x');
            const month = moment().format('YYYY/MM');
            /** 当前时间取整点 */
            /** 剩余天数 */
            const days = moment().date();
            /** 获取当天的小时数 */
            const curHour = moment().hour();
            /** 获取剩余天数的小时数 */
            const restHour = (days - 1) * DAY_POWER_RANGE;
            // 加起来作为参数请求
            end = curHour + restHour;
            const curPowerHistory = await getPowerHistory(modalParams.value, start, end);
            if (!curPowerHistory) {
                // message.error("获取历史电量有误");
                loading.value = false;
                return;
            }
            const data = chunkString(curPowerHistory, 3).map(str => getPowerConsumptionByStr(str));

            for (let j = 0; j < days; j++) {
                const date = oneDigitToDouble(days - j);
                // 第一天
                if (j === 0) {
                    const startTime = moment()
                        .startOf('day')
                        .format('x');
                    const endTime = startPoint;
                    const dayData = getPowerConsumptionData(data, startTime, endTime, startPoint);
                    historyData.value = {
                        [`${month}/${date}`]: dayData
                    };
                } else {
                    const startTime = moment()
                        .subtract(j, 'day')
                        .startOf('day')
                        .format('x');
                    const endTime = moment(parseInt(startTime))
                        .endOf('day')
                        .startOf('hour')
                        .format('x');
                    const dayData = getPowerConsumptionData(data, startTime, endTime, startPoint);
                    _.assign(historyData.value, {
                        [`${month}/${date}`]: dayData
                    });
                }
            }
        } else {
            // 取前一个月的天数
            const cruMonth = moment().subtract(i, 'month');
            const startPoint = moment(cruMonth)
                .endOf('month')
                .hour(23)
                .startOf('hour')
                .format('x');
            const month = moment(cruMonth).format('YYYY/MM');
            const days = moment(cruMonth)
                .endOf('month')
                .date();
            start = end;
            // 获取当月天数
            end = end + days * DAY_POWER_RANGE - 1;
            const curPowerHistory = await getPowerHistory(modalParams.value, start, end);
            if (!curPowerHistory) {
                // message.error("获取历史电量有误");
                loading.value = false;
                return;
            }
            const data = chunkString(curPowerHistory, 3).map(str => getPowerConsumptionByStr(str));

            for (let j = 0; j < days; j++) {
                const startTime = moment(cruMonth)
                    .endOf('month')
                    .subtract(j, 'day')
                    .startOf('day')
                    .format('x');
                const endTime = moment(parseInt(startTime))
                    .endOf('day')
                    .startOf('hour')
                    .format('x');
                const dayData = getPowerConsumptionData(data, startTime, endTime, startPoint);
                const date = oneDigitToDouble(days - j);
                _.assign(historyData.value, {
                    [`${month}/${date}`]: dayData
                });
            }
        }
    }

    loading.value = false;
};

/** 将字符串 str 按 width 宽度分组 */
const chunkString = (str: string, width: number) => {
    const len = str.length;
    const result: string[] = [];
    let start = 0;
    let end = start + width;

    while (end <= len) {
        result.push(str.slice(start, end));
        start += width;
        end += width;
    }

    return result;
};

/** 根据3位字符获取功耗值 */
const getPowerConsumptionByStr = (str: string) => {
    const intVal = parseInt(`0x${str.slice(0, 1)}`);
    return parseFloat(`${intVal}.${str.slice(1)}`);
};

const getPowerConsumptionData = (data: number[], startTime: string, endTime: string, startPoint: string): number[] => {
    let i = 0;
    const result = Array.from({ length: 24 }).fill(0) as number[];

    const st = parseInt(startTime);
    const et = parseInt(endTime);

    const hours = (et - st) / 3600000;
    let j = (parseInt(startPoint) - et) / 3600000;
    for (i = hours; i > 0; i--) {
        result[i] = data[j];
        j++;
    }

    return result;
};

/** 将单位数转换成两位数 */
const oneDigitToDouble = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
};

const getSumByArray = (arr: number[]): number => arr.reduce((pre, cur) => pre + cur, 0);

const downloadExcel = () => {
    let data: excelData[] = [];

    for (const date in historyData.value) {
        const dayPower = historyData.value[date];
        const curDayPower = dayPower.map((power, idx) => {
            const startTime = idx >= 10 ? `${idx}:00` : `0${idx}:00`;
            const endTime = idx + 1 >= 10 ? `${idx + 1}:00` : `0${idx + 1}:00`;
            return {
                date,
                time: `${startTime}-${endTime}`,
                consumption: `${power}`
            };
        });
        data = [...data, ...curDayPower];
    }

    console.log(`SL : 准备加入excel的文件 data`, data);

    const header = {
        date: t('modal.date'),
        time: t('modal.time'),
        consumption: t('modal.usage') + '/' + t('modal.kwh')
    };

    const filename = t('modal.history');

    export2xls({ data, header, filename });
};
</script>

<style lang="stylus" scoped>
.history {
    .tab-wrap {
        :deep(.ant-tabs-tab) {
            text-align: center;
            margin: 0 !important;
        }

        :deep(.ant-tabs-tab:first-child) {
            margin-right: 112px !important;
        }

        :deep(.ant-tabs-tab:last-child) {
            margin-left: 112px !important;
        }

        .date-select {
            text-align: center;
            margin-bottom: 20px;

            .icon {
                font-size: 20px;
                cursor: pointer;
            }

            .active {
                color: #369cff;
            }

            .dead {
                color: #e1e1e1;
            }

            .date {
                font-size: 18px;
                padding: 0 10px;
            }
        }
    }

    .line-chart {
        width: 100%;
        height: 386px;
    }
}
</style>
