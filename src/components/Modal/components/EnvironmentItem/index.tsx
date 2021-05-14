import React, { useState, useEffect } from 'react';
import { useIntl } from 'umi';
import { Select } from 'antd';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
const { Option } = Select;
import { updateDeviceTempUnit } from '@/api';
const TemperatureUnit: React.FC<IComponentProps> = (props) => {
    const [unit, setUnit] = useState('f');
    const { formatMessage } = useIntl();
    async function setUnitAction(value: string) {
        let params = {
            id: props.deviceId,
            unit: value,
        };
        const res = await updateDeviceTempUnit(params);
    }
    // useEffect(() => {
    //     props.unit && setUnit(props.unit);
    // }, [props]);
    // useEffect(() => {
    //     props.unit && setUnit(props.unit);
    // }, []);
    return (
        <div className={styles['environment']}>
            <span className={styles['span-font']}>{formatMessage({ id: 'device.temp.unit' })}</span>
            <Select className={styles['select']} defaultValue={props.unit} onChange={async (value) => setUnitAction(value)}>
                <Option value='f'>{formatMessage({ id: 'device.temp.unit.f' })}[℉]</Option>
                <Option value='c'>{formatMessage({ id: 'device.temp.unit.c' })}[℃]</Option>
            </Select>
        </div>
    );
};
export default TemperatureUnit;
