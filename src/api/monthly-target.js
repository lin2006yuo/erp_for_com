import {http} from '../lib/http-plus';
//首页目标报表 monthly-target-amount/all-target
export const url_get_monthly_target = 'get|monthly-target-amount/all-target';
export const api_get_monthly_target = function (data) {
    return http(url_get_monthly_target,data);
};
//首页 spu开发月度目标进度
export const url_develop_monthly_target = 'get|develop-monthly-target-amount/all-target';
export const api_develop_monthly_target = function (data) {
    return http(url_develop_monthly_target,data);
};