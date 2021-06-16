<template>
  <div class="statistics-item">
    <!-- <div class="range-item">
            <a-range-picker
                showTime
                :placeholder="['From', 'To']"
                format="YYYY-MM-DD HH:mm:ss"
            />
        </div>
        <div class="liquid-item">
            <circle-chart width="180px" height="180px" color="blue" />
            <span class="title">{{ $t('card.realtimestats') }}</span>
            <span class="value">140 KWH</span>
        </div>
        <div class="icon-item">
            <PlayCircleTwoTone class="play-icon" @click="startFunc" />
            <CheckCircleTwoTone class="play-icon" @click="endFunc" />
            <sync-outlined class="action-icon" :spin="spin" @click="refresh" />
        </div> -->

    <div class="range-item">
      <a-range-picker
        showTime
        :bordered="false"
        :placeholder="placeholder"
        :disabled="true"
        :format="dateFormat"
        :value="[defaultStartTime, defaultEndTime]"
      ></a-range-picker>
    </div>
    <div class="liquid-item">
      <circle-chart width="180px" height="180px" color="blue" />
      <span class="title">{{ $t("card.realtimestats") }}</span>
      <span class="value">{{ statisticValue + " " + "KWH" }}</span>
    </div>
    <div class="icon-item">
      <PlayCircleTwoTone
        v-if="!startFlag"
        class="play-icon"
        @click="startFunc"
      />
      <CheckCircleTwoTone
        v-else-if="startFlag"
        class="play-icon"
        @click="endFunc"
      />
      <sync-outlined class="action-icon" :spin="spin" @click="refresh" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import {
  PlayCircleTwoTone,
  CheckCircleTwoTone,
  SyncOutlined,
} from "@ant-design/icons-vue";
import moment, { Moment } from "moment";
import _ from "lodash";
import { startStatistic, endStatistic, refreshStatistic } from "@/api/device";
import CircleChart from "@/components/CircleChart.vue";

export default defineComponent({
  name: "StatisticsItem",

  components: {
    CircleChart,
    PlayCircleTwoTone,
    SyncOutlined,
    CheckCircleTwoTone,
  },
  data() {
    return {
      placeholder: ["from", "to"],
      dateFormat: "YYYY-MM-DD HH:mm:ss",
      spin: false,
      startFlag: false,
      staDateFromat: "YYYY-MM-DDTHH:mm:ss.SSS[Z]",
      startTime: "",
      endTime: "",
      statisticValue: "0",
    };
  },
  computed: {
    ...mapState(["modalParams"]),
    defaultStartTime(): Moment {
      return this.startTime ? moment(this.startTime) : moment();
    },
    defaultEndTime(): Moment {
      return this.endTime ? moment(this.endTime) : moment();
    },
  },
  mounted() {},

  methods: {
    selectRangeTime(dates: any) {},
    async startFunc() {
      this.startFlag = true;
      this.startTime = moment().utc().format(this.staDateFromat);
      await startStatistic(this.startTime, this.modalParams);
    },
    async endFunc() {
      this.startFlag = false;
      this.endTime = moment().utc().format(this.staDateFromat);
      await endStatistic(this.startTime, this.endTime, this.modalParams);
      await this.refresh();
    },
    async refresh() {
      this.spin = true;
      setTimeout(() => {
        this.spin = false;
      }, 2000);
      const res = await refreshStatistic(this.modalParams);
      console.log(
        `ML ~ file: StatisticsItem.vue ~ line 126 ~ refresh ~ res`,
        res
      );
      if (res.error === 0 && res.data && res.data.config) {
        if (this.modalParams.uiid === 126) {
          this.statisticValue =
            this.modalParams.cardIndex === 1
              ? res.data.config.oneKwhData_01
              : res.data.config.oneKwhData_00;
        } else {
          this.statisticValue = res.data.config.oneKwhData;
        }
      }
    },
  },
});
</script>

<style lang="stylus" scoped>
.statistics-item {
  .range-item {
    display: flex;
    justify-content: center;

    .ant-calendar-picker {
      width: 100% !important;
      text-align: start;

      .ant-calendar-range-picker-input {
        text-align: start !important;
      }
    }
  }

  .liquid-item {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 20px;

    .title, .value {
      position: absolute;
    }

    .title {
      top: 34px;
      font-size: 14px;
      color: #C8C8C8;
    }

    .value {
      top: 56px;
      font-size: 26px;
      color: #222222;
    }
  }

  .icon-item {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    .play-icon {
      font-size: 26px;
    }

    .action-icon {
      border-radius: 50%;
      margin-left: 60px;
      font-size: 26px;
      color: #04a9f1;
      transition: all 0.3s;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        background-color: #f7f7f7;
        cursor: pointer;
      }
    }
  }
}
</style>
