<template>
    <div class="scenes-item">
        <a-select :options="options" class="scenes-selecter" :value="selected" @change="handleChange"></a-select>
        <div class="actions">
            <a-button size="small" :type="scenesStatus === 'on' && 'primary'" @click="handleToggle('on')">{{ $t('modal.miniR3.on') }}</a-button>
            <a-button size="small" :type="scenesStatus === 'off' && 'primary'" @click="handleToggle('off')">{{ $t('modal.miniR3.off') }}</a-button>
            <a-button size="small" type="link" @click="handleRemove">{{ $t('modal.miniR3.remove') }}</a-button>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';
import { setCloudDevice } from '@/api/device';

type TypeLightScenesItem = {
    switch: string;
    index: number;
};

export default defineComponent({
    name: 'ScenesItem',
    props: {
        index: {
            default: 0,
            type: Number,
        },
    },
    data() {
        return {
            selected: 0,
            options: [
                {
                    label: `${this.$t('modal.miniR3.scene')}1`,
                    value: 0,
                },
                {
                    label: `${this.$t('modal.miniR3.scene')}2`,
                    value: 1,
                },
                {
                    label: `${this.$t('modal.miniR3.scene')}3`,
                    value: 2,
                },
                {
                    label: `${this.$t('modal.miniR3.scene')}4`,
                    value: 3,
                },
                {
                    label: `${this.$t('modal.miniR3.scene')}5`,
                    value: 4,
                },
                {
                    label: `${this.$t('modal.miniR3.scene')}6`,
                    value: 5,
                },
            ],
        };
    },
    computed: {
        ...mapState(['modalParams']),
        scenesStatus() {
            const modalParams = this.modalParams as any;
            const arr = _.get(modalParams, ['params', `lightScenes_${this.index}`], []) as TypeLightScenesItem[];
            const cur = arr.find((item) => item.index === this.selected) as any;
            if (cur) {
                return cur.switch;
            }
            return '';
        },
    },
    mounted() {},
    watch: {},
    methods: {
        handleChange(val: number) {
            this.selected = val;
        },
        handleToggle(status: string) {
            const modalParams = this.modalParams as any;
            const key = `lightScenes_${this.index}`;
            const tmp = _.cloneDeep(_.get(modalParams, ['params', key], [])) as TypeLightScenesItem[];
            // 如果该场景本没有被添加就直接添加
            if (this.scenesStatus === '') {
                tmp.push({
                    index: this.selected,
                    switch: status,
                });
            } else {
                tmp.forEach((item) => {
                    if (item.index == this.selected) {
                        item.switch = status;
                    }
                });
            }
            setCloudDevice({
                id: modalParams.deviceId,
                apikey: modalParams.apikey,
                params: {
                    [key]: tmp,
                },
            });
        },
        handleRemove() {
            // 如果该场景本没有被添加就直接返回
            if (this.scenesStatus === '') {
                return;
            }
            const modalParams = this.modalParams as any;
            const key = `lightScenes_${this.index}`;
            const tmp = _.cloneDeep(_.get(modalParams, ['params', key], [])) as TypeLightScenesItem[];
            setCloudDevice({
                id: modalParams.deviceId,
                apikey: modalParams.apikey,
                params: {
                    [key]: tmp.filter((item) => item.index !== this.selected),
                },
            });
        },
    },
});
</script>
<style lang="stylus" scoped>
.scenes-item
    display flex;
    justify-content space-between;

.scenes-selecter
    width 150px;

.scenes-item .actions > button
    padding 0 16px
    line-height 1.5
    &:not(:last-child)
        margin-right 8px;
</style>
