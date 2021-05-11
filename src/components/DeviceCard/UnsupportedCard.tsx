// 不支持的设备
import React, { useState } from 'react';
import { useIntl } from 'umi';
import _ from 'lodash';

import { getIconByDeviceType, getMittEmitter, deviceTypeMap, getTmpDeviceList, saveTmpDeviceList } from '@/utils';
import style from './card.less';

interface UnsupportedCardProps {
    data: any;
}

const emitter = getMittEmitter();

const UnsupportedCard: React.FC<UnsupportedCardProps> = ({ data }) => {
    const { formatMessage } = useIntl();
    const [deviceData, setDeviceData] = useState<any>(data);
    const { deviceId, online, type, deviceName } = deviceData;

    emitter.on('data-update', (data: any[]) => {
        const preData = _.find(getTmpDeviceList(), { deviceId });
        const nowData = _.find(data, { deviceId });
        if (!_.isEqual(preData, nowData)) {
            saveTmpDeviceList(data);
            setDeviceData(nowData);
        }
    });

    console.log(`${deviceId} now render`);

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
