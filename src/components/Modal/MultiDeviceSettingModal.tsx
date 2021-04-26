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

    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>Device settings</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>Channel settings</a>);
    }
    // useEffect(() => {
    //     console.log('props', props);
    // });
    return (
        <BaseModal {...props} titleAction={titleAction} destroyOnClose={true}>
            {action ? (
                <div>
                    <DeviceNameItem name={props.title}></DeviceNameItem>
                    <IndicatorLEDItem></IndicatorLEDItem>
                    <InterlockMode></InterlockMode>
                    <EnableEntityItem></EnableEntityItem>
                </div>
            ) : (
                props.tags && <MultiChannelSettingModal tags={props.tags} />
            )}
        </BaseModal>
    );
};
export default MultiDeviceSettingModal;
