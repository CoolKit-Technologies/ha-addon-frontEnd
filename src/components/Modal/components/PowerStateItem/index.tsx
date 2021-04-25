import React, { useEffect } from 'react';
import { Select } from 'antd';
import styles from './index.less';
const { Option } = Select;
interface IClassName {
    style?: string;
}
const PowerState: React.FC<IClassName> = ({ style }) => {
    // useEffect(() => {
    //     console.log('style', style);
    // });
    async function changePowerState(state: string) {
        console.log('state', state);
    }
    return (
        <div className={`${styles['power-state']} ${style}`}>
            <span className={styles['span-font']}>Power-on state</span>
            <Select className={styles['select']} defaultValue='Last state' onSelect={(value) => changePowerState(value)}>
                <Option value='on'>On</Option>
                <Option value='off'>Off</Option>
                <Option value='stay'>Last state</Option>
            </Select>
        </div>
    );
};
export default PowerState;
