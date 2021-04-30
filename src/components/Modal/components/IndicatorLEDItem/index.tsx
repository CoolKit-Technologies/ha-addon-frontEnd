import React, { useState, useEffect } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
const IndicatorLEDItem: React.FC<IComponentProps> = (props) => {
    console.log(`ML ~ file: index.tsx ~ line 9 ~ props`, props);
    const [checked, setChecked] = useState(false);
    const { formatMessage } = useIntl();
    async function setLEDOnline(value: boolean) {
        if (props.type === 'diy') {
            let params = {
                id: props.deviceId,
                type: 'sledOnline',
                params: {
                    state: value ? 'on' : 'off',
                },
            };
            console.log(`ML ~ file: index.tsx ~ line 20 ~ setLEDOnline ~ params`, params);
            const res = await controlDiyDevice(params);
            console.log(`ML ~ file: index.tsx ~ line 21 ~ setLEDOnline ~ res`, res);
            setChecked(value);
        } else {
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
            setChecked(value);
        }
    }
    useEffect(() => {
        props.params?.sledOnline === 'on' ? setChecked(true) : setChecked(false);
    }, []);
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.led' })}</div>
            <div className={styles['actions']}>
                <Switch checked={checked} onClick={async (value) => setLEDOnline(value)} />
            </div>
        </div>
    );
};
export default IndicatorLEDItem;
