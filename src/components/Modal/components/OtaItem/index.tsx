import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import upgradeIcon from '@/assets/cellphone-arrow-down.svg';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { changeDeviceStatus } from '@/api';
const OtaItem: React.FC = (props) => {
    const { formatMessage } = useIntl();

    useEffect(() => {}, []);
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.firmware.upgrade' })}
                <span className={styles['tips']}>{formatMessage({ id: 'device.firmware.upgrade.tips' })}</span>
            </div>
            <div className={styles['actions']}>
                <img src={upgradeIcon} alt='' onClick={() => {}} />
            </div>
        </div>
    );
};
export default OtaItem;
