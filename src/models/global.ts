import { getLocale, setLocale } from 'umi';
import { getLanguage } from '@/api';
import IResponse from '@/types/interface/IResponse';

type TypeState = {
    language: string;
};

export default {
    namespace: 'global',
    state: {
        language: 'en',
    } as TypeState,
    effects: {
        *getLanguage(_: any, { put, call }: any) {
            const res: IResponse<string> = yield call(getLanguage);
            let tmp = 'en';
            if (res.error === 200 && res.data?.indexOf('zh') === 0) {
                tmp = 'zh';
                setLocale('zh-CN');
                // setLocale('en-US');
            } else {
                setLocale('en-US');
            }
            yield put({
                type: 'save',
                payload: {
                    language: tmp,
                },
            });
        },
    },
    reducers: {
        save(state: TypeState, { payload }: { payload: Partial<TypeState> }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
};
