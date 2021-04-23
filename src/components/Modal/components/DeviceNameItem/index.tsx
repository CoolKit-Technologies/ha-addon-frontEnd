import React from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import styles from './index.less';

const DeviceNameItem: React.FC = (props) => {
    const { formatMessage } = useIntl();
    return (
        <div className={styles['device-name-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.name' })}</div>
            <div className={styles['fake-input']}>
                <span>12321name</span>
                <div className={styles['input-actions']}>
                    <EditOutlined />
                </div>
            </div>
        </div>
    );
};
export default DeviceNameItem;
