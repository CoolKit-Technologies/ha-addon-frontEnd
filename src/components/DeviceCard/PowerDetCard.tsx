// 功率检测单通道插座
import React, { useState } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

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
        disabled: boolean;
        uiid: number;
        params: any;
    };
    channel: {
        stat: 'on' | 'off';
        name: string;
    };
    power: string;
}

const PowerDetCard: React.FC<PowerDetCardProps> = ({ deviceData, channel, power }) => {
    const { formatMessage } = useIntl();
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
        disabled: deviceData.disabled,
        uiid:deviceData.uiid,
        params: deviceData.params,
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

    const refresh = async () => {
        const { apikey, deviceId } = deviceData;
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                uiActive: 120,
            },
        });
    };

    return (
        <div
            className={deviceData.online ? style['card'] : style['card-disabled']}
            onClick={() => {
                // console.log('you click card');
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
                            // console.log('you click refresh');
                            if (deviceData.online) await refresh();
                        }}
                    />
                </div>
            </div>
            <div className={style['single-box']}>
                <LiquidBall size='large' type='blue' title={formatMessage({ id: 'device.card.realtime.stats' })} content={power} />
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
            <PowerDetectionModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
        </div>
    );
};

export default PowerDetCard;
