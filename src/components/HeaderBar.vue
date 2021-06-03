<template>
    <div class="header-bar">
        <h1 class="header-bar__title">eWeLink Smart Home</h1>
        <div class="header-bar__action">
            <a-button @click="toggle">toggle</a-button>
            <a-button
                v-if="!isLogin"
                class="signin-btn"
                size="large"
                shape="round"
            >
                <template #icon>
                    <user-outlined />
                </template>
                {{ $t('common.text.signin') }}
            </a-button>
            <sync-outlined class="action-icon" :spin="spin" @click="refresh" />
            <a-dropdown>
                <more-outlined class="action-icon" />
                <template #overlay>
                    <a-menu>
                        <a-menu-item v-if="isLogin">
                            <div class="item-wrapper">
                                <export-outlined class="item-wrapper__icon" />
                                <span class="item-wrapper__text">
                                    {{ $t('common.text.signout') }}
                                </span>
                            </div>
                        </a-menu-item>
                        <a-menu-item>
                            <div class="item-wrapper">
                                <question-outlined class="item-wrapper__icon" />
                                <span class="item-wrapper__text">
                                    {{ $t('common.text.feedback') }}
                                </span>
                            </div>
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapState, mapMutations } from 'vuex';
import {
    UserOutlined,
    SyncOutlined,
    MoreOutlined,
    ExportOutlined,
    QuestionOutlined
} from '@ant-design/icons-vue';
import _ from 'lodash';

export default defineComponent({
    name: 'HeaderBar',

    components: {
        UserOutlined,
        SyncOutlined,
        MoreOutlined,
        ExportOutlined,
        QuestionOutlined
    },

    data() {
        return {
            spin: false
        };
    },

    computed: {
        ...mapState(['isLogin'])
    },

    methods: {
        refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 2000);
        },
        toggle() {
            console.log(this);
            this.setIsLogin(!this.isLogin);
        },
        ...mapMutations(['setIsLogin'])
    },

    mounted() {
        this.refresh = _.throttle(this.refresh, 2200, { 'leading': true, 'trailing': false });
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
    min-height 64px
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

.item-wrapper
    display flex
    justify-content center
    align-items center
    font-size 16px

    .item-wrapper__icon
        margin-right 16px
        margin-left 6px

    .item-wrapper__text
        flex 1
</style>
