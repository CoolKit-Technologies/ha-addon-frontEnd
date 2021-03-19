import axios from 'axios';
import { UserInfo, DeviceInfo } from '../types';

interface Response {
    error: number;
    msg: string;
    data: any;
}

export async function login(params: {
    country: string;
    account: string;
    password: string;
}): Promise<{
    error: number;
    msg: string;
    data: UserInfo;
}> {
    return await sendRequest('http://localhost:4000/login');
}

export async function getList(): Promise<{
    error: number;
    msg: string;
    data: DeviceInfo[];
}> {
    return await sendRequest('http://localhost:4000/list');
}

async function sendRequest(url: string): Promise<Response> {
    try {
        const res = await axios({
            method: 'GET',
            url
        });

        if (res.status === 200 && res.data.error === 0) {
            return {
                error: 0,
                msg: 'success',
                data: res.data.data
            };
        }

        return {
            error: 500,
            msg: 'error',
            data: {}
        };
    } catch (e) {
        return {
            error: 500,
            msg: 'error',
            data: {}
        };
    }


}
