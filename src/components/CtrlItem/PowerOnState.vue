<template>
    <div class="power-on-state">
        <div class="title">{{ $t('modal.powerOnState') }}</div>
        <a-select
            v-model:value="value"
            style="min-width: 120px"
            size="small"
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

    props: {
        index: {
            default: 0
        },
        // If current device is multi-channel
        multi: {
            default: false
        }
    },

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
        const { type, uiid, params, cardIndex } = this.modalParams;
        if (type === 1 && uiid === 1) {
            // DIY device
            this.value = params.data1.startup;
        } else if (
            uiid === 2 || uiid === 3 || uiid === 4 || uiid === 7
            || uiid === 8 || uiid === 9 || uiid === 113 || uiid === 114
        ) {
            // Multi-channel
            this.value = params.configure[this.index].startup;
        } else if (uiid === 126) {
            // Dual R3
            this.value = params.configure[cardIndex].startup;
        } else {
            // Single channel
            this.value = params.startup;
        }
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
