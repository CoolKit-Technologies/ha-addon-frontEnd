import React, { useState, useEffect, ReactNode } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Input, message } from 'antd';
import { IComponentProps } from '../../../../types/interface/IModal';
import { updateDeviceName } from '@/api';

const DeviceNameItem: React.FC<IComponentProps> = ({ deviceId, deviceName }) => {
    const [name, setDeviceName] = useState(''); // 设备名称
    const [id, setDeviceId] = useState(''); // 设备id

    const [abled, setAbled] = useState(true);
    const { formatMessage } = useIntl();

    async function saveDeviceName(deviceName: string) {
        //  保存设备名称
        const params = {
            id: id,
            newName: deviceName,
        };
        const res = await updateDeviceName(params);
        if (res.error === 0) {
            message.success(formatMessage({ id: 'device.message.modify.success' }));
        }
        setAbled(true);
    }
    useEffect(() => {
        setDeviceName(deviceName);
        setDeviceId(deviceId);
    }, []);
    return (
        <div className={styles['device-name-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.name' })}</div>
            <div className={styles['fake-input']}>
                <Input
                    // key={deviceName}
                    defaultValue={name}
                    value={name}
                    disabled={abled}
                    bordered={false}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className={styles['ant-input']}
                    maxLength={14}
                ></Input>
                <div className={styles['input-actions']}>{abled ? <EditOutlined onClick={() => setAbled(false)} /> : <SaveOutlined onClick={() => saveDeviceName(name)} />}</div>
            </div>
        </div>
    );
};
export default DeviceNameItem;
