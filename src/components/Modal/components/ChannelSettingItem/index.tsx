import React from 'react';
import InchingMode from '../InchingModeItem';
import PowerState from '../PowerStateItem';
import styles from './index.less';
import { IChannelName } from '../../../../types/interface/IModal';
import ChannelNameItem from '../ChannelNameItem';
const ChannelSetting: React.FC<IChannelName> = (props) => {
    return (
        <div className={styles['magB10']}>
            <ChannelNameItem name={props.name} />
            <div className={styles['magTB']}>
                <InchingMode />
            </div>
            <PowerState style={styles['magB30']} />
        </div>
    );
};
export default ChannelSetting;
