<template>
  <div class="header-bar">
    <div class="header-bar__left">
      <h1 class="header-bar__title">eWeLink Smart Home</h1>
      <div class="header-bar__tab">
        <div
          class="tab-wrap"
          @click="changeMainShow(true)"
          :style="{ opacity: mainShow ? 1 : 0.5 }"
        >
          <div class="tab-icon"><img src="@/assets/ewlink.png" /></div>
          <div>{{ $t("common.tab.ewelinkTab") }}</div>
        </div>
        <div
          class="tab-wrap"
          @click="changeMainShow(false)"
          :style="{ opacity: mainShow ? 0.5 : 1 }"
        >
          <div class="tab-icon"><img src="@/assets/home-assist.png" /></div>
          <div>{{ $t("common.tab.haDeviceTab") }}</div>
        </div>
      </div>
    </div>
    <div class="header-bar__action">
      <!-- 登录按钮 -->
      <a-button
        class="signin-btn"
        size="large"
        shape="round"
        @click="openModalBox"
        :disabled="isLogin"
        :style="{ 'cursor': isLogin ? 'default' : 'pointer' }"
      >
        <template #icon><user-outlined /></template>
        <span v-if="!isLogin">{{ $t("common.text.signin") }}</span>
      </a-button>

      <!-- 下拉菜单 -->
      <a-dropdown trigger="hover" v-model:visible="dropDownVisible">
        <div style="margin-right: 18px; cursor: pointer; display: flex; justify-content: center; align-items: center;">
          <span v-if="isLogin" style="color: #fff; margin-right: 10px;">{{ username }}</span>
          <caret-down-outlined class="action-icon" @click.prevent />
        </div>

        <template #overlay>
          <a-menu class="drop-down-menu">
            <!-- Hidden offline device -->
            <a-menu-item v-if="isLogin" @click="changeHideDevice">
              <div class="item-wrapper">
                <eye-invisible-outlined class="item-wrapper__icon" v-if="hideUnavaDevice" />
                <eye-outlined class="item-wrapper__icon" v-else />
                <span class="item-wrapper__text">{{ $t('common.hidedevice') }}</span>
              </div>
            </a-menu-item>

            <!-- Language -->
            <a-menu-item>
              <div class="item-wrapper" @click.stop="changeLang">
                <global-outlined class="item-wrapper__icon" />
                <span class="item-wrapper__text">{{ $t('common.langSwitch') }}</span>
                <div :class="['lang-switch', lang === 'English' ? 'en' : 'cn']">
                  <span class="block cn">中文</span>
                  <span class="block en">EN</span>
                </div>
              </div>
            </a-menu-item>

            <!-- Sync Card -->
            <a-menu-item v-if="isLogin" @click="syncLovelace">
              <div class="item-wrapper">
                <span class="item-wrapper__icon text-icon" icon-text="Sync"></span>
                <span class="item-wrapper__text">{{ $t("common.syncLovelace") }}</span>
                <a-spin v-show="syncing" :indicator="indicator"/>
              </div>
            </a-menu-item>

            <!-- Feedback -->
            <a-menu-item @click="handleFeedback">
              <div class="item-wrapper">
                <question-circle-outlined class="item-wrapper__icon" />
                <span class="item-wrapper__text">
                  {{ $t("common.text.feedback") }}
                </span>
              </div>
            </a-menu-item>

            <!-- Logout -->
            <a-menu-item v-if="isLogin" @click="openLogoutModal">
              <div class="item-wrapper">
                <export-outlined class="item-wrapper__icon" />
                <span class="item-wrapper__text">
                  {{ $t("common.text.signout") }}
                </span>
              </div>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>

      <!-- 同步按钮 -->
      <sync-outlined v-if="mainShow" class="action-icon" :spin="spin" @click="refresh" />
    </div>

    <!-- 退出登录对话框 -->
    <a-modal
        v-model:visible="logoutModalVisible"
        :title="$t('modal.signoutConfirm')"
        @ok="handleSignout"
        :okText="$t('common.ok')"
        :cancelText="$t('common.cancel')"
        centered
    >
      <div class="content">
        {{ $t('modal.signoutConfirm') }}?
      </div>
      <!--
      <div class="content">
        <a-checkbox v-model:checked="removeEntityChecked">{{ $t('modal.removeEntityCheck') }}</a-checkbox>
      </div>
      -->
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, h } from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
import {
  UserOutlined,
  SyncOutlined,
  ExportOutlined,
  QuestionOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CaretDownOutlined,
  GlobalOutlined,
  QuestionCircleOutlined,
  LoadingOutlined
} from "@ant-design/icons-vue";
import _ from "lodash";

