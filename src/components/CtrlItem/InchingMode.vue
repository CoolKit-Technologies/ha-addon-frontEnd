<template>
    <div class="inching-mode">
        <div class="title">
            {{ $t('modal.inchingmode') }}
        </div>
        <div class="control">
            <a-time-picker
                :format="dateFormat"
                :value="pulseWidth"
                @change="(time) => handleTime(time)"
            />
            <a-switch
                class="switch"
                :checked="pulseSwitch"
                @click="(value) => inchingAction(value)"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import moment, { Moment } from 'moment';

export default defineComponent({
    name: 'InchingMode',

    props: {
        cardData: {
            required: true,
        },
    },

    data() {
        return {
            dateFormat: 'mm:ss',
        };
    },

    computed: {
        pulseWidth(): Moment {
            let time = 500;
            return time < 1000 ? moment('00:01', this.dateFormat) : moment(`${this.formatTime(time)}`, this.dateFormat);
        },
        pulseSwitch(): boolean {
            return true;
        },
    },

    methods: {
        //  设置点动时间
        handleTime(time: Moment) {
            console.log('time', time);
            if (!time) return;
            const h = moment(time).get('minute');
            const s = moment(time).get('second');
            let count = 0;
            h === 0 ? (count = s) : (count = h * 60 + s);
            console.log(`ML ~ file: InchingMode.vue ~ line 34 ~ handleTime ~ count`, count);
            // todo 接口请求
        },
        //  格式化点动时间
        formatTime(time: number): string {
            let temp = time / 1000;
            return temp < 60 ? `00:${temp}` : `${Math.floor(temp / 60)}:${temp % 60}`;
        },
        //  点动开关
        inchingAction(value: boolean) {
            console.log(`ML ~ file: InchingMode.vue ~ line 54 ~ inchingAction ~ value`, value);
            // todo 接口请求
        },
    },
});
</script>

<style lang="stylus">
.inching-mode
    display flex
    justify-content space-between
    align-items center
    margin-top 10px
    .title
        color #212121
    .switch
        margin-left 20px
</style>
