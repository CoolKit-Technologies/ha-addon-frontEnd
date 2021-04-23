import React, { useState, useEffect } from 'react';
import styles from './index.less';
import _ from 'lodash';
import { connect } from 'umi';
import { Card } from 'antd';
import Header from '@/components/Header';
import CKLiquid from '@/components/Circle/CKLiquid';
import CKGauge from '@/components/Circle/CKGauge';
import YellowGauge from '@/components/Circle/YellowGauge';
import SettingModal from '@/components/Modal/SettingModal';

const { Meta } = Card;

const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    useEffect(() => {
        getLanguage();
    }, []);

    return (
        <div>
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
            <CKLiquid value={'111'} />
            <CKGauge percent={0.7} />
            <YellowGauge percent={0.45} />
            <SettingModal visible></SettingModal>
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
