<template>
  <div class="history-item">
    <!-- <div class="month-item">
      <a-month-picker />
    </div>
    <a-divider style="margin: 14px 0" />
    <div>
      <a-statistic />
    </div> -->

    <div class="month-item">
      <a-month-picker
        @change="(value) => selectMonth(value)"
        :disabled-date="(current) => disabledDate(current)"
      ></a-month-picker>
    </div>
    <a-divider class="divider"></a-divider>
    <div class="description-item">
      <div>
        <a-statistic title="Consumed" :value="total" suffix="KWh" />
      </div>
    </div>
    <div class="line-item">
      <v-chart class="chart" :option="option" />
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

use([CanvasRenderer, LineChart, GridComponent, TooltipComponent]);

import { getHistoryData } from "@/api/device";
import { mapState } from "vuex";

export default defineComponent({
  name: "HistoryItem",

  components: {
    VChart,
  },

  data() {
    return {
      total: 0,
      month: moment().month() + 1,
      avaliableMonth: [] as string[],
      historyData: "",
    };
  },

  computed: {
    ...mapState(["modalParams"]),
    option() {
      const { calculateHistoryData, month } = this as any;
      const data = calculateHistoryData(month);
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
    this.historyData = await getHistoryData(this.modalParams);
  },

  methods: {
    disabledDate(current: Moment) {
      return this.avaliableMonth.includes(`${moment(current).month() + 1}`)
        ? false
        : true;
    },
    selectMonth(date: Moment) {
      const month = moment(date).month() + 1;
      this.month = month;
    },
    calculateHistoryData(month: number) {
      const datas = this.historyData;
      //   const datas =
      //     "190101190301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
      interface IHistoryData {
        day: string;
        value: number;
      }
      let result: { [key: string]: object } = {};
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
        const tempDate = moment().subtract(i, "days");

        //获取当前是几月，获取月份
        const monthNum = tempDate.get("month") + 1;
        //获取这一天是几号，获取是几号
        const dayNum = tempDate.get("date");

        //获取这一个月有几天,获取这个月有几天
        // const monthDayNum = tempDate.daysInMonth();

        //写入对象中
        let tempObj = result[`${monthNum}`] ? result[`${monthNum}`] : {};

        // tempObj.monthSumNum = tempObj.monthSumNum ? tempObj.monthSumNum : 0;
        // tempObj[`${dayNum}`] = resultNum;
        _.set(tempObj, `${dayNum}`, resultNum);
        // tempObj.dayNum = monthDayNum;
        // tempObj.monthSumNum += resultNum;

        // tempObj.month = monthNum;
        result[`${monthNum}`] = tempObj;

        // allMonthSum = allMonthSum + resultNum
      }
      this.avaliableMonth = Object.keys(result);
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
      data = Object.keys(obj).map((item) => ({
        day: item,
        value: _.get(obj, `${item}`) as number,
      }));
      const temp = data.map((item) => item.value);
      //  计算月内总用电量
      this.total = temp.reduce((total, item) => total + item);
      return data;
    },
  },
});
</script>

<style lang="stylus" scoped>
.history-item {
  .divider {
    width: 100%;
  }

  .chart {
    height: 400px;
    width: 500px;
  }
}
</style>
