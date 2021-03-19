import React from 'react';
import { Table, Switch, Typography, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import styles from './index.less';
import { DeviceInfo, DeviceType } from '@/types';
import TableCellHint from '@/components/TableCellHint';

const { Text } = Typography;
const { confirm } = Modal;

interface DeviceListProps {
    tableData: DeviceInfo[];
    onDel: (index: number) => void;
    onStatChange: (stat: boolean) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ tableData, onDel, onStatChange }) => {
    const renderContent = (value: any, record: DeviceInfo) => {
        if (record.type === DeviceType.SUPPORT) {
            return <Text>{value}</Text>
        } else {
            return {
                children: '',
                props: {
                    colSpan: 0
                }
            };
        }
    };
    const columns: ColumnProps<DeviceInfo>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'ID',
            dataIndex: 'id',
            render: (value, record, index) => {
                // 登录后支持的设备
                if (record.type === DeviceType.LOGIN_SUPPORT) {
                    return {
                        children: <TableCellHint type="login-support" />,
                        props: {
                            colSpan: 5
                        }
                    };
                }

                // 不支持的设备
                if (record.type === DeviceType.UNSUPPORT) {
                    return {
                        children: <TableCellHint type="unsupport" />,
                        props: {
                            colSpan: 5
                        }
                    };
                }

                return <Text>{value}</Text>;
            }
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            render: renderContent
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor',
            render: renderContent
        },
        {
            title: 'Model',
            dataIndex: 'model',
            render: renderContent
        },
        {
            title: 'Operation',
            width: 170,
            render: (value, record, index) => {
                if (record.type === DeviceType.SUPPORT) {
                    return (
                        <div className={styles['op-item']}>
                            <Switch
                                checked={ record.enabled ? true : false }
                                onChange={(v) => onStatChange(v)}
                            />
                            <Text>{ record.enabled ? 'Enabled' : 'Disabled' }</Text>
                            <DeleteOutlined
                                className={styles['del-icon']}
                                onClick={() => {
                                    confirm({
                                        title: `'${record.name}' will be removed from the table temporarily.`,
                                        onOk() {
                                            onDel(index);
                                        }
                                    });
                                }}
                            />
                        </div>
                    );
                } else {
                    return {
                        children: '',
                        props: {
                            colSpan: 0
                        }
                    };
                }
            }
        }
    ];

    return (
        <div className={styles['container']}>
            <Table columns={columns} dataSource={tableData} pagination={false} bordered />
        </div>
    );
};

export default DeviceList;
