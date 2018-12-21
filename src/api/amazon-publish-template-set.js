import {http} from '../lib/http-plus';

//add
export const url_amazon_xsd_attribute = "post|amazon-xsd-attribute";
export const api_amazon_xsd_attribute = function(data) {
    return http(Url2(url_amazon_xsd_attribute), data);
};

// 属性
export const url_amazon_get_category = 'get|amazon-xsd-category-tree';
export const api_amazon_get_category = function (data) {
    return http(url_amazon_get_category);
};

//上传excel
export const url_update_excel = 'post|amazon-attribute/match';
export const api_update_excel = function (data) {
    return http(url_update_excel, data);
};

// 添加

export const url_save_attr = 'post|amazon-save-xsd-attribute';
export const api_save_attr = function (data) {
    return http(url_save_attr, data)
};

export const url_attr_list = 'get|amazon-attribute/config';
export const api_attr_list = function (data) {
    return http(url_attr_list, data)
};
