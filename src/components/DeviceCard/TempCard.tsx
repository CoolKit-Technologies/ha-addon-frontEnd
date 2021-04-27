// 恒温恒湿改装件
import React, { useState } from 'react';
import { Switch } from 'antd';

import ArcGauge from '@/components/ArcGauge';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import IconTune from '@/assets/svg/tune.svg';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';
import ConstantTempAndHumiModal from '../Modal/ConstantTempAndHumiModal';
import { updateDeviceByWS } from '@/api';

interface TempCardProps {
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
    mode: string;
    humi: string;
    temp: string;
}

const TempCard: React.FC<TempCardProps> = ({ deviceData, channel, mode, humi, temp }) => {
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
    };
    const toggle = async (v: boolean) => {
        const { deviceId, apikey } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off',
            },
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
            <div className={style['double-box']}>
                <ArcGauge type='green' title='Humidity' content={humi} />
                <ArcGauge type='blue' title='Temperature' content={temp} />
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>
                    <img src={IconTune} />
                </div>
                <span className={style['channel-name']}>Mode</span>
                <span>{mode}</span>
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
            <ConstantTempAndHumiModal title={deviceData.name} visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
        </div>
    );
};

export default TempCard;
