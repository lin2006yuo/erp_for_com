/**
 * Created by user on 2016/12/28.
 */
import {http} from '../lib/http-plus';
//角色列表
export const url_role_list = "get|role";
export const api_role_list = function (data) {
    return http(Url2(url_role_list), data);
}
//添加
export const url_role_add = "post|role";
export const api_role_add = function (data) {
    return http(Url2(url_role_add), data);
}
export const url_role_get = "get|role/:id";
export const api_role_get = function (id) {
    return http(Url2(url_role_get, {id}));
}
//更新
export const url_role_edit_update = "put|role/:id";
export const api_role_edit_update = function (id, data) {
    return http(Url2(url_role_edit_update, {id: id}), data);
}
//删除
export const url_role_delete = "delete|role/:id";
export const api_role_delete = function (id) {
    return http(Url2(url_role_delete, {id: id}));
}
//改变状态
export const url_change_status = "get|role/changeStatus";
export const api_change_status = function (data) {
    return http(Url2(url_change_status), data);
}
//成员管理 ->可选用户
export const url_user_list = 'get|user';
export const api_user_list = function (data) {
    return http(Url2(url_user_list), data);
}
//成员管理  ->角色所属成员列表
export const url_member_list = "get|user/member";
export const api_member_list = function (id) {
    return http(url_member_list, {id: id});
}
//给角色添加或删除成员
export const url_role_addUser = "get|role/addUser";
export const api_role_addUser = function (data) {
    return http(Url2(url_role_addUser), data);
}
//获取部门和角色
export const url_department_role = "get|user/departmentAndRole";
export const api_department_role = function () {
    return http(Url2(url_department_role));
};

export const url_role_access = "get|role/:roleid/access-rules";
export const api_role_access = function (roleid) {
    return http(Url2(url_role_access, {roleid: roleid}));
};

export const url_role_node_config = "get|node/config/:node"
export const api_get_node_config = function (node) {
    return http(Url2(url_role_node_config, {node: node}));
};

export const url_get_filter_params = "get|node/filterParams/:filter";
export const api_get_filter_params = function (filter) {
    return http(Url2(url_get_filter_params, {filter: filter}));
};
export const url_get_role_filter = "get|role/:roleid/node/:nodeid/access";
export const api_get_role_acess = function (roleid, nodeid) {
    return http(Url2(url_get_role_filter, {roleid: roleid, nodeid: nodeid}));
};
export const url_set_role_filter = "post|role/:roleid/node/:nodeid/access";
export const api_set_role_acess = function (roleid, nodeid, access) {
    return http(Url2(url_set_role_filter, {roleid: roleid, nodeid: nodeid}), access);
};

export const url_get_role_mcas = "get|role/:roleid/mcas";
export const api_get_role_mcas = function (roleid) {
    return http(Url2(url_get_role_mcas, {roleid: roleid}));
};
export const url_set_role_mcas = "post|role/:roleid/mcas";
export const api_set_role_mcas = function (roleid, mcas) {
    return http(Url2(url_set_role_mcas, {roleid: roleid}), {mcas});
};
export const url_copy_role = "post|role/:role_id/copy";
export const api_copy_role = function (role_id,data) {
    return http(Url2(url_copy_role, {role_id: role_id}),data);
};
