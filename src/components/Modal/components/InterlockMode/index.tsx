import React from 'react';
import { Switch } from 'antd';
import styles from './index.less';
import { SwitchProps } from 'antd';

const InterlockMode: React.FC<SwitchProps> = (props) => {
    return (
        <div className={styles['interlock-mode']}>
            <span className={styles['span-font']}>InterLock Mode</span>
            <span className={styles['note-font']}>Inching mode & Power-on state will be disabled</span>
            <Switch {...props}></Switch>
        </div>
    );
};
export default InterlockMode;
