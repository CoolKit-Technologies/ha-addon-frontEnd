import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Typography, Select, message } from 'antd';
import { UserOutlined, EnvironmentOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';
import { login } from '@/api';
import { UserInfo } from '@/types';
import logoPng from '@/assets/logo.png';
import regionMapEn from '@/locales/regionMap_en';
import regionMapZh from '@/locales/regionMap_zh';
import { connect, FormattedMessage, useIntl } from 'umi';
const { Text, Link } = Typography;
const { Option } = Select;

interface LoginTabProps {
    visible: boolean; // 登录弹框是否可见
    onClose: () => void; // 关闭弹框
    onLogin: (data: UserInfo) => void; // 用户登录成功
    language: string;
}

const LoginTab: React.FC<LoginTabProps> = ({ visible, onClose, onLogin, language }) => {
    const [loading, setLoading] = useState(false);
    const [country, setCountry] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [languageList, setLanguageList] = useState(regionMapEn);
    const { formatMessage } = useIntl();
    // 验证表单，通过返回 true；否则返回 false
    const verify = (): boolean => {
        if (country === '') {
            message.warning('Please select your country');
            return false;
        }

        if (account === '') {
            message.warning('Please input your phone number or email');
            return false;
        }

        if (password === '') {
            message.warning('Please input your password');
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (language === 'zh') {
            setLanguageList(regionMapZh);
        } else {
            setLanguageList(regionMapEn);
        }
    }, [language]);

    return (
        <Modal visible={visible} footer={null} maskClosable={false} onCancel={() => onClose()} width='500px' className={styles.loginModal} destroyOnClose>
            <div className={styles['wrapper']}>
                <div className={styles.modalHeader}>
                    <img src={logoPng} alt='' />
                    <div>{formatMessage({ id: 'app.slogan' })}</div>
                </div>
                <Select
                    style={{ width: '100%' }}
                    className={styles['form-cntl']}
                    placeholder={formatMessage({ id: 'user.login.country.placeholder' })}
                    showSearch
                    filterOption={(inputValue, option) => {
                        const tmp = inputValue.toLocaleLowerCase();
                        if (~option?.value.indexOf(tmp) || ~(option?.desc as string).toLocaleLowerCase().indexOf(tmp)) {
                            return true;
                        }
                        return false;
                    }}
                    onChange={(e) => {
                        setCountry(e as string);
                    }}
                >
                    {languageList.map((item) => {
                        const [val, desc] = Object.entries(item)[0];
                        return (
                            <Option key={val} desc={desc} value={val}>
                                {desc} ({val})
                            </Option>
                        );
                    })}
                </Select>
                <Input
                    className={styles['form-cntl']}
                    placeholder={formatMessage({ id: 'user.login.username.placeholder' })}
                    prefix={<UserOutlined style={{ paddingRight: '5px' }} />}
                    onChange={(e) => setAccount(e.target.value)}
                    allowClear
                />
                <Input.Password
                    className={styles['form-cntl']}
                    placeholder={formatMessage({ id: 'user.login.password.placeholder' })}
                    prefix={<LockOutlined style={{ paddingRight: '5px' }} />}
                    onChange={(e) => setPassword(e.target.value)}
                    allowClear
                />
                <Button
                    type='primary'
                    onClick={async () => {
                        // 验证后登录
                        if (!verify()) return;

                        setLoading(true);
                        const params: any = {
                            lang: 'en',
                            countryCode: country,
                            password,
                        };
                        if (account.indexOf('@') === -1) {
                            params.phoneNumber = `${country}${account.trim()}`;
                        } else {
                            params.email = account.trim();
                        }

                        const res = await login(params);
                        setLoading(false);
                        if (res.error !== 0) {
                            message.error(formatMessage({ id: 'user.login.failed' }, { msg: res.msg }));
                        } else {
                            message.success(formatMessage({ id: 'user.login.success' }));
                            setTimeout(() => {
                                onClose();
                                onLogin(res.data.user);
                            }, 1000);
                        }
                    }}
                    loading={loading}
                    block
                >
                    {formatMessage({ id: 'user.login' })}
                </Button>
            </div>
            <div className={styles['hint-text']}>
                <Text>
                    <FormattedMessage id='app.noAcount' />{' '}
                    <Link target='_blank' href='https://bing.com'>
                        <FormattedMessage id='app.download' />
                    </Link>{' '}
                    <FormattedMessage id='app.now' />
                </Text>
            </div>
        </Modal>
    );
};

export default connect(({ global }: any) => ({
    language: global.language,
}))(LoginTab);
