<template>
    <div class="statistics-item">
        <div class="range-item">
            <a-range-picker
                :format="timeFormat"
                :placeholder="[$t('modal.from'), $t('modal.to')]"
                :value="[startTime, endTime]"
                showTime
                disabled
            />
        </div>
        <div class="liquid-item">
            <circle-chart width="180px" height="180px" color="blue" />
            <span class="title">{{ $t("modal.consumption") }}</span>
            <span class="value">{{ statisticValue + " " + "KWH" }}</span>
        </div>
        <div class="icon-item">
            <CheckCircleTwoTone
                v-if="hasStartTime"
                class="play-icon"
                @click="endRecord"
            />
            <PlayCircleTwoTone
                v-else
                class="play-icon"
                @click="startRecord"
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
import moment from "moment";
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
            timeFormat: 'YYYY-MM-DD HH:mm:ss',
            utcTimeFormat: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
            startTime: null,
            utcStartTime: '',
            hasStartTime: false,
            endTime: null,
            utcEndTime: '',
            spin: false,
            statisticValue: 0
        } as {
            timeFormat: string;
            utcTimeFormat: string;
            startTime: any;
            utcStartTime: string;
            hasStartTime: boolean;
            endTime: any;
            utcEndTime: string;
            spin: boolean;
            statisticValue: number;
        };
    },

    created() {
        // this.initTime();
    },

    computed: {
        ...mapState(["modalParams"])
    },

    methods: {
        initTime() {
            const { params, uiid, cardIndex } = this.modalParams as any;
            if (uiid === 126) {
                if (params[`startTime_0${cardIndex}`]) {
                    this.startTime = moment(params[`startTime_0${cardIndex}`]);
                    this.utcStartTime = params[`startTime_0${cardIndex}`];
                    this.hasStartTime = true;
                }
            } else if (params.startTime) {
                this.startTime = moment(params.startTime);
                this.hasStartTime = true;
            }
        },
        async startRecord() {
            const now = new Date();
            this.startTime = moment(now);
            this.utcStartTime = moment(now).utc().format(this.utcTimeFormat);
            this.hasStartTime = true;
            await startStatistic(this.utcStartTime, this.modalParams);
        },
        async endRecord() {
            const now = new Date();
            this.endTime = moment(now);
            this.utcEndTime = moment(now).utc().format(this.utcTimeFormat);
            this.hasStartTime = false;
            await endStatistic(this.utcStartTime, this.utcEndTime, this.modalParams);
            await this.refresh();
        },
        async refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 2000);

            const res = await refreshStatistic(this.modalParams);
            if (res.error === 0 && res.data && res.data.config) {
                if (this.modalParams.uiid === 126) {
                    this.statisticValue = parseFloat(
                        this.modalParams.cardIndex === 1
                            ? res.data.config.oneKwhData_01
                            : res.data.config.oneKwhData_00);
                } else {
                    this.statisticValue = parseFloat(res.data.config.oneKwhData);
                }
            }
        }
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
            font-size: 28px;
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
