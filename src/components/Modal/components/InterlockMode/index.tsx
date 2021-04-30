import React, { useState, useEffect } from 'react';
import { Switch } from 'antd';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { useIntl } from 'umi';
import _ from 'lodash';
import { updateDeviceByWS } from '@/api';
const InterlockMode: React.FC<IComponentProps> = (props) => {
    const { formatMessage } = useIntl();
    const [checked, setChecked] = useState(false);
    async function setLockAction(value: boolean) {
        let params = {
            id: props.deviceId,
            apikey: props.apikey,
            params: {},
        };
        value ? _.assign(params.params, { lock: 1, zyx_clear_timers: value }) : _.assign(params.params, { lock: 0, zyx_clear_timers: value });
        const res = await updateDeviceByWS(params);
    }
    useEffect(() => {
        props.params?.lock && props.params.lock === 1 ? setChecked(true) : setChecked(false);
    }, [props.params?.lock]);
    return (
        <div className={styles['interlock-mode']}>
            <div>
                <span className={styles['span-font']}>{formatMessage({ id: 'device.interlock' })}</span>
                <span className={styles['note-font']}>{formatMessage({ id: 'device.interlock.tips' })}</span>
            </div>
            <Switch checked={checked} onClick={async (value) => await setLockAction(value)}></Switch>
        </div>
    );
};
export default InterlockMode;
