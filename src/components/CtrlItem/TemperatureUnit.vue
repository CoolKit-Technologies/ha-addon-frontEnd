<template>
    <div class="temperature-unit">
        <div class="title">{{ $t('modal.temperatureUnit') }}</div>
        <a-select
            v-model:value="value"
            style="width: 120px"
            @change="handleChange" 
        >
            <a-select-option value="c">Celsius[℃]</a-select-option>
            <a-select-option value="f">Fahrenheit[℉]</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'vuex';
import _ from 'lodash';

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
        handleChange() {
            // todo 请求处理
            console.log('Current temperature unit-->', this.value);
            
        }
    },

    created() {
        this.value = _.get(this,['modalParams', 'unit'], 'c');
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
        font-size 12px
    
</style>
