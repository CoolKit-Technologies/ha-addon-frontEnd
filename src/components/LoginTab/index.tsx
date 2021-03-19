import React from 'react';
import { Modal, Input, Button, Typography, Select, message } from 'antd';
import { UserOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { login } from '../../api';
import { UserInfo } from '../../types';

const { Text, Link } = Typography;
const { Option } = Select;

interface LoginTabProps {
    visible: boolean;       // 登录弹框是否可见
    onClose: () => void;    // 关闭弹框
    onLogin: (data: UserInfo) => void;    // 用户登录成功
}

const LoginTab: React.FC<LoginTabProps> = ({ visible, onClose, onLogin }) => {
    const [loading, setLoading] = React.useState(false);
    const [country, setCountry] = React.useState('');
    const [account, setAccount] = React.useState('');
    const [password, setPassword] = React.useState('');

    return (
        <Modal
            title="Login"
            visible={visible}
            footer={null}
            maskClosable={false}
            onCancel={() => onClose()}
            width="500px"
            destroyOnClose
        >
            <div className={styles['wrapper']}>
                <Select
                    style={{ width: '100%' }}
                    className={styles['form-cntl']}
                    placeholder="Country"
                    showSearch
                    onChange={(e) => setCountry(e as string)}
                >
                    <Option value="+1">+1</Option>
                    <Option value="+23">+23</Option>
                    <Option value="+86">+86</Option>
                </Select>
                <Input
                    className={styles['form-cntl']}
                    placeholder="Phone number / Email"
                    prefix={<UserOutlined style={{ paddingRight: '5px' }} />}
                    onChange={(e) => setAccount(e.target.value)}
                    allowClear
                />
                <Input.Password
                    className={styles['form-cntl']}
                    placeholder="Password"
                    prefix={<LockOutlined style={{ paddingRight: '5px' }} />}
                    onChange={(e) => setPassword(e.target.value)}
                    allowClear
                />
                <Button
                    type="primary"
                    onClick={async () => {
                        setLoading(true);
                        const res = await login({
                            country,
                            account,
                            password
                        });
                        setLoading(false);
                        if (res.error !== 0) {
                            message.error('Login failed');
                        } else {
                            message.success('Login success');
                            setTimeout(() => {
                                onClose();
                                onLogin(res.data);
                            }, 1000);
                        }
                    }}
                    loading={loading}
                    block
                >LOG IN</Button>
            </div>
            <div className={styles['hint-text']}>
                <Text>No account. <Link target="_blank" href="https://bing.com">Download eWeLink App</Link> now.</Text>
            </div>
        </Modal>
    );
};

export default LoginTab;
