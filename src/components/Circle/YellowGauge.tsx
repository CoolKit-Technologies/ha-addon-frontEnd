import React, { useState, useEffect } from 'react';
import { Gauge } from '@ant-design/charts';

interface IGauge {
    percent: number;
}
const CKYellowGauge: React.FC<IGauge> = ({ percent }) => {
    const config = {
        width: 400,
        height: 400,
        percent: percent,
        axis: {
            tickCount: 0,
            subTickLine: { count: 0 },
            label: {
                formatter: function formatter(text: string, item: any, index: number) {
                    switch (index) {
                        case 1:
                            return 'Cold';
                        case 2:
                            return 'Cool';
                        case 3:
                            return 'Warm';
                        case 4:
                            return 'Hot';
                        default:
                            return '';
                    }
                },
            },
        },

        range: {
            ticks: [percent],
            color: ['#52C41A', '#F0F2F5'],
        },
        indicator: {
            pointer: { style: { stroke: '#52C41A' } },
            pin: { style: { stroke: '#52C41A' } },
        },
        statistic: {
            title: {
                style: {
                    fontSize: '20px',
                    color: '#000000',
                },
                offsetY: -50,
                formatter: function formatter() {
                    return 'Humidity';
                },
            },
            content: {
                style: {
                    fontSize: '20px',
                },
            },
        },
    };
    return <Gauge {...config} />;
};
export default CKYellowGauge;
