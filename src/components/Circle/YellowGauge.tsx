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
                    console.log('text', text, 'item', item, 'index', index);
                    switch (index) {
                        case 1:
                            return 'Dry';
                        case 4:
                            return 'Wet';
                        default:
                            return '';
                    }
                    // switch (text) {
                    //     case '0.2':
                    //         return '0.35';
                    //     case '0.4':
                    //         return '0.5';
                    //     case '0.6':
                    //         return '0.75';
                    //     default:
                    //         return '';
                    // }
                    // switch (index) {
                    //     case 1:
                    //         return 'Dry';
                    //     case 4:
                    //         return 'Wet';
                    //     default:
                    //         return '';
                    // }
                },
            },
        },

        range: { color: '#52C41A' },
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
