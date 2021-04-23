import React from 'react';
import { Select } from 'antd';
import styles from './index.less';
const { Option } = Select;
const PowerState: React.FC = () => {
    return (
        <div className={styles['power-state']}>
            <span className={styles['span-font']}>Power-on state</span>
            <Select className={styles['select']} defaultValue='Last state' onChange={(value) => console.log(value)}>
                <Option value='on'>On</Option>
                <Option value='off'>Off</Option>
                <Option value='stay'>Last state</Option>
            </Select>
        </div>
    );
};
export default PowerState;
