// 功率检测单通道插座
import React, { useState, useEffect } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

import LiquidBall from '@/components/LiquidBall';
import { Channel, DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { deviceTypeMap, getIconByDeviceType, getMittEmitter } from '@/utils';
import style from './card.less';
import PowerDetectionModal from '../Modal/PowerDetectionModal';
import { updateDeviceByWS } from '@/api';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const PowerDetCard: React.FC<Props> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { deviceId, apikey, online, deviceName, params } = deviceData;
    const type = deviceTypeMap(deviceData.type);
    const power = `${params.power}W`;
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
        uiid:deviceData.uiid,
        params: deviceData.params,
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
                    disabled={!online}
                />
            </div>
            {/*<PowerDetectionModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />*/}
        </div>
    );
};

export default PowerDetCard;
