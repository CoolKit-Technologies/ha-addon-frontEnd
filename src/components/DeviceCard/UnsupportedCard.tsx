// 不支持的设备
import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import _ from 'lodash';

import { getIconByDeviceType, getMittEmitter, deviceTypeMap, getTmpDeviceList, saveTmpDeviceList } from '@/utils';
import style from './card.less';

interface Props {
    data: any;
}

const emitter = getMittEmitter();

const UnsupportedCard: React.FC<Props> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { deviceId, online, type, deviceName } = deviceData;

    useEffect(() => {
        emitter.on(`data-update-${deviceId}`, (data: any) => {
            setDeviceData(data);
        });
    }, []);

    return (
        <div className={style['card']}>
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceTypeMap(type), online)} />
                </div>
                <span className={style['device-name']}>{deviceName || deviceId}</span>
            </div>
            <p className={style['unsupport-hint']}>{ formatMessage({ id: 'device.card.unsupport.message' }) }</p>
        </div>
    );
};

export default UnsupportedCard;
