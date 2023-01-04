<template>
    <!-- 费率设置 -->
    <div class="electric-rate">
        <div class="title">
            <span>{{ $t('modal.feeRate') }}</span>
        </div>
        <div class="electric-rate-input">
            <span class="text" v-if="!editable">{{ rate }}</span>
            <a-input-number
                v-else
                class="input"
                v-model:value="rate"
            />
            <span> / {{ $t('modal.kwh') }}</span>
            <EditOutlined style="margin-left: 5px; font-size: 18px;" @click="() => { editable = !editable }" v-if="!editable" />
            <SaveOutlined style="margin-left: 5px; font-size: 18px;" @click="handleSave" v-else />
        </div>
    </div>
</template>

<script lang="ts" scoped>
import { defineComponent, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue'
import { updateElectricRate } from '@/api/device'
import { getDeviceListInit } from '@/api/device'

export default defineComponent({
    name: 'ElectricRate',
    components: {
        EditOutlined,
        SaveOutlined
    },
    setup() {
        const store = useStore()

        const editable = ref(false)
        const rate = ref(0)

        const deviceId = computed(() => store.state.modalParams.deviceId)
        const modalParams = computed(() => store.state.modalParams)
        const realTimeRate = computed(() => modalParams.value.eRate)

        const getDeviceList = async () => {
            const res = await getDeviceListInit()
            if (res.error === 0) {
                store.commit('setOriginDeviceList', res.data);
                const device = res.data.find((item: any) => item.deviceId === deviceId.value)
                if (device) {
                    store.commit('setModalParams', device)
                    rate.value = device.eRate
                }
            }
        }

        const handleSave = async () => {
            editable.value = !editable.value
            await updateElectricRate(modalParams.value, rate.value)
            getDeviceList()
        }

        rate.value = realTimeRate.value
        getDeviceList()

        return {
            rate,
            editable,
            handleSave
        }
    }
})
</script>

<style lang="stylus" scoped>
.electric-rate
    display flex
    justify-content space-between
    align-items center

    .electric-rate-input
        .text
            margin 0
            width 100%
            padding 4px 0
            border-bottom 1px solid #e8e8e8
            overflow: hidden
            text-overflow ellipsis
            white-space nowrap

</style>
