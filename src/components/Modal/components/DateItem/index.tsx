import { DatePicker, Divider } from 'antd';
import React from 'react';
import styles from './index.less';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
const DateItem: React.FC<IComponentProps> = (props) => {
    async function getHistoryData() {
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                hundredDaysKwh: 'get',
            },
        };
        console.log(`ML ~ file: index.tsx ~ line 15 ~ getHistoryData ~ params`, params);
        const res = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 17 ~ getHistoryData ~ res`, res);
    }
    return (
        <div className={styles['date-item']}>
            <div className={styles['mgt']}>
                <DatePicker picker='month' onChange={(date) => console.log(date)} onClick={getHistoryData} />
            </div>
            <Divider />
        </div>
    );
};
export default DateItem;
