// 恒温恒湿改装件
import React, { useState } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

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
        disabled: boolean;
        params: any;
    };
    channel: {
        stat: 'on' | 'off';
        name: string;
    };
    mode: string;
    unit: string; // 温度单位
    humi: string;
    temp: string;
}

const TempCard: React.FC<TempCardProps> = ({ deviceData, channel, mode, humi, temp, unit }) => {
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

    // 获取温度
    const getTempStr = (temp: string, unit: string) => {
        let postfix = unit === 'c' ? '°C' : '°F';
        let value = '';
        if (unit === 'c') {
            value = `${parseFloat(temp)}`;
        } else {
            value = (parseFloat(temp) * 9 / 5 + 32).toFixed(2);
        }
        return `${value}${postfix}`;
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
                            if (deviceData.online) await refresh();
                        }}
                    />
                </div>
            </div>
            <div className={style['double-box']}>
                <ArcGauge type='green' title={formatMessage({ id: 'device.card.humidity' })} content={`${humi}%`} percent={parseFloat(humi) / 100} />
                <ArcGauge type='blue' title={formatMessage({ id: 'device.card.temperature' })} content={getTempStr(temp, unit)} percent={parseFloat(temp) / 40} />
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>
                    <img src={IconTune} />
                </div>
                <span className={style['channel-name']}>{ formatMessage({ id: 'device.card.mode' }) }</span>
                <span className={style['channel-value']}>{mode}</span>
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
                    disabled={!deviceData.online || mode === 'normal'}
                />
            </div>
            <ConstantTempAndHumiModal title={deviceData.name} visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
        </div>
    );
};

export default TempCard;
