import React, { useState, ReactNode, useEffect } from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem';
import InchingMode from './components/InchingModeItem';
import styles from './base.less';
import DeviceData from './DeviceData';
import _ from 'lodash';
/**
 * 功率检测插座过载告警
 * 多功能双通道电量检测开关
 */
const PowerDetectionSocketModal: React.FC<TypeModalProps> = (props) => {
    const [action, setAction] = useState(true);
    const [titleAction, setTitleAction] = useState<ReactNode>(<a onClick={channelSetting}>Status</a>);

    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>Device settings</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>Status</a>);
    }
    function setParams() {
        const { apikey, deviceId, deviceName, disabled, i, params, uiid } = props.device;
        let dealParams = {
            apikey: apikey,
            deviceId: deviceId,
            deviceName: deviceName,
            disabled: disabled,
            uiid: uiid,
            i: i,
            params: {
                // sledOnline: params?.sledOnline,
            },
        };
        i !== undefined ? _.assign(dealParams.params, { pulses: params?.pulses }) : _.assign(dealParams.params, { pulse: params?.pulse, pulseWidth: params?.pulseWidth });
        i !== undefined && _.assign(dealParams, { index: i });

        return dealParams;
    }
    // useEffect(() => {}, [props]);
    return (
        <BaseModal {...props} titleAction={titleAction} title={props.device.deviceName}>
            {action ? (
                <div>
                    <DeviceNameItem {...props.device}></DeviceNameItem>
                    <IndicatorLEDItem {...props.device}></IndicatorLEDItem>
                    <PowerState style={styles['mrgB10']} {...props.device}></PowerState>
                    <InchingMode style={styles['mrgB10']} {...setParams()}></InchingMode>
                    <EnableEntityItem {...props.device}></EnableEntityItem>
                </div>
            ) : (
                <DeviceData {...props.device} />
            )}
        </BaseModal>
    );
};
export default PowerDetectionSocketModal;
