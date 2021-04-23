// 不支持的设备
import React from 'react';

import LiquidBall from '@/components/LiquidBall';
import style from './card.less';

const UnsupportedCard: React.FC = () => {
    return (
        <div className={style['card']}>
            unsupported device
            <LiquidBall
                size="large"
                type="blue"
            />
            <LiquidBall
                size="small"
                type="yellow"
            />
        </div>
    );
};

export default UnsupportedCard;
