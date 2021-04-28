import React, { useState, ReactNode, useEffect } from 'react';
import BaseModal from './BaseModal';
import TypeModalProps from '@/ts/type/TypeModal';
import DeviceNameItem from './components/DeviceNameItem/index';
import IndicatorLEDItem from './components/IndicatorLEDItem/index';
import PowerState from './components/PowerStateItem/index';
import InchingMode from './components/InchingModeItem/index';
import EnableEntityItem from './components/EnableEntityItem/index';
import styles from './base.less';
import TemperatureUnit from './components/EnvironmentItem';

/**
 * 恒温恒湿改装件
 */
const ConstantTempAndHumiModal: React.FC<TypeModalProps> = (props) => {
    console.log(`ML ~ file: constantTempAndHumiModal.tsx ~ line 16 ~ props`, props);
    return (
        <BaseModal {...props}>
            <div>
                <DeviceNameItem {...props.device}></DeviceNameItem>
                <IndicatorLEDItem {...props.device}></IndicatorLEDItem>
                <PowerState style={styles['mrgB10']} {...props.device}></PowerState>
                <TemperatureUnit {...props.device} />
                <InchingMode style={styles['mrgB10']} {...props.device}></InchingMode>
                <EnableEntityItem {...props.device}></EnableEntityItem>
            </div>
        </BaseModal>
    );
};
export default ConstantTempAndHumiModal;
