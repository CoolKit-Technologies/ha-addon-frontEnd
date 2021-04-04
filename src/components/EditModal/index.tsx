import React, { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { useIntl } from 'umi';
import { updateDeviceName } from '@/api';

type TypeProps = {
    id: string;
    visible: boolean;
    initialValue: string;
    onCancel: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onOk: (newName: string) => void;
};

const EditModal: React.FC<TypeProps> = ({ id, visible, initialValue, onCancel, onOk }) => {
    const { formatMessage } = useIntl();
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        console.log('Jia ~ file: index.tsx ~ line 8 ~ initialValue', initialValue);
        setValue(initialValue);
    }, [visible]);

    return (
        <Modal
            title={'修改设备名称'}
            onCancel={onCancel}
            onOk={async () => {
                const data = await updateDeviceName(id, value);
                console.log('Jia ~ file: index.tsx ~ line 29 ~ onOk={ ~ data', data);
                onOk && onOk(value);
            }}
            visible={visible}
            okText={formatMessage({ id: 'app.ok' })}
            cancelText={formatMessage({ id: 'app.cancel' })}
        >
            <Input
                value={value}
                onChange={(e) => {
                    setValue(e.currentTarget.value);
                }}
            />
        </Modal>
    );
};
export default EditModal;
