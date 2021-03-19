import React from 'react';
import TopBar from '../components/TopBar';
import DeviceList from '../components/DeviceList';
import styles from './index.less';
import { DeviceInfo, DeviceType } from '@/types';
import _ from 'lodash';

const App: React.FC = () => {
    const [tableData, setTableData] = React.useState<DeviceInfo[]>([
        {
            key: '1',
            name: 'Single Socket 401',
            id: '60423DC',
            ip: '192.168.10.3',
            vendor: 'SONOFF',
            model: 'SG-SK-TSA-CN',
            enabled: true,
            type: DeviceType.SUPPORT
        },
        {
            key: '2',
            name: 'Double Socket 402',
            id: '6KFG423',
            ip: '192.168.10.111',
            vendor: 'Coolkit',
            model: 'DB-TK-GCD-EN',
            enabled: false,
            type: DeviceType.SUPPORT
        },
        {
            key: '3',
            name: 'Power K3',
            id: 'PKK301',
            ip: '192.168.10.89',
            vendor: 'Coolkit',
            model: 'DB-PP-DL-EN',
            enabled: true,
            type: DeviceType.LOGIN_SUPPORT
        },
        {
            key: '4',
            name: 'WiFi Controller',
            id: 'PKK301',
            ip: '192.168.10.70',
            vendor: 'TUYA',
            model: 'DB-PP-DL-EN',
            enabled: false,
            type: DeviceType.UNSUPPORT
        }
    ]);

    return (
        <div className={styles['container']}>
            <div className={styles['wrapper']}>
                <TopBar onRefresh={(data) => setTableData(data)} onLogout={() => setTableData([])} />
                <DeviceList
                    tableData={tableData}
                    onDel={(index) => {
                        const copy = _.cloneDeep(tableData);
                        copy.splice(index, 1);
                        setTableData(copy);
                    }}
                    onStatChange={(stat) => {
                        console.log(stat);
                    }}
                />
            </div>
        </div>
    );
};

export default App;
