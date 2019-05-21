import {http} from '@/lib/http-plus';

// wish占比与物流设置列表
export const wish_get = "get|wish-shipping-rate";
export const wish_get_http = function(data) {
    return http(wish_get, data);
};

// wish占比与物流设置
export const wish_set = "post|wish-shipping-rate/order-rate";
export const wish_set_http = function(data) {
    return http(wish_set, data);
};


// 指定物流方式编辑
export const wish_edit_url = "get|wish-shipping-rate/:id";
export const wish_set_edit = function(id) {
    return http(Url2(wish_edit_url, {id:id}));
};

// 指定物流方式保存
export const wish_save = "put|wish-shipping-rate/:id";
export const wish_save_http = function(id, data) {
    return http(Url2(wish_save, {id:id}), data);
};



// Wish重量与费用
export const wish_weight = "get|wish-shipping-rate/weight-list";
export const wish_weight_http = function(data) {
    return http(wish_weight, data);
};

// 计算重量运费
export const wish_weight_cal = "post|wish-shipping-rate/shipping-charge";

export const wish_weight_cal_http = function(data) {
    return http(wish_weight_cal, data);
};
