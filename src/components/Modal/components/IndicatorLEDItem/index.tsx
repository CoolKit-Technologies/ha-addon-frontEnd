import React from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';

const IndicatorLEDItem: React.FC = (props) => {
    const { formatMessage } = useIntl();
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>{formatMessage({ id: 'device.led' })}</div>
            <div className={styles['actions']}>
                <Switch defaultChecked />
            </div>
        </div>
    );
};
export default IndicatorLEDItem;
