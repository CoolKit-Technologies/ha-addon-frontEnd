import React, { useEffect } from 'react';
import { history } from 'umi';

import { isAuth, getHaToken } from '@/api';

const Loading: React.FC = () => {
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
        <div>
            <p>Please wait</p>
        </div>
    );
};

export default Loading;
