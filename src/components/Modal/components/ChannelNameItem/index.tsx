import React, { useState, useEffect, ReactNode } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Input, message } from 'antd';
import { IChannelSetting } from '@/types/interface/IModal';
import { updateChannelName } from '@/api';

const ChannelNameItem: React.FC<IChannelSetting> = (props) => {
    const [channelName, setchannelName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [index, setIndex] = useState(0);
    const [abled, setAbled] = useState(true);
    const { formatMessage } = useIntl();

    async function savechannelName(channelName: string) {
        //  保存设备名称
        const params = {
            id: deviceId,
            tags: { [index]: channelName },
        };
        const res = await updateChannelName(params);
        if (res.error === 0) {
            message.success(formatMessage({ id: 'device.message.modify.success' }));
        }
        setAbled(true);
    }
    useEffect(() => {
        props.channelName && setchannelName(props.channelName);
        setDeviceId(props.deviceId);
        props.i !== undefined && setIndex(props.i);
    }, []);
    return (
        <div className={styles['device-name-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'channel.name' })}</div>
            <div className={styles['fake-input']}>
                <Input
                    // key={channelName}
                    defaultValue={channelName}
                    value={channelName}
                    disabled={abled}
                    bordered={false}
                    onChange={(e) => setchannelName(e.target.value)}
                    className={styles['ant-input']}
                ></Input>
                <div className={styles['input-actions']}>
                    {abled ? <EditOutlined onClick={() => setAbled(false)} /> : <SaveOutlined onClick={() => savechannelName(channelName)} />}
                </div>
            </div>
        </div>
    );
};
export default ChannelNameItem;
