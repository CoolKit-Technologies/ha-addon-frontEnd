// 多功能双通道电量检测开关
import React, { useState, useEffect } from 'react';
import { Switch, message } from 'antd';
import { useIntl } from 'umi';

import LiquidBall from '@/components/LiquidBall';
import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import IconRefresh from '@/assets/svg/refresh.svg';
import { deviceTypeMap, getIconByDeviceType, getMittEmitter } from '@/utils';
import style from './card.less';
import PowerDetectionSocketModal from '../Modal/PowerDetectionSocketModal';
import { updateDeviceByWS } from '@/api';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const DualR3Card: React.FC<Props> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { apikey, deviceId, online, deviceName, params, tags, disabled, uiid, model } = deviceData;
    const type = deviceTypeMap(deviceData.type);
    const i = deviceData.xindex;
    const voltage = params[`voltage_0${i}`] / 100 + 'V';
    const current = params[`current_0${i}`] / 100 + 'A';
    const ballData = [
        { title: formatMessage({ id: 'device.card.real.power' }), content: params[`actPow_0${i}`] / 100 + 'W' },
        { title: formatMessage({ id: 'device.card.reactive.power' }), content: params[`reactPow_0${i}`] / 100 + 'W' },
        { title: formatMessage({ id: 'device.card.apparent.power' }), content: params[`apparentPow_0${i}`] / 100 + 'W' },
    ];
    const channel = { stat: params.switches[i].switch, name: tags ? tags[i] : formatMessage({ id: 'device.card.channel.multi' }, { i: i + 1 }) };

    // 绑定更新事件
    useEffect(() => {
        emitter.on(`data-update-${deviceId}-${i}`, (data: any) => {
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
        params,
        uiid,
        i,
        model,
    };

    const toggle = async (v: boolean) => {
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switches: [{ outlet: i, switch: v ? 'on' : 'off' }],
            },
            useLanCtrl: type === 'lan'
        });
    };

    const refresh = async (i: number) => {
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
                            if (online) await refresh(i);
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
                    <p className={style['key']}>{formatMessage({ id: 'device.card.voltage' })}</p>
                    <p className={style['value']}>{voltage}</p>
                </div>
                <div className={style['divided']}></div>
                <div className={style['cur']}>
                    <p className={style['key']}>{formatMessage({ id: 'device.card.current' })}</p>
                    <p className={style['value']}>{current}</p>
                </div>
            </div>
            <div className={style['channel']}>
                <div className={style['channel-icon']}>{channel.stat === 'on' ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />}</div>
                <span className={style['channel-name']}>{channel.name}</span>
                <Switch
                    checked={channel.stat === 'on'}
                    onClick={async (v, e) => {
                        e.stopPropagation();
                        await toggle(v);
                    }}
                    disabled={!online}
                />
            </div>
            <PowerDetectionSocketModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
        </div>
    );
};

export default DualR3Card;
