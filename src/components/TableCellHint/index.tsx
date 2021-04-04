import React from 'react';
import { Typography } from 'antd';
import styles from './index.less';
import infoIcon from '@/assets/info.png';
import { FormattedMessage } from 'umi';

const { Text } = Typography;

interface TableCellHintProps {
    type: 'login-support' | 'unsupport' | 'not-your-device';
}

const TableCellHint: React.FC<TableCellHintProps> = ({ type }) => {
    if (type === 'login-support') {
        return (
            <Text className={styles['text-wrapper']}>
                <img src={infoIcon} alt='' className={styles['icon']} />
                <FormattedMessage id='device.info.needLogin' />
            </Text>
        );
    }
    if (type === 'not-your-device') {
        return (
            <Text className={styles['text-wrapper']}>
                <img src={infoIcon} alt='' className={styles['icon']} />
                <FormattedMessage id='device.info.notyou' />
            </Text>
        );
    }
    return (
        <Text className={styles['text-wrapper']}>
            <FormattedMessage id='device.info.notsupport' />
        </Text>
    );
};

export default TableCellHint;
