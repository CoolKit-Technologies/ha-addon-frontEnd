import React, { useState, useEffect } from 'react';
import styles from './index.less';
import _ from 'lodash';
import SocketSwitchCard from '@/components/DeviceCard/SocketSwitchCard';
import PowerDetCard from '@/components/DeviceCard/PowerDetCard';
import TempCard from '@/components/DeviceCard/TempCard';
import DualR3Card from '@/components/DeviceCard/DualR3Card';
import IW100Card from '@/components/DeviceCard/IW100Card';
import UnsupportedCard from '@/components/DeviceCard/UnsupportedCard';
import { connect } from 'umi';
import { Card, Button } from 'antd';
import Header from '@/components/Header';
import CKLiquid from '@/components/Circle/CKLiquid';
import CKGauge from '@/components/Circle/CKGauge';
import YellowGauge from '@/components/Circle/YellowGauge';
import SettingModal from '@/components/Modal/SettingModal';
import CKLine from '@/components/Circle/CKLine';
import DeviceDataModal from '@/components/Modal/DeviceData';
import MultiChannelSettingModal from '../components/Modal/MultiChannelSettingModal';
import EnvironmentStatus from '@/components/Modal/EnvironmentStatus';
import ChannelModal from '@/components/Modal/ChannelModal';
import PowerDetectionModal from '@/components/Modal/PowerDetectionModal';
import PowerDetectionSocketModal from '@/components/Modal/PowerDetectionSocketModal';
import EModalType from '../ts/Enum/EModalType';
import MultiDeviceSettingModal from '@/components/Modal/MultiDeviceSettingModal';
import ConstantTempAndHumiModal from '../components/Modal/ConstantTempAndHumiModal';

import { login, getDeviceList } from '@/api';
import { DeviceInfo } from '@/types/device';
import { isDualR3, isIW100Device, isPowerDet, isSocketSwitchDevice, isTempDevice, deviceTypeMap } from '@/utils';

const { Meta } = Card;

