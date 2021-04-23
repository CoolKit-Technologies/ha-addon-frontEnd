import React from 'react';
import { connect, FormattedMessage, useIntl } from 'umi';
import { EditOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';

const EnableEntityItem: React.FC = (props) => {
    const { formatMessage } = useIntl();
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.entity.enable' })}
                <span className={styles['tips']}>Disabled entities will not be added to Home Assistant.</span>
            </div>
            <div className={styles['actions']}>
                <Switch defaultChecked />
            </div>
        </div>
    );
};
export default EnableEntityItem;
