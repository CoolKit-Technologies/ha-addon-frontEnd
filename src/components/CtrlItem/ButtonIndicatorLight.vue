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
import { defineComponent, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import _ from 'lodash'
import { controlButtonIndicatorLight } from '@/api/device'
import { CardData } from '@/types'
import { useI18n } from 'vue-i18n'

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
    setup() {
        const offBrightness = ref(0)

        const store = useStore()
        const { t } = useI18n()

        // computed
        const modalParams = computed(() => store.state.modalParams)
        const uiid = computed(() => modalParams.value.uiid)
        const disabled = computed(() => {
            const { params } = modalParams.value
            let disabled = false

            if ([160, 161, 162].includes(uiid.value)) {
                disabled = params.switches.some((s: { outlet: number, switch: 'off' | 'on' }) => s.switch === 'on')
            }

            return disabled
        })
        const text = computed(() => {
            let text = ''

            if ([160, 161, 162].includes(uiid.value)) {
                text = t('modal.btnled')
            }

            return text
        })
        const tip = computed(() => {
            let tip = ''

            if ([160, 161, 162].includes(uiid.value)) {
                tip = t('modal.btnledTip')
            }

            return tip
        })

        // methods
        const initOffBrightness = () => {
            let brightness = 0

            if ([160, 161, 162].includes(uiid.value)) {
                brightness = modalParams.value?.params?.offBrightness
            }

            offBrightness.value = brightness
        }
        const controlOffBrightness = (offBrightness: number) => {
            _controlOffBrightness(offBrightness, modalParams.value)
        }

        // created
        initOffBrightness()

        // watch
        watch(modalParams, (params) => {
            params && initOffBrightness()
        })

        return {
            disabled,
            text,
            tip,
            controlOffBrightness,
            offBrightness
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
