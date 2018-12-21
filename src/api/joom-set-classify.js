import {http} from '../lib/http-plus';



export const url_get_joom_list = 'get|joom-category'
export const api_get_joom_list = function (data) {
    return http(url_get_joom_list, data);
};


export const url_get_joom_account = 'get|joom-category/accounts';
export const api_get_joom_account = function (data) {
    return http(url_get_joom_account, data);
};

export const url_get_joom_store = 'get|joom-category/shops';
export const api_get_joom_store = function (data) {
    return http(url_get_joom_store, data);
};


//Joom店铺分类树
export const url_joom_category_tree = 'get|joom-category/category';
export const api_joom_category_tree = function (data) {
    return http(url_joom_category_tree, data);
};

///joom-category delete joom-category
export const url_joom_save_category = 'post|joom-category';
export const api_joom_save_category = function (data) {
    return http(url_joom_save_category, data);
}

///joom-category delete joom-category
export const url_joom_delete = 'post|joom-category/del';
export const api_joom_delete = function (data) {
    return http(url_joom_delete, data);
}

//●joom-category/getcategory bianji

export const url_joom_edit_category = 'post|joom-category/getcategory';
export const api_joom_edit_category = function (data) {
    return http(url_joom_edit_category, data);
}
export const url_joom_dangerous_kind = 'get|publish/joom/dangerous-kind';
export const api_joom_dangerous_kind = function (data) {
    return http(url_joom_dangerous_kind, data);
}

