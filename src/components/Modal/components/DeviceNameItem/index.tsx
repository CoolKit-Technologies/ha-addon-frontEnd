import React, { useState } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Input } from 'antd';
const DeviceNameItem: React.FC = (props) => {
    const [deviceName, setDeviceName] = useState('');
    const [abled, setAbled] = useState(true);
    const { formatMessage } = useIntl();

    function saveDeviceName(deviceName: string) {
        console.log(`ML ~ file: index.tsx ~ line 12 ~ saveDeviceName ~ deviceName`, deviceName);
        //  保存设备名称
        setAbled(true);
    }
    return (
        <div className={styles['device-name-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.name' })}</div>
            <div className={styles['fake-input']}>
                <Input value={deviceName} disabled={abled} onChange={(e) => setDeviceName(e.target.value)} bordered={false} className={styles['ant-input']}></Input>
                <div className={styles['input-actions']}>
                    {abled ? <EditOutlined onClick={() => setAbled(false)} /> : <SaveOutlined onClick={() => saveDeviceName(deviceName)} />}
                </div>
            </div>
        </div>
    );
};
export default DeviceNameItem;
