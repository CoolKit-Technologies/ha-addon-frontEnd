// 恒温恒湿改装件
import React from 'react';
import { Switch } from 'antd';

import ArcGauge from '@/components/ArcGauge';
import { DeviceType } from '@/ts/type';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import IconTune from '@/assets/svg/tune.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';

interface TempCardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
    };
    channel: {
        stat: boolean;
        name: string;
    };
    mode: string;
    humi?: string;
    temp?: string;
}

const TempCard: React.FC<TempCardProps> = ({ deviceData, channel, mode }) => {
    return (
        <div
            className={style['card']}
            onClick={() => {
                console.log('you click card');
            }}
        >
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceData.type, deviceData.online)} />
                </div>
                <span className={style['device-name']}>{deviceData.name}</span>
                <div className={style['refresh-icon']}>
                    <img
                        src={IconRefresh}
                        width="30"
                        height="30"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('you click refresh');
                        }}
                    />
                </div>
            </div>
            <div className={style['double-box']}>
                <ArcGauge
                    type="green"
                    title="Humidity"
                    content="45%"
                />
                <ArcGauge
                    type="blue"
                    title="Temperature"
                    content="73F"
                />
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>
                    <img src={IconTune} />
                </div>
                <span className={style['channel-name']}>Mode</span>
                <span>{mode}</span>
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>
                    {
                        channel.stat ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />
                    }
                </div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch
                    checked={channel.stat}
                    onChange={(v, e) => {
                        e.stopPropagation();
                        console.log('you click channel');
                    }}
                />
            </div>
        </div>
    );
};

export default TempCard;
