<template>
    <page class=" department">
        <div class="ml-sm mt-sm mb-xs">
            <permission tag="ElButton" type="primary" size="mini" @click="add"
                        :route="apis.url_depart_add">添加
            </permission>
            <permission tag="requestButton"  v-if="isChange"  class="ml-sm" :request="save"
                        :route="apis.url_department_sort">保存
            </permission>
            <permission tag="ElButton" @click.native="cancel" class="ml-sm" type="warning"
                        v-if="isChange"  size="mini" :route="apis.url_department_sort">取消</permission>
        </div>
        <el-card>
            <depart-menu :tree="dataList"
                         v-loading="loading"
                         element-loading-text="玩命加载中..."
                         @after="after"
                         @setting="setting"
                         @info="info"
                         @delete2="delete2"
                         @change-nodes="change_nodes"
                         @change-status="chang_status"
            ></depart-menu>
            <div v-if="dataList.length <= 0">
                菜单空空如也
            </div>
        </el-card>
        <add-form ref="addForm"
                  v-model="add_dialog"
                  :form-data="formData"
                  :markId='markId'
                  :isEdit="isEdit"
                  :title-name="titleName"
                  @add-depart="addDepart"
                  @refresh="refresh"></add-form>
    </page>
</template>
<style lang="stylus">
    .department {
        .el-card__body{
            padding: 0;
        }
        .el-table__body-wrapper {
            overflow-x: hidden;
        }
        .option {
            width: 90%;
            text-align: right;
        }
        .el-switch__input:checked + .el-switch__core {
            border-color: #20a0ff;
            background-color: #20a0ff;
        }
        .el-switch__core {
            background-color: #20a0ff;
        }
    }
