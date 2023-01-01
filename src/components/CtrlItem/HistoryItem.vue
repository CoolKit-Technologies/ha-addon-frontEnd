<template>
    <div class="history-item">
        <div class="month-item">
            <a-config-provider :locale="antdLocale">
                <a-month-picker
                    :value="currentDate"
                    @change="(value: any) => selectMonth(value)"
                    :disabled-date="(current: any) => disabledDate(current)"
                ></a-month-picker>
            </a-config-provider>
        </div>
        <a-divider class="divider" />
        <div class="description-item">
            <div>
                <a-statistic :title="$t('modal.consumed')" :value="total" suffix="KWh" />
            </div>
        </div>
        <div class="line-item">
            <v-chart class="chart" :option="option" />
        </div>
        <div class="download">
            <a-button type="link" @click="download">
                {{ $t('modal.download') }}
            </a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import moment, { Moment } from "moment";
import _ from "lodash";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import VChart from "vue-echarts";
import { getHistoryData } from "@/api/device";
import { mapState } from "vuex";
import * as XLSX from "xlsx";

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

const numberToMonth = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'Jun',
    7: 'Jul',
    8: 'Aug',
    9: 'Sep',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
};
const monthMap = new Map();
Array(12)
    .fill(null)
    .forEach((item, index) => {
        monthMap.set(index + 1, {
            monthNum: index < 9 ? `0${index + 1}` : `${index + 1}`,
            monthStr: _.get(numberToMonth, index + 1)
        });
    });

