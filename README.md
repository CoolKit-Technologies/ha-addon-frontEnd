# Home Assistant 前端

## 脚本说明

* `$ npm run start` - 启动本地服务器开发

* `$ npm run build` - 打包

## 支持设备

各 UIID 设备：

* UIID 1 - 单通道插座

* UIID 2 - 双通道插座

* UIID 3 - 三通道插座

* UIID 4 - 四通道插座

* UIID 5 - 功率检测单通道插座

* UIID 6 - 单通道开关

* UIID 7 - 双通道开关

* UIID 8 - 三通道开关

* UIID 9 - 四通道开关

* UIID 14 - 开关改装模块

* UIID 15 - 恒温恒湿改装件

* UIID 32 - 功率检测插座

* UIID 77 - 单通道插座（多通道版本）

* UIID 78 - 单通道开关（多通道版本）

* UIID 107 - GSM 单通道插座（多通道协议）

* UIID 112 - 单通道开关（雷达版本）

* UIID 113 - 双通道开关（雷达版本）

* UIID 114 - 三通道开关（雷达版本）

* UIID 126 - 多功能双通道电量检测开关

## 设备类型

Home Assistant 的 Coolkit Add-on 中支持的都是 Coolkit 或 Sonoff 的设备。根据使用方式的不同将它们分成三类：

1. 云设备（Cloud） - 用户帐号下的设备，通过长链接控制设备

2. 局域网设备（LAN） - 通道 mDNS 扫描到的设备（加密）

3. DIY 设备 - 通道 mDNS 扫描到的设备

## 注意事项

* 在本地开发时，如果要使用后端的接口服务，需要修改 `src/api/index.ts` 文件中 `sendRequest` 方法的 `baseURL` 参数。

* 运行 `$ npm run build` 命令打包后，将 `dist/index.html` 文件中的这一行代码 `window.routerBase = "/";` 替换成 `window.routerBase = window.location.pathname;`。并删除 `href` 属性值的 `/`。
