<template>
    <div class="firmware-upgrade-item">
        <div class="text-box">
            <div class="title">{{ $t('modal.firmwareUpgrade.title') }}</div>
            <div class="desc" v-if="isNonLatest">{{ $t('modal.firmwareUpgrade.nonLatest', { version: otaInfo.version }) }}</div>
            <div class="desc" v-else>{{ $t('modal.firmwareUpgrade.latest') }}</div>
        </div>
        <div class="action" @click="upgradeFw" v-if="isNonLatest">
            <img src="@/assets/upgrade.svg" alt="upgrade icon" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';
import { getOtaInfo, upgradeDeviceFw } from '@/api/device';

export default defineComponent({
    name: 'FirmwareUpgrade',

    data() {
        return {
            otaInfo: {},
        };
    },

    computed: {
        ...mapState(['modalParams']),
        isNonLatest() {
            const _this = this as any;
            const oldVersion = _.get(this, 'modalParams.params.fwVersion');
            const newVersion = _.get(this, 'otaInfo.version');
            if (!oldVersion || !newVersion) {
                return false;
            }
            return oldVersion !== newVersion;
        },
    },

    methods: {
        async upgradeFw() {
            const { deviceId, apikey, model } = this.modalParams;
            const res = await upgradeDeviceFw({
                id: deviceId,
                apikey,
                params: {
                    model,
                    binList: _.get(this, ['otaInfo', 'binList']),
                    version: _.get(this, ['otaInfo', 'version']),
                },
            });
        },
    },

    async created() {
        const {
            deviceId,
            model,
            params: { fwVersion },
        } = this.modalParams;

        const res = await getOtaInfo({
            list: [
                {
                    deviceid: deviceId,
                    model,
                    version: fwVersion,
                },
            ],
        });
        if (res.error === 0) {
            this.$data.otaInfo = _.get(res, ['data', 'otaInfoList', 0], {});
        }
    },
});
</script>

<style lang="stylus" scoped>
.firmware-upgrade-item
    display flex
    align-items center
    .text-box
        flex 1
        display flex
        justify-content space-between
        align-items center
        .title
            color #212121
            font-size 14px
        .desc
            margin-right 20px
            font-size 12px
            color #727272
    .action
        display flex
        width 44px
        justify-content center
        align-items center
        cursor pointer
</style>
