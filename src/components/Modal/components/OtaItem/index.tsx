import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import upgradeIcon from '@/assets/cellphone-arrow-down.svg';
import styles from './index.less';
import { changeDeviceStatus } from '@/api';
const OtaItem: React.FC = (props) => {
    const { formatMessage } = useIntl();

    useEffect(() => {}, []);
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.firmware.upgrade' })}
                <span className={styles['tips']}>{formatMessage({ id: 'device.firmware.upgrade.tips' }, { version: '1.1.1' })}</span>
            </div>
            <div className={styles['actions']}>
                <img src={upgradeIcon} alt='' onClick={() => {
                    // console.log('hello');
                }} />
            </div>
        </div>
    );
};
export default OtaItem;
