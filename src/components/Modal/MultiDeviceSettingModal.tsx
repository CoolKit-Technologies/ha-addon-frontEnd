import React, { useState, ReactNode } from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import InterlockMode from './components/InterlockMode';
import EnableEntityItem from './components/EnableEntityItem';
import MultiChannelSettingModal from './MultiChannelSettingModal';
import styles from './base.less';
const MultiDeviceSettingModal: React.FC<TypeModalProps> = (props) => {
    const [action, setAction] = useState(true);
    const [titleAction, setTitleAction] = useState<ReactNode>(<a onClick={channelSetting}>Channel settings</a>);
    const [visible, setVisible] = useState(true);
    function onCancel() {
        setVisible(false);
    }
    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>Device settings</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>Channel settings</a>);
    }
    return (
        <BaseModal {...props} titleAction={titleAction} visible={visible} onCancel={onCancel}>
            {action ? (
                <div>
                    <DeviceNameItem></DeviceNameItem>
                    <IndicatorLEDItem></IndicatorLEDItem>
                    <InterlockMode></InterlockMode>
                    <EnableEntityItem></EnableEntityItem>
                </div>
            ) : (
                <MultiChannelSettingModal />
            )}
        </BaseModal>
    );
};
export default MultiDeviceSettingModal;
