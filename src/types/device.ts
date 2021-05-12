// 设备类型
// lan - 局域网设备
// diy - DIY 设备
// cloud - 云设备
export type DeviceType = 'lan' | 'diy' | 'cloud';

// 列表的设备信息
export interface DeviceInfo {
    key: string;            // 表格的 key
    deviceName?: string;    // 设备的名称
    deviceId: string;       // 设备 ID
    ip?: string;            // DIY 设备的 IP
    manufacturer?: string;  // 设备厂商
    model: string;          // 设备型号
    disabled: boolean;      // 设备是否禁用
    type: number;           // 设备类型
    uiid: number;           // 设备分类
    rssi?: number;          // 信号强度
    online: boolean;        // 是否在线
    params: any;            // 设备参数
    tags: any;              // 通道名
    apikey: string;         // 设备的 apikey
    xindex: number;         // 给 Dual R3 排序用
    unit: string;           // 恒温恒湿设备的温度单位
}

export interface Channel {
    stat: 'on' | 'off';
    name: string;
}
