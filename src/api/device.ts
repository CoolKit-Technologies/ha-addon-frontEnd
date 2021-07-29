// device api
import _ from 'lodash';

import { isOneChannelSPDevice, isMultiChannelDevice, isOneChannelSwOrSockCPDevice } from '@/utils/etc';
import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';
import { isLightDevice } from '@/utils/etc';

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
    id: string; // device id
    type: string; // set type: switch
    params: any; // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/diy', params);
}

/**
 * Set LAN device status, only for toggle
 */
export async function setLanDevice(params: {
    id: string; // device id
    apikey: string; // device apikey
    params: any; // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/lan', params);
}

/**
 * Set Cloud device status
 */
export async function setCloudDevice(params: {
    id: string; // device id
    apikey: string; // device apikey
    params: any; // control status
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/proxy2ws', params);
}

/**
 * Remove device in HASS
 */
export async function disableDevice(params: {
    id: string; // device id
    disabled: boolean; // true - disabled
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/disabled', params);
}

/**
 * Set temperature unit
 */
export async function setTempUnit(params: {
    id: string; // device id
    unit: string; // temperature unit, 'c' or 'f'
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/device/unit', params);
}

/**
 * Set device name
 */
export async function setName(params: {
    id: string; // device id
    newName: string; // new device name
}) {
    return await sendHttpRequest('POST', apiPrefix + '/devices/updateName', params);
}

/**
 * Set device tags
 */
export async function setTags(params: {
    id: string; // device id
    tags: any; // example: { 0: 'name0', 1: 'name1', 2: 'name2', 3: 'name4' }
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
    id: string; // device id
    apikey: string; // device apikey
    params: any; // upgrade params
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
    const { apikey, deviceId, uiid, type } = data;
    let params;

    if (type === 1 && uiid === 1) {
        // DIY device
        await setDiyDevice({
            id: deviceId,
            type: 'switch',
            params: {
                state: v ? 'on' : 'off',
            },
        });
        return;
    } else if (isOneChannelSPDevice(uiid)) {
        // Single channel
        params = {
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off',
            },
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
                        switch: v ? 'on' : 'off',
                    },
                ],
            },
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
    const { type, deviceId, apikey, uiid } = data;
    const switches = [];

    if (isLightDevice(uiid)) {
        if (uiid === 22) {
            await setCloudDevice({
                apikey,
                id: deviceId,
                params: {
                    state: v ? 'on' : 'off',
                },
            });
        } else {
            await setCloudDevice({
                apikey,
                id: deviceId,
                params: {
                    switch: v ? 'on' : 'off',
                },
            });
        }
    } else {
        for (let i = 0; i < 4; i++) {
            switches.push({
                switch: v ? 'on' : 'off',
                outlet: i,
            });
        }

        const params = {
            apikey,
            id: deviceId,
            params: {
                switches,
            },
        };

        if (type === 2) {
            // LAN device
            await setLanDevice(params);
        } else {
            // Cloud device
            await setCloudDevice(params);
        }
    }
}

/**
 * Refresh UI
 * @param data Device data
 */
export async function refreshUi(data: any) {
    const { apikey, uiid, deviceId, cardIndex } = data;
    const params: any = {
        apikey,
        id: deviceId,
        params: {},
    };

    if (uiid === 126) {
        params.params.uiActive = {
            time: 120,
            outlet: cardIndex,
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
                    deviceName: value,
                },
            });
        } else {
            await setName({
                id: deviceId,
                newName: value,
            });
        }
    } else {
        await setTags({
            id: deviceId,
            tags: {
                [Number(index)]: value,
            },
        });
    }
}

/**
 * Toggle device network LED
 * @param v State value
 * @param data Device data
 */
export async function toggleNetworkLed(v: boolean, data: any) {
    const { type, uiid, deviceId, apikey } = data;

    if (type === 1 && uiid === 1) {
        await setDiyDevice({
            id: deviceId,
            type: 'sledOnline',
            params: {
                state: v ? 'on' : 'off',
            },
        });
    } else if (uiid === 126) {
        await setCloudDevice({
            apikey,
            id: deviceId,
            params: {
                sledBright: v ? 100 : 0,
            },
        });
    } else {
        await setCloudDevice({
            apikey,
            id: deviceId,
            params: {
                sledOnline: v ? 'on' : 'off',
            },
        });
    }
}