const App: React.FC<{ language: string; getLanguage: Function; deviceList: DeviceInfo[]; saveDeviceList:any }> = ({ getLanguage, deviceList, saveDeviceList}) => {
    useEffect(() => {
        // getLanguage();

        // dev
        // const source = new EventSource('http://localhost:3000/api/stream');
        const source = new EventSource('http://192.168.1.115:3000/api/stream');
        // Prod
        // const source = new EventSource('api/stream');
        source.addEventListener('open', () => {
            console.log('连接建立成功');
        });
        source.addEventListener('message', (e) => {
            console.log(JSON.parse(e.data));
            saveDeviceList(JSON.parse(e.data));
        });
        return () => {
            source.close();
        };
    }, []);

    console.log(deviceList);
    const [col1, col2, col3] = _.chunk(deviceList, Math.ceil(deviceList.length / 3));

    const renderDeviceCard = (data: DeviceInfo) => {
        const { key, uiid, deviceId, deviceName, online } = data;
        const type = deviceTypeMap(data.type);
        const name = deviceName || deviceId;
        const deviceData = {
            deviceId,
            online,
            type,
            name
        };
        if (isDualR3(uiid)) {
            return (
                <DualR3Card
                    key={deviceId}
                    deviceData={{online:true,type:'diy',name:'DualR3 channel 1'}}
                    channel={{stat:true,name:'channel'}}
                    voltage="150V"
                    current="1.0A"
                    ballData={[
                        { title: 'Power', content: '231 W' },
                        { title: 'Voltage', content: '110 V' },
                        { title: 'Current', content: '2.1 A' },
                    ]}
                />
            );
        } else if (isIW100Device(uiid)) {
            const { power, voltage, current } = data.params;
            const ballData = [
                { title: 'Power', content: `${power}W` },
                { title: 'Voltage', content: `${voltage}V` },
                { title: 'Current', content: `${current}A` },
            ];
            return <IW100Card key={key} deviceData={deviceData} channel={{ stat: data.params.switch, name: 'channel' }} ballData={ballData} />;
        } else if (isPowerDet(uiid)) {
            return <PowerDetCard key={deviceId} deviceData={deviceData} channel={{ stat: data.params.switch, name: 'channel' }} power={149} />;
        } else if (isSocketSwitchDevice(uiid)) {
            const channels: {name:string;stat:'on'|'off'}[] = [];
            if (uiid === 1 && type === 'diy') {                         // 单通道 DIY
                channels.push({ name: 'channel', stat: data.params.data1.switch });
            } else if (uiid === 1 || uiid === 6 || uiid === 14) {       // 单通道非 DIY
                channels.push({ name: 'channel', stat: data.params.switch });
            } else if (uiid === 77 || uiid === 78 || uiid === 112) {    // 单通道（多通道协议）
                channels.push({ name: 'channel', stat: data.params.switches[0].switch });
            } else if (uiid === 2 || uiid === 7 || uiid === 113) {      // 双通道
                for (let i = 0; i < 2; i++)
                    if (data.tags)
                        channels.push({ name: data.tags[i], stat: data.params.switches[i].switch });
                    else
                        channels.push({ name: `channel ${i+1}`, stat: data.params.switches[i].switch });
            } else if (uiid === 3 || uiid === 8 || uiid === 114) {      // 三通道
                for (let i = 0; i < 3; i++)
                    if (data.tags)
                        channels.push({ name: data.tags[i], stat: data.params.switches[i].switch });
                    else
                        channels.push({ name: `channel ${i+1}`, stat: data.params.switches[i].switch });
            } else if (uiid === 4 || uiid === 9) {                      // 四通道
                for (let i = 0; i < 4; i++)
                    if (data.tags)
                        channels.push({ name: data.tags[i], stat: data.params.switches[i].switch });
                    else
                        channels.push({ name: `channel ${i+1}`, stat: data.params.switches[i].switch });
            }
            return <SocketSwitchCard key={key} deviceData={{ apikey: data.apikey, model: data.model, fwVersion: data.params.fwVersion, ...deviceData }} channels={channels} />;
        } else if (isTempDevice(uiid)) {
            return <TempCard key={deviceId} deviceData={deviceData} channel={{ stat: data.params.switch, name: 'channel' }} mode='AUTO' humi={`${data.params.currentHumidity}%`} temp={`${data.params.currentTemperature}C`} />;
        } else {
            return <UnsupportedCard key={key} deviceData={deviceData} />;
        }
    };

    return (
        <div>
            <Header />
            <div style={{padding:'20px'}}>
                <Button onClick={async () => {
                    console.log('you want sign in');
                    const res = await login({
                        countryCode: '+86',
                        lang: 'en',
                        password: 'ck2021it.',
                        phoneNumber: '+8615270260364'
                    });
                    console.log(res);
                }}>Sign in</Button>
                <Button onClick={() => {
                    console.log('you want sign out');
                }}>Sign out</Button>
                <Button onClick={async () => {
                    console.log('you want refresh');
                    const res = await getDeviceList({ type: 'refresh' });
                    saveDeviceList(res.data);
                }}>Refresh</Button>
            </div>
            <div className={styles['main-container']}>
                {/* <div className={styles['ad-box']}>
                    {Array.from({ length: 5 }).map((item) => (
                        <Card cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}>
                            <Meta title='Card title' description='This is the description' />
                        </Card>
                    ))}
                </div> */}
                <div className={styles['device-box']}>
                    <div className={styles['device-col']}>{ col1 ? col1.map((item) => renderDeviceCard(item)) : null }</div>
                    <div className={styles['device-col']}>{ col2 ? col2.map((item) => renderDeviceCard(item)) : null }</div>
                    <div className={styles['device-col']}>{ col3 ? col3.map((item) => renderDeviceCard(item)) : null }</div>
                </div>
            </div>

            {/* <UnsupportedCard
                deviceData={{online:true,name:'XXX',type:'cloud'}}
            />

            <hr />

            <SocketSwitchCard deviceData={{ name: '1 Channel Switch', type: 'cloud', online: true }} channels={[{ name: 'channel 1', stat: true }]} />

            <hr />

            <SocketSwitchCard
                deviceData={{ name: '1 Channel Switch', type: 'diy', online: false }}
                channels={[
                    { name: 'channel 1', stat: true },
                    { name: 'channel 2', stat: true },
                ]}
            />

            <hr />

            <SocketSwitchCard
                deviceData={{ name: '1 Channel Switch', type: 'lan', online: true }}
                channels={[
                    { name: 'channel 1', stat: true },
                    { name: 'channel 2', stat: true },
                    { name: 'channel 3', stat: false },
                ]}
            />

            <hr />

            <SocketSwitchCard
                deviceData={{ name: '1 Channel Switch', type: 'lan', online: false }}
                channels={[
                    { name: 'channel 1', stat: true },
                    { name: 'channel 2', stat: true },
                    { name: 'channel 3', stat: true },
                    { name: 'channel 4', stat: true },
                ]}
            />

            <hr />

            <PowerDetCard deviceData={{ online: true, type: 'cloud', name: 'Power Det' }} channel={{ stat: true, name: 'hello' }} power={149} />

            <hr />

            <TempCard deviceData={{ online: true, type: 'diy', name: 'TH10' }} channel={{ stat: true, name: 'bbb' }} mode='AUTO' />

            <hr />

            <DualR3Card
                deviceData={{ online: true, type: 'diy', name: 'DualR3 channel 1' }}
                channel={{ stat: true, name: 'channel' }}
                voltage='150V'
                current='1.0A'
                ballData={[
                    { title: 'Power', content: '231 W' },
                    { title: 'Voltage', content: '110 V' },
                    { title: 'Current', content: '2.1 A' },
                ]}
            />

            <hr />

            <IW100Card
                deviceData={{ online: true, type: 'diy', name: 'IW100' }}
                channel={{ stat: true, name: 'chh' }}
                ballData={[
                    { title: 'Power', content: '231 W' },
                    { title: 'Voltage', content: '110 V' },
                    { title: 'Current', content: '2.1 A' },
                ]}
            />

            <hr /> */}

            {/* <CKLiquid value={'111'} />
            <CKGauge percent={0.7} />
            <YellowGauge value={0.45} />
            {/* <SettingModal visible={false}></SettingModal> */}
            {/* <CKLiquid value={'111'} />
            <CKGauge percent={0.7} />
            <YellowGauge value={50} /> */}
            {/* <SettingModal visible title='aa' type={EModalType.MULTI}></SettingModal> */}
            {/* <CKGauge percent={0.7} /> */}
            {/* <YellowGauge value={50} /> */}
            {/* 多通道 */}
            {/* <MultiDeviceSettingModal visible title='4 channel'></MultiDeviceSettingModal>  */}
            {/* 单通道 */}
            {/* <ChannelModal visible title='1 Channel Socket/Switch'></ChannelModal> */}
            {/* 功率检测单通道 */}
            {/* <PowerDetectionModal visible title='Power detection Socket'></PowerDetectionModal> */}
            {/* 功率检测插座过载警告 & 多功能双通道电量检测开关 */}
            {/* <PowerDetectionSocketModal visible title='IW100'></PowerDetectionSocketModal> */}
            {/* 恒温恒湿改装件 */}
            {/* <ConstantTempAndHumiModal visible title='TH Switch' /> */}
        </div>
    );
};

export default connect(
    ({ global }: any) => ({
        language: global.language,
        deviceList: global.deviceList,
    }),
    (dispatch) => ({
        getLanguage: () =>
            dispatch({
                type: 'global/getLanguage',
            }),
        saveDeviceList: (deviceList: DeviceInfo[]) =>
            dispatch({
                type: 'global/save',
                payload: {
                    deviceList
                }
            }),
    })
)(App);
