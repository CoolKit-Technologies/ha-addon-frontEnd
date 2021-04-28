import React, { useState, useEffect } from 'react';
import { TimePicker, Switch } from 'antd';
import styles from './index.less';
import moment, { Moment } from 'moment';
import { updateDeviceByWS } from '@/api';
import { IChannelSetting } from '@/types/interface/IModal';
import _ from 'lodash';

const formatStyle = 'mm:ss';
const InchingMode: React.FC<IChannelSetting> = ({ style, apikey, deviceId, index, params }) => {
    const [inchingTime, setInchingTime] = useState<Moment>();
    const [checked, setChecked] = useState(Boolean);
    async function getInchingTime(time: Moment | null) {
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
        if (res.error === 0) {
            setChecked(true);
        }
    }
    async function inchingAction(value: boolean) {
        console.log(`ML ~ file: index.tsx ~ line 37 ~ inchingAction ~ value`, value);
        setChecked(value);
    }
    useEffect(() => {
        params?.pulse && params.pulse === 'on' ? setChecked(true) : setChecked(false);
        // setInchingTime();
    },[]);
    return (
        <div className={`${styles['inching-mode']} ${style}`}>
            <span className={styles['span-font']}>Inching mode</span>
            <div>
                <TimePicker className={styles['mgr20']} format={formatStyle} defaultValue={inchingTime} onChange={(time) => getInchingTime(time)} />
                <Switch checked={checked} onClick={(value) => inchingAction(value)} />
            </div>
        </div>
    );
};
export default InchingMode;
