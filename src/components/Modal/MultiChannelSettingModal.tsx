import React, { useEffect } from 'react';
import ChannelSetting from './components/ChannelSettingItem';
import { IChannel } from '../../types/interface/IModal';
const MultiChannelSettingModal: React.FC<IChannel> = (props) => {
    // useEffect(() => {
    //     console.log('props', props);
    // });
    return (
        <div>
            {props.tags.map((item) => {
                return <ChannelSetting name={item} />;
            })}
        </div>
    );
};
export default MultiChannelSettingModal;
