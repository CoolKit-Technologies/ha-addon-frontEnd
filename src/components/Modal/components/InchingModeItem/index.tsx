import React, { useState, useEffect } from 'react';
import { TimePicker, Switch } from 'antd';
import styles from './index.less';
import moment, { Moment } from 'moment';
import { updateDeviceByWS, controlDiyDevice } from '@/api';
import { IChannelSetting } from '@/types/interface/IModal';
import _ from 'lodash';

const dateFormat = 'mm:ss';
const InchingMode: React.FC<IChannelSetting> = ({ style, apikey, deviceId, type, i, params, updateFunction, uiid }) => {
    const [checked, setChecked] = useState(Boolean);
    //  点动时间设置提交
    async function getInchingTime(time: Moment | null) {
        if (!time) return;
        const h = moment(time).get('minute');
        const s = moment(time).get('second');
        let count = 0;
        h === 0 ? (count = s) : (count = h * 60 + s);
        if (type === 'diy') {
            const param = {
                id: deviceId,
                type: 'pulse',
                params: {
                    state: 'on',
                    width: count * 1000,
                },
            };
            const res = await controlDiyDevice(param);
            res.error === 0 && setChecked(true);
        } else {
            const param = {
                id: deviceId,
                apikey: apikey,
                params: {},
            };
            //多通道
            if (params && params.pulses && !(uiid === 77 || uiid === 78 || uiid === 112)) {
                params?.pulses?.forEach((item) => {
                    if (item.outlet === i) _.assign(item, { width: count * 1000, pulse: 'on' });
                });
                _.assign(param.params, { pulses: params.pulses });
            } else if (!params?.pulses) {
                _.assign(param.params, { pulseWidth: count * 1000, pulse: 'on' });
            } else if (params?.pulses && (uiid === 77 || uiid === 78 || uiid === 112)) {
                params.pulses.find((item) => {
                    if (item.outlet === 0) _.assign(item, { pulse: 'on', width: count * 1000 });
                });
                _.assign(param.params, { pulses: params.pulses });
            }

            const res = await updateDeviceByWS(param);
            if (res.error === 0) {
                setChecked(true);
                params?.pulses && updateFunction && updateFunction(params?.pulses);
            }
        }
    }
    //  点动开关
    async function inchingAction(value: boolean) {
        if (type === 'diy') {
            const param = {
                id: deviceId,
                type: 'pulse',
                params: {
                    state: 'off',
                    width: 500,
                },
            };
            if (!value) {
                const res = await controlDiyDevice(param);
                res.error === 0 && setChecked(value);
            }
        } else {
            const param = {
                id: deviceId,
                apikey: apikey,
                params: {},
            };
            if (params && params.width && !params.pulses) {
                _.assign(param.params, { pulses: [{ width: 500, outlet: i, pulse: 'off' }] });
            } else if (params && params.pulses && !(uiid === 77 || uiid === 78 || uiid == 112)) {
                params.pulses.forEach((item) => {
                    if (item.outlet === i) {
                        _.assign(item, { width: 500, pulse: 'off' });
                    }
                });
                _.assign(param.params, params);
            } else if (!params?.pulses && params?.pulseWidth) {
                _.assign(param.params, { pulseWidth: 500, pulse: 'off' });
            } else if ((params?.pulses && uiid === 77) || uiid === 78 || uiid == 112) {
                params!.pulses!.forEach((item) => {
                    if (item.outlet === 0) {
                        _.assign(item, { width: 500, pulse: 'off' });
                    }
                });
                _.assign(param.params, { pulses: params?.pulses });
            }
            if (!value) {
                const res = await updateDeviceByWS(param);
                res.error === 0 && setChecked(value);
            }
        }
    }
    //  默认点动时间
    function dealInchingTime() {
        if (params?.pulses && !(uiid === 77 || uiid === 78 || uiid == 112)) {
            const temp = params.pulses.find((item) => item.outlet === i);
            return temp && temp?.width <= 1000 ? moment('00:01', dateFormat) : temp && moment(`${formatTime(temp?.width)}`, dateFormat);
        }
        if (!params?.pulses && params?.pulseWidth) {
            return params.pulseWidth <= 1000 ? moment('00:01', dateFormat) : moment(`${formatTime(params.pulseWidth)}`, dateFormat);
        }
        if (uiid === 77 || uiid === 78 || uiid === 112) {
            return params?.pulses![0].width! <= 1000 ? moment('00:01', dateFormat) : moment(`${formatTime(params?.pulses![0].width!)}`, dateFormat);
        }
    }
    //  格式化点动时间
    function formatTime(time: number) {
        let temp = time / 1000;
        return temp < 60 ? `00:${temp}` : `${Math.floor(temp / 60)}:${temp % 60}`;
    }
    useEffect(() => {
        params?.pulse && params.pulse === 'on' ? setChecked(true) : setChecked(false);
        if (params?.pulses && !(uiid === 77 || uiid === 78 || uiid == 112)) {
            let temp = params.pulses.find((item) => item.outlet === i);
            temp && setChecked(temp?.pulse === 'on' ? true : false);
        }
        if ((params?.pulses && uiid === 77) || uiid === 78 || uiid == 112) {
            setChecked(params?.pulses![0].pulse === 'on' ? true : false);
        }
    }, [params]);
    return (
        <div className={`${styles['inching-mode']} ${style}`}>
            <span className={styles['span-font']}>Inching mode</span>
            <div>
                <TimePicker className={styles['mgr20']} format={dateFormat} value={dealInchingTime()} onChange={(time) => getInchingTime(time)} />
                <Switch checked={checked} onClick={(value) => inchingAction(value)} />
            </div>
        </div>
    );
};
export default InchingMode;
