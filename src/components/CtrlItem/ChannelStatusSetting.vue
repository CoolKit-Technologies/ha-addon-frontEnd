<template>
    <!-- 特殊通道设置--加选择的框--实时统计和历史记录图表 -->
    <div class="CKStatusOverload">
        <div class="input-wrap">
            <DeviceName :index="channelIndex" class="device-name" type="channel" />
            <a-select class="input-select" v-model:value="channelIndex">
                <a-select-option v-for="(channelItem, cIndex) in channelList" :key="cIndex + 'channel'" :value="cIndex">{{ channelItem }}</a-select-option>
            </a-select>
        </div>

        <div class="stats">
            <a-tabs type="line">

                <a-tab-pane key="1" :tab="$t('modal.realtimeStats')">

                    <!-- 实时统计 -->
                    <StatisticsItem :channelIndex="channelIndex" />

                    <!-- 过载保护 -->
                    <div class="text-box">
                        <div>
                            <div class="title">{{ $t('modal.ops') }}</div>
                            <div class="desc">{{ $t('modal.opsTip') }}</div>
                        </div>
                        <div class="edit-box">
                            <SaveOutlined @click="handleSave" v-if="editable" />
                            <EditOutlined @click="() => { editable = true }" v-else />
                        </div>
                    </div>
                    <div class="text-box" v-for="(item, oIndex) in overloadList" :key="item.key">
                        <div class="text-wrapper">
                            <a-checkbox :checked="item.en" @change="changeCheck(oIndex)" :disabled="!editable"></a-checkbox>
                            <span style="margin-left: 10px">{{ $t(item.title) }}</span>
                        </div>
                        <div class="input-box">
                            <a-input-number
                                class="input"
                                v-model:value="item.val"
                                default-value="0"
                                :formatter="(value: any) => formatter(value, item.unit)"
                                :parser="(value: any) => parser(value, item.unit)"
                                v-if="editable"
                            ></a-input-number>
                            <p class="text" v-else>{{ item.val }} {{ item.unit }}</p>
                        </div>
                    </div>

                    <div class="text-box">
                        <div class="title">{{ $t('modal.opsDelayClose') }}</div>
                        <div>
                            <a-select v-model:value="minu" style="width: 100px; margin-right: 10px" @select="updateData" :disabled="!editable">
                                <a-select-option v-for="(minute, index) in 3" :key="minute" :value="index">{{ index + ' ' + $t('modal.minute') }}</a-select-option>
                            </a-select>

                            <a-select @select="updateData" v-model:value="second" style="width: 100px" :disabled="!editable">
                                <a-select-option v-for="(second, index) in 60" :key="second" :value="index">{{ index }} {{ $t('modal.second') }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                    <div class="text-box">
                        <div class="desc">{{ $t('modal.opsDelayDesc') }}</div>
                    </div>
                </a-tab-pane>

                <!-- 历史记录 -->
                <a-tab-pane key="2" :tab="$t('modal.history')">
                    <HistoryItem :channelIndex="channelIndex" />
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { message } from 'ant-design-vue'
import { setSubdeviceOverloadService } from '@/api/device'

import DeviceName from './DeviceName.vue'
import StatisticsItem from '@/components/CtrlItem/StatisticsItem.vue'
import HistoryItem from '@/components/CtrlItem/HistoryItem.vue'
import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    name: 'ChannelStatusSetting',
    components: {
        DeviceName,
        StatisticsItem,
        HistoryItem,
        EditOutlined,
        SaveOutlined
    },
    setup() {
        const { t } = useI18n()
        const store = useStore()

        const channelIndex = ref(0)

        const modalParams = computed(() => store.state.modalParams)
        const channelList = computed(() => {
            const tags: string[] = modalParams.value.tags
            const list = new Array(4)

            for (let i = 0; i < 4; i ++) {
                list[i] = (tags && tags[i]) ? tags[i] : `${t('card.channel')}${i+1}`
            }

            return list
        })

        const minu = ref(0);
        const second = ref(0);

        // 编辑控制
        const editable = ref(false);

        const overloadConfig = ref([
            {
                title: 'modal.minPower',
                key: 'minAP',
                unit: 'W',
                en: false,
                val: 0.1,
                editable: false,
                min: 0.1,
                max: 4800,
                message: 'modal.minPowerRange',
            },
            {
                title: 'modal.maxPower',
                key: 'maxAP',
                unit: 'W',
                en: false,
                val: 0.1,
                editable: false,
                min: 0.1,
                max: 4800,
                message: 'modal.maxPowerRange',
            },
            {
                title: 'modal.minVoltage',
                key: 'minV',
                unit: 'V',
                en: false,
                val: 90,
                editable: false,
                min: 90,
                max: 264,
                message: 'modal.minVoltageRange',
            },
            {
                title: 'modal.maxVoltage',
                key: 'maxV',
                unit: 'V',
                en: false,
                val: 90,
                editable: false,
                min: 90,
                max: 264,
                message: 'modal.maxVoltageRange',
            },
            {
                title: 'modal.maxCurrent',
                key: 'maxC',
                unit: 'A',
                en: false,
                val: 0.1,
                editable: false,
                min: 0.1,
                max: 20,
                message: 'modal.maxCurrentRange',
            },
        ]);
        //过载保护配置
        const overloadList = computed(() => {
            const overloadData = _.get(modalParams.value.params, `overload_0${channelIndex.value}`, {});

            const list = overloadConfig.value.map((item) => {
                item.val = _.get(overloadData, [`${item.key}`, 'val'], 0) / 100;
                item.en = !!overloadData[item.key].en;
                return item;
            });

            minu.value = Math.floor(overloadData.delayTime / 60);
            second.value = overloadData.delayTime % 60;

            return list;
        });

        //选择复选框
        async function changeCheck(index: number) {
            let thisItem = overloadList.value[index];
            thisItem.en = !thisItem.en;
        }

        async function updateData() {
            const params: any = {};
            let isInRange = true;
            let whichKey = '';
            overloadList.value.forEach((item, index) => {
                if (item.val < item.min || item.val > item.max) {
                    isInRange = false;
                    whichKey = item.key;
                }

                let obj = {
                    val: item.val * 100,
                    en: item.en ? 1 : 0,
                };
                _.assign(params, { [item.key]: obj });
            });
            //不在范围内，提示
            if (!isInRange) {
                const thisItem = overloadConfig.value.find((item) => item.key == whichKey) as any
                message.error(t(thisItem.message));
                return false;
            }

            const powerExceed = params.minAP.en && params.maxAP.en && params.minAP.val >= params.maxAP.val;
            const voltageExceed = params.minV.en && params.maxV.en && params.minV.val >= params.maxV.val;
            if (powerExceed || voltageExceed) {
                message.error(t('modal.minExceedMax'));
                return false;
            }

            params.delayTime = minu.value * 60 + second.value;
            const resp = await setSubdeviceOverloadService(modalParams.value, params, channelIndex.value);

            if (resp.error !== 0) {
                message.error(t('modal.operationFailed'))
            }

            return true;
        }

        //保存
        async function handleSave() {
            let isSuccess = false;
            isSuccess = await updateData();
            if (isSuccess) {
                editable.value = false
            }
        }

        /**  格式化函数 */
        function formatter(value: number | string, type: string) {
            return value && value !== 0 ? `${value}${type}` : '';
        }
        /**  解析函数 */
        function parser(value: number | string, type: string) {
            return `${value}`.replace(type, '');
        }

        return {
            modalParams,
            channelIndex,
            channelList,
            overloadList,
            editable,
            minu,
            second,
            changeCheck,
            updateData,
            handleSave,
            formatter,
            parser
        }
    }
})
</script>

<style lang="stylus" scoped>
.CKStatusOverload {
    .input-wrap {
        display: flex;
        .device-name {
            flex: 1;
        }
        .input-select {
            width: 150px;
            margin-top: 20px;
            margin-left: 10px;
        }
    }
    .text-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 5px 0;
        .title {
            color: #212121;
            font-size: 14px;
        }
        .desc {
            margin-right: 20px;
            font-size: 12px;
            color: #727272;
        }

        .input-box {
            display: flex;
            flex-direction: row;
            align-items: center;
            .action {
                cursor: pointer;
                margin-left: 8px;
                font-size: 18px;
            }
            .text {
                margin: 0;
                width: 100%;
                padding: 4px 11px;
                border-bottom: 1px solid #e8e8e8;
            }
            .input {
                width: 150px;
            }
        }

        .edit-box {
            font-size: 18px;
            cursor: pointer;
            padding: 4px 11px;
        }
    }
}
</style>
