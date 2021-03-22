import React from 'react';
import { Table, Switch, Typography, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import styles from './index.less';
import { DeviceInfo, DeviceType } from '@/types';
import TableCellHint from '@/components/TableCellHint';
import { deviceIsSupport, deviceIsLoginAva } from '@/utils';

const { Text } = Typography;
const { confirm } = Modal;

interface DeviceListProps {
    isLogin: boolean;
    tableData: DeviceInfo[];
    onDel: (index: number) => void;
    onStatChange: (deviceId: string, stat: boolean) => void;
}

const DeviceList: React.FC<DeviceListProps> = ({ tableData, isLogin, onDel, onStatChange }) => {
    const renderContent = (value: any, record: DeviceInfo) => {
        if (deviceIsSupport(1)) {
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
            dataIndex: 'deviceName',
            render: (value, record, index) => {
                let tag: JSX.Element = <></>;

                switch (record.type) {
                    case DeviceType.DIY:
                        tag = <span>DIY</span>;
                        break;
                    case DeviceType.LAN:
                        tag = <span>LAN</span>;
                        break;
                    case DeviceType.CLOUD:
                        tag = <span>CLOUD</span>;
                        break;
                    default:
                        break;
                }

                return <Text style={ !deviceIsSupport(1) ? { color: '#939393' } : {} }>{tag} - {value}</Text>;
            }
        },
        {
            title: 'ID',
            dataIndex: 'deviceId',
            render: (value, record, index) => {
                // 登录后支持的设备
                if (deviceIsLoginAva(true, 1)) {
                    return {
                        children: <TableCellHint type="login-support" />,
                        props: {
                            colSpan: 5
                        }
                    };
                }

                // 不支持的设备
                if (!deviceIsSupport(1)) {
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
            dataIndex: 'manufacturer',
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
                if (deviceIsSupport(1)) {
                    return (
                        <div className={styles['op-item']}>
                            <Switch
                                checked={ record.disabled ? false : true }
                                onChange={(v) => onStatChange(record.deviceId, v)}
                            />
                            <Text>{ record.disabled ? 'Disabled' : 'Enabled' }</Text>
                            <DeleteOutlined
                                className={styles['del-icon']}
                                onClick={() => {
                                    confirm({
                                        title: `'${record.deviceName}' will be removed from the table temporarily.`,
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
