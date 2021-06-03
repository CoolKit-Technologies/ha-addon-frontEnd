<template>
    <div class="container">
        <div class="logo">
            <img
                alt="eWelink Logo"
                src="@/assets/ewelink-logo.png"
            />
            <span class="slogan">{{ $t('common.slogan') }}</span>
        </div>
        <div class="login-form">
            <a-select
                style="width: 100%; margin-bottom: 14px;"
                :placeholder="$t('form.placeholder.country')"
            />
            <a-input
                class="form-item"
                :placeholder="$t('form.placeholder.username')"
            />
            <a-input-password
                class="form-item"
                :placeholder="$t('form.placeholder.password')"
            />
            <a-button
                type="primary"
                block
            >
                {{ $t('common.text.signin') }}
            </a-button>
        </div>
        <div class="download">
            <a-typography-link
                :href="downloadAppUrl"
                target="_blank"
            >
                {{ $t('common.downloadapp') }}
            </a-typography-link>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getConfig } from '@/utils/config';

export default defineComponent({
    name: 'LoginForm',

    data() {
        const { downloadAppUrl } = getConfig();
        return {
            downloadAppUrl
        };
    }
});
</script>

<style lang="stylus" scoped>
.container
    background-color #ddd
    & > div:not(:last-child)
        margin-bottom 20px

    .logo
        display flex
        flex-direction column
        align-items center

    .login-form
        .form-item
            margin-bottom 14px

    .download
        text-align center
</style>
