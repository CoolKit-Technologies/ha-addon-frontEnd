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

/**
 * 恒温恒湿改装件
 */
const ConstantTempAndHumiModal: React.FC<TypeModalProps> = (props) => {
    const [action, setAction] = useState(true);
    const [titleAction, setTitleAction] = useState<ReactNode>(<a onClick={channelSetting}>Status</a>);
    const [visible, setVisible] = useState(true);
    function onCancel() {
        setVisible(false);
    }
    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>Device settings</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>Status</a>);
    }
    return (
        <BaseModal {...props} titleAction={titleAction} visible={visible} onCancel={onCancel}>
            {action ? (
                <div>
                    <DeviceNameItem></DeviceNameItem>
                    <IndicatorLEDItem></IndicatorLEDItem>
                    <PowerState style={styles['mrgB10']}></PowerState>
                    <InchingMode style={styles['mrgB10']}></InchingMode>
                    <EnableEntityItem></EnableEntityItem>
                </div>
            ) : (
                <EnvironmentStatus />
            )}
        </BaseModal>
    );
};
export default ConstantTempAndHumiModal;
