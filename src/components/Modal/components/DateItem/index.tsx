import { DatePicker, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
import moment from 'moment';
interface IDate extends IComponentProps {
    setMonth: (days: number) => void;
}
const dateFormat = 'YYYY-MM';
const DateItem: React.FC<IDate> = (props) => {
    const [defaultMonth, setDefaultMonth] = useState();

    function dealDate(date: string) {
        const month = moment(date).month() + 1;
        props.setMonth(month);
    }
    useEffect(() => {
        props.setMonth(moment().month() + 1);
    }, []);
    return (
        <div className={styles['date-item']}>
            <div className={styles['mgt']}>
                {/* <DatePicker picker='month' defaultValue={moment()} format={dateFormat} onChange={(date, dateString) => getDay(moment(dateString).daysInMonth())} /> */}
                <DatePicker picker='month' defaultValue={moment()} format={dateFormat} onChange={(date, dateString) => dealDate(dateString)} />
            </div>
            <Divider />
        </div>
    );
};
export default DateItem;
