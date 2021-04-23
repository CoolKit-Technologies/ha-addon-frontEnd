// 水波图
import React from 'react';
import { Liquid } from '@ant-design/charts';

interface LiquidBallProps {
    size: 'small' | 'large';
    type: 'blue' | 'green' | 'yellow';
    title?: string;
    content?: string;
}

const LiquidBall: React.FC<LiquidBallProps> = ({ size, type }) => {
    const width = size === 'small' ? 120 : size === 'large' ? 180 : 400;
    const height = size === 'small' ? 120 : size === 'large' ? 180 : 400;
    const color = type === 'blue' ? '#1890FF' : type === 'green' ? '#4ECB73' : type === 'yellow' ? '#FBD437' : '#ccccff';
    const outline = size === 'small' ? { border: 2, distance: 1 } : size === 'large' ? { border: 2, distance: 2 } : { border: 1, distance: 1 };
    const config = {
        width,
        height,
        color,
        outline,
        percent: 0.4,
        wave: {
            length: 128
        },
        statistic: {
            title: {
                style: 'font-size:12px; color:rgba(0,0,0,0.45);',
                formatter: () => 'dame'
            },
            content: {
                style: 'color:#fcc;',
                formatter: () => 'well well'
            }
        }
    };
    return <Liquid {...config} />;
};

export default LiquidBall;
