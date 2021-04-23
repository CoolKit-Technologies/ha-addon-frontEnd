// 单通道开关，多通道开关，单通道插座，多通道插座
import React from 'react';
import { Switch } from 'antd';

import { DeviceType } from '@/ts/type';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';

interface SocketSwitchCardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
    };
    channels: {
        stat: boolean;
        name: string;
    }[];
}

const SocketSwitchCard: React.FC<SocketSwitchCardProps> = ({ deviceData, channels }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceData.type, deviceData.online)} />
                </div>
                <span className={style['device-name']}>{deviceData.name}</span>
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
                            <div className={style['channel-icon']}>
                                {
                                    channel.stat ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />
                                }
                            </div>
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
