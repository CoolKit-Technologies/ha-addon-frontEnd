import React, { useState, useEffect, ReactNode } from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import styles from './index.less';
import { Input } from 'antd';
import { IChannelName } from '@/types/interface/IModal';

const ChannelNameItem: React.FC<IChannelName> = (props) => {
    const [channelName, setchannelName] = useState('');
    const [abled, setAbled] = useState(true);
    const { formatMessage } = useIntl();

    function savechannelName(channelName: string) {
        console.log(`ML ~ file: index.tsx ~ line 12 ~ savechannelName ~ channelName`, channelName);
        //  保存设备名称
        setAbled(true);
    }
    useEffect(() => {
        setchannelName(props.name as string);
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
