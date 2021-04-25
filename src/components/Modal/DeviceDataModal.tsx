import React from 'react';
import BaseModal from './BaseModal';
import TypeModalProps from '@/ts/type/TypeModal';
import { Tabs } from 'antd';
import StatisticData from './components/StatasticItem';
import HistoryData from './components/History';

const { TabPane } = Tabs;
const DeviceDataModal: React.FC<TypeModalProps> = (props) => {
    return (
        <BaseModal {...props}>
            <Tabs defaultActiveKey='statistic'>
                <TabPane tab='Realtime stats' key='statistic'>
                    <StatisticData />
                </TabPane>
                <TabPane tab='History' key='history'>
                    <HistoryData />
                </TabPane>
            </Tabs>
        </BaseModal>
    );
};
export default DeviceDataModal;
