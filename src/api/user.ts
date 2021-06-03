// user api
import { sendHttpRequest, HttpResponse } from '@/utils/http';
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
}): Promise<HttpResponse> {
    return await sendHttpRequest('POST', apiPrefix + '/user/login', params);
}
