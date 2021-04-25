// 多功能双通道电量检测开关
import React from 'react';
import { Switch } from 'antd';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/ts/type';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';

interface DualR3CardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
    };
    channel: {
        stat: boolean;
        name: string;
    };
    voltage: string;
    current: string;
    ballData: {
        title: string;
        content: string;
    }[];
}

const DualR3Card: React.FC<DualR3CardProps> = ({ deviceData, channel, voltage, current, ballData }) => {
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
            <div className={style['triple-box']}>
                {
                    // 三个一排的水波球
                    ballData.map((data, i) => {
                        return (
                            <LiquidBall
                                key={i}
                                size="small"
                                type={i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'yellow' : 'blue'}
                                title={data.title}
                                content={data.content}
                            />
                        );
                    })
                }
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
                <div className={style['channel-icon']}>
                    {
                        channel.stat ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />
                    }
                </div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch
                    checked={channel.stat}
                    onClick={(v, e) => {
                        e.stopPropagation();
                        console.log('you click channel');
                    }}
                />
            </div>
        </div>
    );
};

export default DualR3Card;
