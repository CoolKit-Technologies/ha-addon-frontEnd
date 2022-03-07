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
      <a-button
        v-if="!isLogin"
        class="signin-btn"
        size="large"
        shape="round"
        @click="openModalBox"
      >
        <template #icon>
          <user-outlined />
        </template>
        {{ $t("common.text.signin") }}
      </a-button>
      <a-button style="margin-right: 10px" @click="changeLang">{{
        lang
      }}</a-button>
      <a-button
        :loading="syncing"
        style="margin-right: 10px"
        @click="syncLovelace"
        >{{ $t("common.syncLovelace") }}</a-button
      >
      <sync-outlined class="action-icon" :spin="spin" @click="refresh" />
      <a-dropdown>
        <more-outlined class="action-icon" />
        <template #overlay>
          <a-menu>
            <a-menu-item v-if="isLogin" @click="handleSignout">
              <div class="item-wrapper">
                <export-outlined class="item-wrapper__icon" />
                <span class="item-wrapper__text">
                  {{ $t("common.text.signout") }}
                </span>
              </div>
            </a-menu-item>
            <a-menu-item @click="handleFeedback">
              <div class="item-wrapper">
                <question-outlined class="item-wrapper__icon" />
                <span class="item-wrapper__text">
                  {{ $t("common.text.feedback") }}
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
import { defineComponent } from "vue";
import { mapState, mapMutations, mapActions } from "vuex";
import { message } from "ant-design-vue";
import {
  UserOutlined,
  SyncOutlined,
  MoreOutlined,
  ExportOutlined,
  QuestionOutlined,
} from "@ant-design/icons-vue";
import _ from "lodash";

import { getConfig } from "@/utils/config";
import { openWindow } from "@/utils/etc";
import { logout } from "@/api/user";
import { syncLovelaceCard } from "@/api/util";
import { getDeviceListRefresh } from "@/api/device";

export default defineComponent({
  name: "HeaderBar",

  components: {
    UserOutlined,
    SyncOutlined,
    MoreOutlined,
    ExportOutlined,
    QuestionOutlined,
  },

  data() {
    return {
      mainShow: true, //易微联设备展示
      spin: false,
      syncing: false,
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
    ...mapState(["isLogin"]),
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
      } else {
        message.error(this.$t("common.error.getdevice"));
      }
    },
    async handleSignout() {
      const res = await logout();
      if (res.error !== 0) {
        console.error("logout failed:", res.msg);
      } else {
        this.setIsLogin(false);
        message.success(this.$t("form.success.logout"));
      }
    },
    handleFeedback() {
      openWindow(getConfig().feedbackUrl);
    },
    openModalBox() {
      this.openModal({
        type: "login",
        params: null,
      });
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
      if (error) {
        message.error(this.$t("common.sync.failed"));
      } else {
        message.success(this.$t("common.sync.success"));
      }
    },
    changeMainShow(mainShow: boolean) {
      if (!this.isLogin&&mainShow==false) {
        message.warning("请先登录易微联账号");
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

.item-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;

  .item-wrapper__icon {
    margin-right: 16px;
    margin-left: 6px;
  }

  .item-wrapper__text {
    flex: 1;
    margin-right: 14px;
  }
}
</style>
