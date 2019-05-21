/**
 * Created by Administrator on 2017/6/20.
 */
import {http} from '../lib/http-plus';
//获取
export const url_transfer_get = "get|allocation";
export const api_transfer_get = function(data){
    return http(url_transfer_get,data);
};
//查看
export const url_transfer_view = "get|allocation/:id";
export const api_transfer_view = function(id){
    return http(Url2(url_transfer_view,{id:id}));
};
//获取状态
export const url_status_get = "get|allocation/status";
export const api_status_get = function(data){
    return http(url_status_get,data);
};
//获取仓库
export const url_warehouse_get = "get|global/warehouse";
export const api_warehouse_get = function(data){
    return http(url_warehouse_get,data);
};
//保存新增
export const url_transfer_save = "post|allocation";
export const api_transfer_save = function(data){
    return http(url_transfer_save,data);
};
//编辑
export const url_transfer_edit = "get|allocation/:id/edit"
export const api_transfer_edit = function(id){
    return http(Url2(url_transfer_edit,{id:id}));
};
//保存编辑
export const url_transfer_edit_save = "put|allocation/:id"
export const api_transfer_edit_save = function(id,data){
    return http(Url2(url_transfer_edit_save,{id:id}),data);
};
//点击作废
export const url_transfer_obsolete = "post|allocation/status"
export const api_transfer_obsolete = function(data){
    return http(url_transfer_obsolete,data);
};
//点击手动完结
export const url_transfer_personOver = "post|allocation/status"
export const api_transfer_personOver = function(data){
    return http(url_transfer_personOver,data);
};

