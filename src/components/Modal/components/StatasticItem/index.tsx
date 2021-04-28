import React from 'react';
import DateRange from '@/components/Modal/components/DateRangeItem';
import ICons from '@/components/Modal/components/IconItem';
import CKLiquid from '@/components/Circle/CKLiquid';
import { IComponentProps } from '@/types/interface/IModal';
import LiquidBall from '@/components/LiquidBall';

const StatisticData: React.FC<IComponentProps> = (props) => {
    return (
        <div>
            <DateRange {...props} />
            <CKLiquid value={'14'} />
            {/* <LiquidBall title='power' content='114w' size='large' type='blue' /> */}
            <ICons {...props} />
        </div>
    );
};
export default StatisticData;
