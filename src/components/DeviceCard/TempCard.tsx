// 恒温恒湿改装件
import React, { useEffect, useState } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

import ArcGauge from '@/components/ArcGauge';
import { DeviceType, Channel } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import IconTune from '@/assets/svg/tune.svg';
import { deviceTypeMap, getIconByDeviceType, getMittEmitter } from '@/utils';
import style from './card.less';
import ConstantTempAndHumiModal from '../Modal/ConstantTempAndHumiModal';
import { updateDeviceByWS } from '@/api';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const TempCard: React.FC<Props> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { deviceId, apikey, unit, params, online, deviceName } = deviceData;
    const type = deviceTypeMap(deviceData.type);
    const mode = params.deviceType;
    const humi = params.currentHumidity;
    const temp = params.currentTemperature;
    const channel: Channel = { stat: params.switch, name: formatMessage({ id: 'device.card.channel.single' }) };

    // 绑定更新事件
    useEffect(() => {
        emitter.on(`data-update-${deviceId}`, (data: any) => {
            setDeviceData(data);
        });
    }, []);

    /*const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
        disabled: deviceData.disabled,
        uiid: deviceData.uiid,
        params: deviceData.params,
        unit: unit,
        model: deviceData.model,
    };*/

    const toggle = async (v: boolean) => {
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off',
            },
        });
    };

    const refresh = async () => {
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
            value = ((parseFloat(temp) * 9) / 5 + 32).toFixed(2);
        }
        return `${value}${postfix}`;
    };

    return (
        <div
            className={online ? style['card'] : style['card-disabled']}
            onClick={() => {
                // console.log('you click card');
                // deviceData.online ? setModalVisible(true) : message.warn('设备不可用');
            }}
        >
            <div className={style['info-refresh']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(type, online)} />
                </div>
                <span className={style['device-name']}>{deviceName || deviceId}</span>
                <div className={style['refresh-icon']}>
                    <img
                        src={IconRefresh}
                        width='30'
                        height='30'
                        onClick={async (e) => {
                            e.stopPropagation();
                            // console.log('you click refresh');
                            if (online) await refresh();
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
                <span className={style['channel-name']}>{formatMessage({ id: 'device.card.mode' })}</span>
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
                    disabled={!online || mode !== 'normal'}
                />
            </div>
            {/*<ConstantTempAndHumiModal title={deviceData.name} visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} /> */}
        </div>
    );
};

export default TempCard;
