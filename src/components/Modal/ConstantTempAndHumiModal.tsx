import React, { useState, ReactNode } from 'react';
import BaseModal from './BaseModal';
import TypeModalProps from '@/ts/type/TypeModal';
import DeviceNameItem from './components/DeviceNameItem/index';
import IndicatorLEDItem from './components/IndicatorLEDItem/index';
import PowerState from './components/PowerStateItem/index';
import InchingMode from './components/InchingModeItem/index';
import EnableEntityItem from './components/EnableEntityItem/index';
import EnvironmentStatus from '@/components/Modal/EnvironmentStatus';
import styles from './base.less';
import TemperatureUnit from './components/EnvironmentItem';

/**
 * 恒温恒湿改装件
 */
const ConstantTempAndHumiModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <div>
                <DeviceNameItem name={props.title}></DeviceNameItem>
                <IndicatorLEDItem></IndicatorLEDItem>
                <PowerState style={styles['mrgB10']}></PowerState>
                <TemperatureUnit />
                <InchingMode style={styles['mrgB10']}></InchingMode>
                <EnableEntityItem></EnableEntityItem>
            </div>
        </BaseModal>
    );
};
export default ConstantTempAndHumiModal;
