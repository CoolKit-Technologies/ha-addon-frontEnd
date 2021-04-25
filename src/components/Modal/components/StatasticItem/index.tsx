import React from 'react';
import DateRange from '@/components/Modal/components/DateRangeItem';
import ICons from '@/components/Modal/components/IconItem';
import CKLiquid from '@/components/Circle/CKLiquid';

const StatisticData: React.FC = () => {
    return (
        <div>
            <DateRange />
            <CKLiquid value={'14'} />
            <ICons />
        </div>
    );
};
export default StatisticData;
