import {http} from '../lib/http-plus';

//仓库----新接口（根据登录人员所属仓库显示默认仓库）
export const url_get_warehouse_default = "get|warehouse/info";
export const api_get_warehouse_default = function (data) {
    return http(url_get_warehouse_default, data);
};