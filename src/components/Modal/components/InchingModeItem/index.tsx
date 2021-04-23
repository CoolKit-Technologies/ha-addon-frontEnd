import React from 'react';
import { TimePicker, Switch } from 'antd';
import styles from './index.less';
const InchingMode: React.FC = () => {
    return (
        <div className={styles['inching-mode']}>
            <span className={styles['span-font']}>Inching mode</span>
            <div>
                <TimePicker className={styles['mgr20']} onChange={(time) => console.log(time)} />
                <Switch onChange={(e) => console.log(e)} />
            </div>
        </div>
    );
};
export default InchingMode;
