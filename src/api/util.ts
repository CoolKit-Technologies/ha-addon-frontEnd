// user api
import { sendHttpRequest } from '@/utils/http';
import { getConfig } from '@/utils/config';

const { apiPrefix } = getConfig();

/**
 * sync lovelace card to HA
 */
export async function syncLovelaceCard() {
    return await sendHttpRequest('POST', apiPrefix + '/util/syncLovelaceCard');
}
