// 功率检测单通道插座
import React from 'react';
import { Switch } from 'antd';

import style from './card.less';

interface PowerDetCardProps {
    deviceName: string;
    channel: {
        stat: boolean;
        name: string;
    };
    power: number;
}

const PowerDetCard: React.FC<PowerDetCardProps> = ({ deviceName, channel, power }) => {
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

export default PowerDetCard;
