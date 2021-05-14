// 功率检测插座
import React, { useState, useEffect } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { getIconByDeviceType, getMittEmitter, deviceTypeMap } from '@/utils';
import style from './card.less';
import PowerDetectionSocketModal from '../Modal/PowerDetectionSocketModal';
import { updateDeviceByWS } from '@/api';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const IW100Card: React.FC<Props> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { online, apikey, deviceId, params, deviceName, disabled, uiid, model } = deviceData;
    const type = deviceTypeMap(deviceData.type);
    const ballData = [
        { title: formatMessage({ id: 'device.card.power' }), content: `${params.power}W` },
        { title: formatMessage({ id: 'device.card.voltage' }), content: `${params.voltage}V` },
        { title: formatMessage({ id: 'device.card.current' }), content: `${params.current}A` },
    ];
    const channel = { stat: params.switch, name: formatMessage({ id: 'device.card.channel.single' }) };

    // 绑定更新事件
    useEffect(() => {
        emitter.on(`data-update-${deviceId}`, (data: any) => {
            setDeviceData(data);
        });
    }, []);

    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId,
        deviceName,
        apikey,
        disabled,
        uiid,
        params,
        model,
    };

    const toggle = async (v: boolean) => {
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switch: v ? 'on' : 'off',
            },
            useLanCtrl: type === 'lan'
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
                online ? setModalVisible(true) : message.warn(formatMessage({ id: 'device.message.device.unavailable' }));
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
                    disabled={!online}
                />
            </div>
            <PowerDetectionSocketModal visible={modalVisible} onCancel={onCancel} destroyOnClose={true} device={modalProps} />
        </div>
    );
};

export default IW100Card;
