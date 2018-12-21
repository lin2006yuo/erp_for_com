<template>
    <page>
        <search-card :params="searchData"  :clears="{snText:''}" @search="search"  @enter="search" @clear-params="search">
            <label-buttons class="inline" label="状态：" :buttons="userStatus" @select="change_select"></label-buttons>
            <el-input  class="inline ml-lg mr-sm enter-result" v-sf.snText  v-model="searchData.snText" placeholder="请输入角色名..."></el-input>
        </search-card>
        <permission tag="ElButton" :route="apis.url_role_add" class="mt-xs mb-xs ml-sm"
                    type="primary" size="mini" @click.native="add_role">添加</permission>
        <add-role v-model="addDialog" :add-form="addForm"@add-save="add_save"></add-role>
        <el-table
                v-resize="{height:41}"
                class="scroll-bar"
                :data="filterTable"
                border
                style="width:100%"
                highlight-current-row
                v-loading="isLoading"
                element-loading-text="玩命加载中..."
        >
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column prop="id" label="ID" align="center" width="50px"></el-table-column>
            <el-table-column inline-template label="角色" width="300">
                <div v-copy>{{row.name}}</div>
            </el-table-column>
            <el-table-column inline-template label="角色描述">
                <div v-copy>
                    <ui-tip :content="row.remark" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column inline-template label="状态" width="120">
                <div>
                    <permission tag="ElSwitch" :route="apis.url_change_status"
                                :key="row.id"
                                :disabled="row.id=== 1"
                                v-model="row.status"
                                :on-text="status[0]"
                                :off-text="status[1]"
                                @change="change_status(row)">
                    </permission>
                </div>
            </el-table-column>
            <el-table-column inline-template label="操作" width="300">
                <div v-if="row.id != 1">
                    <permission tag="span" :route="apis.url_copy_role" class="operate" @click="copy_role(row)">复制角色</permission>
                    |
                    <permission tag="span" :route="apis.url_set_role_mcas" class="operate" @click="permission_setting(row)">权限设置</permission>
                    |
                    <permission tag="span" :route="apis.url_role_addUser" class="operate" @click="member_management(row)">成员管理</permission>
                    |
                    <permission tag="span" :route="apis.url_role_edit_update" class="operate" @click="edit(row.id)">修改</permission>
                    |
                    <permission tag="span" :route="apis.url_role_delete" class="operate" @click="cur_delete(row.id)">删除</permission>
                </div>
                <div v-else>
                        <span class="c-red">
                            系统管理员，无法删除，无法修改
                        </span>
                    <span class="operate" @click="member_management(row)">成员管理</span>
                </div>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="size_change"
                @current-change="current_change"
                :current-page="roleTable.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="roleTable.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="roleTable.totalSize">
        </el-pagination>
        <edit v-model="eidtDialog" :edit-form="editForm" :title="title" @save-edit="save_edit"></edit>
        <mem-management
                :is-loading="loading"
                :mem-form="memForm"
                :title-name="titleName"
                v-model="memDialog"
                :id="mdfid"
                @cancel-member="cancel_member"
        ></mem-management>
        <node-manager v-model="showRoleRule"
                      :role="selectRole"></node-manager>
        <copy-role v-model="copyRole" :old-data="oldData" @submit-copy-role="submit_copy_role"></copy-role>
    </page>
</template>
<style>

