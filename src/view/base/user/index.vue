<template>
    <page class="p-index ">
        <search-card :params="searchData" :clears="{snType:'username',snText:''}" @search="search" @enter="search">
            <label-buttons @select="changeSelect" label="状态：" :buttons="userStatus"></label-buttons>
            <div class="inline">
                <el-select class="inline s-width-small"  v-sf.snType v-model="searchData.snType" @change="change_select">
                    <el-option
                            v-for="item in conditionList"
                            :label="item.label"
                            :value="item.value"
                            :key="item.value"
                    ></el-option>
                </el-select>
                <el-input class="inline width-super enter-result mr-sm" v-if="isInput" placeholder="请输入搜索内容..." v-model="searchData.snText" v-sf.snText ></el-input>
                <el-select v-if="showRole"
                           class="inline width-super mr-sm"
                           v-model="searchData.snText"
                           filterable clearable
                           @change="search_select"
                           placeholder="请选择角色"   v-sf.snText>
                    <el-option
                            v-for="item in condition"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id"
                    ></el-option>
                </el-select>
                <el-select v-if="showDep"
                           class="inline width-super mr-sm"
                           v-model="searchData.snText"
                           filterable clearable
                           placeholder="请选择部门"
                           @change="search_select" v-sf.snText>
                    <el-option
                            v-for="item in condition"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        <div :style="add_style(item)">{{item.name}}</div>
                    </el-option>
                </el-select>
            </div>
        </search-card>

        <div class="mt-xs">
            <permission tag="ElButton" :route="apis.url_add_user" class="ml-sm" type="primary" size="mini"
                        @click.native="add_user">添加
            </permission>
            <request-button v-if="fCurrentSelect===0" type="primary" :request="batch_start">批量启用
            </request-button>
            <request-button v-if="fCurrentSelect===1" type="primary" :request="batch_stop">批量停用
            </request-button>
        </div>
        <add-user @add="add"
                  v-model="addDialog"
                  :add-form="addForm"
                  :department-code="departmentCode"
                  :department-list="conditionLists.departmentList"
                  :mui-selects="muiSelects"
        ></add-user>
        <el-table
                v-resize="{height:41}"
                class="add-category-mt scroll-bar"
                :data="filteruserData"
                border
                @selection-change="select_all"
                highlight-current-row
                v-loading="isLoading"
                element-loading-text="玩命加载中..."
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column type="selection" width="35" align="center"></el-table-column>
            <el-table-column inline-template label="用户名" width="200">
                <div v-copy>
                    <ui-tip :content="row.username" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="部门" align="center" width="500">
                <div v-copy>
                    <ui-tip :content="row.department | filDepartment" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="姓名">
                <div v-copy>{{row.realname}}</div>
            </el-table-column>
            <el-table-column label="角色" align="center" inline-template>
                <div v-copy>
                    <ui-tip :content="row.role" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="状态" align="center" width="80">
                <div>
                    <permission tag="ElSwitch" :route="apis.url_change_status"
                                :key="row.id"
                                :disabled="row.id===1"
                                v-model="row.status"
                                :on-text="status[0]"
                                :off-text="status[1]"
                                @change="change_status(row)">
                    </permission>
                </div>
            </el-table-column>
            <el-table-column label="管理操作"
                             inline-template
                             align="center"
                             width="190">
                <div v-if="row.id!==1">
                    <permission tag="span" :route="apis.url_look_over" class="operate" @click="lookOver(row.id)">
                        查看
                    </permission>
                    |
                    <permission tag="span" :route="apis.url_update" class="operate" @click="edit(row.id)">编辑
                    </permission>
                    |
                    <permission tag="span" :route="apis.url_change_pwd" class="operate"
                                @click="change_pwd(row.id)">重置密码
                    </permission>
                    <permission tag="span" :route="apis.url_delete" class="operate" @click="cur_delete(row.id)" v-if="false">删除
                    </permission>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="tableList.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="tableList.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableList.totalSize">
        </el-pagination>
        <change-pwd v-model="changeDialog"
                    :user-id="changePwdID"
                    :change-info="changeInfo"></change-pwd>
        <edit-page
                ref="lookEditPage"
                :department-code="departmentCode"
                :department-list="conditionLists.departmentList"
                :edit-form="editForm"
                v-model="editDialog"
                :loading="editLoading"
                @update="update"
                :title="title"
                :mui-selects="muiSelects"
                :is-look="isLook"></edit-page>
    </page>
</template>
<style lang="stylus">
    .add-category-mt {
        margin-top: 5px;
    }

