// 功率检测插座
import React from 'react';
import { Switch } from 'antd';

import LiquidBall from '@/components/LiquidBall';
import style from './card.less';

interface IW100CardProps {
    deviceName: string;
    channel: {
        stat: boolean;
        name: string;
    };
    ballData: {
        title: string;
        content: string;
    }[];
}

const IW100Card: React.FC<IW100CardProps> = ({ deviceName, channel, ballData }) => {
    return (
        <div className={style['card']}>
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}></div>
                <span className={style['device-name']}>{deviceName}</span>
                <div className={style['refresh-icon']}></div>
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
            <div className={style['channel']}>
                <div className={style['channel-icon']}></div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch />
            </div>
        </div>
    );
};

export default IW100Card;
