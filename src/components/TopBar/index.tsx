import React from 'react';
import { Button, Menu, Dropdown, Typography, Modal, message } from 'antd';
import { ReloadOutlined, CaretLeftOutlined, CheckOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import LoginTab from '@/components/LoginTab';
import styles from './index.less';
import { IconState, DeviceInfo } from '@/types';

const { Text } = Typography;
const { confirm } = Modal;

interface TopBarProps {
    isLogin: boolean;
    onRefresh: (data: DeviceInfo[]) => void;
    onLogout: () => void;
    onLogin: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isLogin, onRefresh, onLogout, onLogin }) => {
    const [iconState, setIconState] = React.useState<IconState>(IconState.DISABLE);
    const [username, setUsername] = React.useState('');
    const [loginTabVisible, setLoginTabVisible] = React.useState(false);
    const menu = (
        <Menu>
            <Menu.Item onClick={() => {
                confirm({
                    title: 'Do you want to logout?',
                    onOk() {
                        // 用户退出登录
                        onLogout();
                        setIconState(IconState.DISABLE);
                    },
                    okText: 'Yes',
                    cancelText: 'No'
                });
            }}>Logout</Menu.Item>
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

    return (
        <div className={styles['container']}>
            <div className={styles['left']}>
                {
                    isLogin
                    ?
                    <>
                        <Dropdown overlay={menu}>
                            <Text>Welcome, {username}<DownOutlined style={{ paddingLeft: '6px' }} /></Text>
                        </Dropdown>
                    </>
                    :
                    <>
                        <div>
                            <Button type="primary" size="large" onClick={() => setLoginTabVisible(true)}>LOG IN</Button>
                        </div>
                        <div className={styles['hint']}>
                            <h1><CaretLeftOutlined />Log in for more devices</h1>
                        </div>
                    </>
                }
            </div>
            <div>
                <div className={`${styles['icon-btn']} ${iconStyle}`} onClick={async () => {
                    if (iconState === IconState.ENABLE) {
                        // 刷新设备列表
                        setIconState(IconState.LOADING);
                        //const res = await getList();
                        //if (res.error !== 0) {
                            //message.error('Get device failed');
                            //setIconState(IconState.FAIL);
                        //} else {
                            //message.success('Get device success');
                            //setIconState(IconState.SUCCESS);
                            //onRefresh(res.data);
                        //}
                        setTimeout(() => {
                            setIconState(IconState.ENABLE);
                        }, 3000);
                    }
                }}> 
                    {
                        iconState === IconState.FAIL ? <CloseOutlined />
                        : iconState === IconState.SUCCESS ? <CheckOutlined />
                        : <ReloadOutlined spin={iconState === IconState.LOADING} />
                    }
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
                    }
                    if (data.email) {
                        setUsername(data.email);
                    }
                }}
            />
        </div>
    );
};

export default TopBar;
