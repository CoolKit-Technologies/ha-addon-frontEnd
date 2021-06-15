// device api
import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';

const { apiPrefix } = getConfig();

/**
 * Get device list when page loading
 * @returns Device List
 */
export async function getDeviceListInit() {
    return await sendHttpRequest('GET', apiPrefix + '/devices', { type: 7 });
}

/**
 * Get device list when user press refresh button
 * @returns Device List
 */
export async function getDeviceListRefresh() {
    return await sendHttpRequest('GET', apiPrefix + '/devices/refresh', { type: 7 });
}

/**
 * Set DIY device status
 */
export async function setDiyDevice(params: {
    id: string;         // device id
    type: string;       // set type: switch
    params: any;        // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/diy', params);
}

/**
 * Set LAN device status, only for toggle
 */
export async function setLanDevice(params: {
    id: string;         // device id
    apikey: string;     // device apikey
    params: any;        // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/lan', params);
}

/**
 * Set Cloud device status
 */
export async function setCloudDevice(params: {
    id: string;         // device id
    apikey: string;     // device apikey
    params: any;        // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/proxy2ws', params);
}

/**
 * Remove device in HASS
 */
export async function disableDevice(params: {
    id: string;         // device id
    disabled: boolean;  // true - disabled
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/disabled', params);
}

/**
 * Set temperature unit
 */
export async function setTempUnit(params: {
    id: string;         // device id
    unit: string;       // temperature unit, 'c' or 'f'
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/device/unit', params);
}

/**
 * Set device name
 */
export async function setName(params: {
    id: string;         // device id
    newName: string;    // new device name
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/updateName', params);
}

/**
 * Set device tags
 */
export async function setTags(params: {
    id: string;         // device id
    tags: any;          // example: { 0: 'name0', 1: 'name1', 2: 'name2', 3: 'name4' }
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/updateChannelName', params);
}

/**
 * Get device OTA information
 */
export async function getOtaInfo(params: {
    list: Array<{
        deviceid: string;
        model: string;
        version: string;
    }>;
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/getOTAinfo', params);
}

/**
 * Upgrade device firmware version
 */
export async function upgradeDeviceFw(params: {
    id: string;             // device id
    apikey: string;         // device apikey
    params: any;            // upgrade params
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/device/upgrade', params);
}

/* -------- high level -------- */

/**
 * Toggle device channel
 * @param v State value
 * @param data Device data
 * @param index Multi-channel index
 */
export async function toggleChannel(v: boolean, data: any, index: number) {
    const {
        apikey,
        deviceId,
        uiid,
        type
    } = data;
    let params;

    if (type === 1 && uiid === 1) {
        // DIY device
        await setDiyDevice({
            id: deviceId,
            type: 'switch',
            params: {
                state: v ? 'on' : 'off'
            }
        });
        return;
    } else if (
        uiid === 1 || uiid === 5 || uiid === 6 || uiid === 14 || uiid === 15
        || uiid === 32
    ) {
        // Single channel
        params = {
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off'
            }
        };
    } else {
        // Multi-channel
        params = {
            apikey,
            id: deviceId,
            params: {
                switches: [
                    {
                        outlet: index,
                        switch: v ? 'on' : 'off'
                    }
                ]
            }
        };
    }

    if (type === 2) {
        // LAN device
        await setLanDevice(params);
    } else {
        // Cloud device
        await setCloudDevice(params);
    }
}

/**
 * Toggle all of the channels
 * @param v State value
 * @param data Device data
 */
export async function toggleAllChannels(v: boolean, data: any) {
    const { type, deviceId, apikey } = data;
    const switches = [];

    for (let i = 0; i < 4; i++) {
        switches.push({
            switch: v ? 'on' : 'off',
            outlet: i
        });
    }

    const params = {
        apikey,
        id: deviceId,
        params: {
            switches
        }
    };

    if (type === 2) {
        // LAN device
        await setLanDevice(params);
    } else {
        // Cloud device
        await setCloudDevice(params);
    }
}

/**
 * Refresh UI
 * @param data Device data
 */
export async function refreshUi(data: any) {
    const {
        apikey,
        uiid,
        deviceId,
        cardIndex
    } = data;
    const params: any = {
        apikey,
        id: deviceId,
        params: {}
    };

    if (uiid === 126) {
        params.params.uiActive = {
            time: 120,
            outlet: cardIndex
        };
    } else {
        params.params.uiActive = 120;
    }
    await setCloudDevice(params);
}

/**
 * Update device or channel name
 * @param actionType Action type
 * @param data Device data
 * @param value Device or channel name
 * @param index Multi-channel index
 */
export async function updateDeviceOrChannelName(actionType: 'deviceName' | 'channelName', data: any, value: string, index?: number) {
    const { deviceId, type, uiid } = data;
    if (actionType === 'deviceName') {
        if (type === 1 && uiid === 1) {
            // DIY device
            await setDiyDevice({
                id: deviceId,
                type: 'deviceName',
                params: {
                    deviceName: value
                }
            });
        } else {
            await setName({
                id: deviceId,
                newName: value
            });
        }
    } else {
        await setTags({
            id: deviceId,
            tags: {
                [Number(index)]: value
            }
        });
    }
}
