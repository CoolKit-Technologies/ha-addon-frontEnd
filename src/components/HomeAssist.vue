<template>
  <div class="alert-wrap" style="background: #fdeed9" v-if="true">
    <div class="alert">
      <div class="img-wrap"><img src="@/assets/warning.png" /></div>
      <div class="info" style="color: #f0961c">连接异常</div>
    </div>
  </div>

  <div class="alert-wrap" style="background: #fce2e2" v-if="false">
    <div class="alert">
      <div class="img-wrap"><img src="@/assets/net-error.png" /></div>
      <div class="info" style="color: #f00909">与服务器断开连接</div>
    </div>
  </div>
  <div class="main-content">
    <header>
      <h1 class="title">在易微联使用你的Home Assistant设备</h1>
      <div class="tip">
        打开开关，将你的Home
        Assistant设备同步到易微联生态，即可以通过易微联App，中控屏控制你的设备，在场景中联动你的易微联设备
      </div>
    </header>
    <section>
      <div class="list-wrap">
        <div class="box-wrap">
          <div class="list-header">
            <div class="title">设备列表</div>
            <a-tooltip>
              <template #title>一键同步</template>
              <a-switch
                class="operate"
                :checked="isAllAsync"
                @change="toAllAsync"
              />
            </a-tooltip>
          </div>

          <div
            class="list-item"
            v-for="(item, index) in deviceList"
            :key="index + 'list'"
          >
            <div class="list-item-left">
              <div class="img-wrap">
                <img :src="whichImg(item.deviceUiid)" />
              </div>
              <div>
                <div class="title">{{ item.deviceNameHa }}</div>
                <div class="content">{{ item.deviceNameCk }}</div>
              </div>
            </div>

            <a-tooltip>
              <template #title>一键同步</template>
              <a-switch
                class="operate"
                @change="toAllAsync(item.haDeviceId, item.syncState)"
                :checked="item.syncState"
              />
            </a-tooltip>
          </div>
        </div>
      </div>

      <div class="help-wrap">
        <div class="text-wrap">
          <div class="img-info-wrap">
            <div class="img-wrap"><img :src="amazonAlexa.logo" /></div>
            <div class="info-wrap">
              <div class="title">{{ amazonAlexa.title }}</div>
              <div class="content">
                {{ amazonAlexa.description }}
              </div>
            </div>
          </div>
          <div class="text-help">
            <a-button type="link" @click="toHelpHtml(amazonAlexa.link)"
              >帮助文档</a-button
            >
          </div>
        </div>

        <div class="text-wrap">
          <div class="img-info-wrap">
            <div class="img-wrap"><img :src="googleHome.logo" /></div>
            <div class="info-wrap">
              <div class="title">{{ googleHome.title }}</div>
              <div class="content">
                {{ googleHome.description }}
              </div>
            </div>
          </div>
          <div class="text-help">
            <a-button type="link" @click="toHelpHtml(googleHome.link)"
              >帮助文档</a-button
            >
          </div>
        </div>

        <footer>
          <div class="protocol-wrap">
            <div @click="showModal('ewlink')">《易微联服务协议》</div>
            <div @click="showModal('voice')">《第三方语音控制服务协议》</div>
          </div>
        </footer>
      </div>
    </section>
  </div>

  <a-modal v-model:visible="visible" class="modal-box">
    <template #title>
      <div style="text-align: center">{{ serveTitle }}</div>
    </template>
    <div style="width: 100%; height: 400px">
      <iframe
        :src="serveContent"
        frameborder="0"
        style="width: 100%; height: 100%"
      ></iframe>
    </div>
    <template #footer>
      <div class="modal-footer" v-if="buttonShow">
        <a-button key="back" type="text" @click="handleCancel">不同意</a-button>
        <a-button key="submit" type="link" @click="handleOk">同意</a-button>
      </div>
      <div v-else></div>
    </template>
  </a-modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import _ from "lodash";
import {
  getHaDeviceList,
  syncHa2ck,
  getHaGatewayStatus,
} from "@/api/ha-device";
import { message } from "ant-design-vue";

interface IcmsInfo {
  thirdPlatform: {
    "Amazon Alexa": {
      description: string;
      link: string;
      logo: string;
      title: string;
    };
    "Google Home": {
      description: string;
      link: string;
      logo: string;
      title: string;
    };
  };
  thirdPlatformAgreement: {
    link: string;
  };
  ewelinkUserAgreement: {
    link: string;
  };
}

