<template>
    <div class="container">
        <div class="logo">
            <img
                alt="eWelink Logo"
                src="@/assets/ewelink-logo.png"
            />
            <span class="slogan">{{ $t('common.slogan') }}</span>
        </div>
        <form class="login-form">
            <a-select
                style="width: 100%; margin-bottom: 14px;"
                :placeholder="$t('form.placeholder.country')"
                showSearch
                :filterOption="true"
                @change="selectCountry"
            >
                <a-select-option
                    v-for="item in regionMap"
                    :key="item.i"
                    :value="`${item.name} (${item.code})`"
                >
                    {{ `${item.name} (${item.code})` }}
                </a-select-option>
            </a-select>
            <a-input
                v-model:value="username"
                class="form-item"
                :placeholder="$t('form.placeholder.username')"
                @pressEnter="signin"
                allowClear
            />
            <a-input-password
                v-model:value="password"
                class="form-item"
                :placeholder="$t('form.placeholder.password')"
                @pressEnter="signin"
                allowClear
            />
            <a-button
                :loading="btnLoading"
                type="primary"
                @click="signin"
                block
            >
                {{ $t('common.text.signin') }}
            </a-button>
        </form>
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
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { message } from 'ant-design-vue';

import { getConfig } from '@/utils/config';
import { login } from '@/api/user';
import { getDeviceListRefresh } from '@/api/device';

export default defineComponent({
    name: 'LoginForm',

    data() {
        const { downloadAppUrl } = getConfig();
        return {
            downloadAppUrl,
            username: '',
            password: '',
            country: '',
            btnLoading: false
        };
    },

    computed: {
        ...mapGetters(['regionMap'])
    },

    methods: {
        verify() {
            if (this.country.trim() === '') {
                message.warning(this.$t('form.error.nocountry'));
                return false;
            }

            if (this.username.trim() === '') {
                message.warning(this.$t('form.error.nousername'));
                return false;
            }

            if (this.password.trim() === '') {
                message.warning(this.$t('form.error.nopassword'));
                return false;
            }
            return true;
        },
        async signin() {
            if (!this.verify()) {
                return;
            }

            this.btnLoading = true;
            const params: any = {
                lang: 'en',
                countryCode: this.country,
                password: this.password
            };
            if (this.username.indexOf('@') === -1) {
                params.phoneNumber = `${this.country.trim()}${this.username.trim()}`;
            } else {
                params.email = this.username.trim();
            }

            const res = await login(params);
            this.btnLoading = false;
            if (res.error !== 0) {
                message.error(this.$t('form.error.login', { msg: res.msg }));
            } else {
                message.success(this.$t('form.success.login'));
				const userData = res.data;
				const { user: { apikey = '' } } = userData || {};
				this.setUserApikey(apikey);
                this.setIsLogin(true);
                this.setUsername(res.data.user.phoneNumber || res.data.user.email);
                setTimeout(() => {
                    this.closeModal();
                }, 1000);
                const deviceRes = await getDeviceListRefresh();
                if (deviceRes.error === 0) {
                    this.setOriginDeviceList(deviceRes.data);
                } else {
                    message.error(this.$t('common.error.getdevice'));
                }
            }
        },
        selectCountry(e: string) {
            const start = e.indexOf('(');
            const end = e.indexOf(')');
            this.country = e.slice(start + 1, end);
        },
        ...mapMutations(['setIsLogin', 'setOriginDeviceList', 'setUsername', 'setUserApikey']),

        ...mapActions(['closeModal'])
    }
});
</script>

<style lang="stylus" scoped>
.container
    & > *:not(:last-child)
        margin-bottom 20px

    .logo
        display flex
        flex-direction column
        align-items center

    .slogan
        margin-top 10px

    .login-form
        max-width 404px
        margin auto
        .form-item
            margin-bottom 14px

    .download
        margin-top 10px
        text-align center
</style>
