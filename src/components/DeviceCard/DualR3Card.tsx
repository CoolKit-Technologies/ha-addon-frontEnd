// 多功能双通道电量检测开关
import React from 'react';
import { Switch } from 'antd';

import style from './card.less';

interface DualR3CardProps {
    deviceName: string;
    channel: {
        stat: boolean;
        name: string;
    };
    voltage: string;
    current: string;
}

const DualR3Card: React.FC<DualR3CardProps> = ({ deviceName, channel, voltage, current }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}></div>
                <span className={style['device-name']}>{deviceName}</span>
                <div className={style['refresh-icon']}></div>
            </div>
            <div className={style['vol-cur-data']}>
                <div className={style['vol']}>
                    <p className={style['key']}>Voltage</p>
                    <p className={style['value']}>{voltage}</p>
                </div>
                <div className={style['divided']}></div>
                <div className={style['cur']}>
                    <p className={style['key']}>Current</p>
                    <p className={style['value']}>{current}</p>
                </div>
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}></div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch />
            </div>
        </div>
    );
};

export default DualR3Card;
