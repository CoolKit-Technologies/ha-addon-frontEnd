import React, { useState, useEffect } from 'react';
import TopBar from '@/components/TopBar';
import DeviceList from '@/components/DeviceList';
import styles from './index.less';
import { DeviceInfo } from '@/types';
import { getDeviceList, changeDeviceStatus, logout, getLanguage } from '@/api';
import _ from 'lodash';
import { connect, setLocale } from 'umi';

const App: React.FC<{ language: string; getLanguage: Function }> = ({ getLanguage }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [tableData, setTableData] = useState<DeviceInfo[]>([]);

    useEffect(() => {
        getDeviceList({ type: 'init' }).then((res) => {
            if (res.error === 0) {
                // done
                setTableData(res.data);
            } else {
                // fail
            }
        });
        getLanguage();
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <TopBar
                    isLogin={isLogin}
                    onRefresh={(data) => setTableData(data)}
                    onLogout={async () => {
                        const { error } = await logout();
                        if (error === 0) {
                            setIsLogin(false);
                            setTableData([]);
                            window.localStorage.clear();
                        }
                    }}
                    onLogin={async () => {
                        setIsLogin(true);
                        const { data, error } = await getDeviceList({ type: 'init' });
                        setTableData(data);
                    }}
                />
                <DeviceList
                    isLogin={isLogin}
                    tableData={tableData}
                    setTableData={setTableData}
                    onDel={(index) => {
                        const copy = _.cloneDeep(tableData);
                        copy.splice(index, 1);
                        setTableData(copy);
                    }}
                    onStatChange={async (deviceId, stat) => {
                        await changeDeviceStatus({ id: deviceId, disabled: !stat });
                        const res = await getDeviceList({ type: 'init' });
                        setTableData(res.data);
                    }}
                />
            </div>
        </div>
    );
};

export default connect(
    ({ global }: any) => ({
        language: global.language,
    }),
    (dispatch) => ({
        getLanguage: () =>
            dispatch({
                type: 'global/getLanguage',
            }),
    })
)(App);
