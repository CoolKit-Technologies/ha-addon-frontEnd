import React from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem';

/**
 * 功率检测单通道
 * @param props 
 * @returns 
 */
const PowerDetectionModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <DeviceNameItem></DeviceNameItem>
            <IndicatorLEDItem></IndicatorLEDItem>
            <PowerState></PowerState>
            <EnableEntityItem></EnableEntityItem>
        </BaseModal>
    );
};
export default PowerDetectionModal;
