import React, { useEffect } from 'react';
import { history, useIntl } from 'umi';
import { Spin } from 'antd';

import { isAuth, getHaToken } from '@/api';
import style from './index.less';

const Loading: React.FC = () => {
    const { formatMessage } = useIntl();
    let timer: any;

    const checkIsAuth = () => {
        timer = setInterval(async () => {
            const res = await isAuth();
            if (res.data.isAuth) {
                // clear timer and go to redir page
                clearInterval(timer);
                history.push('/');
            }
        }, 1000);
    };

    useEffect(checkIsAuth, []);

    useEffect(() => {
        let code = '';
        let index = 0;
        if ((index = window.location.search.indexOf('code=')) !== -1) {
            code = window.location.search.slice(index + 5);
            getHaToken({
                code,
                clientId: window.location.origin,
            });
        }
    }, []);

    return (
        <div className={style['container']}>
            <div className={style['wrapper']}>
                <Spin size="large" />
                <p className={style['hint-text']}>{formatMessage({ id: 'loading.message.hint' })}</p>
            </div>
        </div>
    );
};

export default Loading;