</style>
<script>
    import labelButtons from '../../../components/label-buttons.vue';
    import addUser from './add-user.vue';
    import changePwd from './change-pwd.vue';
    import editPage from './edit-page.vue';
    import {
        api_user_list,
        api_delete,
        api_look_over,
        api_batch_change_status,
        api_change_status,
        api_department_role,
        api_department_code,
        api_get_department,
        api_change_pwd,
        url_add_user,
        url_look_over,
        url_update,
        url_change_pwd,
        url_delete,
        url_change_status,
    } from '../../../api/user-management';

    export default {
        permission: {
            url_add_user,
            url_look_over,
            url_update,
            url_change_pwd,
            url_delete,
            url_change_status
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                editLoading:false,
                jobList:[],
                muiSelects: {},
                isLook: false,
                changePwdID: 0,
                changeDialog: false,
                fCurrentSelect: -1,
                userStatus: [
                    {name: "全部", status: -1},
                    {name: "已停用", status: 0},
                    {name: "已启用", status: 1},
                ],
                searchData:{
                    snText: "",
                    snType: "username",
                },
                conditionList: [
                    {label: "用户名", value: "username"},
                    {label: "部门", value: "department_id"},
                    {label: "手机", value: "mobile"},
                    {label: "工号", value: "job_number"},
                    {label: "姓名", value: "realname"},
                    {label: "角色", value: "role_id"},
                ],
                condition: [],
                tableList: {
                    userData: [],
                    page: 1,
                    pageSize: 50,
                    totalSize: 0
                },
                addForm: {
                    job_number:"",
                    username: "",
                    password: "",
                    department_id: [{job_id:'',id:""}],
                    realname: "",
                    mobile: "",
                    email: "",
                    status: 0,
                    role_id: "",
                },
                lookForm: {},
                editForm: {},
                status: ["启用", "停用"],
                lookDialog: false,
                editDialog: false,
                addDialog: false,
                changeInfo: {},
                ids: [],
                title: "",
                isLoading: true,
                conditionLists: {
                    roleList: [],
                    departmentList: [],
                },
                departmentCode: [],
                firstLoading:true,
            }
        },
        computed: {
            filteruserData() {
                return this.tableList.userData.filter(data => {
                    data.status = data.status ? true : false;
                    switch (this.fCurrentSelect) {
                        case 0:
                            return !data.status;
                        case 1:
                            return data.status;
                        case -1:
                            return true;
                    }
                })
            },
            isInput() {
                return !(['role_id', 'department_id'].includes(this.searchData.snType));
            },
            showRole() {
                return this.searchData.snType === "role_id";
            },
            showDep() {
                return this.searchData.snType === "department_id";
            },
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            },
        },
        filters: {
            filDepartment(val) {
                if (val === '') {
                    return "-无-";
                } else {
                    return val;
                }
            }
        },
        created() {
            this.get_department_code();
            this.init();
        },
        watch: {},
        methods: {
            init_status_btn(){
                let curBtn = this.userStatus;
                this.userStatus = [];
                this.$nextTick(()=>{
                    this.userStatus = curBtn;
                })
            },
            init() {
                this.isLoading = true;
                let params = {
                    page: this.tableList.page,
                    pageSize: this.tableList.pageSize,
                    snType: this.searchData.snType
                };
                this.fCurrentSelect >= 0 && (params.status = this.fCurrentSelect);
                if (this.searchData.snType === "username" || this.searchData.snType === "realname" || this.searchData.snType === 'mobile') {
                    this.searchData.snText && (params.snText = this.searchData.snText.trim());
                } else {
                    params.snText = this.searchData.snText;
                }
                this.tableList.userData = [];
                this.$http(api_user_list, params).then(res => {
                    this.tableList.userData = res.data;
                    this.tableList.totalSize = res.count;
                    this.isLoading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    console.log(code);
                    this.isLoading = false;
                });
                this.get_department();
                this.get_role();

            },
            add_style(item) {
                let padd = item.depth * 20;
//                let color=item.depth==0?"#D1C2A5":((item.depth==1)?"black":"red");
                return {
                    paddingLeft: `${padd}px`,
//                    color:color,
                }
            },
            get_role() {
                this.conditionLists.roleList = [];
                this.$http(api_department_role).then(res => {
                    this.conditionLists.roleList = res.roleList;
                }).catch(code => {
                    console.log(code);
                })
            },
            get_department() {
                this.conditionLists.departmentList = [];
                this.$http(api_get_department).then(res => {
                    this.muiSelects = res;
                    let data = [];
                    function pends(data, i, all) {
                        let length = data.length;
                        data[length - 1].depth = i;
                        if (data[length - 1].child_ids.length > 0) {
                            i++;
                            data[length - 1].child_ids.forEach(id => {
                                    data.push(all[id])
                                    if (all[id].child_ids.length > 0) {
                                        pends(data, i, all)
                                    }
                                }
                            )
                        }
                    }

                    res.child_ids.forEach(id => {
                        data.push(res[id]);
                        pends(data, 0, res)
                    })
                    this.conditionLists.departmentList = data;
                }).catch(code => {
                    console.log(code);
                })
            },
            change_select(val) {
                this.searchData.snText = "";
                if (val === "department_id") {
                    this.condition = this.conditionLists.departmentList;
                } else if (val === "role_id") {
                    this.condition = this.conditionLists.roleList;
                }
            },
//            -----------------------------------  搜索
            search() {
                this.init();
            },
//            清空搜索
            clear_search() {
                this.searchData.snType = 'username';
                this.searchData.snText = "";
                this.init();
            },
//           改变select
            search_select() {
                this.init();
            },
//            -----------------------------------  批量停用
            batch_stop() {
                if (this.ids.length <= 0) {
                    this.$message({
                        type: "warning",
                        message: "请选择要停用的账号",
                    })
                    return false
                } else {
                    let params = {
                        ids: this.ids.join(','),
                        status: 0,
                    }
                    return this.$http(api_batch_change_status, params).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        })
                        this.init();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    });
                }
            },
