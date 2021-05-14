import { ModalProps, SwitchProps } from 'antd';
import { ReactNode } from 'react';
import EModalType from '../Enum/EModalType';
import { IModalProps } from '../../types/interface/IModal';
type TypeModalProps = ModalProps & { titleAction?: ReactNode; type?: EModalType | null; tags?: Array<string>; device: IModalProps };
export default TypeModalProps;
