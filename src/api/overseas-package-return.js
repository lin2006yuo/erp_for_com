import {http} from '../lib/http-plus';

//海外仓包裹退回列表
export const url_overseas_package_return = "get|overseas-package-return"
export const api_overseas_package_return= function(data){
    return http(url_overseas_package_return, data);
};

//海外退件类型
export const url_overseas_package_return_types = "get|overseas-package-return/types";
export const api_overseas_package_return_types = function(){
    return http(url_overseas_package_return_types);
};

//查看海外仓退件详情
export const url_overseas_package_return_id = "get|overseas-package-return/:id";
export const api_overseas_package_return_id = function(id){
    return http(Url2(url_overseas_package_return_id, {id}));
};

//海外退件导出
export const url_overseas_package_return_export = "post|overseas-package-return/export";
export const api_overseas_package_return_export = function(data){
    return http(url_overseas_package_return_export, data);
};

//获取谷仓仓库
export const url_warehouse_gucang = 'get|warehouse/info?type=7'
export const api_arehouse_gucang = function(){
    return http(url_warehouse_gucang);
};
