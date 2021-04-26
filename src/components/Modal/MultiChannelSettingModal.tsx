import React from 'react';
import ChannelSetting from './components/ChannelSettingItem';
import BaseModal from './BaseModal';

const MultiChannelSettingModal: React.FC = (props) => {
    return (
        <div>
            <ChannelSetting />
            <ChannelSetting />
            <ChannelSetting />
            <ChannelSetting />
        </div>
    );
};
export default MultiChannelSettingModal;
