<template>
    <div class="device-name">
        <div class="title">
            {{ type === 'device' ? $t('modal.deviceName') : $t('modal.channelName') }}
        </div>
        <div class="input-box">
            <a-input v-model:value="value" v-if="editable" />
            <p class="text" v-else>{{ value }}</p>
            <div class="action" @click="handleSave">
                <SaveOutlined v-if="editable" />
                <EditOutlined v-else />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState } from 'vuex';
import { EditOutlined, SaveOutlined } from '@ant-design/icons-vue';

import { setName } from '@/api/device';

export default defineComponent({
    name: 'DeviceName',

    components: {
        EditOutlined,
        SaveOutlined,
    },

    data() {
        return {
            editable: false,
            value: '',
        };
    },

    props: {
        // type: 'device', 'channel'
        // 'device' - update device name
        // 'channel' - update device channel name
        type: {
            default: 'device',
            required: false,
        },
        index: {
            default: 0
        }
    },

    computed: {
        ...mapState(['modalParams']),
    },

    methods: {
        async handleSave() {
            if (this.editable) {
                await setName({
                    id: this.modalParams.deviceId,
                    newName: this.value
                });
            }
            this.editable = !this.editable;
        },
    },

    created() {
        this.value = this.modalParams.deviceName;
        console.log('>_< ...', this.index);
    },
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
            font-size 18px
        .text
            margin 0
            width 100%
            cursor not-allowed
            padding 4px 11px
            border-bottom 1px solid white
    .ant-input
        border-radius 0
        border-top: none
        border-left: none
        border-right: none
</style>
