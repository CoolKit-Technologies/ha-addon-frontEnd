// 单通道开关，多通道开关，单通道插座，多通道插座
import React, { useState, useReducer } from 'react';
import { Switch, message } from 'antd';

import { DeviceType } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import { getIconByDeviceType } from '@/utils';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import style from './card.less';
import ChannelModal from '../Modal/ChannelModal';
import MultiDeviceSettingModal from '../Modal/MultiDeviceSettingModal';

interface SocketSwitchCardProps {
    deviceData: {
        deviceId: string;
        apikey: string;
        online: boolean;
        type: DeviceType;
        name: string;
        model: string;
        fwVersion: string;
        disabled: boolean;
        params?: any;
    };
    channels: {
        stat: 'on' | 'off';
        name: string;
    }[];
}

const SocketSwitchCard: React.FC<SocketSwitchCardProps> = ({ deviceData, channels }) => {
    const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
        channels: channels.map((item) => {
            return {
                name: item.name,
            };
        }),
        params: deviceData.params,
        disabled: deviceData.disabled,
    };
    // 开关一个通道
    const toggle = async (v: boolean, i: number) => {
        const { type, deviceId, apikey } = deviceData;
        if (type === 'diy') {
            // 单通道 DIY 设备
            await controlDiyDevice({
                id: deviceId,
                type: 'switch',
                params: {
                    state: v ? 'on' : 'off',
                },
            });
        }
        if (channels.length === 1) {
            // 单通道设备
            await updateDeviceByWS({
                apikey,
                id: deviceId,
                params: {
                    switch: v ? 'on' : 'off',
                },
            });
        }
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switches: [
                    {
                        outlet: i,
                        switch: v ? 'on' : 'off',
                    },
                ],
            },
        });
    };

    // 开关所有通道
    const totalToggle = async (v: boolean) => {
        const { apikey, deviceId } = deviceData;
        const stat = v ? 'on' : 'off';
        const statList = [];
        for (let i = 0; i < channels.length; i++) {
            statList.push({ outlet: i, switch: stat });
        }
        await updateDeviceByWS({
            apikey,
            id: deviceId,
            params: {
                switches: statList,
            },
        });
    };

    return (
        <div
            className={deviceData.online ? style['card'] : style['card-disabled']}
            onClick={() => {
                console.log('click card');
                deviceData.online ? setModalVisible(true) : message.warn('设备不可用');
            }}
        >
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceData.type, deviceData.online)} />
                </div>
                <span className={style['device-name']}>{deviceData.name}</span>
                {// 总开关（单通道开关／插座没有总开关）
                channels.length === 1 || deviceData.params.lock === 1 ? null : (
                    <Switch
                        checked={channels.filter((chan) => chan.stat === 'on').length === channels.length}
                        onChange={async (v, e) => {
                            e.stopPropagation();
                            await totalToggle(v);
                        }}
                        disabled={!deviceData.online}
                    />
                )}
            </div>
            {// 单通道开关
            channels.map((channel, i) => {
                return (
                    <div key={i} className={style['channel']}>
                        <div className={style['channel-icon']}>{channel.stat === 'on' ? <img src={IconFlashOn} /> : <img src={IconFlashOff} />}</div>
                        <span className={style['channel-name']}>{channel.name}</span>
                        <Switch
                            checked={channel.stat === 'on'}
                            onChange={async (v, e) => {
                                e.stopPropagation();
                                await toggle(v, i);
                            }}
                            disabled={!deviceData.online}
                        />
                    </div>
                );
            })}
            {channels.length === 1 ? (
                <ChannelModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
            ) : (
                <MultiDeviceSettingModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
            )}
        </div>
    );
};

export default SocketSwitchCard;
