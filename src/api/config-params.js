/**
 * Created by wuchuguang on 17-4-18.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';
export const url_get_define = "get|system-config";
export const api_get_define = function(){
    return http(url_get_define);
};
export const url_mdf_param = "put|system-config/param/:id";
export const api_mdf_param = function(param){
    return http(Url2(url_mdf_param,{id:param.id}),param);
};
export const url_add_param = "post|system-config/param";
export const api_add_param = function(param){
    return http(url_add_param,param);
};
export const url_del_param = "delete|system-config/param/:id";
export const api_del_param = function(param){
    return http(Url2(url_del_param, {id:param.id}));
};
export const url_add_group = "post|system-config/group";
export const api_add_group = function(group){
    return http(url_add_group,group);
};

export const url_mdf_group = "put|system-config/group/:id";
export const api_mdf_group = function(group){
    return http(Url2(url_mdf_group,{id:group.id}), group);
};
export const url_del_group = "delete|system-config/group/:id";
export const api_del_group = function(group){
    return http(Url2(url_del_group,{id:group.id}));
};