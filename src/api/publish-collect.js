/**
 * Created by alison on 16-11-14.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

// 1.1  刊登数据采集列表
export const url_publish_collect_list = 'get|publish-collect-index';
export const api_publish_collect_list = function (data) {
    return http(url_publish_collect_list, data);
};

// 1.2  添加采集
export const url_publish_collect_add = 'post|publish-collect-add';
export const api_publish_collect_add = function (data) {
    return http(url_publish_collect_add,data);
};

// 1.3  认领
export const url_publish_collect_claim = 'post|publish-collect-claim';
export const api_publish_collect_claim = function (data) {
    return http(url_publish_collect_claim, data);
};

// 1.4  绑定本地商品
export const url_publish_collect_bind = 'post|publish-collect-bind-goods';
export const api_publish_collect_bind = function (data) {
    return http(url_publish_collect_bind, data);
};

// 1.5  刊登采集删除
export const url_publish_collect_delete = 'post|publish-collect-delete';
export const api_publish_collect_delete = function (data) {
    return http(url_publish_collect_delete, data);
};

// 1.6  速卖通部门所有员工
export const url_aliexpress_users = 'get|aliexpress-users';
export const api_aliexpress_users = function (data) {
    return http(url_aliexpress_users, data);
};


