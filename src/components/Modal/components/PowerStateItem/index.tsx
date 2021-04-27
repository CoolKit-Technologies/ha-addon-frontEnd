import React, { useEffect } from 'react';
import { Select } from 'antd';
import styles from './index.less';
import { IChannelSetting } from '@/types/interface/IModal';
import { updateDeviceByWS } from '@/api';
import _ from 'lodash';
const { Option } = Select;
const PowerState: React.FC<IChannelSetting> = (props) => {
    console.log(`ML ~ file: index.tsx ~ line 8 ~ props`, props);

    async function setPowerState(value: string) {
        console.log(`ML ~ file: index.tsx ~ line 12 ~ setPowerState ~ value`, value);
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                startup: value,
            },
        };
        props.index !== undefined && _.assign(params.params, { outlet: props.index });
        console.log(`ML ~ file: index.tsx ~ line 20 ~ setPowerState ~ params`, params);
        const res = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 22 ~ setPowerState ~ res`, res);
    }
    async function changePowerState(state: string) {
        console.log('state', state);
    }
    return (
        <div className={`${styles['power-state']} ${props.style}`}>
            <span className={styles['span-font']}>Power-on state</span>
            <Select className={styles['select']} defaultValue='Last state' onSelect={(value) => setPowerState(value)}>
                <Option value='on'>On</Option>
                <Option value='off'>Off</Option>
                <Option value='stay'>Last state</Option>
            </Select>
        </div>
    );
};
export default PowerState;
