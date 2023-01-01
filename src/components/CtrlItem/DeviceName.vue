<template>
    <div class="device-name">
        <div class="title">{{ title }}</div>
        <div class="input-box">
            <a-input v-model:value="value" v-if="editable" :maxlength="14" />
            <p class="text" v-else>{{ value ? value : `${$t('card.channel')}${index + 1}` }}</p>
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

import { updateDeviceOrChannelName, updateRemoteOrButtonName } from '@/api/device';

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
        // 'remote' - update remote name
        // 'button' - update button name
        type: {
            default: 'device',
            required: false,
        },
        index: {
            default: 0,
        },
    },

    computed: {
        title() {
            const { type, $t } = this as any;
            if (type === 'device') {
                return $t('modal.deviceName');
            } else if (type === 'channel') {
                return $t('modal.channelName');
            } else if (type === 'remote') {
                return $t('modal.remoteName');
            } else if (type === 'button') {
                return $t('modal.buttonName');
            }
        },
        ...mapState(['modalParams']),
    },

    methods: {
        async handleSave() {
            if (this.editable) {
                if (this.type === 'device') {
                    await updateDeviceOrChannelName('deviceName', this.modalParams, this.value);
                } else if (this.type === 'channel') {
                    await updateDeviceOrChannelName('channelName', this.modalParams, this.value, this.index);
                } else if (this.type === 'remote') {
                    await updateRemoteOrButtonName('remote', this.modalParams, this.value, -1);
                } else if (this.type === 'button') {
                    await updateRemoteOrButtonName('button', this.modalParams, this.value, this.index);
                }
            }
            this.editable = !this.editable;
        },
        initValue() {
            if (this.type === 'device') {
                this.value = this.modalParams.deviceName;
            } else if (this.type === 'channel') {
                this.value = (this.modalParams.tags && this.modalParams.tags[this.index]) ? this.modalParams.tags[this.index] : '';
            } else if (this.type === 'remote') {
                this.value = this.modalParams.tags.zyx_info[this.modalParams.cardIndex].name;
            } else if (this.type === 'button') {
                this.value = Object.values(this.modalParams.tags.zyx_info[this.modalParams.cardIndex].buttonName[this.index])[0] as string;
            }
        }
    },

    created() {
        this.initValue()
    },

    watch: {
        'index': function() {
            this.initValue();
            this.editable = false;
        }
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
            font-size 18px
        .text
            margin 0
            width 100%
            height 29px
            padding 4px 11px
            border-bottom 1px solid #e8e8e8
    .ant-input
        border-radius 0
        border-top: none
        border-left: none
        border-right: none
</style>
