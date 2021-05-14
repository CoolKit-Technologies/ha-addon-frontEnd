import React, { useState, useEffect } from 'react';
import { Gauge } from '@ant-design/charts';

interface IGauge {
    percent: number;
}

const CKGauge: React.FC<IGauge> = ({ percent }) => {
    const config = {
        width: 400,
        height: 400,
        percent: percent,
        axis: {
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
            color: '#1890FF',
        },
        indicator: {
            pointer: { style: { stroke: '#1890FF' } },
            pin: { style: { stroke: '#1890FF' } },
        },
        statistic: {
            title: {
                style: {
                    fontSize: '20px',
                    color: '#000000',
                },
                offsetY: -50,
                formatter: function formatter() {
                    return 'Temperature';
                },
            },
            content: {
                style: {
                    fontSize: '20px',
                },
                formatter: function formatter() {
                    return '73℉';
                },
            },
        },
    };
    return <Gauge {...config} />;
};
export default CKGauge;
