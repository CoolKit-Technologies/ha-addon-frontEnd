<template>
    <!-- UIID 190 的功能：重制用电量 -->
    <div class="reset-consumption">
        <div class="text">
            <span>{{$t('modal.resetConsumption')}}</span>
        </div>
        <div class="action">
            <a-popconfirm :title="$t('modal.confirmToReset')" :ok-text="$t('modal.confirm')" :cancel-text="$t('modal.cancel')" @confirm="resetConsumption">
                <reload-outlined class="icon" />
            </a-popconfirm>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ReloadOutlined } from '@ant-design/icons-vue'
import { setCloudDevice } from '@/api/device';

export default defineComponent({
    name: 'ResetConsumption',

    components: {
        ReloadOutlined
    },

    props: {
        cardData: {
            required: true
        }
    },

    methods: {
        resetConsumption() {
            const { deviceId, apikey } = this.cardData as any;
            setCloudDevice({
                id: deviceId,
                apikey,
                params: {
                    totalKwh: 'reset'
                }
            });
        }
    }
});
</script>

<style scoped>
.reset-consumption {
    display: flex;
    justify-content: space-between;
}

.action .icon {
    font-size: 18px;
    color: rgb(56, 158, 253);
    cursor: pointer;
}
</style>
