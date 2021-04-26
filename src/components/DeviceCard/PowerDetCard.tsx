// 功率检测单通道插座
import React, { useState } from 'react';
import { Switch } from 'antd';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';
import PowerDetectionModal from '../Modal/PowerDetectionModal';
import { updateDeviceByWS } from '@/api';

interface PowerDetCardProps {
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
    power: string;
}

const PowerDetCard: React.FC<PowerDetCardProps> = ({ deviceData, channel, power }) => {
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    const toggle = async (v: boolean) => {
        const { deviceId, apikey } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off'
            }
        });
    };

    return (
        <div
            className={style['card']}
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
                        width='30'
                        height='30'
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('you click refresh');
                        }}
                    />
                </div>
            </div>
            <div className={style['single-box']}>
                <LiquidBall
                    size="large"
                    type="blue"
                    title="Realtime stats"
                    content={power}
                />
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
                />
            </div>
            <PowerDetectionModal visible={modalVisible} onCancel={onCancel} title={deviceData.name} />
        </div>
    );
};

export default PowerDetCard;
