<template>
    <div class="device-name">
        <div class="title">{{ $t('modal.deviceName') }}</div>
        <div class="input-box">
            <a-input v-model:value="value" v-if='editable'>
            </a-input>
            <p class="text" v-else>{{ value }}</p>
            <div class="action" @click="handleSave">
                <SaveOutlined  v-if="editable"/>
                <EditOutlined  v-else/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from 'vuex';

import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';

export default defineComponent({
    name: "DeviceName",

    components:{
        EditOutlined,
        SaveOutlined,
    },

    data() {
        return {
            editable: false,
            value: '',
        }
    },

    computed: {
        ...mapState(['modalParams'])
    },
    methods: {
        handleSave() {
            const status = this.editable;
            if(status) {
                // todo 接口请求
                console.log(this.value);
            }
            this.editable = !status;
        }
    },

    created() {
        this.value = this.modalParams.deviceName;
    }
});
</script>

<style lang="stylus" scoped>
.device-name
    .title
        color #212121
        font-size 14px
    .input-box
        display flex
        flex-direction row
        align-items center
        .action
            cursor pointer
            margin-left 8px
        .text 
            margin 0
            width 100%
            cursor not-allowed
            padding 4px 11px
            border-bottom 1px solid #d9d9d9
    .ant-input
        border-radius 0
        border-top: none
        border-left: none
        border-right: none
</style>