interface IDeviceInfo {
  deviceNameCk: string;
  deviceNameHa: string;
  deviceUiid: number;
  syncState: boolean;
  haDeviceId: number;
}
// 20000:'HA网关',
// 20001:'HA单通道开关',
// 20002:'HA双通道开关',
// 20003:'HA三通道开关',
// 20004:'HA四通道开关',
// 20005:'HA开关灯',
// 20006:'HA调光灯',
// 20007:'HA双色灯',
// 20008:'HA五色灯',
export default defineComponent({
  name: "HomeAssist",
  data() {
    return {
      visible: false,
      serveTitle: "",
      serveContent: "",
      isAllAsync: false,
      deviceList: [],
      isNewGw: true, //是否第一次同步ha设备
      buttonShow:false,
    } as {
      visible: boolean;
      serveTitle: string;
      serveContent: string;
      isAllAsync: boolean;
      deviceList: IDeviceInfo[];
      isNewGw: boolean;
      buttonShow:boolean;
    };
  },
  computed: {
    ...mapState(["cmsInfo"]),
    amazonAlexa() {
      const cmsInfo = this.cmsInfo as IcmsInfo;
      return cmsInfo.thirdPlatform["Amazon Alexa"];
    },
    googleHome() {
      const cmsInfo = this.cmsInfo as IcmsInfo;
      return cmsInfo.thirdPlatform["Google Home"];
    },
    whichImg() {
      return function (deviceUiid: number) {
        if (deviceUiid >= 20001 || deviceUiid <= 20004) {
          return require("@/assets/switch.png");
        } else if (deviceUiid >= 20005 || deviceUiid <= 20008) {
          return require("@/assets/light.png");
        }
      };
    },
  },
  methods: {
    async toAllAsync(haDeviceId?: number, state?: boolean) {
      if (this.isNewGw) {
        this.visible = true;
        this.buttonShow = true
        return;
      }
      let params:{haDeviceId:number,state:boolean}[] = [];
      if (haDeviceId&&state!==undefined) {
        //同步单个
        params = [
          {
            haDeviceId,
            state,
          },
        ];
      } else {
        //同步所有设备

        if (this.deviceList && this.deviceList.length > 0) {
          params = this.deviceList.map((item) => {
            return {
              haDeviceId: item.haDeviceId,
              state: true,
            };
          });
        }
      }
      const res = await syncHa2ck(params);

      if (res.error !== 0) {
        return;
      }

      this.deviceList = this.deviceList.map((item) => {
        let list = res.data as { haDeviceId: number; state: boolean }[];
        let thisItem = list.find((it) => it.haDeviceId == item.haDeviceId);
        if (thisItem) {
          item.syncState = thisItem.state;
          return item;
        } else {
          return item;
        }
      });
    },
    async getHaDevice() {
      const res = await getHaDeviceList();
      if (res.error !== 0) {
        message.warning(this.$t("common.error.getdevice"));
        return;
      }
      this.deviceList = res.data as IDeviceInfo[];

      console.log(res, "rrrrrrrrrrrrrressssssss");
    },
    toHelpHtml(url: string) {
      window.open(url, "_blank");
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.visible = false;
    },
    showModal(type: string) {
      if (type == "ewlink") {
        this.serveTitle = "易微联服务协议";
        this.serveContent = this.cmsInfo.ewelinkUserAgreement.link;
      } else {
        this.serveTitle = "第三方语音控制服务协议";
        this.serveContent = this.cmsInfo.thirdPlatformAgreement.link;
      }
      this.buttonShow = false
      this.visible = true;
    },
    async getHaGatewayStatus() {
      const res = await getHaGatewayStatus();
      this.isNewGw = res.data.isNewGw;
      console.log(res, "rrrrrrrrrrrrrrrrr");
    },
  },
  async mounted() {
    this.getHaDevice();
    this.getHaGatewayStatus();
  },
});
</script>
<style lang="stylus">
.modal-box {
  .ant-modal-close {
    left: 0;
  }
}
</style>
<style lang="stylus" scoped>
.main-content {
  margin: 0 auto;
  padding: 40px;
  height: calc(100vh - 80px);
}

.alert-wrap {
  width: 100%;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;

  .alert {
    display: flex;

    .img-wrap {
      width: 22px;
      height: 22px;
      overflow: hidden;
      margin-right: 8px;

      img {
        width: 100%;
        height: 100%;
        vertical-align: baseline;
      }
    }

    .info {
      font-size: 14px;
      font-family: Source Han Sans CN;
    }
  }
}

header {
  .title {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 24px;
    opacity: 0.8;
  }

  .tip {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;
    line-height: 18px;
    opacity: 0.5;
  }

  margin-bottom: 27px;
}

section {
  display: flex;
  height: calc(100% - 80px);

  .list-wrap {
    flex: 1;
    padding-right: 30px;

    .box-wrap {
      background: #FFFFFF;
      border: 1px solid #E1E1E1;
      border-radius: 12px;
      overflow: hidden;
    }

    .list-header {
      padding: 0 40px 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 70px;
      background: #FAFAFA;
      border-bottom: 1px solid #E1E1E1;

      .title {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }
    }

    .list-item {
      display: flex;
      padding: 0 40px 0 20px;
      align-items: center;
      justify-content: space-between;
      height: 100px;
      border-bottom: 1px solid #E1E1E1;

      .list-item-left {
        display: flex;
        align-items: center;

        .img-wrap {
          width: 54px;
          height: 54px;
          overflow: hidden;
          margin-right: 30px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #000000;
        }

        .content {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
        }
      }
    }
  }

  .help-wrap {
    width: 500px;
    height: 100%;
    padding: 0 10px;
    position: relative;

    .text-wrap {
      width: 100%;
      height: 180px;
      background: #FAFAFA;
      border: 1px solid #E1E1E1;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;

      .img-info-wrap {
        display: flex;
        width: 100%;
      }

      .img-wrap {
        width: 100px;
        height: 100px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .info-wrap {
        flex: 1;
        padding-left: 20px;

        .title {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #000000;
        }

        .content {
          font-size: 18px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #000000;
          line-height: 30px;
          opacity: 0.7;
        }
      }

      .text-help {
        text-align: right;
      }
    }

    footer {
      position: absolute;
      bottom: 0;
      color: #03A9F4;
      width: 100%;

      .protocol-wrap {
        width: 100%;
        display: flex;
        justify-content: space-around;

        div {
          cursor: pointer;
        }
      }
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: space-between;
}
</style>
