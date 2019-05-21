import {http} from '../lib/http-plus';

// 上传自定义图片
export const url_upload_self_goods = "post|goods-image/self-image";
export const api_upload_self_goods= function(data) {
    return http(url_upload_self_goods,data);
};