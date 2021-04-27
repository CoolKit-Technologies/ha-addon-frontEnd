//  有关modal层和组件层的接口
export interface IModalProps {
    deviceId: string;
    deviceName: string;
    apikey: string;
    channels?: {
        // 通道
        name: string;
    }[];
    configure?: {
        //  通电状态
        startup: 'on' | 'off' | 'stay';
    };
    pulses?: {
        // 点动
        pulse: 'on' | 'off';
        width: number;
    };
    // sledOnline: 'on' | 'off'; // led
}
export interface IComponentProps extends IModalProps {
    style?: string;
}

export interface IChannelSetting extends IModalProps {
    index?: number;
    style?: string;
    channelName?: string;
}
