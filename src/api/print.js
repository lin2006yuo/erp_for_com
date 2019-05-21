/**
 * Created by RondaFul on 2017/7/18.
 */
import {http} from '../lib/http-plus';
export const url_label_list = 'get|label';
export const api_label_list = function(data){
    return http(url_label_list, data);
};
export const url_label_edit = "get|label/:id";
export const api_label_edit = function (id) {
    return http(Url2(url_label_edit,{id:id}));
}
export const url_label_save = "post|label";
export const api_label_save = function (data) {
    return http(url_label_save,data);
}
export const url_label_del = "delete|label/del-temp";
export const api_label_del = function (data) {
    return http(url_label_del,data);
}
export const url_label_type = 'get|label/label-types';
export const api_label_type = function(data){
    return http(url_label_type, data);
};
export const url_label_edit_type = "get|label/label-fields/:type";
export const api_label_edit_type = function (id) {
    return http(Url2(url_label_edit_type,{type:id}));
};
//copy
export const url_label_edit_copy = "get|label/copy/:id";
export const api_label_edit_copy = function (id) {
    return http(Url2(url_label_edit_copy,{id:id}));
}
//获取指定类型的模板列表
export const url_label_type_list = "get|label/temp-list/:type";
export const api_label_type_list = function (id, data) {
    return http(Url2(url_label_type_list,{type:id}), data);
}

//获取打印机下载
export const url_get_printer = "get|printer";
export const api_get_printer = function (data) {
    return http(Url2(url_get_printer),data);
}
