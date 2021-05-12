// 单通道开关，多通道开关，单通道插座，多通道插座
import React, { useState, useReducer, useEffect } from 'react';
import { useIntl } from 'umi';
import { Switch, message } from 'antd';
import _ from 'lodash';

import { DeviceType, Channel } from '@/types/device';
import IconFlashOn from '@/assets/svg/flash-on.svg';
import IconFlashOff from '@/assets/svg/flash-off.svg';
import { getIconByDeviceType } from '@/utils';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import style from './card.less';
import ChannelModal from '../Modal/ChannelModal';
import MultiDeviceSettingModal from '../Modal/MultiDeviceSettingModal';
import DIYChannelModal from '../Modal/DIYChannelModal';
import { getTmpDeviceList, getMittEmitter, deviceTypeMap } from '@/utils';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const SocketSwitchCard: React.FC<Props> = ({ data }) => {
    /*const [modalVisible, setModalVisible] = useState(false);
    function onCancel() {
        setModalVisible(false);
    }
    let modalProps = {
        deviceId: deviceData.deviceId,
        deviceName: deviceData.name,
        apikey: deviceData.apikey,
        uiid: deviceData.uiid,
        type: deviceData.type,
        key: deviceData.key,
        channels: channels.map((item) => {
            return {
                name: item.name,
            };
        }),
        params: deviceData.params,
        disabled: deviceData.disabled,
        model: deviceData.model,
    };*/

    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { deviceId, online, deviceName, uiid, params, tags, apikey } = deviceData;
    const type = deviceTypeMap(deviceData.type);

    // 初始化通道数据
    const channels: Channel[] = [];
    let len = 0;
    if (uiid === 1 && type === 'diy') {                         // 单通道的 DIY 设备
        channels.push({ name: formatMessage({ id: 'device.card.channel.single' }), stat: params.data1.switch });
    } else if (uiid === 1 || uiid === 6 || uiid === 14) {       // 单通道的非 DIY 设备
        channels.push({ name: formatMessage({ id: 'device.card.channel.single' }), stat: params.switch });
    } else if (uiid === 77 || uiid === 78 || uiid === 112) {    // 单通道设备，使用多通道协议
        channels.push({ name: formatMessage({ id: 'device.card.channel.single' }), stat: params.switches[0].switch });
    } else if (uiid === 2 || uiid === 7 || uiid === 113) {      // 双通道设备
        len = 2;
    } else if (uiid === 3 || uiid === 8 || uiid === 114) {      // 三通道设备
        len = 3;
    } else if (uiid === 4 || uiid === 9) {                      // 四通道设备
        len = 4;
    }
    for (let i = 0; i < len; i++) {
        if (tags) {
            channels.push({ name: data.tags[i], stat: params.switches[i].switch });
        } else {
            channels.push({ name: formatMessage({ id: 'device.card.channel.multi' }, { i: i + 1 }), stat: params.switches[i].switch });
        }
    }

    // 绑定事件
    useEffect(() => {
        emitter.on(`data-update-${deviceId}`, (data: any) => {
            setDeviceData(data);
        });
    }, []);

    // 开关一个通道
    const toggle = async (v: boolean, i: number) => {
        if (uiid === 1 && type === 'diy') {
            await controlDiyDevice({
                id: deviceId,
                type: 'switch',
                params: {
                    state: v ? 'on' : 'off',
                },
            });
        } else if (uiid === 1 || uiid === 6 || uiid === 14) {
            await updateDeviceByWS({
                apikey,
                id: deviceId,
                params: {
                    switch: v ? 'on' : 'off',
                },
            });
        } else {
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
        }
    };

    // 开关所有通道
    const totalToggle = async (v: boolean) => {
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
            className={online ? style['card'] : style['card-disabled']}
            onClick={() => {
                // console.log('click card');
                // deviceData.online ? setModalVisible(true) : message.warn('设备不可用');
            }}
        >
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(type, online)} />
                </div>
                <span className={style['device-name']}>{deviceName || deviceId}</span>
                {
                    // 总开关，单通道和互锁的情况下没有这个开关
                    channels.length === 1 || params.lock === 1 ? null : (
                        <Switch
                            checked={channels.filter((chan) => chan.stat === 'on').length === channels.length}
                            onChange={async (v, e) => {
                                e.stopPropagation();
                                await totalToggle(v);
                            }}
                            disabled={!online}
                        />
                    )
                }
            </div>
            {
                // 单通道开关
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
                                disabled={!online}
                            />
                        </div>
                    );
                })
            }
            {/*channels.length === 1 ? (
                deviceData.type !== 'diy' ? (
                    <ChannelModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
                ) : (
                    <DIYChannelModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
                )
            ) : (
                <MultiDeviceSettingModal visible={modalVisible} onCancel={onCancel} device={modalProps} destroyOnClose={true} />
            )*/}
        </div>
    );
};

export default SocketSwitchCard;
