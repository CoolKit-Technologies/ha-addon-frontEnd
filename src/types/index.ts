// 刷新按钮图标的状态
export enum IconState {
    DISABLE,    // 不可用
    ENABLE,     // 可用
    LOADING,    // 加载中
    SUCCESS,    // 成功
    FAIL        // 失败
}

// 用户信息
export interface UserInfo {
    phoneNumber?: string;
    email?: string;
}

// HTTP 请求方法
export type HttpMethod = 'GET' | 'POST';

// HTTP 请求响应
export interface HttpResponse {
    error: number;
    msg: string;
    data: any;
}
