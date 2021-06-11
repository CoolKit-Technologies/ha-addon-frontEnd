<template>
    <div class="statastic-item">
        <div class="range-item">
            <a-range-picker showTime :bordered="false" :placeholder="placeholder" :disabled="true" :format="dateFormat" :value="[defaultTime, defaultTime]"></a-range-picker>
        </div>
        <div class="liquid-item">
            <circle-chart width="180px" height="180px" color="blue" />
            <span class="title">{{ $t('card.realtimestats') }}</span>
            <span class="value">140 KWH</span>
        </div>
        <div class="icon-item">
            <PlayCircleTwoTone v-if="!this.startFlag" class="play-icon" @click="startFunc" />
            <CheckCircleTwoTone v-else-if="this.startFlag" class="play-icon" @click="endFunc" />
            <sync-outlined class="action-icon" :spin="spin" @click="refresh" />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import CircleChart from '@/components/CircleChart.vue';
import { PlayCircleTwoTone, CheckCircleTwoTone, SyncOutlined } from '@ant-design/icons-vue';
import moment, { Moment } from 'moment';

export default defineComponent({
    components: {
        CircleChart,
        PlayCircleTwoTone,
        SyncOutlined,
        CheckCircleTwoTone,
    },
    data() {
        return {
            placeholder: ['from', 'to'],
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            spin: false,
            startFlag: false,
        };
    },
    computed: {
        defaultTime(time: string): Moment {
            // return time ? moment(time) : moment();
            return moment('2015-01-01 10:10:10');
        },
    },
    methods: {
        selectRangeTime(dates: any) {
            console.log(`ML ~ file: StatasticItem.vue ~ line 34 ~ selectRangeTime ~ value`, dates);
        },
        startFunc() {
            this.startFlag = true;
            console.log(new Date().getTime());
        },
        endFunc() {
            this.startFlag = false;
            console.log(new Date().getTime());
        },
        refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 2000);
        },
        // formatTime(time: any): string {
        //     return moment(time).format(this.dateFormat);
        // },
    },
});
</script>
<style lang="stylus">

.statastic-item
    .range-item
        display flex
        justify-content center
        .ant-calendar-picker
            width: 100% !important;
            text-align start
            .ant-calendar-range-picker-input
                text-align start !important
    .liquid-item
        display flex
        justify-content center
        align-items center
        position relative
        margin-top 20px
        .title,
        .value
            position absolute
        .title
            top 34px
            font-size 14px
            color #C8C8C8
        .value
            top 56px
            font-size 26px
            color #222222
    .icon-item
        display flex
        justify-content center
        margin-top 20px
        .play-icon
            font-size 26px
        .action-icon
            border-radius 50%
            margin-left 60px
            font-size 26px
            color #04a9f1
            transition all 0.3s
            &:not(:last-child)
                margin-right 8px
            &:hover
                background-color #f7f7f7
                cursor pointer
</style>
