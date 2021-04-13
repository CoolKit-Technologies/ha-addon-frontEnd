import React, { useState } from 'react';
import _ from 'lodash';
import { Table, Switch, Typography, Modal, Input } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ColumnProps } from 'antd/lib/table';
import styles from './index.less';
import { DeviceInfo, DeviceType } from '@/types';
import TableCellHint from '@/components/TableCellHint';
import { deviceIsSupport, deviceIsLoginAva } from '@/utils';
import diyIcon from '@/assets/diy.png';
import lanIcon from '@/assets/lan.png';
import cloudIcon from '@/assets/cloud.png';
import deleteIcon from '@/assets/delete.png';
import wifi0Icon from '@/assets/wifi_0.png';
import wifi1Icon from '@/assets/wifi_1.png';
import wifi2Icon from '@/assets/wifi_2.png';
import wifi3Icon from '@/assets/wifi_3.png';
import { useIntl } from 'umi';
import EditModal from '../EditModal';

const { Text } = Typography;
const { confirm } = Modal;

interface DeviceListProps {
    isLogin: boolean;
    tableData: DeviceInfo[];
    onDel: (index: number) => void;
    onStatChange: (deviceId: string, stat: boolean) => void;
    setTableData: React.Dispatch<React.SetStateAction<DeviceInfo[]>>;
}

const DeviceList: React.FC<DeviceListProps> = ({ tableData, isLogin, onDel, onStatChange, setTableData }) => {
    const [editingDeviceId, setEditingDeviceId] = useState<string>('');
    const [editingDeviceName, setEditingDeviceName] = useState<string>('');
    const { formatMessage } = useIntl();
    const renderContent = (value: any, record: DeviceInfo) => {
        if (deviceIsSupport(record)) {
            return <Text>{value}</Text>;
        } else {
            return {
                children: '',
                props: {
                    colSpan: 0,
                },
            };
        }
    };
    const columns: ColumnProps<DeviceInfo>[] = [
        {
            title: formatMessage({ id: 'device.name' }),
            dataIndex: 'deviceName',
            render: (value, record, index) => {
                let tag;

                switch (record.type) {
                    case DeviceType.DIY:
                        tag = diyIcon;
                        break;
                    case DeviceType.LAN:
                        tag = lanIcon;
                        break;
                    case DeviceType.CLOUD:
                        tag = cloudIcon;
                        break;
                    default:
                        break;
                }

                let signal;
                if (record.rssi) {
                    if (record.rssi > -100) {
                        signal = wifi0Icon;
                    }
                    if (record.rssi > -80) {
                        signal = wifi1Icon;
                    }
                    if (record.rssi > -60) {
                        signal = wifi2Icon;
                    }
                    if (record.rssi > -55) {
                        signal = wifi3Icon;
                    }
                }

                return (
                    <Text className={styles.dataItem} style={!deviceIsSupport(record) ? { color: '#939393' } : {}}>
                        {signal && <img className={styles.signalIcon} src={signal} />}
                        <img className={styles.icon} src={tag} />
                        {value}
                    </Text>
                );
            },
        },
        {
            title: formatMessage({ id: 'device.id' }),
            dataIndex: 'deviceId',
            render: (value, record, index) => {
                // 不是你的设备
                if (isLogin && !deviceIsSupport(record)) {
                    return {
                        children: <TableCellHint type='not-your-device' />,
                        props: {
                            colSpan: 5,
                        },
                    };
                }

                // 登录后支持的设备
                if (deviceIsLoginAva(isLogin, record.type)) {
                    return {
                        children: <TableCellHint type='login-support' />,
                        props: {
                            colSpan: 5,
                        },
                    };
                }

                // 不支持的设备
                if (!deviceIsSupport(record)) {
                    return {
                        children: <TableCellHint type='unsupport' />,
                        props: {
                            colSpan: 5,
                        },
                    };
                }
                return <Text>{value}</Text>;
            },
        },
        {
            title: formatMessage({ id: 'device.ip' }),
            dataIndex: 'ip',
            render: renderContent,
        },
        {
            title: formatMessage({ id: 'device.vendor' }),
            dataIndex: 'manufacturer',
            render: renderContent,
        },
        {
            title: formatMessage({ id: 'device.model' }),
            dataIndex: 'model',
            render: renderContent,
        },
        {
            title: formatMessage({ id: 'device.operation' }),
            width: 170,
            render: (value, record, index) => {
                if (deviceIsSupport(record)) {
                    return (
                        <div className={styles['op-item']}>
                            <div>
                                <Switch checked={record.disabled ? false : true} onChange={(v) => onStatChange(record.deviceId, v)} />
                                <div>{record.disabled ? formatMessage({ id: 'device.disabled' }) : formatMessage({ id: 'device.enable' })}</div>
                            </div>
                            <EditOutlined
                                className={styles['edit-icon']}
                                onClick={() => {
                                    setEditingDeviceId(record.deviceId);
                                    setEditingDeviceName(record.deviceName!);
                                }}
                            />
                            <DeleteOutlined
                                className={styles['del-icon']}
                                onClick={() => {
                                    confirm({
                                        title: formatMessage({ id: 'device.remove' }, { name: record.deviceName || record.deviceId }),
                                        onOk() {
                                            onDel(index);
                                        },
                                        okText: formatMessage({ id: 'app.ok' }),
                                        cancelText: formatMessage({ id: 'app.cancel' }),
                                    });
                                }}
                            />
                        </div>
                    );
                } else {
                    return {
                        children: '',
                        props: {
                            colSpan: 0,
                        },
                    };
                }
            },
        },
    ];

    return (
        <div className={styles['container']}>
            <Table
                columns={columns}
                dataSource={tableData.sort((a, b) => {
                    if (deviceIsSupport(b)) {
                        return 1;
                    }
                    return -1;
                })}
                pagination={false}
                bordered
            />
            <EditModal
                id={editingDeviceId}
                visible={!!editingDeviceId}
                onCancel={() => {
                    setEditingDeviceId('');
                }}
                onOk={(newName) => {
                    const copy = _.cloneDeep(tableData);
                    for (let item of copy) {
                        if (item.deviceId === editingDeviceId) {
                            item.deviceName = newName;
                            break;
                        }
                    }
                    setTableData(copy);
                    setEditingDeviceId('');
                }}
                initialValue={editingDeviceName}
            />
        </div>
    );
};

export default DeviceList;
