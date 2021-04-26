// 单通道开关，多通道开关，单通道插座，多通道插座
import React, { useState } from 'react';
import { Switch } from 'antd';

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
        online: boolean;
        type: DeviceType;
        name: string;
    };
    channels: {
        stat: 'on' | 'off';
        name: string;
    }[];
}

const SocketSwitchCard: React.FC<SocketSwitchCardProps> = ({ deviceData, channels }) => {
    const [modalVisible, setModalVisible] = useState(false);
    let tags = channels.map((item) => item.name); //通道名称数组
    function onCancel() {
        setModalVisible(false);
    }
    const toggle = (v: boolean) => {
        const { type, deviceId } = deviceData;
        if (type === 'diy') {
            controlDiyDevice({
                id: deviceId,
                type: 'switch',
                params: {
                    state: v ? 'on' : 'off',
                },
            });
        }
    };

    return (
        <div
            className={style['card']}
            onClick={() => {
                console.log('click card');
                setModalVisible(true);
            }}
        >
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceData.type, deviceData.online)} />
                </div>
                <span className={style['device-name']}>{deviceData.name}</span>
                {// 总开关（单通道开关／插座没有总开关）
                channels.length === 1 ? null : (
                    <Switch
                        checked={channels.filter((chan) => chan.stat === 'on').length === channels.length}
                        onChange={(v, e) => {
                            e.stopPropagation();
                            console.log('You click the total');
                        }}
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
                            onChange={(v, e) => {
                                e.stopPropagation();
                                console.log(`You click #${i} channel`);
                                toggle(v);
                            }}
                        />
                    </div>
                );
            })}
            {tags.length === 1 ? (
                <ChannelModal visible={modalVisible} title={deviceData.name} onCancel={onCancel} />
            ) : (
                <MultiDeviceSettingModal visible={modalVisible} title={deviceData.name} onCancel={onCancel} tags={tags} />
            )}
        </div>
    );
};

export default SocketSwitchCard;
