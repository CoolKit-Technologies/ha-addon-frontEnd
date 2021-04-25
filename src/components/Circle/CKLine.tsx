import React from 'react';
import { Line } from '@ant-design/charts';

interface ICKLine {
    id: number;
    year: string;
}
const CKLine: React.FC = () => {
    const config = {
        width: 300,
        height: 300,
        data: [
            {
                id: 1,
                year: '2021-04-15',
            },
            {
                id: 6,
                year: '2021-04-16',
            },
            {
                id: 4,
                year: '2021-04-17',
            },
            {
                id: 5,
                year: '2021-04-18',
            },
        ],
        xField: 'year',
        yField: 'id',
        tooltip: {
            // customContent: (title, data) => {
            //     return `<div>${title}</div>`;
            // },
            formatter: (datum: any) => {
                // console.log(`ML ~ file: CKLine.tsx ~ line 35 ~ datum`, datum);
                return { name: '功率', value: datum.id + 'kwh' };
            },
            // customContent: (title, data) => {
            //     return `<div>${title}${data}</div>`;
            // },
            // domStyles: {
            //     'g2-tooltip-name': {
            //         display: 'none',
            //     },
            // },
        },
        // yAxis: {
        //     label: {
        //         formatter: function formatter(v: any) {
        //             console.log('v', v);

        //             return `${v}Kwh`;
        //         },
        //     },
        // },
    };
    return <Line {...config} />;
};
export default CKLine;
