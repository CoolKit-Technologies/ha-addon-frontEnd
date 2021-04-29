import { DatePicker, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { updateDeviceByWS } from '@/api';
import { IComponentProps } from '@/types/interface/IModal';
import moment from 'moment';
interface IDate extends IComponentProps {
    getDays: (days: Array<string>) => void;
}
const dateFormat = 'YYYY-MM';
const DateItem: React.FC<IDate> = (props) => {
    const [defaultMonth, setDefaultMonth] = useState();
    function getDay(days: number) {
        // const days = moment(dateString).daysInMonth();
        const daylist: string[] = [];
        for (let i = 1; i <= days; i++) {
            daylist.push(`${i}`);
        }
        props.getDays(daylist);
    }
    useEffect(() => {
        getDay(moment().daysInMonth());
    }, []);
    return (
        <div className={styles['date-item']}>
            <div className={styles['mgt']}>
                <DatePicker picker='month' defaultValue={moment()} format={dateFormat} onChange={(date, dateString) => getDay(moment(dateString).daysInMonth())} />
            </div>
            <Divider />
        </div>
    );
};
export default DateItem;
