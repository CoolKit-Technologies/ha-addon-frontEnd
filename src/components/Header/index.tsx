import React from 'react';
import styles from './index.less';

const Header: React.FC = () => {
    return (
        <header className={styles['header-box']}>
            <div className={styles['title']}>eWeLink Smart Home</div>
            <div className={styles['actions']}></div>
        </header>
    );
};
export default Header;
