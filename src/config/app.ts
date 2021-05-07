const env = process.env.NODE_ENV;

let sseUrl = 'api/stream';
let baseURL = '';

if (env === 'development') {
    sseUrl = 'http://192.168.1.115:3000/api/stream';
    baseURL = 'http://192.168.1.115:3000';
}

export { sseUrl, baseURL };
