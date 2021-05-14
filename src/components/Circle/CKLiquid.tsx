import React, { useContext } from 'react';
import { Liquid } from '@ant-design/charts';
interface IProps {
    value: string;
}
const CKLiquid: React.FC<IProps> = ({ value }) => {
    const config = {
        width: 400,
        height: 400,
        percent: 0.3,
        outline: {
            border: 2,
            distance: 4,
        },
        wave: { length: 300 },
        statistic: {
            title: {
                style: {
                    fontSize: '20px',
                    color: '#000000',
                },
                offsetY: -90,
                formatter: function formatter() {
                    return 'POWER';
                },
            },
            content: {
                style: {
                    fontSize: '30px',
                    color: '#000000',
                },
                offsetY: -80,
                formatter: function formatter() {
                    // return `${value}W`;
                    return value ? `${value}W` : `0W`;
                },
            },
        },
    };
    return <Liquid {...config} />;
};
export default CKLiquid;
