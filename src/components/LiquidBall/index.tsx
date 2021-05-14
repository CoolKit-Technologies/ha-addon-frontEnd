// 水波图
import React from 'react';
import { Liquid } from '@ant-design/charts';

interface LiquidBallProps {
    size: 'small' | 'large';
    type: 'blue' | 'green' | 'yellow';
    title: string;
    content: string;
}

const LiquidBall: React.FC<LiquidBallProps> = ({ size, type, title, content }) => {
    let width = 400, height = 400;
    let outline = {
        border: 1,
        distance: 1
    };
    let color = '#ccf';
    let titleFontSize = '16px', contentFontSize = '16px';
    let titleOffsetY = 0, contentOffsetY = 0;

    switch (size) {
        case 'small':
            width = height = 120;
            outline.border = 2;
            outline.distance = 1;
            titleFontSize = '12px';
            contentFontSize = '16px';
            titleOffsetY = -16;
            contentOffsetY = -18;
            break;
        case 'large':
            width = height = 160;
            outline.border = 2;
            outline.distance = 2;
            titleFontSize = '14px';
            contentFontSize = '24px';
            titleOffsetY = -26;
            contentOffsetY = -20;
            break;
        default:
            break;
    }

    switch (type) {
        case 'blue':
            color = '#1890FF';
            break;
        case 'green':
            color = '#4ECB73';
            break;
        case 'yellow':
            color = '#FBD437';
            break;
        default:
            break;
    }

    const config = {
        width,
        height,
        color,
        outline,
        percent: 0.38,
        autoFit: false,
        wave: {
            length: 128
        },
        statistic: {
            title: {
                style: {
                    fontSize: titleFontSize,
                    color: '#c8c8c8'
                },
                offsetY: titleOffsetY,
                formatter: () => title
            },
            content: {
                style: {
                    fontSize: contentFontSize,
                    color: '#222'
                },
                offsetY: contentOffsetY,
                formatter: () => content
            }
        }
    };
    return <Liquid {...config} />;
};

export default LiquidBall;
