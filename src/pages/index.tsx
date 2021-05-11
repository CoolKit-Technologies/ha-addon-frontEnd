import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { connect, Dispatch, useIntl } from 'umi';
import { Card, Button, Menu, Dropdown } from 'antd';
import { QuestionOutlined, ExportOutlined, MoreOutlined, UserOutlined, RedoOutlined } from '@ant-design/icons';

import { login, getDeviceList, logout, getHaToken, getCmsContent, getLanguage as getLanguageApi } from '@/api';
import { isDualR3, isIW100Device, isPowerDet, isSocketSwitchDevice, isTempDevice, deviceTypeMap, getMittEmitter, saveTmpDeviceList, getTmpDeviceList, clearMittEmitter } from '@/utils';
import { DeviceInfo } from '@/types/device';
import SocketSwitchCard from '@/components/DeviceCard/SocketSwitchCard';
import PowerDetCard from '@/components/DeviceCard/PowerDetCard';
import TempCard from '@/components/DeviceCard/TempCard';
import DualR3Card from '@/components/DeviceCard/DualR3Card';
import IW100Card from '@/components/DeviceCard/IW100Card';
import UnsupportedCard from '@/components/DeviceCard/UnsupportedCard';
import LoginTab from '@/components/LoginTab';
import styles from './index.less';
import { sseUrl } from '@/config/app';

const { Meta } = Card;
const emitter = getMittEmitter();

