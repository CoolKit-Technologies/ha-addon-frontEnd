import React from 'react';
import DateItem from '../DateItem';
import DescriptionItem from '../DescriptionItem';
import CKLine from '@/components/Circle/CKLine';

const HistoryData: React.FC = () => {
    return (
        <div>
            <DateItem />
            <DescriptionItem />
            <CKLine />
        </div>
    );
};
export default HistoryData;
