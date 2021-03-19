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

    SUPPORT,        // 支持的设备
    UNSUPPORT,      // 不支持的设备
    LOGIN_SUPPORT   // 登录后支持
}

// 用户信息
export interface UserInfo {
    username: string;
}

// 列表的设备信息
export interface DeviceInfo {
    key: string;
    name: string;
    id: string;
    ip: string;
    vendor: string;
    model: string;
    enabled: boolean;
    type: DeviceType;
}

// HTTP 请求方法
export type HttpMethod = 'GET' | 'POST';

// HTTP 请求响应
export interface HttpResponse {
    error: number;
    msg: string;
    data: any;
}
