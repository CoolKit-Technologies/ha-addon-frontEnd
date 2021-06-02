import axios from 'axios';

const BASE_URL = 'https://appcms.coolkit.cn/appcms-service/v2/batch.json';
const PROJECT = 'home-assistant';
const CATEGORY = '[%22top%22,%22push%22]';

export async function getContent() {
    // cn, zh-cn; eu, en-us
    let url = BASE_URL + '?'
        + 'project=' + PROJECT + '&'
        + 'region=' + 'eu' + '&'
        + 'locale=' + 'en-us' + '&'
        + 'category=' + CATEGORY;

    // await axios.get(url);
}
