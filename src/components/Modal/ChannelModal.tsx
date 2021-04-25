import React, { useEffect } from 'react';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import InchingMode from './components/InchingModeItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem/index';
import TypeModalProps from '@/ts/type/TypeModal';
import styles from './base.less';
const ChannelModal: React.FC<TypeModalProps> = (props) => {

    return (
        <BaseModal {...props}>
            <DeviceNameItem></DeviceNameItem>
            <IndicatorLEDItem></IndicatorLEDItem>
            <InchingMode style={styles['mrgB10']}></InchingMode>
            <PowerState style={styles['mrgB10']}></PowerState>
            <EnableEntityItem></EnableEntityItem>
        </BaseModal>
    );
};
export default ChannelModal;
