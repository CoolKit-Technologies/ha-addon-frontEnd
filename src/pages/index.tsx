import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import styles from './index.less';
import { DeviceInfo } from '@/types';
import { getDeviceList, changeDeviceStatus, logout, getLanguage } from '@/api';
import _ from 'lodash';
import { connect, setLocale, Link, history } from 'umi';

const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    useEffect(() => {
        getLanguage();
    }, []);

    return (
        <div>
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
