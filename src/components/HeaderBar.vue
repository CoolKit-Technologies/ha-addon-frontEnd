<template>
    <div class="header-bar">
        <h1 class="header-bar__title">eWeLink Smart Home</h1>
        <div class="header-bar__action">
            <a-button
                class="signin-btn"
                size="large"
                shape="round"
            >
                <template #icon>
                    <user-outlined />
                </template>
                sign in
            </a-button>
            <sync-outlined class="action-icon" />
            <more-outlined class="action-icon" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import {
    UserOutlined,
    SyncOutlined,
    MoreOutlined
} from '@ant-design/icons-vue';

export default defineComponent({
    name: 'HeaderBar',

    components: {
        UserOutlined,
        SyncOutlined,
        MoreOutlined
    }
});
</script>

<style lang="stylus" scoped>
$color-blue = #04a9f1
$color-blue-dark = #0394e4
$color-white = #ffffff

.header-bar
    display flex
    justify-content space-between
    align-items center
    background-color $color-blue
    padding 12px 16px

    .header-bar__title
        font-size 20px
        font-weight 400
        color $color-white
        margin 0

    .header-bar__action
        display flex
        align-items center

        .signin-btn
            margin-right 24px

        .action-icon
            border-radius 50%
            padding 8px
            font-size 22px
            color $color-white
            transition all 0.3s
            &:not(:last-child)
                margin-right 8px
            &:hover
                background-color $color-blue-dark
                cursor pointer
</style>
