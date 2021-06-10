// user api
import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';

const { apiPrefix } = getConfig();

/**
 * User login API
 * @param params Request params
 */
export async function login(params: {
    countryCode: string;
    phoneNumber?: string;
    email?: string;
    password: string;
    lang: string;
}) {
    return await sendHttpRequest('POST', apiPrefix + '/user/login', params);
}

/**
 * User logout API
 */
export async function logout() {
    return await sendHttpRequest('POST', apiPrefix + '/user/logout');
}

/**
 * Determine if user is login
 */
export async function isLogin() {
    return await sendHttpRequest('POST', apiPrefix + '/user/isLogin');
}

/**
 * Determine if user is auth
 */
export async function isAuth() {
    return await sendHttpRequest('GET', apiPrefix + '/user/isAuth');
}

/**
 * Get Hass token
 */
export async function getHaToken(params: {
    code: string;
    clientId: string;
}) {
    return await sendHttpRequest('POST', apiPrefix + '/user/auth', params);
}
