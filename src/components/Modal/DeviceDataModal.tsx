import React from 'react';
import { Tabs } from 'antd';
import StatisticData from './components/StatasticItem';
import HistoryData from './components/History';
import styles from './base.less';
const { TabPane } = Tabs;
const DeviceDataModal: React.FC = (props) => {
    return (
        <Tabs defaultActiveKey='statistic' className={styles['ant-tabs-nav-list']}>
            <TabPane tab='Realtime stats' key='statistic' className={styles['ant-tabs-tab']}>
                <StatisticData />
            </TabPane>
            <TabPane tab='History' key='history' className={styles['ant-tabs-tab']}>
                <HistoryData />
            </TabPane>
        </Tabs>
    );
};
export default DeviceDataModal;
