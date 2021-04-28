import React, { useState, ReactNode } from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import PowerState from './components/PowerStateItem';
import EnableEntityItem from './components/EnableEntityItem';
import InchingMode from './components/InchingModeItem';
import styles from './base.less';
import DeviceData from './DeviceData';
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
    return (
        <BaseModal {...props} titleAction={titleAction} title={props.device.deviceName}>
            {action ? (
                <div>
                    <DeviceNameItem {...props.device}></DeviceNameItem>
                    <IndicatorLEDItem {...props.device}></IndicatorLEDItem>
                    <PowerState style={styles['mrgB10']} {...props.device}></PowerState>
                    <InchingMode style={styles['mrgB10']} {...props.device}></InchingMode>
                    <EnableEntityItem {...props.device}></EnableEntityItem>
                </div>
            ) : (
                <DeviceData {...props.device} />
            )}
        </BaseModal>
    );
};
export default PowerDetectionSocketModal;
