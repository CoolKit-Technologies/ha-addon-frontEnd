// 恒温恒湿改装件
import React from 'react';
import { Switch } from 'antd';

import ArcGauge from '@/components/ArcGauge';
import style from './card.less';

interface TempCardProps {
    deviceName: string;
    channel: {
        stat: boolean;
        name: string;
    };
    mode: string;
    humi?: string;
    temp?: string;
}

const TempCard: React.FC<TempCardProps> = ({ deviceName, channel, mode }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}></div>
                <span className={style['device-name']}>{deviceName}</span>
                <div className={style['refresh-icon']}></div>
            </div>
            <div className={style['double-box']}>
                <ArcGauge
                    type="humi"
                />
                <ArcGauge
                    type="temp"
                />
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}></div>
                <span className={style['channel-name']}>Mode</span>
                <span>{mode}</span>
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}></div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch />
            </div>
        </div>
    );
};

export default TempCard;
