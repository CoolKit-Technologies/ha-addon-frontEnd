<!-- NS Panel 温度单位控制 -->
<template>
    <div class="ctrl-temp">
        <div class="title">{{ $t('modal.temperatureUnit.name') }}</div>
        <a-select class="select" size="small" :value="tempUnit" @change="handleChange">
            <a-select-option v-for="item in options" :key="item.id">{{ item.title }}</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { setCloudDevice } from '@/api/device';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'CtrlTemp',

    props: {
        cardData: {
            required: true,
            type: Object
        }
    },

    data() {
        const options = [
            {
                id: 0,
                title: this.$t('modal.temperatureUnit.c'),
                value: 0
            },
            {
                id: 1,
                title: this.$t('modal.temperatureUnit.f'),
                value: 1
            },
        ];

        return {
            options
        };
    },

    computed: {
        tempUnit() {
            return this.cardData.params.tempUnit;
        }
    },

    methods: {
        handleChange(v: any) {
            const { deviceId, apikey } = this.cardData;
            setCloudDevice({
                id: deviceId,
                apikey,
                params: {
                    tempUnit: v
                }
            });
        }
    }
});
</script>

<style lang="stylus" scoped>
.ctrl-temp
    display flex
    justify-content space-between

    .select
        width 150px
</style>
