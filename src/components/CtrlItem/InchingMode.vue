<template>
    <div class="inching-mode">
        <div class="title">
            {{ $t('modal.inchingmode') }}
        </div>
        <div class="control">
            <!-- <a-time-picker
                format="mm:ss"
                v-model:value="modeTime"
                size="small"
                @change="changeTime"
                :disabled="!modeStat"
            >
                <template #addon>
                    <span style="display:inline-block; text-align:center; width:100%;">{{ $t('modal.minute') }} : {{ $t('modal.second') }}</span>
                </template>
            </a-time-picker> -->

            <!-- 分钟选择器 -->
            <a-select
                style="width: 120px; margin-left: 10px;"
                size="small"
                v-model:value="minutes"
                :disabled="!modeStat"
                @change="handleMinOrSecChange"
            >
                <a-select-option
                    v-for="minute in 60"
                    :value="minute-1"
                    :key="minute-1"
                >
                    {{ (minute-1) + $t('modal.minute') }}
                </a-select-option>
            </a-select>

            <!-- 秒钟选择器 -->
            <a-select
                style="width: 120px; margin-left: 10px;"
                size="small"
                v-model:value="seconds"
                :disabled="!modeStat"
                @change="handleMinOrSecChange"
            >
                <a-select-option
                    v-for="second in 60"
                    :value="second-1"
                    :key="second-1"
                >
                    {{ (second-1) + $t('modal.second') }}
                </a-select-option>
            </a-select>

			<a-select style="width: 120px;margin-left: 10px;" size="small" :disabled="!modeStat" :value="action" @select="setInchingAction" v-if="isShowStatus">
                <a-select-option key="on" value="on">{{ $t('modal.miniR3.inchingOn') }} </a-select-option>
                <a-select-option key="off" value="off">{{ $t('modal.miniR3.inchingOff') }}</a-select-option>
            </a-select>
            <a-switch
                class="switch"
                :checked="modeStat"
                @change="toggle"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import moment from 'moment';

import { toggleInchingMode } from '@/api/device';
import { isOneChannelSPDevice } from '@/utils/etc';

export default defineComponent({
    name: 'InchingMode',

    props: {
        index: {
            default: 0
        }
    },

    data() {
        return {
            minutes: null,
            seconds: null,
            modeTime: null,
			action: 'on'
        } as {
            minutes: number | null,
            seconds: number | null,
            modeTime: any;
			action: string
        };
    },

    computed: {
        modeStat() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
            const { index } = this as any;

            if (type === 1 && uiid === 1) {
                return params.data1.pulse === 'on';
            } else if (isOneChannelSPDevice(uiid) && uiid !== 181) {
                return params.pulse === 'on';
            } else if (uiid === 126) {
                return params.pulses[cardIndex].pulse === 'on';
            } else if (uiid === 181) {
                return params.pulseConfig.pulse === 'on';
            } else {
                return params.pulses[index].pulse === 'on';
            }
        },
		//	点动是否显示 常开常闭 选项
		isShowStatus(){
            const { uiid } = this.modalParams as any;
            return [138, 139, 140, 141, 160, 161, 162, 182, 190].includes(uiid);
		},
        ...mapState(['modalParams'])
    },

    created() {
        this.initTime();
        this.initAction();
    },

    methods: {
        initTime(min?: number | null, sec?: number | null) {

            if ((min !== null && min !== undefined) && (sec !== null && sec !== undefined)) {
                const ms = (min * 60 * 1000) + sec * 1000;
                this.modeTime = this.ms2time(ms);
                return;
            }

            const { type, uiid, params, cardIndex } = this.modalParams as any;
            let ms = 0;

            if (type === 1 && uiid === 1) {
                ms = params.data1.pulseWidth;
            } else if (uiid === 181) {
                ms = params.pulseConfig.pulseWidth;
            } else if (isOneChannelSPDevice(uiid)) {
                ms = params.pulseWidth;
            } else if (uiid === 126) {
                ms = params.pulses[cardIndex].width;
            } else {
                ms = params.pulses[this.index].width;
            }
            this.modeTime = this.ms2time(ms);

            this.minutes = moment(this.modeTime).get('minute');
            this.seconds = moment(this.modeTime).get('second');
        },
        initAction() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
            let action = ''

            if ([138, 160, 161, 162, 182].includes(uiid)) {
                action = params.pulses[this.index].switch;
            }

            this.action = action;
        },
        // Convert time format (ms => min:sec)
        // 1000ms => 00:01, 1500ms => 00:02
        ms2time(ms: number) {
            if (ms <= 1000) {
                return moment('00:01', 'mm:ss');
            } else {
                const sec = Math.ceil(ms / 1000);
                if (sec < 60) {
                    return moment('00:' + sec.toString().padStart(2, '0'), 'mm:ss');
                } else {
                    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
                    const ss = String(sec % 60).padStart(2, '0');
                    return moment(`${mm}:${ss}`, 'mm:ss');
                }
            }
        },
        handleMinOrSecChange(val: string) {
            this.initTime(this.minutes, this.seconds)
            this.changeTime()
        },
        getMs() {
            const min = moment(this.modeTime).get('minute');
            const sec = moment(this.modeTime).get('second');
            const ms = (60 * min + sec) * 1000;
            return ms;
        },
        async changeTime() {
            if (this.modeStat) {
                await toggleInchingMode(true, this.modalParams, this.getMs(), this.index);
            }
        },
        async toggle(v: boolean) {
            await toggleInchingMode(v, this.modalParams, this.getMs(), this.index,this.isShowStatus ? this.action : '');
        },
		setInchingAction(v:string){
			this.action = v;
			this.toggle(true)
		}
    },

    watch: {
        'modalParams.params': function(params) {
            params && this.initTime();
            params && this.initAction();
        }
    }
});
</script>

<style lang="stylus" scoped>
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
