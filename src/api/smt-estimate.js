/**
 * Created by user on 2017/4/12.
 */
import {http} from '../lib/http-plus';

//获取账号
export const url_get_account = "get|orders/account";
export const api_get_account = function (data) {
    return http(Url2(url_get_account),data)
}
//获取评论列表
export const url_get_list = "get|ali-evaluate";
export const api_get_list = function(data){
    return http(Url2(url_get_list),data);
}
//获取回评模板
export const url_get_tmpContent = "get|ali-evaluate/tmpContent";
export const api_get_tmpContent = function (data) {
    return http(Url2(url_get_tmpContent),data)
}
//回评
export const url_post_evaluate = "post|ali-evaluate/evaluate";
export const api_post_evaluate = function (data) {
    return http(Url2(url_post_evaluate),data);
}
//获取回复模板列表
export const url_get_templates = "get|msg-tpl/getTemplates";
export const api_get_templates = function (data) {
    return http(Url2(url_get_templates),data);
}
//获取搜索状态及数量
export const url_get_statistics = "get|ali-evaluate/statistics";
export const api_get_statistics = function () {
    return http(Url2(url_get_statistics));
}
//批量回评
export const url_post_batch = "post|ali-evaluate/batchEvaluate";
export const api_post_batch = function (data) {
    return http(Url2(url_post_batch),data);
}
//追加回评
export const url_post_content = "post|ali-evaluate/append";
export const api_post_content  = function (data) {
    return http(Url2(url_post_content),data)
}
//获取评价类型

export const url_get_ali_evaluate_statistics_score = "get|ali-evaluate/statistics-score";
export const api_get_ali_evaluate_statistics_score = function () {
    return http(Url2(url_get_ali_evaluate_statistics_score));
}
