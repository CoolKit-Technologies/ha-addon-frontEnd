import React from 'react';
import { PlayCircleTwoTone, ReloadOutlined } from '@ant-design/icons';
import styles from './index.less';
const ICons: React.FC = () => {
    return (
        <div className={styles['iconsPos']}>
            <PlayCircleTwoTone className={styles['mgr100']} onClick={() => console.log('播放')} />
            <ReloadOutlined onClick={() => console.log('刷新')} />
        </div>
    );
};
export default ICons;
