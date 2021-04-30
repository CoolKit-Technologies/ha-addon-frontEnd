import React, { useEffect, useState } from 'react';
import InchingMode from '../InchingModeItem';
import PowerState from '../PowerStateItem';
import styles from './index.less';
import { IChannelSetting } from '../../../../types/interface/IModal';
import ChannelNameItem from '../ChannelNameItem';
import _ from 'lodash';

interface IPulses {
    // 点动
    pulse: 'on' | 'off';
    width: number;
    outlet: number;
}
const ChannelSetting: React.FC<IChannelSetting> = (props) => {
    const [pulses, setPulses] = useState<Array<IPulses>>([]);

    let params = {
        deviceId: props.deviceId,
        deviceName: props.deviceName,
        apikey: props.apikey,
        disabled: props.disabled,
        index: props.index,
        uiid: props.uiid,
        params: {},
    };
    if (props.params?.pulses && props.params.pulses.length > 0) {
        _.assign(params.params, { pulses: props.params.pulses });
    }

    useEffect(() => {
        props.params?.pulses && setPulses(props.params?.pulses);
    }, [pulses]);
    return (
        <div className={styles['magB10']} key={props.index}>
            <ChannelNameItem {...props} />
            <div className={styles['magTB']}>
                <InchingMode {...params} {...setPulses} />
            </div>
            <PowerState style={styles['magB30']} {...props} />
        </div>
    );
};
export default ChannelSetting;
