import React, { useEffect } from 'react';
import { Select } from 'antd';
import styles from './index.less';
import { IChannelSetting } from '@/types/interface/IModal';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import _ from 'lodash';
import { useIntl } from 'umi';
const { Option } = Select;
const PowerState: React.FC<IChannelSetting> = (props) => {
    const { formatMessage } = useIntl();
    let startup = '';
    if (props.type === 'diy' && props.params?.startup) {
        //手工diy
        startup = props.params?.startup;
    } else if (props.params?.configure && props.i !== undefined) {
        //dualr3或多通道设备
        let tempStart = props.params?.configure[props.i].startup;
        tempStart && (startup = tempStart);
    } else if (!props.params?.configure && props.params?.startup) {
        startup = props.params?.startup;
    } else if (props.params?.configure && (props.uiid === 77 || props.uiid === 78 || props.uiid === 112)) {
        startup = props.params?.configure[0].startup;
    }

    async function setPowerState(value: string) {
        if (props.type === 'diy') {
            let params = {
                id: props.deviceId,
                type: 'startup',
                params: {
                    state: value,
                },
            };
            const res = await controlDiyDevice(params);
        } else {
            let params = {
                id: props.deviceId,
                apikey: props.apikey,
                params: {},
            };
            if (!props.params?.configure && !(props.uiid === 77 || props.uiid === 78 || props.uiid === 112)) {
                _.assign(params.params, { startup: value });
            }
            if (props.params?.configure && props.params.configure?.length > 0) {
                props.params?.configure?.forEach((item) => {
                    if (item.outlet === props.i) _.assign(item, { startup: value });
                });
                props.i !== undefined && _.assign(params.params, { configure: props.params?.configure });
            }
            if ((props.params?.configure && props.uiid === 77) || props.uiid === 78 || props.uiid === 112) {
                props.params?.configure!.find((item) => {
                    if (item.outlet === 0) _.assign(item, { startup: value });
                });
                _.assign(params.params, { configure: props.params?.configure });
            }
            const res = await updateDeviceByWS(params);
        }
    }

    return (
        <div className={`${styles['power-state']} ${props.style}`}>
            <span className={styles['span-font']}>{formatMessage({ id: 'device.poweron.state' })}</span>
            <Select className={styles['select']} defaultValue={startup} onSelect={(value) => setPowerState(value)}>
                <Option value='on'>{formatMessage({ id: 'device.poweron.on' })}</Option>
                <Option value='off'>{formatMessage({ id: 'device.poweron.off' })}</Option>
                <Option value='stay'>{formatMessage({ id: 'device.poweron.stay' })}</Option>
            </Select>
        </div>
    );
};
export default PowerState;
