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
import { Card } from 'antd';
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

const { Meta } = Card;

const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    useEffect(() => {
        // getLanguage();

        // dev
        const source = new EventSource('http://localhost:3000/api/stream');
        // Prod
        // const source = new EventSource('api/stream');
        source.addEventListener('open', () => {
            console.log('连接建立成功');
        });
        source.addEventListener('message', (e) => {
            console.log(e);
        });
        return () => {
            source.close();
        };
    }, []);

    return (
        <div style={{ padding: '30px' }}>
            <Header />
            <div className={styles['main-container']}>
                <div className={styles['ad-box']}>
                    {Array.from({ length: 5 }).map((item) => (
                        <Card cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}>
                            <Meta title='Card title' description='This is the description' />
                        </Card>
                    ))}
                </div>
                <div className={styles['device-box']}>
                    <div className={styles['device-col']}></div>
                    <div className={styles['device-col']}></div>
                    <div className={styles['device-col']}></div>
                </div>
            </div>

            <UnsupportedCard deviceData={{ online: true, name: 'XXX', type: 'cloud' }} />

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

            <hr />

            <CKLiquid value={'111'} />
            <CKGauge percent={0.7} />
            <YellowGauge value={0.45} />
            {/* <SettingModal visible={false}></SettingModal> */}
            {/* <CKGauge percent={0.7} /> */}
            {/* <YellowGauge value={50} /> */}
            {/* 多通道 */}
            {/* <MultiDeviceSettingModal visible title='4 channel'></MultiDeviceSettingModal>  */}
            {/* 单通道 */}
            {/* <ChannelModal visible title='1 Channel Socket/Switch'></ChannelModal> */}
            {/* 功率检测单通道 */}
            {/* <PowerDetectionModal visible title='Power detection Socket'></PowerDetectionModal> */}
            {/* 功率检测插座过载警告 & 多功能双通道电量检测开关 */}
            <PowerDetectionSocketModal visible title='IW100'></PowerDetectionSocketModal>
            {/* 恒温恒湿改装件 */}
            {/* <ConstantTempAndHumiModal visible title='TH Switch' /> */}
        </div>
    );
};

export default connect(
    ({ global }: any) => ({
        language: global.language,
    }),
    (dispatch) => ({
        getLanguage: () =>
            dispatch({
                type: 'global/getLanguage',
            }),
    })
)(App);
