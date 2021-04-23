import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import styles from './index.less';
import { DeviceInfo } from '@/types';
import { getDeviceList, changeDeviceStatus, logout, getLanguage } from '@/api';
import _ from 'lodash';
import { connect, setLocale, Link, history } from 'umi';
import SocketSwitchCard from '@/components/DeviceCard/SocketSwitchCard';
import PowerDetCard from '@/components/DeviceCard/PowerDetCard';
import TempCard from '@/components/DeviceCard/TempCard';
import DualR3Card from '@/components/DeviceCard/DualR3Card';
import IW100Card from '@/components/DeviceCard/IW100Card';
import UnsupportedCard from '@/components/DeviceCard/UnsupportedCard';

const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    useEffect(() => {
        // getLanguage();
    }, []);

    return (
        <div style={{padding:'30px'}}>
            <header>heder111111121312312</header>
            <div className={styles['main-container']}>
                <div className={styles['ad-box']}></div>
                <div className={styles['device-box']}>
                    <div className={styles['device-col']}>
                        {/* {'List'.map(item=>{<DeviceCard />})} */}
                    </div>
                    <div className={styles['device-col']}></div>
                    <div className={styles['device-col']}></div>
                </div>
            </div>

            <UnsupportedCard
            />

            <hr />

            <SocketSwitchCard
                deviceName="1 Channel Socket"
                channels={[{name:'channel 1',stat:true}]}
            />

            <hr/>

            <SocketSwitchCard
                deviceName="2 Channel Socket"
                channels={[{name:'channel 1',stat:true},{name:'channel2',stat:true}]}
            />

            <hr />

            <SocketSwitchCard
                deviceName="3 Channel Socket"
                channels={[{name:'channel 1',stat:true},{name:'channel2',stat:true},{name:'channel 3',stat:false}]}
            />

            <hr />

            <SocketSwitchCard
                deviceName="4 Channel Socket"
                channels={[{name:'channel 1',stat:true},{name:'channel2',stat:true},{name:'channel 3',stat:true},{name:'channel 4',stat:true}]}
            />

            <hr />

            <PowerDetCard
                deviceName="Power Det"
                channel={{stat:true,name:'hello'}}
                power={149}
            />

            <hr />

            <TempCard
                deviceName="TH10"
                channel={{stat:true,name:'bbb'}}
                mode="auto"
            />

            <hr />

            <DualR3Card
                deviceName="DualR3 channel 1"
                channel={{stat:true,name:'channel'}}
                voltage="150V"
                current="1.0A"
            />

            <hr />

            <IW100Card
                deviceName="IW100"
                channel={{stat:true,name:'chh'}}
            />

            <hr />

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
