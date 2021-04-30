import React, { useEffect } from 'react';
import { Select } from 'antd';
import styles from './index.less';
import { IChannelSetting } from '@/types/interface/IModal';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import _ from 'lodash';
const { Option } = Select;
const PowerState: React.FC<IChannelSetting> = (props) => {
    console.log(`ML ~ file: index.tsx ~ line 9 ~ props`, props);
    let startup = '';
    if (props.type === 'diy' && props.params?.startup) {
        //手工diy
        startup = props.params?.startup;
    } else if (props.params?.configure) {
        //dualr3或多通道设备
        let tempStart = props.params?.configure.find((item) => item.startup);
        tempStart && (startup = tempStart?.startup);
    } else if (!props.params?.configure && props.params?.startup) {
        startup = props.params?.startup;
    }

    async function setPowerState(value: string) {
        console.log(`ML ~ file: index.tsx ~ line 12 ~ setPowerState ~ value`, value);
        if (props.type === 'diy') {
            let params = {
                id: props.deviceId,
                type: 'startup',
                params: {
                    state: value,
                },
            };
            console.log(`ML ~ file: index.tsx ~ line 20 ~ changeDeviceState ~ params`, params);
            const res = await controlDiyDevice(params);
            console.log(`ML ~ file: index.tsx ~ line 21 ~ changeDeviceState ~ res`, res);
        } else {
            let params = {
                id: props.deviceId,
                apikey: props.apikey,
                params: {},
            };
            if (!props.params?.configure) {
                _.assign(params.params, { startup: value });
            }
            if (props.params?.configure && props.params.configure?.length > 0) {
                props.params?.configure?.forEach((item) => {
                    if (item.outlet === props.index) _.assign(item, { startup: value });
                });
                props.index !== undefined && _.assign(params.params, { configure: props.params?.configure });
            }
            console.log(`ML ~ file: index.tsx ~ line 20 ~ setPowerState ~ params`, params);
            const res = await updateDeviceByWS(params);
            console.log(`ML ~ file: index.tsx ~ line 22 ~ setPowerState ~ res`, res);
        }
    }
    async function changePowerState(state: string) {
        console.log('state', state);
    }
    return (
        <div className={`${styles['power-state']} ${props.style}`}>
            <span className={styles['span-font']}>Power-on state</span>
            <Select className={styles['select']} defaultValue={startup} onSelect={(value) => setPowerState(value)}>
                <Option value='on'>On</Option>
                <Option value='off'>Off</Option>
                <Option value='stay'>Last state</Option>
            </Select>
        </div>
    );
};
export default PowerState;
