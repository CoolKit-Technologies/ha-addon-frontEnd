import React from 'react';
import { DatePicker, Divider } from 'antd';
import styles from './index.less';
const { RangePicker } = DatePicker;

const DateRange: React.FC = () => {
    return (
        <div className={styles['date-range']}>
            <RangePicker showTime bordered={false} placeholder={['from', ' to']} className={styles['.ant-picker']} />
            <Divider className={styles['divider']} />
        </div>
    );
};
export default DateRange;
