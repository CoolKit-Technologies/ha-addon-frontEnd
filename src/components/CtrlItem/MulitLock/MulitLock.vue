<template>
    <div class="multi-lock-box">
        <div class="top-box">
            <div class="title">{{ $t('modal.interlock') }}</div>
            <img @click="handleAdd" src="@/assets/add.png" alt="" :class="`add-icon ${localLocks.length >= maxLocksLength && 'disabled'}`" />
        </div>
        <div class="content">
            <actions-item
                v-for="(item, index) in localLocks"
                :index="index"
                :locks="localLocks"
                :lockData="localLocks[index]"
                :channelsDisabledStatus="channelsDisabledStatus"
                @onRemove="onRemove"
            />
        </div>
    </div>
</template>

<script lang="ts">
import _ from 'lodash';
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import ActionsItem from './ActionsItem.vue';
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
    name: 'MulitLock',
    components: {
        ActionsItem,
    },
    data() {
        return {
            localLocks: [] as TypeLockItem[],
        };
    },
    computed: {
        ...mapState(['modalParams']),
        channelsDisabledStatus() {
            const {
                params: { locks = [] },
            } = this.modalParams as any;
            const disabledArr = [false, false, false, false];
            // 筛选出params.lock中已存在的通道（不管互锁有无打开）
            const arr = (locks as TypeLockItem[]).reduce((arr, cur) => arr.concat(cur.outlets), [] as number[]);
            arr.forEach((item) => {
                disabledArr[item] = true;
            });
            return disabledArr;
        },
        maxLocksLength() {
            const { uiid } = this.modalParams as any;
            switch (uiid) {
                case 139:
                    return 1;
                case 140:
                    return 1;
                case 141:
                    return 2;
                default:
                    return 1;
            }
        },
    },
    methods: {
        handleAdd() {
            if (this.localLocks.length >= this.maxLocksLength) {
                return;
            }
            const counter = this.channelsDisabledStatus.reduce((count, cur) => {
                if (!cur) {
                    count++;
                }
                return count;
            }, 0);
            if (counter > 1) {
                this.localLocks = [...this.localLocks, { outlets: [], enabled: 0 }];
            }
        },
        onRemove(index: number) {
            const {
                params: { locks = [] },
                deviceId,
                apikey,
            } = this.modalParams as any;
            if (index >= locks.length) {
                // 无须调接口locks
                const tmp = _.cloneDeep(this.localLocks);
                tmp.splice(index, 1);
                this.localLocks = tmp;
            } else {
                const tmp = _.cloneDeep(locks);
                tmp.splice(index, 1);
                setCloudDevice({
                    id: deviceId,
                    apikey,
                    params: {
                        locks: tmp,
                    },
                });
            }
        },
    },
    mounted() {
        const {
            params: { locks = [] },
        } = this.modalParams as any;
        this.localLocks = _.cloneDeep(locks);
        // console.log('====', this.localLocks);
    },
    watch: {
        'modalParams.params.locks': function(val, oldVal) {
            this.localLocks = val;
        },
    },
});
</script>

<style lang="stylus" scoped>
.multi-lock-box
    .top-box
        display flex
        justify-content space-between
        align-items center
        .title
            color #212121
            font-size 14px
        .add-icon
            width 18px
            margin-right 4px
            cursor pointer
            &:hover
                filter  brightness(0.8)
            &.disabled
                cursor not-allowed

    .content
        .select-item
            display flex
            justify-content space-between
            align-items center
            .channels-selecter
                margin-right 20px
            .lock-switcher
                margin-right 20px
</style>
