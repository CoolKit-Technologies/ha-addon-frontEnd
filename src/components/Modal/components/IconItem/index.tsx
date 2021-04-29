import React, { useState, useEffect, useContext } from 'react';
import { PlayCircleTwoTone, ReloadOutlined, CheckCircleTwoTone } from '@ant-design/icons';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { updateDeviceByWS } from '@/api';
import moment from 'moment';
interface ICon extends IComponentProps {
    callback: (data: string) => void;
}
const dateFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
const ICons: React.FC<ICon> = (props) => {
    const [start, setStart] = useState(false); //  开始电量统计标识
    const [startTime, setStartTime] = useState(''); //  记录开始时间iso格式
    async function elecStart() {
        setStart(true);
        setStartTime(
            moment()
                .utc()
                .format(dateFormat)
        );
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                onKwh: 'start',
                endTime: '',
                startTime: moment()
                    .utc()
                    .format(dateFormat),
            },
        };
        console.log(`ML ~ file: index.tsx ~ line 17 ~ elecStart ~ params`, params);
        const startRes = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 18 ~ elecStart ~ startRes`, startRes);
    }
    async function elecEnd() {
        setStart(false);
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                onKwh: 'stop',
                endTime: moment()
                    .utc()
                    .format(dateFormat),
                startTime: startTime,
            },
        };
        console.log(`ML ~ file: index.tsx ~ line 31 ~ elecEnd ~ params`, params);
        const endRes = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 33 ~ elecEnd ~ endRes`, endRes);
        await refresh();
    }
    async function refresh() {
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                oneKwh: 'get',
            },
        };
        console.log(`ML ~ file: index.tsx ~ line 43 ~ refresh ~ params`, params);
        const res = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 45 ~ refresh ~ res`, res);
        if (res.error === 0 && res.data && res.data.config) {
            props.callback(res.data.config.oneKwhData);
        }
    }
    return (
        <div className={styles['iconsPos']}>
            {start ? <CheckCircleTwoTone className={styles['mgr100']} onClick={elecEnd} /> : <PlayCircleTwoTone className={styles['mgr100']} onClick={elecStart} />}

            <ReloadOutlined onClick={refresh} />
        </div>
    );
};
export default ICons;
