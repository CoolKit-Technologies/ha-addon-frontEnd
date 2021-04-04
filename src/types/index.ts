// 刷新按钮图标的状态
export enum IconState {
    DISABLE,    // 不可用
    ENABLE,     // 可用
    LOADING,    // 加载中
    SUCCESS,    // 成功
    FAIL        // 失败
}

// 设备类型
export enum DeviceType {
    // real
    DIY = 1,      // DIY 设备
    LAN = 2,      // 局域网设备
    CLOUD = 4,    // 云设备
}

// 用户信息
export interface UserInfo {
    phoneNumber?: string;
    email?: string;
}

// 列表的设备信息
export interface DeviceInfo {
    key: string;            // 表格的 key
    deviceName?: string;    // 设备的名称
    deviceId: string;       // 设备 ID
    ip?: string;            // DIY 设备的 IP
    manufacturer?: string;  // 设备厂商
    model?: string;         // 设备型号
    disabled: boolean;      // 设备是否禁用
    type: DeviceType;       // 设备类型 - type 等于 2 且没有登录；登录了但 uiid 不在范围内
    uiid?: number;          // 设备分类
    rssi?: number;          // 信号强度
}

// HTTP 请求方法
export type HttpMethod = 'GET' | 'POST';

// HTTP 请求响应
export interface HttpResponse {
    error: number;
    msg: string;
    data: any;
}
