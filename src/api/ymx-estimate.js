/**
 * Created by user on 2017/5/22.
 */
import {http} from '../lib/http-plus';
export const url_estimate_lists = "get|amazon/getFeedbacks"
export const api_estimate_lists = function(data){
    return http(url_estimate_lists,data);
};
/*提交中差评原因  amazon/submitFeedbackReason*/
export const url_submit_Feedback_Reason = "post|amazon/submitFeedbackReason"
export const api_Feedback_Reason = function(data){
    return http(url_submit_Feedback_Reason,data);
};
/*处理状态*/
export const url_dealing_status = "post|amazon/submitFeedbackDealingStatus"
export const api_dealing_status = function(data){
    return http(url_dealing_status,data);
};
/*获取账号*/
export const url_get_account = "get|orders/account"
export const api_get_account = function(data){
    return http(url_get_account,data);
};
/*获取客服人员*/
// member-ship/customer/member?channel_id=2
// user/:type(类型)/staffs?content=a;
export const url_get_member = "get|user/:type/staffs";
export const api_get_member = function(data){
    return http(Url2(url_get_member,{type:'customer'}),data);
};
