import axios from 'axios';

import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';

export interface Content {
    description: string;
    link: string;
    pageid: string;
    thumbnail: string;
    title: string;
}

const BASE_URL = 'https://appcms.coolkit.cn/appcms-service/v2/batch.json';
const PROJECT = 'home-assistant';
const CATEGORY = '[%22top%22,%22push%22,%22thirdPlatform%22,%22ewelinkUserAgreement%22,%22thirdPlatformAgreement%22]';

const { apiPrefix } = getConfig();

/**
 * Get content data
 * @returns Content data
 */
export async function getContent(v: string) {
    // cn, zh-cn; eu, en-us
    const region = v === 'en' ? 'eu' : 'cn';
    const locale = v === 'en' ? 'en-us' : 'zh-cn';
    let url = BASE_URL + '?'
        + 'project=' + PROJECT + '&'
        + 'region=' + region + '&'
        + 'locale=' + locale + '&'
        + 'category=' + CATEGORY;

    try {
        console.log('url-----',url)
        const res = await axios.get(url);
        if (res.status === 200 && res.data.err === 0) {
            return {
                error: 0,
                msg: 'success',
                data: res.data.data
            };
        } else {
            console.error('getContent() failed');
            return {
                error: -1,
                msg: 'failed',
                data: {}
            };
        }
    } catch (e) {
        console.error('getContent() error');
        return {
            error: -1,
            msg: 'error occur',
            data: {}
        };
    }
}

/**
 * Get Hass locale
 * @returns Hass locale
 */
export async function getLocale() {
    return await sendHttpRequest('GET', apiPrefix + '/language');
}
