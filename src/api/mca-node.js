/**
 * Created by wuchuguang on 17-3-31.
 */

import {http} from '../lib/http-plus';

export const url_get = "get|node"
export const api_get = function(){
  return http(url_get);
};

export const url_get_page_node = "get|node/pageNode"
export const api_get_page_node = function(mca){
  return http(url_get_page_node, mca);
};

export const url_set_page_node = "put|node/pageNode"
export const api_set_page_node = function(mcan){
  return http(url_set_page_node, mcan);
};

export const url_get_filters = "get|node/filters"
export const api_get_filters = function(){
  return http(url_get_filters);
};

export const url_get_filter_node = "get|node/filterNode"
export const api_get_filter_node = function(mca){
  return http(url_get_filter_node, mca);
};

export const url_set_filter_node = "put|node/filterNode"
export const api_set_filter_node = function(mcan){
  return http(url_set_filter_node, mcan);
};

export const url_ignore_vists = "get|node/ignore-vists";
export const api_ignore_vists = function(){
    return http(url_ignore_vists);
};