//            -----------------------------------  批量启用
            batch_start() {
                if (this.ids.length <= 0) {
                    this.$message({
                        type: "warning",
                        message: "请选择要启用的账号",
                    })
                    return false
                } else {
                    let params = {
                        ids: this.ids.join(','),
                        status: 1,
                    }
                    return this.$http(api_batch_change_status, params).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        })
                        this.init();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    });
                }
                console.log("批量启用");
            },
//            -----------------------------------  全选
            select_all(selection) {
                this.ids = selection.map(row => {
                    return row.id;
                });
                console.log(this.ids.join(","));
            },
//            -----------------------------------  分页
            size_change(size) {
                this.tableList.pageSize = size;
                this.init();
            },
            current_change(page) {
                this.tableList.page = page;
                this.init();
            },
//            ----------------------------------  添加
            add_user() {
                this.addForm = {
                    job_number:"",
                    username: "",
                    password: "",
                    job: "",
                    department_id: [{job_id:'',id:""}],
                    realname: "",
                    mobile: "",
                    email: "",
                    status: 0,
                    role_id: "",
                };
                this.addDialog = true
            },
            add(form) {
                this.tableList.userData.push(form);
            },
//            ----------------------------------  查看
            lookOver(id) {
                this.isLook = true;
                this.$http(api_look_over, id).then(res => {
                    this.editForm = res;
                    this.editDialog = true;
                    this.title = `查看用户： ${res.username} 信息`;
                });
            },
//            ----------------------------------  编辑
            edit(id) {
                this.isLook = false;
                this.editLoading = true;
                this.$http(api_look_over, id).then(res => {
                    this.title = `编辑用户： ${res.username} 信息`;
                    if(!res.department_id||res.department_id.length<=0){
                        res.department_id = [{id: '', job_id: ''}]
                    }
                    this.editForm = clone(res);
                    this.editDialog = true;
                    this.editLoading = false;
                }).catch(code => {
                    this.editLoading = false;
                    console.log(code);
                });
            },
//            ----------------------------------  编辑页面   保存按钮
            update(form) {
                const index = this.tableList.userData.indexOfFun(r => {
                    return r.id === form.id
                });
                this.tableList.userData.splice(index, 1, form);
            },
//            ----------------------------------  修改密码
            change_pwd(id) {
                this.$confirm(`确认要重置为系统默认密码：Rondaful&@123#`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_change_pwd,id).then(res=>{
                        this.$message({type:"success",message:res.message || res});
                    }).catch(code=>{
                        this.$message({type:"error",message:code.message || code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
//            ----------------------------------  删除
            cur_delete(id) {
                let username = "";
                var index = this.tableList.userData.indexOfFun(id, function (old, id) {
                    if (old.id === id) {
                        username = old.username;
                    }
                    return old.id === id;
                })
                this.$confirm(`您将删除  ${username}  用户，确定进行此操作?`, '提示', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    this.$http(api_delete, id).then(res => {
                        this.$message({
                            type: "success",
                            message: res.message || res
                        })
                        this.tableList.userData.splice(index, 1);
                        this.$set(this.tableList, 'totalSize', this.tableList.totalSize - 1)
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    });
                }).catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消"
                    })
                })
            },
//            ---------------------------------  启用禁用按钮
            change_status(row) {
                this.$confirm(`此操作将更改  ${row.username}  用户状态, 确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let params = {
                        id: row.id,
                        status: status
                    };
                    console.log(row);
                    this.$http(api_change_status, params).then(res => {
                        this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                    }).catch(code => {
                        console.log(code);
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                    row.status = !row.status;
                });
            },
//            -----------------------------------  状态选择
            changeSelect(index) {
                this.fCurrentSelect = this.userStatus[index].status;
                this.init();
            },
//            ----------------------------  获取职务
            get_department_code() {
                this.$http(api_department_code,{type:0}).then(res => {
                    this.departmentCode = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.code,
                        }
                    });
                }).catch(code => {
                    console.log(code);
                })
            },

        },
        components: {
            labelButtons,
            addUser,
            changePwd,
            editPage,
            uiTip: require('../../../components/ui-tip.vue').default,
            searchCard:require("../../../components/search-card.vue").default,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
