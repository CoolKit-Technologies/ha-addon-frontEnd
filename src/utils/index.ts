import mitt from 'mitt';

import { DeviceType, DeviceInfo } from '@/types/device';
import IconDiyOnline from '@/assets/svg/diy-online.svg';
import IconDiyOffline from '@/assets/svg/diy-offline.svg';
import IconLanOnline from '@/assets/svg/lan-online.svg';
import IconLanOffline from '@/assets/svg/lan-offline.svg';
import IconWifiOnline from '@/assets/svg/wifi-online.svg';
import IconWifiOffline from '@/assets/svg/wifi-offline.svg';

const mittData: any = {};
const deviceData: any = {};

initMitt();

// 初始化 Mitt
export function initMitt() {
    if (!mittData.emitter)
        mittData.emitter = mitt();
}

// 获取 Mitt 的 emitter 对象
export function getMittEmitter() {
    return mittData.emitter;
}

// 清除事件
export function clearMittEmitter() {
    mittData.emitter.all.clear();
}

// 暂存一下设备列表
export function saveTmpDeviceList(deviceList: any) {
    deviceData.deviceList = deviceList;
}

// 获取暂存的设备列表
export function getTmpDeviceList() {
    return deviceData.deviceList;
}

// 根据设备类型及设备是否在线返回对应的 icon
export function getIconByDeviceType(type: DeviceType, online: boolean) {
    if (type === 'cloud') {
        return online ? IconWifiOnline : IconWifiOffline;
    } else if (type === 'diy') {
        return online ? IconDiyOnline : IconDiyOffline;
    } else {
        return online ? IconLanOnline : IconLanOffline;
    }
}

// 根据 uiid 判断设备是否为 开关／插座
export function isSocketSwitchDevice(uiid: number): boolean {
    const uiids = [1, 2, 3, 4, 6, 7, 8, 9, 14, 77, 78, 107, 112, 113, 114];
    return uiids.indexOf(uiid) !== -1;
}

// 根据 uiid 判断设备是否为 恒温恒湿
export function isTempDevice(uiid: number): boolean {
    const uiids = [15];
    return uiids.indexOf(uiid) !== -1;
}

// 根据 uiid 判断设备是否为 IW100
export function isIW100Device(uiid: number): boolean {
    const uiids = [32];
    return uiids.indexOf(uiid) !== -1;
}

// 根据 uiid 判断设备是否为 DualR3
export function isDualR3(uiid: number): boolean {
    const uiids = [126];
    return uiids.indexOf(uiid) !== -1;
}

// 根据 uiid 判断设备是否为 PowerDet
export function isPowerDet(uiid: number): boolean {
    const uiids = [5];
    return uiids.indexOf(uiid) !== -1;
}

// 根据数字返回字符的设备类型
export function deviceTypeMap(type: number): DeviceType {
    if (type === 1)
        return 'diy';
    else if (type === 2)
        return 'lan';
    else
        return 'cloud';
}

//  生成认证 URL
export const genAuthorizeUrl = (hassUrl: string, clientId: string, redirectUrl: string, state?: string) => {
    let authorizeUrl = `${hassUrl}/auth/authorize?response_type=code&redirect_uri=${encodeURIComponent(redirectUrl)}`;

    authorizeUrl += `&client_id=${encodeURIComponent(clientId)}`;

    if (state) {
        authorizeUrl += `&state=${encodeURIComponent(state)}`;
    }
    return authorizeUrl;
};
