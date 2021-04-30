import React, { useState, useEffect } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { changeDeviceStatus, controlDiyDevice } from '@/api';
const EnableEntityItem: React.FC<IComponentProps> = (props) => {
    const [checked, setChecked] = useState(false);
    const { formatMessage } = useIntl();
    async function changeDeviceState(disabled: boolean) {
        if (props.type === 'diy') {
            let params = {
                id: props.deviceId,
                type: 'startup',
                params: {
                    state: disabled ? 'on' : 'off',
                },
            };
            console.log(`ML ~ file: index.tsx ~ line 20 ~ changeDeviceState ~ params`, params);
            const res = await controlDiyDevice(params);
            console.log(`ML ~ file: index.tsx ~ line 21 ~ changeDeviceState ~ res`, res);
        } else {
            let params = {
                id: props.deviceId,
                disabled: disabled,
            };
            const res = await changeDeviceStatus(params);
            setChecked(disabled);
        }
    }
    useEffect(() => {
        setChecked(props.disabled);
    }, []);
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.entity.enable' })}
                <span className={styles['tips']}>{formatMessage({ id: 'device.entity.enable.tips' })}</span>
            </div>
            <div className={styles['actions']}>
                <Switch checked={checked} onClick={(value) => changeDeviceState(value)} />
            </div>
        </div>
    );
};
export default EnableEntityItem;
