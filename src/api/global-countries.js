import {http} from '../lib/http-plus';


// 新增的请选择国家列表。  country?zone_code=all&snText=
export const url_country_list = "get|country";
export const api_country_list = function(data){
    return http(url_country_list, data);
};


// 全球国家城市中英文添加。
export const ur_global__add = "post|country-area";
export const api_global_add = function(data){
    return http(ur_global__add, data);
};

// list页的的下拉选项。
export const ur_list_country = "get|country-area";
export const api_list_country = function(data){
    return http(ur_list_country, data);
};


// 有城市国家列表--list列表上的新增。
export const url_country_area ="get|country-area/index";
export const api_country_area = function (data) {
    return http(url_country_area, data);
};

// 修改对应城市
export const url_city_mod = 'put|country-area/:id';
export const api_city_mod = function (id,data) {
    let url = Url2(url_city_mod,{id:id});
    return http(url,data);
};


// 删除国家城市
export const url_city_del = 'delete|country-area/:id';
export const api_city_del = function (id) {
    let url = Url2(url_city_del,{id:id});
    return http(url);
};


// list页面的表格数据。
export const url_country_index ="get|country-area/city-list";
export const api_country_index = function (data) {
    return http(url_country_index, data);
};


export const url_channel_accounts = "get|global/channel-accounts";
export const api_channel_accounts = function(data){
    return http(url_channel_accounts,data)
};
