// 功率检测插座
import React from 'react';
import { Switch } from 'antd';

import style from './card.less';

interface IW100CardProps {
    deviceName: string;
    channel: {
        stat: boolean;
        name: string;
    };
}

const IW100Card: React.FC<IW100CardProps> = ({ deviceName, channel }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}></div>
                <span className={style['device-name']}>{deviceName}</span>
                <div className={style['refresh-icon']}></div>
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}></div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch />
            </div>
        </div>
    );
};

export default IW100Card;
