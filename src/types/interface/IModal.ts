//  有关modal层和组件层的接口
export interface IModalProps {
    deviceId: string;
    deviceName: string;
    apikey: string;
    disabled: boolean;
    unit?: string; //温度单位
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
        pulse?: 'on' | 'off';
        width?: number;
        pulseWidth?: number;
        start?: 'on' | 'off' | 'stay';
        sledOnline?: 'on' | 'off'; // led
        lock?: 0 | 1;
        startTime?: string;
        endTime?: string;
    };
    i?: number; //dualr3设备区分
}
export interface IComponentProps extends IModalProps {
    style?: string;
}

export interface IChannelSetting extends IModalProps {
    index?: number;
    style?: string;
    channelName?: string;
    updateFunction?: (obj: IPulses[]) => void;
}
interface IPulses {
    // 点动
    pulse: 'on' | 'off';
    width: number;
    outlet: number;
}
