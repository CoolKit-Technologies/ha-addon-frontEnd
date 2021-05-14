import React from 'react';
import { Tabs } from 'antd';
import { useIntl } from 'umi';
import StatisticData from './components/StatasticItem';
import HistoryData from './components/History';
import styles from './base.less';
import { IComponentProps } from '@/types/interface/IModal';
const { TabPane } = Tabs;
const DeviceData: React.FC<IComponentProps> = (props) => {
    const { formatMessage } = useIntl();
    return (
        <Tabs defaultActiveKey='statistic' animated={{ inkBar: true, tabPane: false }} className={styles['ant-tabs-nav-list']}>
            <TabPane tab={formatMessage({ id: 'device.tab.realtime.stats' })} key='statistic' className={styles['ant-tabs-tab']}>
                <StatisticData {...props} />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'device.tab.history' })} key='history' className={styles['ant-tabs-tab']}>
                <HistoryData {...props} />
            </TabPane>
        </Tabs>
    );
};
export default DeviceData;
