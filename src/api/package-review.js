/**
 * Created by Administrator on 2017/11/27.
 */
import {http} from '../lib/http-plus';
//集包单提交复核
export const url_put_package = "put|package-collection/check";
export const api_put_package= function(data) {
    return http(Url2(url_put_package),data);
};