/**
 * Toggle device interlock
 * @param v State value
 * @param data Device data
 */
export async function toggleLock(v: boolean, data: any) {
    const { apikey, deviceId } = data;
    await setCloudDevice({
        apikey,
        id: deviceId,
        params: v ? { lock: 1, zyx_clear_timers: true } : { lock: 0, zyx_clear_timers: false },
    });
}

/**
 * Toggle device inching mode
 * @param v State value
 * @param data Device data
 * @param value Millisecond value
 * @param index Channel index
 */
export async function toggleInchingMode(v: boolean, data: any, value: number, index: number) {
    const { type, uiid, deviceId, apikey, params, cardIndex } = data;
    const pulses = _.cloneDeep(params.pulses);

    if (type === 1 && uiid === 1) {
        await setDiyDevice({
            id: deviceId,
            type: 'pulse',
            params: {
                state: v ? 'on' : 'off',
                width: v ? value : 500,
            },
        });
        return;
    } else if (isOneChannelSPDevice(uiid)) {
        await setCloudDevice({
            apikey,
            id: deviceId,
            params: {
                pulse: v ? 'on' : 'off',
                pulseWidth: v ? value : 500,
            },
        });
        return;
    } else if (uiid === 126) {
        pulses[cardIndex].width = value;
        pulses[cardIndex].pulse = v ? 'on' : 'off';
    } else {
        pulses[index].width = value;
        pulses[index].pulse = v ? 'on' : 'off';
    }
    await setCloudDevice({
        apikey,
        id: deviceId,
        params: {
            pulses,
        },
    });
}

/**
 * Set device power-on state
 * @param v State value
 * @param data Device data
 * @param i Channel index
 */
export async function setPowerOnState(v: string, data: any, i: number) {
    const { type, uiid, deviceId, apikey } = data;
    if (type === 1 && uiid === 1) {
        await setDiyDevice({
            id: deviceId,
            type: 'startup',
            params: {
                state: v,
            },
        });
        return;
    } else if (isMultiChannelDevice(uiid) || isOneChannelSwOrSockCPDevice(uiid) || uiid === 126 || uiid === 34) {
        // Multi-channel + OneChannelSwOrSock + DualR3
        const configure = _.get(data, ['params', 'configure'], []);
        _.set(configure, [i, 'startup'], v);
        await setCloudDevice({
            apikey,
            id: deviceId,
            params: {
                configure,
            },
        });
    } else {
        // Single channel
        await setCloudDevice({
            apikey,
            id: deviceId,
            params: {
                startup: v,
            },
        });
    }
}

/**
 * Start statistic
 * @param startTime Statistic start time
 * @param data Device data
 */
export async function startStatistic(startTime: string, data: any) {
    const { deviceId, apikey, uiid, cardIndex } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 126) {
        cardIndex === 1 ? _.assign(params.params, { startTime_01: startTime, endTime_01: '' }) : _.assign(params.params, { startTime_00: startTime, endTime_00: '' });
    } else {
        _.assign(params.params, {
            onKwh: 'start',
            startTime: startTime,
            endTime: '',
        });
    }
    await setCloudDevice(params);
}

/**
 * End statistic
 * @param startTime Statistic start time
 * @param endTime Statistic end time
 * @param data Device data
 */
export async function endStatistic(startTime: string, endTime: string, data: any) {
    const { deviceId, apikey, uiid, cardIndex } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 126) {
        cardIndex === 1 ? _.assign(params.params, { startTime_01: startTime, endTime_01: endTime }) : _.assign(params.params, { startTime_00: startTime, endTime_00: endTime });
    } else {
        _.assign(params.params, {
            onKwh: 'stop',
            startTime: startTime,
            endTime: endTime,
        });
    }
    await setCloudDevice(params);
}

/**
 * Refresh statistic
 * @param data Device data
 */
export async function refreshStatistic(data: any) {
    const { deviceId, apikey, uiid, cardIndex } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 126) {
        cardIndex === 1 ? _.assign(params.params, { getKwh_01: 1 }) : _.assign(params.params, { getKwh_00: 1 });
    } else {
        _.assign(params.params, { oneKwh: 'get' });
    }
    return await setCloudDevice(params);
}

