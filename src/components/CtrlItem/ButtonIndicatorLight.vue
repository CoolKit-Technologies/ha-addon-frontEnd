<template>
    <div class="btn-indicator-light">
        <span class="text">{{ text }}</span>
        <div class="control">
            <a-slider v-model:value="offBrightness" :disabled="disabled" class="slider" style="width: 200px" @change="controlOffBrightness"></a-slider>
            <a-tooltip>
                <template #title>{{ tip }}</template>
                <question-circle-outlined style="font-size: 16px;" />
            </a-tooltip>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import { controlButtonIndicatorLight } from '@/api/device'
import { CardData } from '@/types'

const _controlOffBrightness = _.debounce(
    (offBrightness: number, device: CardData) => { controlButtonIndicatorLight(offBrightness, device) },
    500,
    { leading: false, trailing: true }
)

export default defineComponent({
    name: 'ButtonIndicatorLight',
    components: {
        QuestionCircleOutlined
    },
    data() {
        return {
            offBrightness: 0
        }
    },
    methods: {
        initOffBrightness() {
            let offBrightness = 0

            if ([160, 161, 162].includes(this.uiid)) {
                offBrightness = this.modalParams.params.offBrightness
            }

            this.offBrightness = offBrightness
        },
        controlOffBrightness(offBrightness: number) {
            _controlOffBrightness(offBrightness, this.modalParams)
        }
    },
    computed: {
        ...mapState(['modalParams']),
        uiid() {
            return this.modalParams.uiid
        },
        disabled() {
            const { params } = this.modalParams
            let disabled = false

            if ([160, 161, 162].includes(this.uiid)) {
                disabled = params.switches.some((s: { outlet: number, switch: 'off' | 'on' }) => s.switch === 'on')
            }

            return disabled
        },
        text() {
            let text = ''

            if ([160, 161, 162].includes(this.uiid)) {
                text = this.$t('modal.btnled')
            }

            return text
        },
        tip() {
            let tip = ''

            if ([160, 161, 162].includes(this.uiid)) {
                tip = this.$t('modal.btnledTip')
            }

            return tip
        }
    },
    created() {
        this.initOffBrightness()
    },
    watch: {
        'modalParams.params': function(params) {
            params && this.initOffBrightness()
        }
    }
})
</script>

<style lang="stylus" scoped>
.btn-indicator-light
    display flex
    justify-content space-between
    align-items center

    .control
        display flex
        justify-content flex-end
        align-items center

        .slider
            margin-right 16px
</style>
