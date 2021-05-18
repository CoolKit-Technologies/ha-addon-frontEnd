import { getLocale, setLocale } from 'umi';
import { getLanguage, userIsLogin } from '@/api';
import IResponse from '@/types/interface/IResponse';
import { DeviceInfo } from '@/types/device';


type TypeState = {
    language: string;
};

export default {
    namespace: 'global',
    state: {
        language: 'en',
        deviceList: [] as DeviceInfo[],
        isLogin: false,
        isLoading: true, // 由于没有路由，用这个变量标示页面是否加载
    } as TypeState,
    effects: {
        *getLanguage(_: any, { put, call }: any) {
            const res: IResponse<string> = yield call(getLanguage);
            let tmp = 'en';
            if (res.error === 0 && res.data?.indexOf('zh') === 0) {
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
        *checkUserLogin(_: any, { put, call }: any) {
            const res: IResponse<{isLogin:boolean}> = yield call(userIsLogin);
            if (res.error === 0) {
                yield put({
                    type: 'save',
                    payload: {
                        isLogin: res.data!.isLogin
                    },
                });
            } else {
                yield put({
                    type: 'save',
                    payload: {
                        isLogin:false
                    },
                });
            }
        }
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
