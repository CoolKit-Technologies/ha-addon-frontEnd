import React from 'react';
import InchingMode from '../InchingModeItem';
import PowerState from '../PowerStateItem';
import styles from './index.less';
import { IChannelSetting } from '../../../../types/interface/IModal';
import ChannelNameItem from '../ChannelNameItem';
import _ from 'lodash';

const ChannelSetting: React.FC<IChannelSetting> = (props) => {
    console.log(`ML ~ file: index.tsx ~ line 9 ~ props`, props);

    let params = {
        deviceId: props.deviceId,
        deviceName: props.deviceName,
        apikey: props.apikey,
        disabled: props.disabled,
        index: props.index,
        params: {},
    };
    if (props.params?.pulses && props.params.pulses.length > 0) {
        let pulses = props.params.pulses.find((item) => item.outlet === props.index);
        pulses && _.assign(params.params, pulses);
    }
    console.log(`ML ~ file: index.tsx ~ line 20 ~ params`, params);

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
