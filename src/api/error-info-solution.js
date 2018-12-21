import {http} from '../lib/http-plus';

//获取创建人
export const url_get_packages_error_developers = "get|packages-error/developers";
export const api_get_packages_error_developers = function () {
    return http(url_get_packages_error_developers);
};
//获取更新人
export const url_get_packages_error_updaters = "get|packages-error/updaters";
export const api_get_packages_error_updaters = function () {
    return http(url_get_packages_error_updaters);
};
//获取列表
export const url_get_packages_error = "get|packages-error";
export const api_get_packages_error = function (data) {
    return http(url_get_packages_error,data);
};
//添加错误信息
export const url_get_packages_error_add = "post|packages-error/";
export const api_get_packages_error_add = function (data) {
    return http(url_get_packages_error_add,data);
};
//编辑错误信息
export const url_get_packages_error_edit = "put|packages-error/";
export const api_get_packages_error_edit = function (data) {
    return http(url_get_packages_error_edit,data);
};
