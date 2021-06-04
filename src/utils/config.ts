// config utils

// Determine env
function isProdEnv() {
    return process.env.NODE_ENV === 'production';
}

/**
 * Get the config object
 * @returns Config object
 */
export function getConfig() {
    const host = process.env.VUE_APP_NODE_SERVER;

    if (isProdEnv()) {
        return {
            baseUrl: '',
            sseUrl: 'api/stream',
            timeout: 10000,
            downloadAppUrl: 'http://www.ewelink.cc/',
            apiPrefix: 'api',
            feedbackUrl: 'https://t.me/joinchat/RkXAHh47kmI2Y2Nl',
        };
    } else {
        return {
            baseUrl: host,
            sseUrl: host + '/api/stream',
            timeout: 2000,
            downloadAppUrl: 'http://www.ewelink.cc/',
            apiPrefix: 'api',
            feedbackUrl: 'https://t.me/joinchat/RkXAHh47kmI2Y2Nl',
        };
    }
}
