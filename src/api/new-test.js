/**
 * Created by wuchuguang on 17-6-27.
 */


import {http} from '../lib/http-plus';
export const url_get = "get|xxx/xxx/:id/test"
export const api_get = function(id, data){
    return http(Url2(url_get,{id:id}), data);
};

