import React from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
const IndicatorLEDItem: React.FC<IComponentProps> = (props) => {
    const { formatMessage } = useIntl();
    async function setLEDOnline(value: boolean) {
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {
                sledOnline: value ? 'on' : 'off',
            },
        };
        console.log(`ML ~ file: index.tsx ~ line 18 ~ setLEDOnline ~ params`, params);
        const res = await updateDeviceByWS(params);
        console.log(`ML ~ file: index.tsx ~ line 20 ~ setLEDOnline ~ res`, res);
    }

    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.led' })}</div>
            <div className={styles['actions']}>
                <Switch onClick={async (value) => setLEDOnline(value)} />
            </div>
        </div>
    );
};
export default IndicatorLEDItem;
