// 多功能双通道电量检测开关
import React, { useState } from 'react';
import { Switch, message } from 'antd';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';
import PowerDetectionSocketModal from '../Modal/PowerDetectionSocketModal';
import { updateDeviceByWS } from '@/api';

interface DualR3CardProps {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
        deviceId: string;
        apikey: string;
        model: string;
        fwVersion: string;
        disabled: boolean;
        params: any;
    };
    channel: {
        stat: 'on' | 'off';
        name: string;
    };
    voltage: string;
    current: string;
    ballData: {
        title: string;
        content: string;
    }[];
    i: number;
}

const DualR3Card: React.FC<DualR3CardProps> = ({ deviceData, channel, voltage, current, ballData, i }) => {
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
        disabled: deviceData.disabled,
        params: deviceData.params,
    };
    const toggle = async (v: boolean) => {
        const { deviceId, apikey } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switches: [{ outlet: i, switch: v ? 'on' : 'off' }],
            },
        });
    };

    const refresh = async (i: number) => {
        const { apikey, deviceId } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                uiActive: {
                    time: 120,
                    outlet: i,
                },
            },
        });
    };

    return (
        <div
            className={deviceData.online ? style['card'] : style['card-disabled']}
            onClick={() => {
                console.log('you click card');
                deviceData.online ? setModalVisible(true) : message.warn('设备不可用');
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
                        onClick={async (e) => {
                            e.stopPropagation();
                            console.log('you click refresh');
                            if (deviceData.online) await refresh(i);
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
                <div className={style['channel-icon']}>{channel.stat ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />}</div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch
                    checked={channel.stat === 'on'}
                    onClick={async (v, e) => {
                        e.stopPropagation();
                        await toggle(v);
                    }}
                    disabled={!deviceData.online}
                />
            </div>
            <PowerDetectionSocketModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
        </div>
    );
};

export default DualR3Card;
