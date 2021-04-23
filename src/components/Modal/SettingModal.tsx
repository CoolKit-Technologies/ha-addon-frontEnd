import React from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import EnableEntityItem from './components/EnableEntityItem';

const SettingModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <DeviceNameItem></DeviceNameItem>
            <IndicatorLEDItem></IndicatorLEDItem>
            <EnableEntityItem></EnableEntityItem>
        </BaseModal>
    );
};

export default SettingModal;
