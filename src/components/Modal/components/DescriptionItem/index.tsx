import React from 'react';
import { Row, Col, Statistic, Divider } from 'antd';
import styles from './index.less';
const DescriptionItem: React.FC = () => {
    return (
        <div className={styles['description']}>
            <Row gutter={16}>
                <Col span={10}>
                    <Statistic title='Consumed' value={14} suffix='KWh'></Statistic>
                </Col>
                <Col span={1} className={styles['col']}>
                    <Divider type='vertical' style={{ height: '70%' }} />
                </Col>
                <Col span={10}>
                    <Statistic title='Costs' value={10} suffix='USD' />
                </Col>
                <Col span={1} className={styles['col']}>
                    <Divider type='vertical' style={{ height: '70%' }} />
                </Col>
            </Row>
        </div>
    );
};
export default DescriptionItem;
