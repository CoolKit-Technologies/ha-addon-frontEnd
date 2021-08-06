<template>
    <div class="select-item">
        {{ $t('modal.interlock') }}{{ index + 1 }}
        <div>
            <a-select
                v-model:value="selected"
                class="channels-selecter"
                :options="options"
                mode="multiple"
                size="small"
                placeholder="Please select"
                style="width: 150px"
                @blur="handleBlur"
            />
            <a-switch v-model:checked="lockData.enabled" @click="handleToggle" class="lock-switcher" />
            <a-button type="link" @click="handleRemove">{{ $t('modal.miniR3.remove') }}</a-button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';
import { setCloudDevice } from '@/api/device';

type TypeLockItem = {
    enabled: number;
    outlets: number[];
};

const lenMap = new Map([
    [139, 2],
    [140, 3],
    [141, 4],
]);

export default defineComponent({
    name: 'ActionsItem',
    data() {
        return {
            selected: [],
        };
    },
    props: {
        index: {
            type: Number,
            required: true,
        },
        locks: {
            type: Array,
            required: true,
        },
        lockData: {
            type: Object,
            required: true,
        },
        channelsDisabledStatus: {
            type: Array,
            required: true,
        },
        onRemove: {
            required: true,
        },
    },
    computed: {
        ...mapState(['modalParams']),
        options(): Array<any> {
            const { uiid } = this.modalParams as any;
            const { $t } = this as any;
            const { channelsDisabledStatus } = this.$props as any;
            const len = lenMap.get(uiid)!;
            return Array.from({ length: len }, (item, i) => {
                return {
                    label: `${$t('card.channel')}${i + 1}`,
                    value: i,
                    disabled: channelsDisabledStatus[i] && !this.lockData.outlets.includes(i),
                };
            });
        },
    },
    methods: {
        // handleChange(e: any) {
        //     console.log('selected--> ', e);
        // },
        handleBlur(e: any) {
            const modalParams = this.modalParams as any;
            let tmp = _.cloneDeep(this.locks) as TypeLockItem[];
            tmp[this.index] = {
                outlets: this.selected,
                enabled: this.lockData.enabled,
            };
            tmp = tmp.filter((item) => item.outlets.length > 1);
            setCloudDevice({
                id: modalParams.deviceId,
                apikey: modalParams.apikey,
                params: {
                    locks: tmp,
                },
            });
        },
        handleRemove() {
            this.$emit('onRemove', this.index);
        },
        handleToggle(checked: boolean) {
            let tmp = _.cloneDeep(this.locks) as TypeLockItem[];
            tmp[this.index] = {
                enabled: checked ? 1 : 0,
                outlets: this.selected,
            };
            const modalParams = this.modalParams as any;
            setCloudDevice({
                id: modalParams.deviceId,
                apikey: modalParams.apikey,
                params: {
                    locks: tmp,
                },
            });
        },
    },
    mounted() {
        this.$data.selected = this.lockData.outlets;
    },
});
</script>

<style lang="stylus" scoped>
.select-item
    display flex
    justify-content space-between
    align-items center
    .channels-selecter
        margin-right 20px
    .lock-switcher
        margin-right 20px
</style>
