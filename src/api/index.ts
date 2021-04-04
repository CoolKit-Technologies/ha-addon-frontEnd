import axios, { AxiosRequestConfig } from 'axios';
import { UserInfo, DeviceInfo, HttpResponse, HttpMethod } from '@/types';

const apiPrefix = 'api';

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
        // todo
        baseURL: 'http://localhost:3000',
        method,
        url,
    };

    if (params && method === 'GET') {
        config.params = params;
    }

    if (params && method === 'POST') {
        config.data = params;
    }

    try {
        const res = await axios(config);
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

export async function updateDeviceName(
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
}