import { getConfig } from "@/utils/config";
import { openWindow } from "@/utils/etc";
import { logout } from "@/api/user";
import { syncLovelaceCard } from "@/api/util";
import { getDeviceListRefresh } from "@/api/device";

const indicator = h(LoadingOutlined, {
  style: { fontSize: '24px' },
  spin: true,
})

export default defineComponent({
  name: "HeaderBar",

  components: {
    UserOutlined,
    SyncOutlined,
    ExportOutlined,
    QuestionOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
    CaretDownOutlined,
    GlobalOutlined,
    QuestionCircleOutlined
  },

  data() {
    return {
      mainShow: true, //易微联设备展示
      spin: false,
      syncing: false,
      logoutModalVisible: false,
      removeEntityChecked: false,
      dropDownVisible: false,
      indicator
    };
  },

  computed: {
    lang() {
      if (this.$root?.$i18n.locale === "en") {
        return "中文";
      } else {
        return "English";
      }
    },
    ...mapState(["isLogin", "username", "hideUnavaDevice"]),
  },

  methods: {
    async refresh() {
      this.spin = true;
      setTimeout(() => {
        this.spin = false;
      }, 2000);
      const res = await getDeviceListRefresh();
      if (res.error === 0) {
        this.setOriginDeviceList(res.data);
        message.success(this.$t('common.success.getdevice'));
      } else {
        message.error(this.$t("common.error.getdevice"));
      }
    },
    async handleSignout() {
      const res = await logout({ removeEntity: this.removeEntityChecked });
      if (res.error !== 0) {
        console.error("logout failed:", res.msg);
      } else {
        this.setIsLogin(false);
        message.success(this.$t("form.success.logout"));
      }
      this.closeLogoutModal();
    },
    handleFeedback() {
      this.dropDownVisible = false;
      openWindow(getConfig().feedbackUrl);
    },
    openModalBox() {
      // 已登录，不再打开登录弹框
      if (this.isLogin) {
        return;
      }
      this.openModal({
        type: "login",
        params: null,
      });
    },
    openLogoutModal() {
      this.dropDownVisible = false
      this.logoutModalVisible = true;
    },
    closeLogoutModal() {
        this.logoutModalVisible = false;
    },
    changeHideDevice() {
      this.setHideUnavaDevice(!this.hideUnavaDevice);
      this.dropDownVisible = false;
    },
    changeLang() {
      if (this.$root?.$i18n.locale === "en") {
        this.$root.$i18n.locale = "zh";
        this.setLocale("zh");
        this.setAntdLocale("zh");
      } else if (this.$root?.$i18n.locale === "zh") {
        this.$root.$i18n.locale = "en";
        this.setLocale("en");
        this.setAntdLocale("en");
      }
      this.getCmsInfo();
    },
    async syncLovelace() {
      this.$data.syncing = true;
      const { error } = await syncLovelaceCard();
      this.$data.syncing = false;
      this.dropDownVisible = false
      if (error) {
        message.error(this.$t("common.sync.failed"));
      } else {
        message.success(this.$t("common.sync.success"));
      }
    },
    changeMainShow(mainShow: boolean) {
      //未登录时点击ha设备同步导航栏
      if (!this.isLogin && mainShow == false) {
        message.warning(this.$t("haDevice.loginFirst"));
        return;
      }
      this.mainShow = mainShow;
      this.$emit("changeMainShow", mainShow);
    },
    ...mapMutations([
      "setIsLogin",
      "setOriginDeviceList",
      "setLocale",
      "setAntdLocale",
      "setHideUnavaDevice"
    ]),
    ...mapActions(["openModal", "getCmsInfo"]),
  },

  mounted() {
    this.getCmsInfo();
    this.refresh = _.throttle(this.refresh, 2200, {
      leading: true,
      trailing: false,
    }) as any;
  },
  watch: {
    isLogin(newVal, oldVal) {
      console.log("loginStatus----------", newVal, oldVal);
      this.changeMainShow(true)
    },
  },
});
</script>

