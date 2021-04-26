import React from 'react';
import DeviceNameItem from '../DeviceNameItem';
import InchingMode from '../InchingModeItem';
import PowerState from '../PowerStateItem';
import styles from './index.less';
const ChannelSetting: React.FC = () => {
    return (
        <div className={styles['magB10']}>
            <DeviceNameItem />
            <div className={styles['magTB']}>
                <InchingMode />
            </div>
            <PowerState style={styles['magB30']} />
        </div>
    );
};
export default ChannelSetting;