/**
 * get history use power data
 */
export async function getHistoryData(data: any) {
    const { deviceId, apikey, uiid, cardIndex } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 126) {
        cardIndex === 1 ? _.assign(params.params, { getKwh_01: 2 }) : _.assign(params.params, { getKwh_00: 2 });
    } else {
        _.assign(params.params, { hundredDaysKwh: 'get' });
    }
    const res = await setCloudDevice(params);
    if (res.error === 0 && res.data && res.data.config) {
        if (uiid === 126) {
            return cardIndex === 1 ? res.data.config.kwhHistories_01 : res.data.config.kwhHistories_00;
        } else {
            return res.data.config.hundredDaysKwhData;
        }
    }
}

/**
 * curtain control button
 */
export async function curtainControl(data: any, action: string) {
    const { deviceId, apikey } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {
            switch: action,
        },
    };
    await setCloudDevice(params);
}
/**
 *  set curtain value slider
 */
export async function setCurtainValue(data: any, value: number) {
    const { deviceId, apikey } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {
            setclose: value,
        },
    };
    console.log(`ML ~ file: device.ts ~ line 529 ~ setCurtainValue ~ params`, params);
    await setCloudDevice(params);
}
/**
 * set five bulb color temp
 */
export async function setFiveColorBulbTemp(data: any, type: string) {
    const { deviceId, apikey } = data;
    const { channel0, channel1 } = data.params;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {
            type: type,
            zyx_mode: 1,
        },
    };
    const max = `${Math.max(parseInt(channel0), parseInt(channel1), 25)}`;
    switch (type) {
        case 'middle':
            _.assign(params.params, {
                channel0: max,
                channel1: max,
            });
            break;
        case 'warm':
            _.assign(params.params, {
                channel0: '0',
                channel1: max,
            });
            break;
        case 'cold':
            _.assign(params.params, {
                channel0: max,
                channel1: '0',
            });
            break;
    }
    console.log(`ML ~ file: device.ts ~ line 570 ~ setFiveColorBulbTemp ~ params`, params);
    await setCloudDevice(params);
}
/**
 * set color picker
 */
export async function setPickerColor(data: any, obj: any) {
    const { deviceId, apikey, uiid } = data;

    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 104) {
        _.assign(params.params, {
            ltype: 'color',
            color: {
                ...obj,
            },
        });
    } else if (uiid === 22) {
        _.assign(params.params, {
            zyx_mode: 2,
            channel0: '0',
            channel1: '0',
            channel2: `${obj.r}`,
            channel3: `${obj.g}`,
            channel4: `${obj.b}`,
        });
    } else if (uiid === 59) {
        _.assign(params.params, {
            mode: 1,
            colorR: obj.r,
            colorG: obj.g,
            colorB: obj.b,
            light_type: 1,
        });
    }
    console.log(`ML ~ file: device.ts ~ line 605 ~ setPickerColor ~ params`, params);
    await setCloudDevice(params);
}

//  change five light mode
export async function setFiveLtMode(data: any) {
    const { deviceId, apikey, uiid } = data;
    let params = {
        id: deviceId,
        apikey: apikey,
        params: {},
    };
    if (uiid === 104) {
        _.assign(params.params, {
            switch: 'on',
        });
    } else if (uiid === 22) {
        _.assign(params.params, {
            state: 'on',
        });
    }
    await setCloudDevice(params);
}

/**
 * Update remote or button name
 * @param nameType Action type
 * @param data Device data
 * @param v Name
 * @param bi Button index
 */
export async function updateRemoteOrButtonName(nameType: 'remote' | 'button', data: any, v: string, bi: number) {
    const { cardIndex, deviceId } = data;
    const tags = _.cloneDeep(data.tags);
    if (nameType === 'remote') {
        tags.zyx_info[cardIndex].name = v;
    } else {
        const key = Object.keys(tags.zyx_info[cardIndex].buttonName[bi])[0];
        tags.zyx_info[cardIndex].buttonName[bi][key] = v;
    }
    await setTags({
        id: deviceId,
        tags,
    });
}
