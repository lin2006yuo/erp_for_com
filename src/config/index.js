/**
 * Created by wuchuguang on 16-11-12.
 */

let config = {};
const hostname = url('hostname');
switch (process.env.NODE_ENV){
    case 'release':
        config = {
            // webSocket:`ws://${hostname}:9502`,
            webSocket:`ws://172.20.0.12:9502`,
            apiHost:`http://${hostname}:8081/`,
            host:`http://${hostname}/`,
        };
        break;
    case 'production':
        config = {
            webSocket:`ws://${hostname}:9502`,
            apiHost:`http://${hostname}:8081/`,
            host:'http://localhost:8081/',
        };
        break;
    case 'warehouse':
        config = {
            webSocket:`ws://${hostname}:9502`,
            apiHost:`http://14.118.130.18:1713/`,
            host:'http://localhost:8081/',
        };
        break;
    case 'other':
        config = {
            webSocket:`ws://${hostname}:9502`,
            apiHost:`http://14.118.130.18:1715/`,
            host:'http://localhost:8081/',
        };
        break;
    default:
        config = {
            webSocket:'ws://172.18.8.240:9502',
            apiHost:'http://172.18.8.242:80/',
            host:'http://localhost:8081/',
        };
        break;
}
const hostport = `${url('hostname')}:${url('port')}`;
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
        config.apiHost = 'http://www.zrzsoft.com:8081/';
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
    default:

        config.apiHost = 'http://172.18.8.242/';
}
config.webSocket = 'http://172.20.0.12:9502/';
window.config = config;
export default config;
