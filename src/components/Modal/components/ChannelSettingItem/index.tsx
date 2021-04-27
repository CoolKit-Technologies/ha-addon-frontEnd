import React from 'react';
import InchingMode from '../InchingModeItem';
import PowerState from '../PowerStateItem';
import styles from './index.less';
import { IChannelSetting } from '../../../../types/interface/IModal';
import ChannelNameItem from '../ChannelNameItem';

const ChannelSetting: React.FC<IChannelSetting> = (props) => {
    console.log(`ML ~ file: index.tsx ~ line 9 ~ props`, props);
    return (
        <div className={styles['magB10']} key={props.index}>
            <ChannelNameItem {...props} />
            <div className={styles['magTB']}>
                <InchingMode {...props} />
            </div>
            <PowerState style={styles['magB30']} {...props} />
        </div>
    );
};
export default ChannelSetting;
