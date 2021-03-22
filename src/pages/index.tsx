import React from 'react';
import TopBar from '@/components/TopBar';
import DeviceList from '@/components/DeviceList';
import styles from './index.less';
import { DeviceInfo, DeviceType } from '@/types';
import _ from 'lodash';
import { getDeviceList, changeDeviceStatus } from '@/api';

const App: React.FC = () => {
    const [isLogin, setIsLogin] = React.useState(false);
    const [tableData, setTableData] = React.useState<DeviceInfo[]>([]);

    React.useEffect(() => {
        getDeviceList({ type: 'init' })
            .then((res) => {
                if (res.error === 0) {
                    // done
                    console.log(res.data);
                    setTableData(res.data);
                } else {
                    // fail
                }
            });
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <TopBar
                    isLogin={isLogin}
                    onRefresh={(data) => setTableData(data)}
                    onLogout={() => {
                        setIsLogin(false);
                        setTableData([]);
                    }}
                    onLogin={() => {
                        setIsLogin(true);
                    }}
                />
                <DeviceList
                    isLogin={isLogin}
                    tableData={tableData}
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

export default App;
