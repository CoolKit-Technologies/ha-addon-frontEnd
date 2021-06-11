<template>
    <div class="firmware-upgrade-item">
        <div class="text-box">
            <div class="title">{{ $t('modal.firmwareUpgrade.title') }}</div>
            <div class="desc">{{ $t('modal.firmwareUpgrade.desc', { version: '1.2.3' }) }}</div>
        </div>
        <img src="@/assets/upgrade.svg" alt="upgrade icon" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import _ from 'lodash';

export default defineComponent({
    name: 'FirmwareUpgrade',

    data() {
        return {
            value: '',
        };
    },

    computed: {
        ...mapState(['modalParams']),
    },

    methods: {
        handleChange() {
            // todo 请求处理
            console.log('当前Power-on state:', this.value);
        },
    },

    created() {
        this.value = _.get(this, ['modalParams', 'params', 'sledOnline'], '');
    },
});
</script>

<style lang="stylus" scoped>
.firmware-upgrade-item
    display flex
    justify-content space-between
    align-items center
    .text-box
        display flex
        align-items center
        .title
            color #212121
            font-size 14px
        .desc
            margin-left 12px
            font-size 12px
            color #727272
</style>
