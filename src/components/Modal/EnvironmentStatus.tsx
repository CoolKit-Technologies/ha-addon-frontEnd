import React from 'react';
import BaseModal from './BaseModal';
import TemperatureUnit from './components/EnvironmentItem';
import TypeModalProps from '../../ts/type/TypeModal';
import DeviceNameItem from './components/DeviceNameItem';
import EnableEntityItem from './components/EnableEntityItem';

const EnvironmentStatus: React.FC<TypeModalProps> = (props) => {
    return (
        <div>
            <DeviceNameItem />
            <TemperatureUnit />
            <EnableEntityItem></EnableEntityItem>
        </div>
    );
};
export default EnvironmentStatus;
