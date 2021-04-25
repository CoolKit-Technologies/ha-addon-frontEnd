import React, { useState } from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import EnableEntityItem from './components/EnableEntityItem';
import InterlockMode from './components/InterlockMode';
import PowerState from './components/PowerStateItem';
import InchingMode from './components/InchingModeItem';
import EModalType from '../../ts/Enum/EModalType';
import EnvironmentStatus from '@/components/Modal/EnvironmentStatus';
import styles from './base.less';

const SettingModal: React.FC<TypeModalProps> = ({ type, ...props }) => {
    const [visible, setVisible] = useState(false);
    function titleActionMethod(params: any) {
        setVisible(true);
    }
    function onCancel() {
        setVisible(false);
    }
    let titleAction: React.ReactNode = '';
    switch (type) {
        case EModalType.MULTI:
            titleAction = <a onClick={() => console.log('Channel settings')}>Channel settings</a>;
            break;
        case EModalType.SINGLE:
            titleAction = '';
            break;
        default:
            titleAction = <a onClick={titleActionMethod}>Status</a>;
            break;
    }

    return (
        <>
            <BaseModal titleAction={titleAction} {...props}>
                <DeviceNameItem></DeviceNameItem>
                <IndicatorLEDItem></IndicatorLEDItem>
                {type === EModalType.MULTI ? <InterlockMode></InterlockMode> : null}
                {type !== EModalType.MULTI ? <PowerState style={styles['mrgB10']}></PowerState> : null}
                {type !== EModalType.POWERDETECTION && type !== EModalType.MULTI ? <InchingMode style={styles['mrgB10']}></InchingMode> : null}
                <EnableEntityItem></EnableEntityItem>
            </BaseModal>
            <EnvironmentStatus visible={visible} onCancel={onCancel} footer={null}></EnvironmentStatus>
        </>
    );
};

export default SettingModal;
