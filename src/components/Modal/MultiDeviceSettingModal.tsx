import React, { useState, useEffect, ReactNode } from 'react';
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
    console.log(`ML ~ file: MultiDeviceSettingModal.tsx ~ line 11 ~ props`, props);

    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>Device settings</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>Channel settings</a>);
    }
    return (
        <BaseModal {...props} title={props.device.deviceName} titleAction={titleAction} destroyOnClose={true}>
            {action ? (
                <div>
                    <DeviceNameItem {...props.device}></DeviceNameItem>
                    <IndicatorLEDItem {...props.device}></IndicatorLEDItem>
                    <InterlockMode></InterlockMode>
                    <EnableEntityItem {...props.device}></EnableEntityItem>
                </div>
            ) : (
                props.device.channels && <MultiChannelSettingModal {...props.device} />
            )}
        </BaseModal>
    );
};
export default MultiDeviceSettingModal;
