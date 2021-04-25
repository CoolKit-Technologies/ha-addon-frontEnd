import React, { useEffect } from 'react';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import InchingMode from './components/InchingModeItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem/index';
import TypeModalProps from '@/ts/type/TypeModal';

const ChannelModal: React.FC<TypeModalProps> = (props) => {
    // useEffect(() => {
    //     console.log('inching', props);
    // });
    return (
        <BaseModal {...props}>
            <DeviceNameItem></DeviceNameItem>
            <IndicatorLEDItem></IndicatorLEDItem>
            <InchingMode></InchingMode>
            <PowerState></PowerState>
            <EnableEntityItem></EnableEntityItem>
        </BaseModal>
    );
};
export default ChannelModal;
