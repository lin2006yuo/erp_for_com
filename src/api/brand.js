/**
 * Created by RondaFul on 2016/11/11.
 * 更换api传参方式  Alison  2017/6/28
 */
import {http} from '../lib/http-plus';

export const url_brand_data = "get|brand";
    export const api_brand_data = function (data) {
        return http(url_brand_data, data);
    };
export const url_add ="post|brand";
    export const api_add = function (data) {
        return http(url_add, data);
    };
export const url_delete = "delete|brand/:id";
    export const api_delete = function(id){
        return http(Url2(url_delete,{id:id}));
    };
export const url_edit = "get|brand/:id/edit";
    export const api_edit = function (id) {
        return http(Url2(url_edit,{id:id}));
    }
export const url_update ="put|brand/:id";
    export const api_update = function (id,data) {
        return http(Url2(url_update,{id:id}),data);
    }