export default defineComponent({
    name: "HistoryItem",

    props: {
        channelIndex: {
            type: Number,
            default: 0
        }
    },

    components: {
        VChart,
    },

    data() {
        return {
            total: 0,
            month: moment().format('YYYY-MM'),
            avaliableMonth: [] as string[],
            historyData: "",
            currentDate: moment()
        };
    },

    computed: {
        ...mapState(["modalParams", 'antdLocale']),
        option() {
            const { calculateHistoryData, month } = this as any;
            const data = calculateHistoryData(month, true);
            return {
                xAxis: {
                    type: "category",
                    name: "day",
                    data: data.map((item: any) => item.day),
                },
                yAxis: {
                    type: "value",
                },
                tooltip: {
                    show: true,
                    trigger: "item",
                },
                series: [
                    {
                        data: data,
                        type: "line",
                    },
                ],
            };
        },
    },

    async created() {
        this.historyData = await getHistoryData(this.modalParams, this.channelIndex);
    },

    methods: {
        disabledDate(current: Moment) {
            const isDisable = this.avaliableMonth.every(date => {
                return date !== `${moment(current).format('YYYY-MM')}`;
            });
            return isDisable;
        },
        selectMonth(date: Moment) {
            this.currentDate = date
            const month = moment(date).format('YYYY-MM');
            this.month = month;
        },
        addZeroToMonth(month: number) {
            return month < 10 ? `0${month}` : month;
        },
        calculateDataByUiid() {
            const { uiid } = this.modalParams;
            //     const datas =
            //         "190101190301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            const datas = this.historyData;
            let result: { [key: string]: object } = {};
            if (uiid === 126 || uiid === 130) {
                for (let i = 0; i < datas.length / 4; i++) {
                    // 获取到这一天的数值
                    const firNumStr = datas.substr(i * 4, 2);
                    const secNumStr = datas.substr(i * 4 + 2, 2);
                    const firNum = parseInt(firNumStr, 16);
                    const resultNumStr = `${firNum}.${secNumStr}`;
                    const resultNum = parseFloat(resultNumStr);

                    // 获取这一天的时间对象 是今天的第前几天0，1，2，3，4，
                    const tempDate = moment().subtract(i, 'days');

                    // 获取当前年月日
                    const yearNum = tempDate.get('year');
                    const monthNum = this.addZeroToMonth(tempDate.get('month') + 1);
                    const dayNum = tempDate.get('date');

                    //写入对象中
                    let tempObj = result[`${yearNum}-${monthNum}`] ? result[`${yearNum}-${monthNum}`] : {};

                    // tempObj.monthSumNum = tempObj.monthSumNum ? tempObj.monthSumNum : 0;
                    // tempObj[`${dayNum}`] = resultNum;
                    _.set(tempObj, `${dayNum}`, resultNum);
                    // tempObj.dayNum = monthDayNum;
                    // tempObj.monthSumNum += resultNum;

                    // tempObj.month = monthNum;
                    result[`${yearNum}-${monthNum}`] = tempObj;

                    // allMonthSum = allMonthSum + resultNum
                }
            } else {
                for (let i = 0; i < datas.length / 6; i++) {
                    //获取到这一天的数值
                    const firNumStr = datas.substr(i * 6, 2);
                    const secNumStr = datas.substr(i * 6 + 2, 2);
                    const thrNumStr = datas.substr(i * 6 + 4, 2);
                    const firNum = parseInt(firNumStr, 16);
                    const secNum = parseInt(secNumStr, 16);
                    const thrNum = parseInt(thrNumStr, 16);
                    const resultNumStr = `${firNum}.${secNum}${thrNum}`;
                    const resultNum = parseFloat(resultNumStr);

                    //获取这一天的时间对象 是今天的第前几天0，1，2，3，4，
                    const tempDate = moment().subtract(i, 'days');

                    // 获取当前年月日
                    const yearNum = tempDate.get('year');
                    const monthNum = this.addZeroToMonth(tempDate.get('month') + 1);
                    const dayNum = tempDate.get('date');

                    //写入对象中
                    let tempObj = result[`${yearNum}-${monthNum}`] ? result[`${yearNum}-${monthNum}`] : {};

                    // tempObj.monthSumNum = tempObj.monthSumNum ? tempObj.monthSumNum : 0;
                    // tempObj[`${dayNum}`] = resultNum;
                    _.set(tempObj, `${dayNum}`, resultNum);
                    // tempObj.dayNum = monthDayNum;
                    // tempObj.monthSumNum += resultNum;

                    // tempObj.month = monthNum;
                    result[`${yearNum}-${monthNum}`] = tempObj;

                    // allMonthSum = allMonthSum + resultNum
                }
            }
            return result;
        },
        calculateHistoryData(month: string, isCalculateTotal = false) {
            interface IHistoryData {
                // year: string;
                day: string;
                value: number;
            }
            const result = this.calculateDataByUiid();
            this.avaliableMonth = Object.keys(result);
            // this.availableMonth[this.availableMonth.length - 1]
            const obj = result[month];
            if (!obj) {
                return [];
            }
            const currentDays = moment().daysInMonth();
            const lastDay = Object.keys(obj).length;
            if (lastDay < currentDays) {
                // 计算填充的天数
                for (let i = lastDay + 1; i < currentDays; i++) {
                    _.set(obj, i, 0);
                }
            }
            let data: IHistoryData[] = [];
            data = Object.keys(obj).map(item => ({
                day: item,
                value: _.get(obj, `${item}`) as number
            }));
            const temp = data.map(item => item.value);
            // 计算月内总用电量,下载表格的时候不计算
            if (isCalculateTotal) {
                const monthTotal = temp.reduce((total, item) => total + item)
                this.total = Number(monthTotal.toFixed(2));
            }
            return data;
        },
        createSheetData(month: string) {
            //电费费率
            const rate = this.modalParams.itemData?.tags?.rate || 0
            const curYear = moment(month).year();
            const curMonth = moment(month).month() + 1;
            let data: any[] = this.calculateHistoryData(month).map(item => {
                return [`${curYear}.${monthMap.get(curMonth).monthNum}.${+item.day < 10 ? '0' + item.day : item.day}`, item.value.toFixed(2), (item.value * rate).toFixed(2)];
            });
            const tempEle = data.map(item => item[1]);
            const tempCost = data.map(item => item[2]);
            // 计算月内总用电量
            let totalEle = tempEle.reduce((total, item) => Number(total) + Number(item));
            console.log('totalEle-------------', totalEle)
            totalEle = totalEle?.toFixed(2)
            // 计算月内总支出
            let totalCost = tempCost.reduce((total, item) => Number(total) + Number(item));
            console.log('totalCost-------------', totalCost)

            totalCost = totalCost?.toFixed(2)
            data = data.concat([
                ['', '', ''],
                ['', '', ''],
                ['total', totalEle, totalCost],
                ['', '', '']
            ]);
            // 添加表头月份信息
            data.unshift(['date', 'kw/h', 'cost']);
            data.unshift(['', `${monthMap.get(curMonth).monthStr}.${curYear}`, '']);
            return data;
        },
        async download() {
            let sheetData: any[] = [];
            this.avaliableMonth.forEach(month => {
                sheetData = sheetData.concat(this.createSheetData(month));
            });

            let worksheet = XLSX.utils.aoa_to_sheet(sheetData);
            // 设置列宽度
            worksheet['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }];
            // console.log(`ML ~ file: Test.vue ~ line 109 ~ download ~ worksheet`, worksheet);
            let workbook = XLSX.utils.book_new();
            // console.log(`ML ~ file: Test.vue ~ line 111 ~ download ~ workbook`, workbook);
            XLSX.utils.book_append_sheet(workbook, worksheet, '第一页');
            XLSX.writeFile(workbook, 'history.xlsx');
        },
    },

    watch: {
        index: async function() {
            this.historyData = await getHistoryData(this.modalParams, this.channelIndex);
        }
    }
});
</script>

<style lang="stylus" scoped>
.history-item
    .divider
        margin 14px 0
	.line-item
		display: flex
		justify-content: center
		.chart
			height 400px
			width 500px

.download
    display: flex;
    justify-content: flex-end;
</style>
