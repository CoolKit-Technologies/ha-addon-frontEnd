<template>
    <div class="ctrl-light-mode">
        <ctrl-slider class="mg-14" type="brightness" :card-data="cardData" />
        <color-picker v-if="[1].includes(modeLocal)" class="mg-14" :card-data="cardData" />
        <ctrl-slider v-if="[2].includes(modeLocal)" class="mg-14" type="color-temp" :card-data="cardData" />

        <div class="wrapper">
            <div
                class="mode-checker"
                v-for="item in itModeList"
                :key="item.value"
                @click.stop="switchMode(item.value)"
            >
                <img
                    class="icon"
                    :src="modeLocal === item.value ? item.icons.selected : item.icons.unselected"
                    width="24"
                    height="24"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import ColorPicker from '@/components/CtrlItem/ColorPicker.vue';
import CtrlSlider from '@/components/CtrlItem/CtrlSlider.vue';
import { defineComponent, computed, PropType, ref, watch } from 'vue'
import { setCloudDevice } from '@/api/device'
import { CardData } from '@/types'

// 灯带模式列表
const itModeList = [
    {
        mode: 'color',
        value: 1,
        icons: {
            selected: require('@/assets/colorful-light-on.png'),
            unselected: require('@/assets/colorful-light-off.png')
        }
    },
    {
        mode: 'color_temperature',
        value: 2,
        icons: {
            selected: require('@/assets/color-temperature-on.png'),
            unselected: require('@/assets/color-temperature-off.png')
        }
    },
    {
        mode: 'white',
        value: 3,
        icons: {
            selected: require('@/assets/white-light-on.png'),
            unselected: require('@/assets/white-light-off.png')
        }
    }
]

export default defineComponent({
    name: 'CtrlLightMode',
    components: {
        ColorPicker,
        CtrlSlider
    },
    props: {
        cardData: {
            type: Object as PropType<CardData>,
            required: true
        }
    },
    setup(props) {
        const mode = computed(() => {
            const { mode } = props.cardData.params
            return [1, 2, 3].includes(mode) ? mode: 1
        })
        const params = computed(() => props.cardData.params)
        const online = computed(() => props.cardData.online)

        const modeLocal = ref(mode.value)

        const switchMode = async (modeValue: number) => {
            if ( !online.value || modeValue === modeLocal.value) {
                return
            }

            const { apikey, deviceId } = props.cardData
            const { colorTemp, bright, colorR, colorG, colorB } = params.value
            const requestParams: any = {
                mode: modeValue,
                bright
            }
            modeLocal.value = modeValue
            switch (modeValue) {
                case 1:
                    Object.assign(requestParams, {
                        colorR,
                        colorG,
                        colorB
                    })
                    break
                case 2:
                    Object.assign(requestParams, {
                        colorTemp
                    })
                    break
            }

            await setCloudDevice({
                id: deviceId,
                apikey,
                params: requestParams
            })
        }

        watch(mode, (newMode) => {
            modeLocal.value = newMode
        })

        return {
            itModeList,
            mode,
            modeLocal,
            online,
            switchMode
        }
    }
})
</script>

<style lang="stylus">
.ctrl-light-mode

    .wrapper
        display flex
        justify-content center
        align-items center

        .mode-checker
            width 40px
            height: 40px
            margin 0 10px
            display flex
            justify-content center
            align-items center

.mg-14
    margin-top 14px
    &:last-child
        margin-bottom 0
</style>
