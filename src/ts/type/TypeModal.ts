import { ModalProps, SwitchProps } from 'antd';
import { ReactNode } from 'react';
import EModalType from '../Enum/EModalType';
type TypeModalProps = ModalProps & { titleAction?: ReactNode; type?: EModalType | null; tags?: Array<string>};
export default TypeModalProps;