const App: React.FC<{
    language: string;
    getLanguage: Function;
    deviceList: DeviceInfo[];
    saveDeviceList: Function;
    dispatch: Dispatch;
    isLogin: boolean;
    checkUserLogin: Function;
}> = ({ isLogin, checkUserLogin, getLanguage, deviceList, saveDeviceList, dispatch, language }) => {
    const [loginTabVisible, setLoginTabVisible] = useState(false);
    const [cmsContent, setCmsContent] = useState<{ pageid: string; link: string; thumbnail: string; title: string; description: string }[]>([]);
    const { formatMessage } = useIntl();
    const [refreshing, setRefreshing] = useState(false);

    // 保存设备数据
    const saveDeviceData = (v: any) => {
        saveTmpDeviceList(v);
        saveDeviceList(v);
    };

    const handleMessage = (e: any) => {
        const newList = JSON.parse(e.data);
        const oldList = getTmpDeviceList();
        console.log('sse -> deviceList', newList);
        console.log('sse -> tpm device list', oldList);
        console.log('sse -> emitter', emitter);
        if (newList.length !== oldList.length) {        // 设备数量发生了变化（登录／登出）
            console.log('device num change');
            saveDeviceData(newList);
        } else {                                        // 设备状态发生了变化
            console.log('device stat change');
            // emitter.emit('data-update', newList);
            for (let i = 0; i < newList.length; i++) {
                if (!_.isEqual(newList[i], oldList[i])) {
                    saveTmpDeviceList(newList);
                    emitter.emit(`data-update-${newList[i].deviceId}`, newList[i]);
                }
            }
        }
    };

    useEffect(() => {
        getLanguageApi().then((res) => {
            // getCmsContent(res.data).then((res) => {
                // setCmsContent([res.data.top, ...res.data.push]);
            // });
        });
    }, [language]);

    useEffect(() => {
        let source: EventSource;
        new Promise((resolve) => {
            let code = '';
            let index = 0;
            if ((index = window.location.search.indexOf('code=')) !== -1) {
                code = window.location.search.slice(index + 5);
                getHaToken({
                    code,
                    clientId: window.location.origin,
                }).then(resolve);
            } else {
                resolve(0);
            }
        }).then(() => {
            checkUserLogin();
            getDeviceList({ type: 'init' }).then((res) => {
                saveDeviceData(res.data);
            });
            getLanguage();
            const source = new EventSource(sseUrl);
            source.addEventListener('open', () => {
                console.log('连接建立成功');
            });
            source.addEventListener('message', handleMessage);
        });

        return () => {
            if (source) {
                source.close();
            }
        };
    }, []);

    // 下拉菜单
    const menu = (
        <Menu>
            {isLogin ? (
                <Menu.Item className={styles['drop-down-item']}>
                    <ExportOutlined style={{ fontSize: '16px' }} />
                    <div
                        style={{ fontSize: '16px', padding: '0 12px' }}
                        onClick={async () => {
                            await logout();
                            checkUserLogin();
                        }}
                    >
                        {formatMessage({ id: 'header.signout' })}
                    </div>
                </Menu.Item>
            ) : null}
            <Menu.Item className={styles['drop-down-item']}>
                <QuestionOutlined style={{ fontSize: '16px' }} />
                <div style={{ fontSize: '16px', padding: '0 12px' }} onClick={() => {}}>
                    {formatMessage({ id: 'header.feedback' })}
                </div>
            </Menu.Item>
        </Menu>
    );

    // 处理设备列表数据
    const listCopy = _.cloneDeep(deviceList);
    const col1 = [];
    const col2 = [];
    const col3 = [];
    for (let i = 0; i < listCopy.length; i++) {
        if (listCopy[i].uiid === 126) {
            // 是否为 Dual R3
            const item1 = _.cloneDeep(listCopy[i]);
            const item2 = _.cloneDeep(listCopy[i]);
            item1.xindex = 0;
            item2.xindex = 1;
            listCopy.splice(i, 1, item1, item2);
            i++;
        }
    }
    for (let i = 0; i < listCopy.length; i++) {
        if (i % 3 === 0) col1.push(listCopy[i]);
        else if ((i - 1) % 3 === 0) col2.push(listCopy[i]);
        else if ((i - 2) % 3 === 0) col3.push(listCopy[i]);
    }

    // 卡片渲染
    const renderDeviceCard = (data: DeviceInfo) => {
        const { uiid, deviceId, deviceName, online, apikey, model, params, disabled } = data;
        const key = deviceId;
        const type = deviceTypeMap(data.type);
        const name = deviceName || deviceId;
        const deviceData = {
            deviceId,
            online,
            type,
            name,
            apikey,
            model,
            params,
            disabled,
            uiid,
        };
        if (isDualR3(uiid)) {
            const i = data.xindex;
            const voltage = data.params[`voltage_0${i}`] / 100 + 'V';
            const current = data.params[`current_0${i}`] / 100 + 'A';
            const actPow = data.params[`actPow_0${i}`] / 100 + 'W';
            const reactPow = data.params[`reactPow_0${i}`] / 100 + 'W';
            const appPow = data.params[`apparentPow_0${i}`] / 100 + 'W';
            const ballData = [
                { title: formatMessage({ id: 'device.card.real.power' }), content: actPow },
                { title: formatMessage({ id: 'device.card.reactive.power' }), content: reactPow },
                { title: formatMessage({ id: 'device.card.apparent.power' }), content: appPow },
            ];
            return (
                <DualR3Card
                    key={deviceId}
                    deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }}
                    channel={{ stat: data.params.switches[i].switch, name: data.tags ? data.tags[i] : formatMessage({ id: 'device.card.channel.multi' }, { i: i + 1 }) }}
                    voltage={voltage}
                    current={current}
                    ballData={ballData}
                    i={i}
                />
            );
        } else if (isIW100Device(uiid)) {
            const { power, voltage, current } = data.params;
            const ballData = [
                { title: formatMessage({ id: 'device.card.power' }), content: `${power}W` },
                { title: formatMessage({ id: 'device.card.voltage' }), content: `${voltage}V` },
                { title: formatMessage({ id: 'device.card.current' }), content: `${current}A` },
            ];
            return (
                <IW100Card
                    key={key}
                    deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }}
                    channel={{ stat: data.params.switch, name: formatMessage({ id: 'device.card.channel.single' }) }}
                    ballData={ballData}
                />
            );
        } else if (isPowerDet(uiid)) {
            return (
                <PowerDetCard
                    key={deviceId}
                    deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }}
                    channel={{ stat: data.params.switch, name: formatMessage({ id: 'device.card.channel.single' }) }}
                    power={`${data.params.power}W`}
                />
            );
        } else if (isSocketSwitchDevice(uiid)) {
            return <SocketSwitchCard key={key} data={data} />;
        } else if (isTempDevice(uiid)) {
            return (
                <TempCard
                    key={deviceId}
                    deviceData={{ fwVersion: data.params.fwVersion, ...deviceData }}
                    channel={{ stat: data.params.switch, name: formatMessage({ id: 'device.card.channel.single' }) }}
                    unit={data.unit}
                    mode={data.params.deviceType}
                    humi={data.params.currentHumidity}
                    temp={data.params.currentTemperature}
                />
            );
        } else {
            return <UnsupportedCard key={key} data={data} />;
        }
    };

    return (
        <div>
            <header className={styles['header']}>
                <div className={styles['title']}>
                    <h1>eWeLink Smart Home</h1>
                </div>
                <div className='control'>
                    {!isLogin ? (
                        <Button
                            size='large'
                            shape='round'
                            icon={<UserOutlined style={{ fill: '#03a9f4' }} />}
                            className={styles['signin-btn']}
                            onClick={() => setLoginTabVisible(true)}
                        >
                            {formatMessage({ id: 'header.signin' })}
                        </Button>
                    ) : null}
                    <Button
                        shape='circle'
                        icon={<RedoOutlined spin={refreshing} />}
                        className={styles['refresh-btn']}
                        size='large'
                        type='text'
                        onClick={async () => {
                            setRefreshing(true);
                            const res = await getDeviceList({ type: 'refresh' });
                            setRefreshing(false);
                            saveDeviceData(res.data);
                        }}
                    />
                    <Dropdown overlay={menu}>
                        <Button className={styles['menu-btn']} type='text' shape='circle' icon={<MoreOutlined />} size='large' />
                    </Dropdown>
                </div>
            </header>

            <div className={styles['main-container']}>
                <div className={styles['ad-box']}>
                    {cmsContent.map((item) => (
                        <Card
                            key={item.pageid}
                            hoverable
                            cover={
                                <img
                                    alt='example'
                                    src={item.thumbnail}
                                    height={160}
                                    onClick={() => {
                                        window.open(item.link);
                                    }}
                                />
                            }
                        >
                            <Meta title={item.title} />
                        </Card>
                    ))}
                </div>
                <div className={styles['device-box']}>
                    <div className={styles['device-col']}>{col1 ? col1.map((item) => renderDeviceCard(item)) : null}</div>
                    <div className={styles['device-col']}>{col2 ? col2.map((item) => renderDeviceCard(item)) : null}</div>
                    <div className={styles['device-col']}>{col3 ? col3.map((item) => renderDeviceCard(item)) : null}</div>
                </div>
            </div>

            <LoginTab
                visible={loginTabVisible}
                onClose={() => setLoginTabVisible(false)}
                onLogin={() => {
                    setLoginTabVisible(false);
                    checkUserLogin();
                }}
            />
        </div>
    );
};

export default connect(
    ({ global }: any) => ({
        language: global.language,
        deviceList: global.deviceList,
        isLogin: global.isLogin,
    }),
    (dispatch) => ({
        getLanguage: () =>
            dispatch({
                type: 'global/getLanguage',
            }),
        checkUserLogin: () =>
            dispatch({
                type: 'global/checkUserLogin',
            }),
        saveDeviceList: (deviceList: DeviceInfo[]) =>
            dispatch({
                type: 'global/save',
                payload: {
                    deviceList,
                },
            }),
        dispatch,
    })
)(App);
