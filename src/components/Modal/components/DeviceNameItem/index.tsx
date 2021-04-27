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
        console.log(`ML ~ file: index.tsx ~ line 12 ~ saveDeviceName ~ deviceName`, deviceName);
        //  保存设备名称
        const params = {
            id: id,
            newName: deviceName,
        };
        console.log(`ML ~ file: index.tsx ~ line 22 ~ saveDeviceName ~ params`, params);
        const res = await updateDeviceName(params);
        console.log(`ML ~ file: index.tsx ~ line 23 ~ saveDeviceName ~ res`, res);
        if (res.error === 0) {
            message.success('修改成功');
        }
        setAbled(true);
    }
    useEffect(() => {
        setDeviceName(deviceName);
        setDeviceId(deviceId);
        console.log(deviceName);
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
