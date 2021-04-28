//  有关modal层和组件层的接口
export interface IModalProps {
    deviceId: string;
    deviceName: string;
    apikey: string;
    disabled: boolean;
    channels?: {
        // 通道
        name: string;
    }[];
    params?: {
        configure?: {
            //  通电状态
            startup: 'on' | 'off' | 'stay';
        }[];
        pulses?: {
            // 点动
            pulse: 'on' | 'off';
            width: number;
            outlet: number;
        }[];
        pulse: 'on' | 'off';
        start: 'on' | 'off' | 'stay';
        sledOnline?: 'on' | 'off'; // led
        lock?: 0 | 1;
        unit?: string;
        startTime?: string;
        endTime?: string;
    };
}
export interface IComponentProps extends IModalProps {
    style?: string;
}

export interface IChannelSetting extends IModalProps {
    index?: number;
    style?: string;
    channelName?: string;
}
