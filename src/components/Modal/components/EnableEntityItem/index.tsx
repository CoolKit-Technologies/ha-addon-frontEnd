import React from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { changeDeviceStatus } from '@/api';
const EnableEntityItem: React.FC<IComponentProps> = (props) => {
    const { formatMessage } = useIntl();
    async function changeDeviceState(disabled: boolean) {
        let params = {
            id: props.deviceId,
            disabled: disabled,
        };
        console.log(`ML ~ file: index.tsx ~ line 15 ~ changeDeviceState ~ params`, params);
        const res = await changeDeviceStatus(params);
        console.log(`ML ~ file: index.tsx ~ line 16 ~ changeDeviceState ~ res`, res);
    }
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.entity.enable' })}
                <span className={styles['tips']}>Disabled entities will not be added to Home Assistant.</span>
            </div>
            <div className={styles['actions']}>
                <Switch onClick={(value) => changeDeviceState(value)} />
            </div>
        </div>
    );
};
export default EnableEntityItem;
