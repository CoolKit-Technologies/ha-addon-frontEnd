import React from 'react';
import { Modal } from 'antd';
import styles from './base.less';
import TypeModalProps from '@/ts/type/TypeModal';

const BaseModal: React.FC<TypeModalProps> = (props) => {
    return (
        <Modal
            className={styles['base-modal']}
            width={600}
            footer={null}
            {...props}
            title={
                <div className={styles['modal-title']}>
                    {props.title}
                    {props.titleAction ? <span className={styles['modal-title-action']}>{props.titleAction}</span> : null}
                </div>
            }
        >
            {props.children}
        </Modal>
    );
};

export default BaseModal;
