/**
 * Created by RondaFul on 2016/10/18.
 */

import {http} from '../lib/http-plus';

export default {
  get_orders(params){
    return http("get|order/getlist", params);
  }
}