</style>
<script>
    import searchList from './search-list.vue'
    import addForm from './add-form.vue'
    import departMenu from "./depart-menu"
    import {
        depart_list,
        depart_edit,
        depart_check,
        depart_status,
        depart_del,
        api_department_sort,
        url_department_sort,
        url_depart_add
    } from '../../../api/department'

    export default {
        permission: {
            url_depart_add,
            url_department_sort
        },
        page: {},
        refresh() {
            this.init();
        },
        data() {
            return {
                changeNodes: [],
                sorts:[],
                deletes:[],
                titleName: '',
                add_dialog: false,
                markId: 0,//-------标示id
                isEdit: false,
                formData: {
                    pid: 0,
                    name: '',
                    remark: '',
                    status: 1,
                    leader_id:[
                        {user_id:1,job_id:1}
                    ],
                    job:"",
                    type:1
                },

                dataParams: {
                    status: "",
                    snText: '',
                    snType: "",
                },
                butStatus: [
                    {name: "全部", status: ''},
                    {name: "已启用", status: 1},
                    {name: "已停用", status: 0}
                ],

                dataList: {},
                dataListOld: {},
                loading: true,
                editLoading:false,
            }
        },
        created() {
            this.init()
        },
        methods: {
            init() {/*-------------------------------初始化*/
                this.loading=true;
                this.$http(depart_list, this.dataParams).then(res => {
                    this.loading=false;
                    this.dataList = res;
                    this.dataListOld = window.clone(this.dataList);
                }).catch(code => {
                    this.$message({message:code.message || code, type: 'error'});
                })
            },
            addDepart(departId, departInfo) {
                this.init();
//                this.$set(this.dataList, departId, Object.assign({id:departId}, departInfo));
//                if(departInfo.pid){
//                    console.log("child_ids",this.dataList[departInfo.pid].child_ids);
//                    if(this.dataList[departInfo.pid].child_ids === undefined){
//                        this.$set(this.dataList[departInfo.pid], 'child_ids', [departId]);
//                    }else{
//                    console.log(this.dataList[departInfo.pid]);
//                    console.log(departId);
//                        this.dataList[departInfo.pid].child_ids.push(departId);
//                    }
//                }
//                this.$forceUpdate();
            },
            after(id) {
                this.markId = 0;
                this.isEdit = true;
                this.titleName = '添加部门';
                this.formData = {
                    pid: id,
                    name: '',
                    remark: '',
                    status: 1,
                    leader_id:[
                        {user_id:'',job_id:''}
                    ],
                    job:"",
                    type:1
                };
                this.add_dialog = true;
            },
            setting(row) {
                this.markId = row.id;
                this.isEdit = true;
                this.titleName = `修改部门：${row.name} 信息`;
                this.$http(depart_edit, row.id).then(res => {
                    if(res.leader_id.length<=0||!res.leader_id)  res.leader_id = [{user_id:"",job_id:""}];
                    res.leader_id.forEach(row=>{
                        if(parseInt(row.user_id)===0)row.user_id='';
                        if(parseInt(row.job_id)===0)row.job_id='';
                    });
                    this.formData = clone(res);
                    this.$nextTick(()=>{
                        this.$refs.addForm.get_job();
                        this.formData.leader_id = clone(res.leader_id);
                    });
                    this.add_dialog = true;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            delete2(row) {
                let node = this.dataList[row.id];
                if (node.child_ids.length > 0) {
                    this.$message({
                        type: 'error',
                        message: "请先删除所有子分类"
                    });
                    return;
                }
                this.$confirm('您将删除' + row.name + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$http(depart_del, row.id).then(res => {
                        this.$message({type: "success", message: res.message || res})
                        this.init()
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作'
                    });
                });
            },
            change_nodes() {
                let pids = arguments;
                for(let i = 0; i < pids.length; i++){
                    let pid = pids[i];
                    if(this.sorts.indexOfFun(opid => pid === opid) <= -1){
                        this.sorts.push(pid);
                    }
                }
            },
            info(row) {
                this.add_dialog = true;
                this.isEdit = false;
                this.titleName = `查看部门：${row.name} 信息`;
                this.$http(depart_check, row.id).then(res => {
                    if(res.leader_id.length<=0||!res.leader_id)  res.leader_id = [{user_id:"",job_id:""}];
                    res.leader_id.forEach(row=>{
                        if(parseInt(row.user_id)===0)row.user_id='';
                        if(parseInt(row.job_id)===0)row.job_id='';
                    });
                    this.formData = clone(res);
                    this.$refs.addForm.get_job();
                    this.$nextTick(()=>{
                        this.formData.leader_id = clone(res.leader_id);
                    });
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            changeSelect(val) {/*------------------------------------更改状态*/
                console.log(val);
                this.dataParams.status = this.butStatus[val].status;
                this.init()
            },
            search(key) {/*----------------------------------搜索*/
                this.dataParams.snText = key;
                this.init()
            },
            add() {/*----------------------------------添加*/
                this.markId = 0;
                this.add_dialog = true;
                this.isEdit = true;
                this.titleName = '添加部门';
                this.formData = {
                    pid: 0,
                    name: '',
                    remark: '',
                    status: 1,
                    leader_id:[
                        {user_id:"",job_id:""}
                    ],
                    job:"",
                    type:1
                }
            },
            chang_status(row) {/*-----------------------------------启用禁用*/
                let statusTitle = row.status ? '启用' : '停用';
                this.$confirm('您将' + statusTitle + row.name + '，确认此操作吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    let status = row.status ? 1 : 0;
                    let data = {
                        id: row.id,
                        status: status
                    };
                    this.$http(depart_status, data).then(res => {
                        this.$message({type: "success", message: res.message || res})
//                        row.status=!row.status
                    }).catch(code => {
                        this.$message({type: "error", message: code.message || code})
                    })

                }).catch((code) => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + statusTitle
                    });
                    row.status = !row.status
                });
            },

            refresh() {/*------刷新*/
                this.init()
            },
            save(){
                let sort = [];
                this.sorts.map(pid=>{
                    let menu = this.dataList[pid];
                    let menu_old = this.dataListOld[pid];
                    let child_ids = menu.child_ids || [];
                    let child_ids_old = menu_old.child_ids || [];
                    child_ids.forEach((row)=>{
                    	let find = child_ids_old.find(item =>{
                    		return item === row;
                        });
                    	if(!find){
                            sort.push({id:row,pid:pid});
                        }
                    });
                });
                this.$http(api_department_sort, {sort:sort}).then(res=>{
                    this.sorts = [];
                    this.deletes = [];
                    this.$message({
                        type:'success',
                        message:res.message || res
                    });
                }).catch(code=>{
                    this.$message({
                        type:'error',
                        message:code.message || code
                    });
                });
            },
            cancel(){
                this.sorts = [];
                this.deletes = [];
                this.init();
            },

        },
        computed:{
            isChange(){
                return this.deletes.length > 0 || this.sorts.length > 0;
            }
        },
        filters: {
            deparmentFilter(val) {
                if (val) {
                    return val;
                } else {
                    return '-无-'
                }
            }
        },
        components: {
            searchList,
            addForm,
            departMenu,
            requestButton:require('../../../global-components/request-button').default
        }
    }
</script>
