import React, { useState, useEffect } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
import _ from 'lodash';
const IndicatorLEDItem: React.FC<IComponentProps> = (props) => {
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
            const res = await controlDiyDevice(params);
            setChecked(value);
        } else {
            let params = {
                id: props.deviceId,
                apikey: props.apikey,
                params: {
                    // sledOnline: value ? 'on' : 'off',
                },
            };
            props.uiid === 126 ? _.assign(params.params, { sledBright: value ? 100 : 0 }) : _.assign(params.params, { sledOnline: value ? 'on' : 'off' });

            const res = await updateDeviceByWS(params);
            setChecked(value);
        }
    }
    useEffect(() => {
        props.params?.sledOnline === 'on' ? setChecked(true) : setChecked(false);
    }, [props.params?.sledOnline]);
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
