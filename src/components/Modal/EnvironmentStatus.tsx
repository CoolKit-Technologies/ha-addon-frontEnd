import React from 'react';
import BaseModal from './BaseModal';
import TemperatureUnit from './components/EnvironmentItem';
import TypeModalProps from '../../ts/type/TypeModal';
import DeviceNameItem from './components/DeviceNameItem';

const EnvironmentStatus: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <DeviceNameItem />
            <TemperatureUnit />
        </BaseModal>
    );
};
export default EnvironmentStatus;
