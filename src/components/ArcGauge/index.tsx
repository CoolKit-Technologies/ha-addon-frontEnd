// 计量图
import React from 'react';
import { Gauge } from '@ant-design/charts';

interface ArcGaugeProps {
    type: 'humi' | 'temp';
}

const ArcGauge: React.FC<ArcGaugeProps> = ({ type }) => {
    const config = {
        width: 160,
        height: 160,
        percent: 0.3,
        autoFix: false
    };

    return <Gauge {...config} />;
};

export default ArcGauge;
