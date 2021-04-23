// 不支持的设备
import React from 'react';

import style from './card.less';

const UnsupportedCard: React.FC = () => {
    return (
        <div className={style['card']}>
            unsupported device
        </div>
    );
};

export default UnsupportedCard;
