import React from 'react';
import { Select } from 'antd';
import styles from './index.less';
const { Option } = Select;
const TemperatureUnit: React.FC = () => {
    return (
        <div className={styles['environment']}>
            <span className={styles['span-font']}>Temperature Unit</span>
            <Select className={styles['select']} defaultValue='Fahrenheit[℉]' onChange={(value) => console.log(value)}>
                <Option value='Fahrenheit[℉]'>Fahrenheit[℉]</Option>
                <Option value='Celsius[℃]'>Celsius[℃]</Option>
            </Select>
        </div>
    );
};
export default TemperatureUnit;
