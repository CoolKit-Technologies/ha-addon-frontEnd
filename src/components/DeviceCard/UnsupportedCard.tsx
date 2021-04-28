// 不支持的设备
import React from 'react';
import { useIntl } from 'umi';

import { DeviceType } from '@/types/device';
import { getIconByDeviceType } from '@/utils';
import style from './card.less';

interface UnsupportedCard {
    deviceData: {
        online: boolean;
        type: DeviceType;
        name: string;
    };
}

const UnsupportedCard: React.FC<UnsupportedCard> = ({ deviceData }) => {
    const { formatMessage } = useIntl();
    return (
        <div className={style['card']}>
            <div className={style['info-switch']}>
                <div className={style['info-icon']}>
                    <img src={getIconByDeviceType(deviceData.type, deviceData.online)} />
                </div>
                <span className={style['device-name']}>{deviceData.name}</span>
            </div>
            <p className={style['unsupport-hint']}>{ formatMessage({ id: 'device.card.unsupport.message' }) }</p>
        </div>
    );
};

export default UnsupportedCard;
