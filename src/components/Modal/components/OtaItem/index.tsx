import React, { useState, useEffect } from 'react';
import { connect, useIntl } from 'umi';
import upgradeIcon from '@/assets/cellphone-arrow-down.svg';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import { changeDeviceStatus, getOtaInfo, upgradeDeviceByWS } from '@/api';
import _ from 'lodash';
const OtaItem: React.FC<IComponentProps> = ({ deviceId, params, model, apikey }) => {
    const { formatMessage } = useIntl();
    const [upgradeInfo, setUpgradeInfo] = useState({ version: params?.fwVersion });
    useEffect(() => {
        getOtaInfo({
            list: [
                {
                    deviceid: deviceId,
                    version: params?.fwVersion!,
                    model,
                },
            ],
        }).then((res) => {
            if (res.error === 0) {
                setUpgradeInfo(_.get(res, ['data', 'otaInfoList', 0]));
            }
        });
    }, []);
    return (
        <div className={styles['form-item']}>
            <div className={styles['label']}>
                {formatMessage({ id: 'device.firmware.upgrade' })}
                <span className={styles['tips']}>
                    {params?.fwVersion === upgradeInfo?.version
                        ? formatMessage({ id: 'device.firmware.upgrade.latest' })
                        : formatMessage({ id: 'device.firmware.upgrade.tips' }, { version: upgradeInfo?.version })}
                </span>
            </div>
            <div className={styles['actions']} style={{ visibility: params?.fwVersion === upgradeInfo?.version ? 'hidden' : 'visible' }}>
                <img
                    src={upgradeIcon}
                    alt=''
                    onClick={() => {
                        if (upgradeInfo) {
                            upgradeDeviceByWS({
                                id: deviceId,
                                apikey,
                                params: {
                                    model,
                                    binList: upgradeInfo.binList,
                                    version: upgradeInfo.version,
                                },
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
};
export default connect(
    ({ global }: any) => ({}),
    (dispatch) => ({})
)(OtaItem);
