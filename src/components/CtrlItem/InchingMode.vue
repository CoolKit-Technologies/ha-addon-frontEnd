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

export default defineComponent({
    name: 'InchingMode',

    props: {
        index: {
            default: 0
        },
        // If current device is multi-channel
        multi: {
            default: false
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
            // const { modalParams } = this as any;
            // return modalParams.params.pulses[0].pulse === 'on';
            const { type, uiid, params } = this.modalParams as any;

            if (type === 1 && uiid === 1) {
                return params.data1.pulse === 'on';
            }
            return true;
        },
        ...mapState(['modalParams'])
    },

    created() {
        this.initTime();
    },

    methods: {
        initTime() {
            console.log('modal params', this.modalParams);

            const { type, uiid, params } = this.modalParams as any;
            let ms = 0;

            if (type === 1 && uiid === 1) {
                ms = params.data1.pulseWidth;
                console.log(ms);
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
        changeTime() {
            const mm = moment(this.modeTime).get('minute');
            const ss = moment(this.modeTime).get('second');
            if (this.modeStat) {
                // When stat is 'on', send request
            }
        },
        async toggle(v: boolean) {
            // TODO: send request
            console.log('>_< ::', v);
            await toggleInchingMode(v, this.modalParams, 500);
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
