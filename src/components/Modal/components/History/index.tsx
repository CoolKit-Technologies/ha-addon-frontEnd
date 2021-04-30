import React, { useState, useEffect } from 'react';
import DateItem from '../DateItem';
import DescriptionItem from '../DescriptionItem';
import CKLine from '@/components/Circle/CKLine';
import { IComponentProps } from '@/types/interface/IModal';
const HistoryData: React.FC<IComponentProps> = (props) => {
    const [month, setMonth] = useState(Number);
    const [consumed, setConsumed] = useState(Number);
    let rate = 0;
    if (props.rate) {
        rate = props.rate;
    }
    return (
        <div>
            <DateItem {...props} setMonth={setMonth} />
            <DescriptionItem rate={rate} consumed={consumed} />
            <CKLine {...props} month={month} setConsumed={setConsumed} />
        </div>
    );
};
export default HistoryData;
