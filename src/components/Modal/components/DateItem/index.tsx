import { DatePicker, Divider } from 'antd';
import React from 'react';
import styles from './index.less';
const DateItem: React.FC = () => {
    return (
        <div className={styles['date-item']}>
            <div className={styles['mgt']}>
                <DatePicker picker='month' onChange={(date) => console.log(date)} />
            </div>
            <Divider />
        </div>
    );
};
export default DateItem;
