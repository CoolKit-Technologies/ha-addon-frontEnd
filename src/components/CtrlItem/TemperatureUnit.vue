<template>
    <div class="temperature-unit">
        <div class="title">{{ $t('modal.temperatureUnit.name') }}</div>
        <a-select
            v-model:value="value"
            style="min-width: 120px"
            size="small"
            @change="handleChange" 
        >
            <a-select-option value="c">{{ $t('modal.temperatureUnit.c') }}</a-select-option>
            <a-select-option value="f">{{ $t('modal.temperatureUnit.f') }}</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'vuex';
import _ from 'lodash';

import { setTempUnit } from '@/api/device';

export default defineComponent({
    name: "TemperatureUnit",

    data() {
        return {
            value: '',
        }
    },

    computed: {
        ...mapState(['modalParams'])
    },

    methods: {
        async handleChange() {
            const { deviceId } = this.modalParams as any;
            await setTempUnit({
                id: deviceId,
                unit: this.value
            });
        }
    },

    created() {
        this.value = _.get(this, ['modalParams', 'unit'], 'c');
    }
});
</script>

<style lang="stylus" scoped>
.temperature-unit
    display flex
    justify-content space-between
    align-items center
    .title
        color #212121
        font-size 14px
</style>
