import React, { useEffect } from 'react';
import ChannelSetting from './components/ChannelSettingItem';
import { IModalProps } from '../../types/interface/IModal';
const MultiChannelSettingModal: React.FC<IModalProps> = (props) => {
    return (
        <div>
            {props.channels &&
                props.channels.map((item, index) => {
                    return <ChannelSetting deviceName={props.deviceName} deviceId={props.deviceId} apikey={props.apikey} channelName={item.name} index={index} key={index} />;
                })}
        </div>
    );
};
export default MultiChannelSettingModal;
