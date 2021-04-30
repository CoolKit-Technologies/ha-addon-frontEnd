import React, { useState, useEffect, ReactNode } from 'react';
import TypeModalProps from '@/ts/type/TypeModal';
import BaseModal from './BaseModal';
import DeviceNameItem from './components/DeviceNameItem';
import IndicatorLEDItem from './components/IndicatorLEDItem';
import InterlockMode from './components/InterlockMode';
import EnableEntityItem from './components/EnableEntityItem';
import MultiChannelSettingModal from './MultiChannelSettingModal';
import styles from './base.less';
import OtaItem from './components/OtaItem';
import { useIntl } from 'umi';
const MultiDeviceSettingModal: React.FC<TypeModalProps> = (props) => {
    const { formatMessage } = useIntl();
    const [action, setAction] = useState(true);
    const [titleAction, setTitleAction] = useState<ReactNode>(<a onClick={channelSetting}>{formatMessage({ id: 'device.modal.channel.settings' })}</a>);

    function channelSetting() {
        setAction(false);
        setTitleAction(<a onClick={deviceSetting}>{formatMessage({ id: 'device.modal.device.settings' })}</a>);
    }
    function deviceSetting() {
        setAction(true);
        setTitleAction(<a onClick={channelSetting}>{formatMessage({ id: 'device.modal.channel.settings' })}</a>);
    }
    return (
        <BaseModal {...props} title={props.device.deviceName} titleAction={titleAction} destroyOnClose={true}>
            {action ? (
                <div>
                    <DeviceNameItem {...props.device}></DeviceNameItem>
                    <IndicatorLEDItem {...props.device}></IndicatorLEDItem>
                    <InterlockMode {...props.device}></InterlockMode>
                    <EnableEntityItem {...props.device}></EnableEntityItem>
                    <OtaItem {...props.device}></OtaItem>
                </div>
            ) : (
                props.device.channels && <MultiChannelSettingModal {...props.device} />
            )}
        </BaseModal>
    );
};
export default MultiDeviceSettingModal;
