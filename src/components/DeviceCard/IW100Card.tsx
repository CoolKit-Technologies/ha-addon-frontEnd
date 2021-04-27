// 功率检测插座
import React, { useState } from 'react';
import { Switch } from 'antd';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';
import PowerDetectionSocketModal from '../Modal/PowerDetectionSocketModal';

import { updateDeviceByWS } from '@/api';

interface IW100CardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
        deviceId: string;
        apikey: string;
        model: string;
        fwVersion: string;
    };
    channel: {
        stat: 'on' | 'off';
        name: string;
    };
    ballData: {
        title: string;
        content: string;
    }[];
}

const IW100Card: React.FC<IW100CardProps> = ({ deviceData, channel, ballData }) => {
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    const toggle = async (v: boolean) => {
        const { apikey, deviceId } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off'
            }
        });
    };

    const refresh = async () => {
        const { apikey, deviceId } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                uiActive: 120
            }
        });
    };

    return (
        <div
            className={deviceData.online ? style['card'] : style['card-disabled']}
            onClick={() => {
                console.log('you click card');
                setModalVisible(true);
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
                        onClick={async (e) => {
                            e.stopPropagation();
                            console.log('you click refresh');
                            if (deviceData.online)
                                await refresh();
                        }}
                    />
                </div>
            </div>
            <div className={style['triple-box']}>
                {// 三个一排的水波球
                ballData.map((data, i) => {
                    return <LiquidBall key={i} size='small' type={i === 0 ? 'blue' : i === 1 ? 'green' : i === 2 ? 'yellow' : 'blue'} title={data.title} content={data.content} />;
                })}
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>{channel.stat === 'on' ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />}</div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch
                    checked={channel.stat === 'on'}
                    onChange={async (v, e) => {
                        e.stopPropagation();
                        await toggle(v);
                    }}
                    disabled={!deviceData.online}
                />
            </div>
            <PowerDetectionSocketModal visible={modalVisible} onCancel={onCancel} title={deviceData.name} />

        </div>
    );
};

export default IW100Card;
