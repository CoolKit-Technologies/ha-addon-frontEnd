// 单通道开关，多通道开关，单通道插座，多通道插座
import React from 'react';
import { Switch } from 'antd';

import foo from '@/assets/flash.svg';
import style from './card.less';

interface SocketSwitchCardProps {
    deviceName: string;
    channels: {
        stat: boolean;
        name: string;
    }[];
}

const SocketSwitchCard: React.FC<SocketSwitchCardProps> = ({ deviceName, channels }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-switch']}>
                <div className={style['info-icon']}><img src={foo} className={style['icon']} /></div>
                <span className={style['device-name']}>{deviceName}</span>
                {
                    // 总开关（单通道开关／插座没有总开关）
                    channels.length === 1 ? null : <Switch checked={channels.filter((chan) => chan.stat).length === channels.length} />
                }
            </div>
            {
                // 单通道开关
                channels.map((channel, i) => {
                    return (
                        <div key={i} className={style['channel']}>
                            <div className={style['channel-icon']}></div>
                            <span className={style['channel-name']}>{channel.name}</span>
                            <Switch checked={channel.stat} />
                        </div>
                    );
                })
            }
        </div>
    );
};

export default SocketSwitchCard;
