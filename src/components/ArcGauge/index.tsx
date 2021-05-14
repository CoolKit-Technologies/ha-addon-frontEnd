// 计量图
import React from 'react';
import { Gauge } from '@ant-design/charts';
import { useIntl } from 'umi';

interface ArcGaugeProps {
    type: 'green' | 'blue';
    title: string;
    content: string;
    percent: number;
}

const ArcGauge: React.FC<ArcGaugeProps> = ({ type, title, content, percent }) => {
    const { formatMessage } = useIntl();
    const MAIN_COLOR = type === 'green' ? '#52C41A' : '#1890FF';
    const config = {
        width: 150,
        height: 150,
        percent,
        autoFix: false,
        axis: {
            subTickLine: {
                count: 0
            },
            label: {
                formatter: (text: string, item: any, i: number) => {
                    if (type === 'green' && i === 1) {
                        return formatMessage({ id: 'device.card.dry' });
                    } else if (type === 'green' && i === 4) {
                        return formatMessage({ id: 'device.card.wet' });
                    } else if (type === 'blue' && i === 1) {
                        return formatMessage({ id: 'device.card.cold' });
                    } else if (type === 'blue' && i === 2) {
                        return formatMessage({ id: 'device.card.cool' });
                    } else if (type === 'blue' && i === 3) {
                        return formatMessage({ id: 'device.card.warm' });
                    } else if (type === 'blue' && i === 4) {
                        return formatMessage({ id: 'device.card.hot' });
                    } else {
                        return '';
                    }
                }
            }
        },
        range: {
            color: MAIN_COLOR
        },
        indicator: {
            pointer: {
                style: {
                    stroke: MAIN_COLOR,
                    lineWidth: 3
                }
            },
            pin: {
                style: {
                    stroke: MAIN_COLOR,
                    lineWidth: 3
                }
            }
        },
        statistic: {
            title: {
                style: {
                    fontSize: '14px',
                    color: '#ccc'
                },
                offsetY: -10,
                formatter: () => title
            },
            content: {
                style: {
                    fontSize: '24px',
                    color: '#333'
                },
                offsetY: 26,
                formatter: () => content
            }
        }
    };

    return <Gauge {...config} />;
};

export default ArcGauge;
