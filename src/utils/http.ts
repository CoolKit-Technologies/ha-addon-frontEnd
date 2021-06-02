// http utils
import axios, { AxiosRequestConfig } from 'axios';

import { getConfig } from './config';

type HttpMethod = 'GET' | 'POST';

interface HttpResponse {
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
) {
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

    console.log('axios config', config);
    axios(config);
}
