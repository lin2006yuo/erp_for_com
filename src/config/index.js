/**
 * Created by wuchuguang on 16-11-12.
 */

let config = {};
switch (process.env.NODE_ENV){
    case 'release':
        config = {
            webSocket:`ws://172.20.0.12:9502`,
            apiHost:`https://api.rondaful.com/`,
            host:`http://api.rondaful.com/`,
        };
        break;
    default:
        config = {
            webSocket:'ws://172.18.8.240:9502',
            // apiHost:'http://172.18.8.242:80/',
            apiHost:'http://172.18.8.245:81/',
            host:'http://localhost:8081/',
        };
        break;
}
const hostport = `${url('hostname')}:${url('port')}`;
config.webSocket = 'ws://172.20.0.12:9502/';
switch (hostport) {
    case '14.118.130.18:83':
        config.apiHost = 'http://14.118.130.18:1716/';
        break;
    case '14.118.130.18:82':
        config.apiHost = 'http://14.118.130.18:1715/';
        break;
    case '14.118.130.18:81':
        config.apiHost = 'http://14.118.130.18:1714/';
        break;
    case '14.118.130.18:80':
        config.apiHost = 'http://14.118.130.18:1713/';
        break;
    case 'www.zrzsoft.com:80':
    case 'oms.rondaful.com:80':
        config.apiHost = 'http://api.rondaful.com:8081/';//http://www.zrzsoft.com:8081/';
        break;
    case '172.20.0.11:80':
        config.apiHost = 'http://172.20.0.11:8081/';
        config.webSocket = 'http://172.20.0.22:9502/';
        break;
    case 'test.rondaful.com:443':
        config.apiHost = 'https://office.rondaful.com/';
        config.host = 'https://localhost:8081/';
        break;
    case '172.18.8.245:80':
        config.apiHost = 'http://172.18.8.245:81/';
        config.host = 'http://localhost:8081/';
        break;
    case 'oms.rondaful.com:443':
        config.apiHost = 'https://api.rondaful.com/';
        config.host = 'https://localhost:8081/';
        config.webSocket = 'wss://oms.rondaful.com:9502/';
        break;
    default:
        config.apiHost = 'http://172.18.8.242/';
        // config.apiHost = 'http://172.18.8.241:81/';
        // config.apiHost = 'http://172.18.8.245:81/';
}
window.config = config;
export default config;
