import React from 'react';
import { TimePicker, Switch, SwitchProps, TimePickerProps } from 'antd';
import styles from './index.less';
import moment, { Moment } from 'moment';
import { updateDeviceByWS } from '@/api';
import { IChannelSetting } from '@/types/interface/IModal';
import _ from 'lodash';

const formatStyle = 'mm:ss';
const InchingMode: React.FC<IChannelSetting> = ({ style, apikey, deviceId, index }) => {
    async function setInchingTime(time: Moment | null) {
        if (!time) return;
        const h = moment(time).get('minute');
        const s = moment(time).get('second');
        let count = 0;
        h === 0 ? (count = s) : (count = h * 60 + s);
        console.log('count', count);
        const params = {
            id: deviceId,
            apikey: apikey,
            params: {
                pulse: 'on',
                width: count * 1000,
            },
        };
        index !== undefined && _.assign(params.params, { outlet: index });
        console.log(`ML ~ file: index.tsx ~ line 28 ~ setInchingTime ~ params`, params);
        const res = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 30 ~ setInchingTime ~ res`, res);
    }
    async function inchingAction(deviceId: string) {
        console.log('deviceId', deviceId);
    }
    return (
        <div className={`${styles['inching-mode']} ${style}`}>
            <span className={styles['span-font']}>Inching mode</span>
            <div>
                <TimePicker className={styles['mgr20']} format={formatStyle} onChange={(time) => setInchingTime(time)} />
                <Switch onClick={async () => await inchingAction('111')} />
            </div>
        </div>
    );
};
export default InchingMode;
