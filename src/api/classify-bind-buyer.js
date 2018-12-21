/**
 * Created by wuchuguang on 17-5-27.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const url_get = "get|sub-map";
export const api_get = function(params){
    return http(url_get,params);
};
export const url_del_single = "delete|sub-map/:id";
export const api_del_single = function(id){
    return http(Url2(url_del_single,{id:id}));
};
export const url_del = "post|sub-map/batch/:type";
export const api_del = function(ids){
    return http(Url2(url_del,{type:"delete"}),{data:ids});
};
export const url_add = "post|sub-map";
export const api_add = function(datas){
    return http(url_add,{detail:datas});
};
export const url_edit = "put|sub-map/:id";
export const api_edit = function(datas){
    return http(Url2(url_edit,{id:datas.id}),{
        category_id:datas.category_id,
        purchase_id:datas.purchase_id,
    });
};