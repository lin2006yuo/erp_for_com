/**
 * Created by Administrator on 2017/11/1.
 */
import {http} from '../lib/http-plus';

export const url_get_channel = "get|orders/channel";
export const api_get_channel = function () {
    return http(url_get_channel);
};

//获取服务器列表
export const url_get_server = "get|servers";
export const api_get_server = function (data) {
    return http(Url2(url_get_server), data);
};

//获取买手列表
export const url_get_buyers = "get|local-buyers";
export const api_get_buyers = function (data) {
    return http(Url2(url_get_buyers), data);
};

//删除买手
export const url_delete_buyers = "delete|local-buyers/:id";
export const api_delete_buyers = function (id) {
    return http(Url2(url_delete_buyers, {id:id}));
};

//批量删除买手
export const url_batch_delete_buyers = "post|local-buyers/batch";
export const api_batch_delete_buyers = function (data) {
    return http(Url2(url_batch_delete_buyers), data);
};

//编辑买手信息
export const url_edit_buyers = "get|local-buyers/:id/edit";
export const api_edit_buyers = function (id, data) {
    return http(Url2(url_edit_buyers, {id:id}), data);
};

//新增买手信息
export const url_add_buyers = "post|local-buyers";
export const api_add_buyers = function (data) {
    return http(Url2(url_add_buyers), data);
};

//更新买手信息
export const url_updata_buyers = "put|local-buyers/:id";
export const api_updata_buyers = function (id, data) {
    return http(Url2(url_updata_buyers, {id:id}), data);
};
