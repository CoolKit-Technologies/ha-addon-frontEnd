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
            />
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
            return false;
        },
        ...mapState(['modalParams'])
    },

    created() {
        this.initTime();
    },

    methods: {
        initTime() {
            // const ms = this.modalParams.params.pulses[0].width;
            const ms = 5000;
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
        toggle(v: boolean) {
            // TODO: send request
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