</style>
<script>
    import labelButtons from '../../../components/label-buttons.vue';
    import addRole from './add-role.vue';
    import edit from './edit.vue';
    import memManagement from './member-management.vue'
    import {api_role_list,api_role_get,api_role_delete,api_change_status,api_user_list,api_member_list,api_copy_role,
        url_copy_role,url_role_add,url_change_status,url_set_role_mcas,url_role_addUser,url_role_edit_update,url_role_delete} from '../../../api/role';
    export default{
    	  permission:{
          url_role_add,
          url_change_status,
          url_set_role_mcas,
          url_role_addUser,
          url_role_edit_update,
          url_role_delete,
          url_copy_role
        },
        page:{},
        refresh(){
        	this.init();
        },
        data(){
            return{
                showRoleRule:false,
                titleName:'',
                selectRole:{},
                 userStatus:[
                    {name:"全部",status:-1},
                    {name:"已停用",status:0},
                    {name:"已启用", status:1},
                ],
                status:["启用","停用"],
                currentStatus:-1,
                searchData:{
                    snText:"",
                },
                roleTable:{
                    tableList:[],
                    page:1,
                    pageSize:50,
                    totalSize:0,
                },
                editForm:{},
                addDialog:false,
                eidtDialog:false,
                memDialog:false,
                memForm:{
                     data:[]
                },
                selList:{
                    table:[],
                    page:0,
                    pageSize:20,
                    totalSize:0,
                },
                addForm:{
                    name:"",
                    remark:"",
                    status:0,
                },
                title:"",
                isLoading:true,
                loading:true,
                mdfid:0,
                copyRole:false,
                oldData:{},
                firstLoading:true
            }
        },
        created(){
            this.init();
        },
        methods:{
            submit_copy_role(data){
                data.status = !!data.status;
                this.roleTable.tableList.unshift(data);
            },
            copy_role(row){
                this.copyRole = true;
                this.oldData = row;
                console.log(this.oldData,'this.oldData');
            },
            init_status_btn(){
                let curBtn = this.userStatus;
                this.userStatus = [];
                this.$nextTick(()=>{
                    this.userStatus = curBtn;
                })
            },
//            ----------------------------------------------------  初始角色列表
            init(){
                this.isLoading = true;
                let params={
                    page:this.roleTable.page,
                    pageSize:this.roleTable.pageSize
                };
                this.currentStatus > -1&&(params.status = this.currentStatus);
                this.searchData.snText &&(params.snText = this.searchData.snText.trim());
                this.roleTable.tableList = [];
                this.$http(api_role_list,params).then(res=>{
                    this.roleTable.tableList = res.data;
                    this.roleTable.totalSize = res.count;
                    this.isLoading = false;
                    this.firstLoading = false;
                }).catch(code=>{
                    console.log(code);
                    this.isLoading = false;
                });
            },
//            ----------------------------------------------------  添加
            add_role(){
                this.addForm={
                    name:"",
                    remark:"",
                    status:0,
                }
                this.addDialog = true;
            },
            add_save(form){
                this.init();
            },
//            ----------------------------------------------------  权限设置
            permission_setting(row){
                this.selectRole = row;
                this.showRoleRule = true;
            },
//            ----------------------------------------------------  成员管理
            /*初始*/
            member_management(row){
            	this.titleName = row.name;
                this.mdfid=row.id;
                this.memDialog = true;

                this.mem_init(row.id);
            },
            mem_init(id){
                this.loading = true;
                this.$http(api_member_list,id).then(res=>{
                    this.memForm=res;
                    this.loading = false;
                }).catch(code=>{
                    console.log(code);
                    this.loading = false;
                })
            },
            /*取消*/
            cancel_member(id){
                this.mem_init(id);
            },
//            ----------------------------------------------------  修改
            edit(id){
                this.eidtDialog = true;
                this.$http(api_role_get,id).then(res=>{
                    this.editForm = res;
                    this.title = `修改角色：${res.name} 信息`;
                }).catch(code=>{
                    console.log(code);
                })
            },
            save_edit(id,form){
                let index = this.roleTable.tableList.indexOfFun(id,function (old,id) {
                    return old.id === id;
                })
                this.roleTable.tableList[index].name=form.name;
                this.roleTable.tableList[index].remark=form.remark;
                this.roleTable.tableList[index].status=form.status;
            },
//            ----------------------------------------------------  删除
            cur_delete(id){
                let name = '';
                var index = this.roleTable.tableList.indexOfFun(id,function (old,id) {
                    if(old.id===id){
                        name = old.name;
                    }
                    return old.id === id;
                });
                this.$confirm(`您将删除【${name}】角色，确定进行此操作?`,'提示',{
                    confirmButtonText:"确定",
                    cancelButtonText:"取消",
                    type:"warning"
                }).then(()=>{
                    this.$http(api_role_delete,id).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.roleTable.tableList.splice(index,1);
                        this.$set(this.roleTable,'totalSize',this.roleTable.totalSize-1)
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message||code
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消"
                    })
                })
            },
//            ----------------------------------------------------  分页
            size_change(size){
                this.roleTable.pageSize = size;
                this.init();
            },
            current_change(page){
                this.roleTable.page = page;
                this.init();
            },
//            ----------------------------------------------------  更改状态
            change_status(row){
                this.$confirm(`您将更改 ${row.name} 角色状态，确定进行此操作？`,"提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let status= row.status?1:0;
                    let params = {
                        id:row.id,
                        status:status
                    }
                    this.$http(api_change_status,params).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message
                        })
                    }).catch(code=>{
                        this.$message({
                            type:"error",
                            message:code.message
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    })
                    row.status = !row.status;
                })

            },
//            ----------------------------------------------------  搜索
            search(){
                this.init();
            },
//            ----------------------------------------------------  清空搜索
            clear_search(){
                this.searchData.snText = '';
                this.init();
            },
//            ----------------------------------------------------  更改状态
            change_select(index){
                this.currentStatus = this.userStatus[index].status;
                this.init();
            }
//            ----------------------------------------------------  提娜佳
        },
        computed:{
            filterTable(){
                return this.roleTable.tableList.filter(row=>{
                    row.status = row.status ? true:false;
                    switch (this.currentStatus){
                        case -1:
                            return true;
                        case 0:
                            return !row.status;
                        case 1:
                            return row.status;
                    }
                })
            },
            emptyText() {
                return this.firstLoading?'请查询数据':'暂无数据'
            },
        },
        components:{
            labelButtons,
            addRole,
            edit,
            memManagement,
            nodeManager:require('./node-manager.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require("../../../components/search-card.vue").default,
            copyRole:require("./copy-role.vue").default,
        }
    }

</script>
