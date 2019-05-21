/**
 * Created by wuchuguang on 16-11-4.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

export const url_get_categories = "get|categories";
export const api_get_categories = function(){
    return http(url_get_categories, {});
};

export const url_get_channel_categories = "get|channel-categories";
export const api_get_channel_categories = function () {
    return http(url_get_channel_categories, {});
};

export const url_orders_channel = "get|orders/channel";
export const api_orders_channel = function () {
    return http(url_orders_channel)
}
//获取站点
export const url_get_channel_platform = "get|channel-categories/:plat";
export const api_get_channel_platform = function (plat) {
    return http(Url2(url_get_channel_platform, {plat:plat}));
};
//获取站点下的分类
export const url_get_channel_site= "get|channel-categories/:plat/:site";
export const api_get_channel_site= function (plat,site) {
    return http(Url2(url_get_channel_site, {plat:plat,site:site}));
};
//获取有站点下的分类
export const url_get_channel_site_classify = "get|channel-categories/:plat/:site/:classify";
export const api_get_channel_site_classify = function (plat,site, classify) {
    return http(Url2(url_get_channel_site_classify, {plat:plat,site:site, classify:classify}));
};
//获取无站点下的分类
export const url_get_channel_classify = "get|channel-categories/:plat/:classify";
export const api_get_channel_classify = function (plat, classify) {
    return http(Url2(url_get_channel_classify, {plat:plat, classify:classify}));
};
export const url_add = "post|categories";
export const api_add = function (datas) {
    return http(url_add, datas);
};

export const url_sorts = "put|categories/sorts";
export const api_sorts = function (sort) {
    return http(url_sorts, {sort});
};

export const url_edit ="get|categories/:id/edit";
export const api_edit = function (id) {
    return http(Url2(url_edit, {id:id}));
};

export const url_delete = "delete|categories/:id";
export const api_delete = function (id) {
    return http(Url2(url_delete, {id:id}));
};

export const url_update = "put|categories/:id";
export const api_update = function(id, data){
    return http(Url2(url_update, {id:id}), data);
};

export const url_set_attributes ="get|set-attributes/:id";
export const api_set_attributes = function (id) {
    return http(Url2(url_set_attributes, {id:id}));
};

export const url_save_attributes ="post|set-attributes";
export const api_save_attributes = function (params) {
    return http(url_save_attributes, params);
};

export const url_set_quality = "get|set-qc/:id";
export const api_set_quality = function (id) {
    return http(Url2(url_set_quality, {id:id}));
};

export const url_save_quality = "post|set-qc";
export const api_save_quality = function (params) {
    return http(url_save_quality, params);
};

export const url_get_checktool = "get|goods/check_tool";
export const api_get_checktool = function () {
    return http(url_get_checktool);
};

export const url_get_group_infos = "get|set-qc/group";
export const api_get_group_infos = function () {
    return http(url_get_group_infos);
};
