import React from 'react';
import ChannelSetting from './components/ChannelSettingItem';
import BaseModal from './BaseModal';
import TypeModalProps from '@/ts/type/TypeModal';

const MultiChannelModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <ChannelSetting />
            <ChannelSetting />
            <ChannelSetting />
            <ChannelSetting />
        </BaseModal>
    );
};
export default MultiChannelModal;
