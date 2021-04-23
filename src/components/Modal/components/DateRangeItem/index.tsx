import React from 'react';
import { DatePicker, Divider } from 'antd';

const { RangePicker } = DatePicker;

const DateRange: React.FC = () => {
    return (
        <div>
            <RangePicker showTime bordered={false} placeholder={['from', ' to']} />
            <Divider />
        </div>
    );
};
export default DateRange;
