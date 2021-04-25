import React from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem';
import InchingMode from './components/InchingModeItem';

/**
 * 单通道
 * 功率检测插座过载告警
 * 多功能双通道电量检测开关
 * 恒温湿改装件
 */
const PowerDetectionSocketModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <DeviceNameItem></DeviceNameItem>
            <IndicatorLEDItem></IndicatorLEDItem>
            <PowerState></PowerState>
            <InchingMode></InchingMode>
            <EnableEntityItem></EnableEntityItem>
        </BaseModal>
    );
};
export default PowerDetectionSocketModal;
