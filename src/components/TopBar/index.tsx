import React, { useState, useEffect } from 'react';
import { Button, Menu, Dropdown, Typography, Modal, message } from 'antd';
import { ReloadOutlined, CaretLeftOutlined, CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import LoginTab from '@/components/LoginTab';
import styles from './index.less';
import { IconState, DeviceInfo } from '@/types';
import { getDeviceList } from '@/api';
import loginIcon from '@/assets/login.png';
import { FormattedMessage, useIntl } from 'umi';

const { Text } = Typography;
const { confirm } = Modal;

interface TopBarProps {
    isLogin: boolean;
    onRefresh: (data: DeviceInfo[]) => void;
    onLogout: () => void;
    onLogin: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isLogin, onRefresh, onLogout, onLogin }) => {
    const [iconState, setIconState] = useState<IconState>(IconState.ENABLE);
    const [username, setUsername] = useState('');
    const { formatMessage } = useIntl();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [loginTabVisible, setLoginTabVisible] = useState(false);
    const menu = (
        <Menu>
            <Menu.Item
                onClick={() => {
                    setLogoutModalVisible(true);
                    // confirm({
                    //     content: (
                    //         <>
                    //             <div>Do you want to logout?</div>
                    //             <div>
                    //                 <Button>No</Button>
                    //                 <Button onClick={onLogout}>Yes</Button>
                    //             </div>
                    //         </>
                    //     ),
                    //     className: styles.logoutModal,
                    //     onOk() {
                    //         // 用户退出登录
                    //         onLogout();
                    //     },
                    //     okText: 'Yes',
                    //     cancelText: 'No',
                    // });
                }}
            >
                {formatMessage({ id: 'user.logout' })}
            </Menu.Item>
        </Menu>
    );
    let iconStyle: any;

    switch (iconState) {
        case IconState.DISABLE:
            iconStyle = styles['icon-btn-disable'];
            break;
        case IconState.ENABLE:
            iconStyle = styles['icon-btn-enable'];
            break;
        case IconState.LOADING:
            iconStyle = styles['icon-btn-loading'];
            break;
        case IconState.SUCCESS:
            iconStyle = styles['icon-btn-success'];
            break;
        case IconState.FAIL:
            iconStyle = styles['icon-btn-fail'];
            break;
        default:
            break;
    }

    useEffect(() => {
        const username = window.localStorage.getItem('username');
        if (username) {
            setUsername(username);
            onLogin();
        }
    }, []);

    return (
        <div className={styles['container']}>
            <div className={styles['left']}>
                {isLogin ? (
                    <>
                        <Dropdown overlay={menu}>
                            <Text>
                                {formatMessage({ id: 'user.welcome' }, { name: username })}
                                <DownOutlined style={{ paddingLeft: '6px' }} />
                            </Text>
                        </Dropdown>
                    </>
                ) : (
                    <>
                        <div>
                            <Button icon={<img src={loginIcon} className={styles.loginIcon} />} shape='round' type='primary' size='middle' onClick={() => setLoginTabVisible(true)}>
                                {formatMessage({ id: 'user.login' })}
                            </Button>
                        </div>
                        <div className={styles['hint']}>
                            <h1>{formatMessage({ id: 'device.info.needLogin' })}</h1>
                        </div>
                    </>
                )}
            </div>
            <div>
                <div
                    className={`${styles['icon-btn']} ${iconStyle}`}
                    onClick={async () => {
                        if (iconState === IconState.ENABLE) {
                            // 刷新设备列表
                            setIconState(IconState.LOADING);
                            const res = await getDeviceList({
                                type: 'refresh',
                            });
                            if (res.error !== 0) {
                                message.error(formatMessage({ id: 'device.get.failed' }));
                                setIconState(IconState.FAIL);
                            } else {
                                message.success(formatMessage({ id: 'device.get.success' }));
                                setIconState(IconState.SUCCESS);
                                onRefresh(res.data);
                            }
                            setTimeout(() => {
                                setIconState(IconState.ENABLE);
                            }, 3000);
                        }
                    }}
                >
                    {iconState === IconState.FAIL ? (
                        <CloseOutlined />
                    ) : iconState === IconState.SUCCESS ? (
                        <CheckOutlined />
                    ) : (
                        <ReloadOutlined spin={iconState === IconState.LOADING} />
                    )}
                </div>
            </div>
            <LoginTab
                visible={loginTabVisible}
                onClose={() => setLoginTabVisible(false)}
                onLogin={(data) => {
                    // 用户登录成功
                    onLogin();
                    setIconState(IconState.ENABLE);
                    // 有手机显示手机，没有手机显示邮箱
                    if (data.phoneNumber) {
                        setUsername(data.phoneNumber);
                        window.localStorage.setItem('username', data.phoneNumber);
                    }
                    if (data.email) {
                        setUsername(data.email);
                        window.localStorage.setItem('username', data.email);
                    }
                }}
            />
            <Modal centered width={400} visible={logoutModalVisible} destroyOnClose footer={null} onCancel={setLogoutModalVisible.bind(null, false)} className={styles.logoutModal}>
                <p className={styles.modalTitle}>{formatMessage({ id: 'user.logout.tip' })}</p>
                <div className={styles.modalBtnBox}>
                    <Button shape='round' className={styles.cancelBtn} onClick={setLogoutModalVisible.bind(null, false)}>
                        <FormattedMessage id='app.no' />
                    </Button>
                    <Button
                        shape='round'
                        className={styles.confirmBtn}
                        onClick={() => {
                            onLogout();
                            setLogoutModalVisible(false);
                        }}
                    >
                        <FormattedMessage id='app.yes' />
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default TopBar;
