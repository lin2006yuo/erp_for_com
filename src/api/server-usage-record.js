import {http} from '../lib/http-plus';

//获取服务器使用记录列表
export const url_server_network = "get|server-network";
export const api_server_network = function (data) {
    return http(url_server_network,data)
};