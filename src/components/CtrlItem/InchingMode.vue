<template>
    <div class="inching-mode">
        <div class="title">
            {{ $t('modal.inchingmode') }}
        </div>
        <div class="control">
            <a-time-picker
                format="mm:ss"
                v-model:value="modeTime"
                size="small"
                @change="changeTime"
            >
                <template #addon>
                    <span style="display:inline-block; text-align:center; width:100%;">{{ $t('modal.minute') }} : {{ $t('modal.second') }}</span>
                </template>
            </a-time-picker>
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
            modeTime: null,
        } as {
            modeTime: any;
        };
    },

    computed: {
        modeStat() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
            const { index } = this as any;

            if (type === 1 && uiid === 1) {
                return params.data1.pulse === 'on';
            } else if (isOneChannelSPDevice(uiid)) {
                return params.pulse === 'on';
            } else if (uiid === 126) {
                return params.pulses[cardIndex].pulse === 'on';
            } else {
                return params.pulses[index].pulse === 'on';
            }
        },
        ...mapState(['modalParams'])
    },

    created() {
        this.initTime();
    },

    methods: {
        initTime() {
            const { type, uiid, params, cardIndex } = this.modalParams as any;
            let ms = 0;

            if (type === 1 && uiid === 1) {
                ms = params.data1.pulseWidth;
            } else if (isOneChannelSPDevice(uiid)) {
                ms = params.pulseWidth;
            } else if (uiid === 126) {
                ms = params.pulses[cardIndex].width;
            } else {
                ms = params.pulses[this.index].width;
            }
            this.modeTime = this.ms2time(ms);
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
            await toggleInchingMode(v, this.modalParams, this.getMs(), this.index);
        },
    },
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
