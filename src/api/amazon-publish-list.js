import {http} from '../lib/http-plus';


//已刊登列表
export const url_has_publish_list = "get|publish/amazon-listing";
export const api_has_publish_list = function(data) {
    return http(Url2(url_has_publish_list), data);
};

export const url_account_site = "get|orders/account";
export const api_account_site = function (data) {
    return http(url_account_site, data)
};

export const url_amazon_logs = "get|listing/amazon/action-logs";
export const api_amazon_logs = function (data) {
    return http(url_amazon_logs, data);
};

export const url_amazon_batch="post|listing/amazon/batch-edit-price";
export const api_amazon_batch=function(data){
    return http(url_amazon_batch,data)
}


export const url_edit_listing = 'post|listing/amazon/edit-listing';
export const api_edit_listing = function (data) {
    return http(url_edit_listing, data)
}


export const url_unpublished = 'get|publish/amazon/unpublished';
export const api_unpublished = function (data) {
    return http(url_unpublished, data);
}

export const url_get_detail = 'get|publish/amazon-listing/detail/:id';
export const api_get_detail = function (id) {
    return http(Url2(url_get_detail,{id}))
}

export const url_bind_sku = 'post|update-sku-relation';
export const api_bind_sku = function (data) {
    return http(url_bind_sku, data)
};

export const url_publish_queue = 'get|publish/amazon-publish/get-listing';
export const api_publish_queue = function (data) {
    return http(url_publish_queue, data)
}

// export const url_publish_edit = 'get|publish/amazon-publish/get-one';
// export const api_publish_edit = function (data) {
//     return http(url_publish_edit, data);
// }
/*刊登记录--》编辑*/
export const url_publish_edit = 'get|publish/amazon/edit';
export const api_publish_edit = function (data) {
    return http(url_publish_edit, data);
}
/*刊登记录删除&批量删除
* */
export const url_publish_del = 'get|publish/amazon-publish/delete-listing';
export const api_publish_del = function (data) {
    return http(url_publish_del, data)
}

//获取亚马逊账号 publish/amazon/account
export const url_get_amazon_account = 'get|publish/amazon/account';
export const api_get_amazon_account = function (data) {
    return http(url_get_amazon_account, data)
};
//状态刷新
export const url_refresh_status = 'get|publish/amazon-publish/refresh_status';
export const api_refresh_status = function (data) {
    return http(url_refresh_status, data)
};
//强制失败
export const url_amazon_defeat = 'get|publish/amazon/:id/defeat';
export const api_amazon_defeat = function (id) {
    return http(Url2(url_amazon_defeat,{id:id}))
};
//草稿箱列表
export const url_amazon_draft_list = 'get|publish/amazon/draft';
export const api_amazon_draft_list = function (data) {
    return http(url_amazon_draft_list,data)
};
//删除
export const url_amazon_draft_delete = 'delete|publish/amazon/draft';
export const api_amazon_draft_delete = function (data) {
    return http(url_amazon_draft_delete,data)
};
//刊登异常导出接口
export const url_amazon_error_export = 'get|publish/amazon/error-export';
export const api_amazon_error_export = function (data) {
    return http(url_amazon_error_export,data)
};
//批量复制
export const url_batch_copy = 'post|publish/amazon/batch-copy';
export const api_batch_copy = function (data) {
    return http(url_batch_copy,data)
};
//已更改价格  POST
export const url_adjusted_price = 'post|publish/amazon-publish/adjusted-price';
export const api_adjusted_price = function (data) {
    return http(url_adjusted_price,data)
};

//Listing管理列表修改图片按钮
export const url_resend_images = 'post|publish/amazon-publish/resend-images';
export const api_resend_images = function (data) {
    return http(url_resend_images,data)
};
//ASIN核查
export const url_publish_amazon_review_asin = 'post|publish/amazon/review-asin';
export const api_publish_amazon_review_asin = function (data) {
    return http(url_publish_amazon_review_asin,data)
};



