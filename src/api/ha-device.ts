// user api
import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';


const { apiPrefix } = getConfig();

/**
 * get HA device list 
 */
export async function getHaDeviceList() {
    return await sendHttpRequest('GET', apiPrefix + '/ha-devices/list');
}

/**
 * sync HA device to eWelink
 */
export async function syncHa2ck(params: {
    haDeviceId: number;
    state: boolean;
    deviceUiid:number;
}[]) {
    return await sendHttpRequest('POST', apiPrefix + '/ha-devices/sync2ck', params);
}


/**
 * get HA gateway status
 */
 export async function getHaGatewayStatus() {
    return await sendHttpRequest('GET', apiPrefix + '/ha-devices/gwstate');
}