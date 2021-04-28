import React from 'react';
import DateItem from '../DateItem';
import DescriptionItem from '../DescriptionItem';
import CKLine from '@/components/Circle/CKLine';
import { IComponentProps } from '@/types/interface/IModal';
const HistoryData: React.FC<IComponentProps> = (props) => {
    return (
        <div>
            <DateItem {...props} />
            <DescriptionItem />
            <CKLine />
        </div>
    );
};
export default HistoryData;
