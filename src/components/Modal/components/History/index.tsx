import React, { useState, useEffect } from 'react';
import DateItem from '../DateItem';
import DescriptionItem from '../DescriptionItem';
import CKLine from '@/components/Circle/CKLine';
import { IComponentProps } from '@/types/interface/IModal';
const HistoryData: React.FC<IComponentProps> = (props) => {
    const [days, setDays] = useState<Array<string>>();
    function getDays(days: Array<string>) {
        setDays(days);
        console.log('days', days);
    }
    return (
        <div>
            <DateItem {...props} getDays={setDays} />
            <DescriptionItem />
            <CKLine {...props} days={days} />
        </div>
    );
};
export default HistoryData;