<style lang="stylus" scoped>
$color-blue = #04a9f1;
$color-blue-dark = #0394e4;
$color-white = #ffffff;

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $color-blue;
  min-height: 64px;
  padding: 12px 16px;

  .header-bar__title {
    font-size: 18px;
    font-weight: 400;
    color: $color-white;
  }

  .header-bar__tab {
    display: flex;
    justify-content: space-between;

    .tab-wrap {
      display: flex;
      margin-right: 60px;
      color: $color-white;
      font-size: 16px;
      cursor: pointer;

      .tab-icon {
        width: 24px;
        height: 24px;
        overflow: hidden;
        margin-right: 6px;

        img {
          width: 100%;
          height: 100%;
          margin-bottom: 4px;
        }
      }
    }
  }

  .header-bar__action {
    display: flex;
    align-items: center;

    .signin-btn {
      margin-right: 18px;
      background: transparent;
      border: none;
      color: #fff;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      ::v-deep(.anticon) {

        border: 2px solid #fff;
        border-radius: 50%;
        padding: 2px;
        width: 40px;
        height: 40px;
        > svg {
          font-size: 28px;
        }
      }
    }

    .action-icon {
      border-radius: 50%;
      padding: 8px;
      font-size: 22px;
      color: $color-white;
      transition: all 0.3s;

      &:not(:last-child) {
        margin-right: 8px;
      }

      &:hover {
        background-color: $color-blue-dark;
        cursor: pointer;
      }
    }
  }
}

.drop-down-menu {
  background: rgba(#000, .9);
  ::v-deep(.ant-dropdown-menu-item) {
    padding: 10px 12px;
    color: #fff;

    &:hover {
      color: rgba(#000, .85);
    }

    &.no-hover-action:hover {
      cursor: default;
      background: none;
    }

    .item-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      width: 300px;

      .item-wrapper__icon {
        margin-right: 10px;
        padding: 3px;
        font-size: 24px;

        &.text-icon {
          width: 30px;
          height: 30px;
          &::before {
            content: attr(icon-text);
            font-size: 12px;
            display: block;
            height: 100%;
            width: 100%;
          }
        }
      }

      .item-wrapper__text {
        flex: 1;
      }

      .lang-switch {
        position: relative;
        width: 120px;
        height: 30px;
        background: #a1a1a1;
        border-radius: 10px;
        text-align: center;
        font-size: 14px;
        line-height: 30px;
        color: #424242;
        overflow: hidden;
        cursor: pointer;

        .block {
          position: relative;
          display: inline-block;
          width: 50%;
          height: 100%;
          background: transparent;
          border-radius: 8px;
        }

        &.en {
          .block {
            &.en {
              color: #282828;
            }
            &.cn {
              color: #fff;
              background: #5192fd;
            }
          }
        }

        &.cn {
          .block {
            &.cn {
              color: #282828;
            }
            &.en {
              color: #fff;
              background: #5192fd;
            }
          }
        }
      }
    }
  }
}
</style>
