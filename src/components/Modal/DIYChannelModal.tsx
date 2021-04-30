import React, { useEffect, useState } from 'react';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import InchingMode from './components/InchingModeItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem/index';
import TypeModalProps from '@/ts/type/TypeModal';
import styles from './base.less';

const DIYChannelModal: React.FC<TypeModalProps> = (props) => {
    function getDIYProps() {
        let params = {
            deviceId: props.device.deviceId,
            deviceName: props.device.deviceName,
            apikey: '',
            key: props.device.key,
            disabled: props.device.disabled,
            uiid: props.device.uiid,
            type: props.device.type,
            params: {
                pulse: props.device.params!.data1.pulse,
                pulseWidth: props.device.params!.data1.pulseWidth,
                sledOnline: props.device.params!.data1.sledOnline,
                startup: props.device.params!.data1.startup,
            },
        };
        return params;
    }

    return (
        <BaseModal {...props} title={props.device.deviceName}>
            {/* <IndicatorLEDItem {...getDIYProps()}></IndicatorLEDItem> */}
            <InchingMode style={styles['mrgB10']} {...getDIYProps()}></InchingMode>
            <PowerState style={styles['mrgB10']} {...getDIYProps()}></PowerState>
            <EnableEntityItem {...getDIYProps()}></EnableEntityItem>
        </BaseModal>
    );
};
export default DIYChannelModal;
