import React, { useEffect } from 'react';
import styles from './index.less';
import _ from 'lodash';
import SocketSwitchCard from '@/components/DeviceCard/SocketSwitchCard';
import PowerDetCard from '@/components/DeviceCard/PowerDetCard';
import TempCard from '@/components/DeviceCard/TempCard';
import DualR3Card from '@/components/DeviceCard/DualR3Card';
import IW100Card from '@/components/DeviceCard/IW100Card';
import UnsupportedCard from '@/components/DeviceCard/UnsupportedCard';
import { connect,Dispatch, useParams } from 'umi';
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
import { AccountBookFilled, DownloadOutlined, UserOutlined } from '@ant-design/icons';

import { login, getDeviceList, userIsLogin, logout } from '@/api';
import { DeviceInfo } from '@/types/device';
import { isDualR3, isIW100Device, isPowerDet, isSocketSwitchDevice, isTempDevice, deviceTypeMap } from '@/utils';

const { Meta } = Card;

const App: React.FC<{ language: string; getLanguage: Function; deviceList: DeviceInfo[]; saveDeviceList:Function, dispatch: Dispatch; isLogin: boolean; checkUserLogin: Function; }> = ({ isLogin, checkUserLogin, getLanguage, deviceList, saveDeviceList, dispatch}) => {
    useEffect(() => {
        checkUserLogin();

        getDeviceList({ type: 'init' }).then((res) => saveDeviceList(res.data));
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
            console.log('sse -> deviceList', JSON.parse(e.data));
            saveDeviceList(JSON.parse(e.data));
        });
        return () => {
            source.close();
        };
    }, []);

    const listCopy = _.cloneDeep(deviceList);
    for (let i = 0; i < listCopy.length; i++) {
        if (listCopy[i].uiid === 126) {       // 是否为 Dual R3
            const item1 = _.cloneDeep(listCopy[i]);
            const item2 = _.cloneDeep(listCopy[i]);
            item1.xindex = 0;
            item2.xindex = 1;
            listCopy.splice(i, 1, item1, item2);
            i++;
        }
    }
    const col1 = [];
    const col2 = [];
    const col3 = [];
    for (let i = 0; i < listCopy.length; i++) {
        if (i % 3 === 0)
            col1.push(listCopy[i]);
        else if ((i-1) % 3 === 0)
            col2.push(listCopy[i]);
        else if ((i-2) % 3 === 0)
            col3.push(listCopy[i]);
    }

    const renderDeviceCard = (data: DeviceInfo) => {
        const { uiid, deviceId, deviceName, online, apikey, model } = data;
        const key = deviceId;
        const type = deviceTypeMap(data.type);
        const name = deviceName || deviceId;
        const deviceData = {
            deviceId,
            online,
            type,
            name,
            apikey,
            model
        };
        if (isDualR3(uiid)) {
            const i = data.xindex;
            const voltage = data.params[`voltage_0${i}`] / 100 + 'V';
            const current = data.params[`current_0${i}`] / 100 + 'A';
            const actPow = data.params[`actPow_0${i}`] / 100 + 'W';
            const reactPow = data.params[`reactPow_0${i}`] / 100 + 'W';
            const appPow = data.params[`apparentPow_0${i}`] / 100 + 'W';
            const ballData = [
                { title: 'Real power', content: actPow },
                { title: 'Reactive power', content: reactPow },
                { title: 'Apparent power', content: appPow },
            ];
            return (
                <DualR3Card
                    key={deviceId}
                    deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }}
                    channel={{ stat: data.params.switches[i].switch, name: data.tags ? data.tags[i] : `channel ${i+1}` }}
                    voltage={voltage}
                    current={current}
                    ballData={ballData}
                    i={i}
                />
            );
        } else if (isIW100Device(uiid)) {
            const { power, voltage, current } = data.params;
            const ballData = [
                { title: 'Power', content: `${power}W` },
                { title: 'Voltage', content: `${voltage}V` },
                { title: 'Current', content: `${current}A` },
            ];
            return <IW100Card key={key} deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }} channel={{ stat: data.params.switch, name: 'channel' }} ballData={ballData} />;
        } else if (isPowerDet(uiid)) {
            return <PowerDetCard key={deviceId} deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }} channel={{ stat: data.params.switch, name: 'channel' }} power="149W" />;
        } else if (isSocketSwitchDevice(uiid)) {
            const channels: {name:string;stat:'on'|'off'}[] = [];
            let len = 0;
            if (uiid === 1 && type === 'diy') {                         // 单通道 DIY
                channels.push({ name: 'channel', stat: data.params.data1.switch });
            } else if (uiid === 1 || uiid === 6 || uiid === 14) {       // 单通道非 DIY
                channels.push({ name: 'channel', stat: data.params.switch });
            } else if (uiid === 77 || uiid === 78 || uiid === 112) {    // 单通道（多通道协议）
                channels.push({ name: 'channel', stat: data.params.switches[0].switch });
            } else if (uiid === 2 || uiid === 7 || uiid === 113) {      // 双通道
                len = 2;
            } else if (uiid === 3 || uiid === 8 || uiid === 114) {      // 三通道
                len = 3;
            } else if (uiid === 4 || uiid === 9) {                      // 四通道
                len = 4;
            }
            for (let i = 0; i < len; i++)
                if (data.tags)
                    channels.push({ name: data.tags[i], stat: data.params.switches[i].switch });
                else
                    channels.push({ name: `channel ${i+1}`, stat: data.params.switches[i].switch });

            return <SocketSwitchCard key={key} deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }} channels={channels} />;
        } else if (isTempDevice(uiid)) {
            return <TempCard key={deviceId} deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }} channel={{ stat: data.params.switch, name: 'channel' }} unit={data.unit} mode={data.params.deviceType} humi={data.params.currentHumidity} temp={data.params.currentTemperature} />;
        } else {
            return <UnsupportedCard key={key} deviceData={deviceData} />;
        }
    };

    return (
        <div>
            <header className={styles['header']}>
                <div className={styles['title']}>
                    <h1>eWeLink Smart Home</h1>
                </div>
                <div className="control">
                    <Button size="large" shape="round" icon={<UserOutlined />}>Sign in</Button>
                    <Button shape="circle" icon={<DownloadOutlined />} size="large" />
                    <Button shape="circle" icon={<AccountBookFilled />} size="large" />
                </div>
            </header>

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
                    checkUserLogin();
                }}>Sign in</Button>
                <Button onClick={async () => {
                    console.log('you want sign out');
                    await logout();
                    checkUserLogin();
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
                <p>login: {isLogin ? 'YES' : 'NO'}</p>
            </div>
        </div>
    );
};

export default connect(
    ({ global }: any) => ({
        language: global.language,
        deviceList: global.deviceList,
        isLogin: global.isLogin,
    }),
    (dispatch) => ({
        getLanguage: () =>
            dispatch({
                type: 'global/getLanguage',
            }),
        checkUserLogin: () =>
            dispatch({
                type: 'global/checkUserLogin',
            }),
        saveDeviceList: (deviceList: DeviceInfo[]) =>
            dispatch({
                type: 'global/save',
                payload: {
                    deviceList
                }
            }),
            dispatch
    })
)(App);
