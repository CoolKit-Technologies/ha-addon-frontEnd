import { DeviceType } from '@/types';

/**
 * 判断设备是否被支持
 * @param uiid 设备的 uiid
 * @returns 是否支持设备
 */
export function deviceIsSupport(uiid: number): boolean {
    return (uiid === 1 || uiid === 15);
}

/**
 * 判断设备有登录后是否被支持
 * @param isLogin 用户是否登录
 * @param type 设备类型
 * @returns 是否登录后支持
 */
export function deviceIsLoginAva(isLogin: boolean, type: number): boolean {
    return (type === DeviceType.LAN && !isLogin);
}
