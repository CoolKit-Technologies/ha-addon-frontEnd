// http utils
import axios, { AxiosRequestConfig } from 'axios';

import { getConfig } from './config';

type HttpMethod = 'GET' | 'POST';

export interface HttpResponse {
    error: number;
    msg: string;
    data: any;
}

/**
 * Send HTTP request
 * @param method HTTP method
 * @param url Request URL
 * @param params payload
 */
export async function sendHttpRequest(
    method: HttpMethod,
    url: string,
    params?: any
): Promise<HttpResponse> {
    const { baseUrl, timeout } = getConfig();
    const config: AxiosRequestConfig = {
        baseURL: baseUrl,
        method,
        url,
        timeout
    };

    if (params) {
        if (method === 'GET') {
            config.params = params;
        } else {
            config.data = params;
        }
    }

    try {
        const res = await axios(config);

        if (res.status === 200 && res.data.error === 0) {
            return {
                error: 0,
                msg: 'success',
                data: res.data.data
            };
        } else {
            console.error('http request failed');
            const { error, msg, data } = res.data;
            return {
                error,
                msg,
                data
            };
        }
    } catch (e) {
        console.error('http request error');
        return {
            error: -1,
            msg: 'error occur',
            data: {}
        };
    }
}
