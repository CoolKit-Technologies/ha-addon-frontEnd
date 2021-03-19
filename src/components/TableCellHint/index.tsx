import React from 'react';
import { Typography } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './index.less';

const { Text } = Typography;

interface TableCellHintProps {
    type: 'login-support' | 'unsupport';
}

const TableCellHint: React.FC<TableCellHintProps> = ({ type }) => {
    if (type === 'login-support') {
        return (
            <Text className={styles['text-wrapper']}><ExclamationCircleFilled className={styles['icon']} />Log in to use this device</Text>
        );
    } else {
        return (
            <Text className={styles['text-wrapper']}>Temporarily unsupported device</Text>
        );
    }
};

export default TableCellHint;
