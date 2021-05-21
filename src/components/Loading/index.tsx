import React, { useEffect } from 'react';
import { connect, history, useIntl } from 'umi';
import { Spin } from 'antd';

import { isAuth, getHaToken } from '@/api';
import style from './index.less';

const Loading: React.FC<{ setIsLoading: Function }> = ({ setIsLoading }) => {
    const { formatMessage } = useIntl();
    let timer: any;

    const checkIsAuth = () => {
        timer = setInterval(async () => {
            const res = await isAuth();
            if (res.data.isAuth) {
                // clear timer and set isLoading to false
                clearInterval(timer);
                setIsLoading(false);
            }
        }, 1000);
    };

    useEffect(checkIsAuth, []);

    useEffect(() => {
        let code = '';
        let index = 0;
        if ((index = window.location.search.indexOf('code=')) !== -1) {
            const { search, origin, pathname } = window.location;
            code = search.slice(index + 5);
            getHaToken({
                code,
                clientId: origin + pathname,
            });
        }
    }, []);

    return (
        <div className={style['container']}>
            <div className={style['wrapper']}>
                <Spin size='large' />
                <p className={style['hint-text']}>{formatMessage({ id: 'loading.message.hint' })}</p>
            </div>
        </div>
    );
};

export default connect(
    () => {},
    (dispatch) => ({
        setIsLoading: (isLoading: boolean) =>
            dispatch({
                type: 'global/save',
                payload: {
                    isLoading,
                },
            }),
    })
)(Loading);
