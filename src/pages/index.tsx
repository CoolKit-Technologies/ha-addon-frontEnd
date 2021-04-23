import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import styles from './index.less';
import { DeviceInfo } from '@/types';
import { getDeviceList, changeDeviceStatus, logout, getLanguage } from '@/api';
import _ from 'lodash';
import { connect, setLocale, Link, history } from 'umi';
import Header from '@/components/Header';
import CKLiquid from '@/components/Circle/index';
import CKGauge from '@/components/Circle/CKGauge';
import YellowGauge from '@/components/Circle/YellowGauge';
const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    useEffect(() => {
        getLanguage();
    }, []);

    return (
        <div>
            <Header />
            <div className={styles['main-container']}>
                <div className={styles['ad-box']}></div>
                <div className={styles['device-box']}>
                    <div className={styles['device-col']}>{/* {'List'.map(item=>{<DeviceCard />})} */}</div>
                    <div className={styles['device-col']}></div>
                    <div className={styles['device-col']}></div>
                </div>
            </div>
            <CKLiquid value={'111'} />
            <CKGauge percent={0.75} />
            <YellowGauge percent={0.45} />
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
