import React, { useState } from 'react';
import DateRange from '@/components/Modal/components/DateRangeItem';
import ICons from '@/components/Modal/components/IconItem';
import CKLiquid from '@/components/Circle/CKLiquid';
import { IComponentProps } from '@/types/interface/IModal';
import LiquidBall from '@/components/LiquidBall';

const StatisticData: React.FC<IComponentProps> = (props) => {
    const [oneKwhData, setOneKwhData] = useState('');
    const [hundredDaysKwhData, setHundredDaysKwhData] = useState('');
    function oneKwhDataCallback(oneKwhData: string) {
        setOneKwhData(oneKwhData);
    }
    // console.log(`ML ~ file: index.tsx ~ line 10 ~ oneKwhData`, oneKwhData);
    return (
        <div>
            <DateRange {...props} />
            <CKLiquid value={oneKwhData} />
            {/* <LiquidBall title='power' content='114w' size='large' type='blue' /> */}
            <ICons {...props} callback={oneKwhDataCallback} />
        </div>
    );
};
export default StatisticData;
