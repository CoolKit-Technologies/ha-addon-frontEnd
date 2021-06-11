<template>
    <div class="power-on-state">
        <div class="title">{{ $t('modal.powerOnState') }}</div>
        <a-select
            v-model:value="value"
            style="width: 120px"
            @change="handleChange"
        >
            <a-select-option value="on">On</a-select-option>
            <a-select-option value="off">Off</a-select-option>
            <a-select-option value="stay">Last state</a-select-option>
        </a-select>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'vuex';
import _ from 'lodash';

export default defineComponent({
    name: "PowerOnState",

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
            console.log('当前Power-on state:', this.value);
            
        }
    },

    created() {
        this.value = _.get(this,['modalParams', 'params', 'sledOnline'], '');
    }
});
</script>

<style lang="stylus" scoped>
.power-on-state
    display flex
    justify-content space-between
    align-items center
    .title
        color #212121
        font-size 14px
    
</style>
