import React, { useState, useEffect } from 'react';
import { DatePicker, Divider } from 'antd';
import styles from './index.less';
import { IComponentProps } from '@/types/interface/IModal';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const { RangePicker } = DatePicker;

const DateRange: React.FC<IComponentProps> = (props) => {
    const [startTime, setStartTime] = useState(String);
    const [endTime, setEndTime] = useState(String);
    function getDefaluteDate(time: string) {
        return time ? moment(time) : moment();
    }
    useEffect(() => {
        props.params?.startTime && setStartTime(moment(props.params.startTime).format(dateFormat));
        props.params?.endTime && setEndTime(moment(props.params.endTime).format(dateFormat));
    }, [props.params?.startTime, props.params?.endTime]);
    return (
        <div className={styles['date-range']}>
            <RangePicker
                showTime
                bordered={false}
                disabled={true}
                placeholder={['from', ' to']}
                className={styles['.ant-picker']}
                format={dateFormat}
                // defaultValue={[moment('2015-01-01', 'YYYY-MM-DD'), moment('2015-01-03', 'YYYY-MM-DD')]}
                value={[getDefaluteDate(startTime), getDefaluteDate(endTime)]}
            />
            <Divider className={styles['divider']} />
        </div>
    );
};
export default DateRange;
