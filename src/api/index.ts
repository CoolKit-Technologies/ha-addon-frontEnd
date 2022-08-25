import axios, { AxiosRequestConfig } from 'axios';
import { UserInfo, HttpResponse, HttpMethod } from '@/types';
import { genAuthorizeUrl } from '@/utils';
import { baseURL } from '@/config/app';
const apiPrefix = 'api';

// 判断用户是否登录
export async function userIsLogin(): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/user/isLogin`);
}

// 获取 HA 的 token
export async function getHaToken(params: { code: string; clientId: string }): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/user/auth`, params);
}

// 获取 CMS 内容
export async function getCmsContent(language: string): Promise<HttpResponse> {
    let region, locale;
    if (language.indexOf('zh-') !== -1) {
        region = 'cn';
        locale = 'zh-cn';
    } else {
        region = 'eu';
        locale = 'en-us';
        locale = 'it-it';
    }
    const url = `https://appcms.coolkit.cn/appcms-service/v2/batch.json?project=home-assistant&category=[%22top%22,%22push%22]&region=${region}&locale=${locale}&country=CL`;
    return await sendRequest('GET', url);
}

/**
 * 用户登录
 * @param params 请求参数
 * @returns 接口返回值
 */
export async function login(params: {
    countryCode: string;
    phoneNumber?: string;
    email?: string;
    password: string;
    lang: 'cn' | 'en';
}): Promise<{
    error: number;
    msg: string;
    data: {
        user: UserInfo;
    };
}> {
    return await sendRequest('POST', `${apiPrefix}/user/login`, params);
}

export async function logout(): Promise<{
    error: number;
    msg: string;
}> {
    return await sendRequest('POST', `${apiPrefix}/user/logout`);
}

/**
 * 获取设备列表
 * @param params 请求参数
 * @returns 接口返回值
 */
export async function getDeviceList(params: {
    type: 'refresh' | 'init'; // init - 页面加载时使用，refresh - 刷新时使用
}): Promise<HttpResponse> {
    if (params.type === 'init') {
        return await sendRequest('GET', `${apiPrefix}/devices`, { type: 7 });
    } else {
        return await sendRequest('GET', `${apiPrefix}/devices/refresh`, { type: 7 });
    }
}

// 根据设备的 deviceid 获取设备信息
export async function getDeviceById(params: { id: string }) {
    return await sendRequest('GET', `${apiPrefix}/devices/device`, params);
}

// 与 WebSocket 有关的接口
export async function updateDeviceByWS(params: {
    id: string; // 设备的 deviceid
    apikey: string; // 设备的 apikey
    params: any; // 控制参数
    useLanCtrl?: boolean;   // 使用局域网控制
}): Promise<HttpResponse> {
    if (params.useLanCtrl) {
        return await sendRequest('POST', `${apiPrefix}/devices/lan`, params);
    } else {
        return await sendRequest('POST', `${apiPrefix}/devices/proxy2ws`, params);
    }
}

export async function upgradeDeviceByWS(params: {
    id: string; // 设备的 deviceid
    apikey: string; // 设备的 apikey
    params: any; // 更新的参数
}) {
    return await sendRequest('POST', `${apiPrefix}/devices/device/upgrade`, params);
}

// 修改设备名称
export async function updateDeviceName(params: {
    id: string; // 设备的 deviceid
    newName: string; // 设备的新名称
}): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/updateName`, params);
}

// 修改通道名称
export async function updateChannelName(params: {
    id: string; // 设备的 deviceid
    tags: any; // tags: { 0: 'Power Fan', 1: 'PS5', 2: 'xbox' }
}): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/updateChannelName`, params);
}
// 修改温度单位
export async function updateDeviceTempUnit(params: {
    id: string; // 设备的 deviceid
    unit: string; //  'f' or 'c'
}): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/device/unit`, params);
}

// 获取设备更新信息
export async function getOtaInfo(params: {
    list: {
        deviceid: string; // 设备的 ID
        model: string; // 设备的模块型号
        version: string; // 当前设备的固件版本号
    }[];
}): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/getOTAinfo`, params);
}

/**
 * 修改设备状态
 * @param params 请求参数
 * @returns 接口返回值
 */
export async function changeDeviceStatus(params: { id: string; disabled: boolean }): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/disabled`, params);
}

/**
 * 发送 HTTP 请求的函数
 * @param method 请求方法
 * @param url 请求的 URL
 * @param params 请求参数
 * @returns 接口返回值
 */
async function sendRequest(method: HttpMethod, url: string, params?: any): Promise<HttpResponse> {
    const config: AxiosRequestConfig = {
        baseURL,
        method,
        url,
        timeout: 10000,
    };

    if (params && method === 'GET') {
        config.params = params;
    }

    if (params && method === 'POST') {
        config.data = params;
    }

    try {
        const res = await axios(config);
        // 重定向到 HA 授权
        if (res.data.error === 302) {
            const origin = window.location.origin;
            window.location.href = genAuthorizeUrl(res.data.data, origin, origin);
        }

        if (res.data.error === 0) {
            return {
                error: 0,
                msg: 'success',
                data: res.data.data,
            };
        } else {
            const { error, msg, data } = res.data;
            return {
                error,
                msg,
                data,
            };
        }
    } catch (e) {
        return {
            error: 500,
            msg: 'axios error',
            data: {},
        };
    }
}

export async function getLanguage(): Promise<{
    error: number;
    data: string;
}> {
    return await sendRequest('GET', `${apiPrefix}/language`);
}

/*export async function updateDeviceName(
    id: string,
    newName: string
): Promise<{
    error: number;
    data: string;
}> {
    return await sendRequest('POST', `${apiPrefix}/devices/updateName`, {
        id,
        newName,
    });
}*/

/* -------- >8 -------- */
// DIY 设备
export async function controlDiyDevice(params: { id: string; type: string; params: any }): Promise<HttpResponse> {
    return await sendRequest('POST', `${apiPrefix}/devices/diy`, params);
}
