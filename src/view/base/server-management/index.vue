<template>
    <page>
        <search-card @search="search" @enter='search':params="searchData" :clears="clears">
            <label-buttons label="类型：" :buttons="typeBtn" @select="select_type"></label-buttons>
            <label-item class="mr-sm">
                <el-select v-model="searchData.snType"
                           class="s-width-default mr-sm"
                           v-sf.snType>
                    <el-option v-for="type in snTypeList"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-input class="width-sm"
                          v-sf.name
                          v-model="searchData.snText"
                          @keyup.enter.native="serverEnter($event)"></el-input>
            </label-item>
            <label-item class="mr-sm">
                <el-select v-model="searchData.snDate"
                           class="s-width-small mr-sm"
                           v-sf.snDate>
                    <el-option v-for="type in time_type_list"
                               :key="type.value"
                               :label="type.label"
                               :value="type.value">
                    </el-option>
                </el-select>
                <el-date-picker
                        v-model="searchData.date_b"
                        v-sf.date_b
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeStart">
                </el-date-picker>
                <label>&nbsp;--&nbsp;</label>
                <el-date-picker
                        v-model="searchData.date_e"
                        v-sf.date_e
                        type="date"
                        placeholder="选择日期"
                        class="inline date"
                        :picker-options="inputTimeEnd">
                </el-date-picker>
            </label-item>
        </search-card>
        <permission tag="ElButton"
                    :route="apis.url_add_server"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    @click.natvie="add">添加</permission>
        <permission tag="ElButton"
                    :route="apis.url_post_export_server"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    @click.natvie="exportServer">导出服务器</permission>
        <permission tag="ElButton"
                    :route="apis.url_post_export_user"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    @click.natvie="exportServerMembers">导出服务器成员</permission>
        <permission tag="ElButton"
                    :route="apis.url_post_reporting_batch"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    :disabled="selectList.length===0"
                    @click.natvie="batchSet">批量设置上报周期</permission>
        <el-table :data="tableData"
                  class="scroll-bar"
                  v-loading="loading"
                  highlightCurrentRow
                  element-loading-text="玩命加载中..."
                  @selection-change="handle_selection_change"
                  v-resize={height:41}>
            <div slot="empty" class="no-data-reminder">
                <i></i>
                {{emptyText}}
            </div>
            <el-table-column
                    type="selection"
                    width="50">
            </el-table-column>
            <el-table-column label="ID" inline-template>
                <span>{{row.id}}</span>
            </el-table-column>
            <el-table-column label="服务器名" inline-template>
                <div>
                    <ui-tip :content="row.name" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="IP地址" inline-template>
                <div>
                    <ui-tip :content="row.ip" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="访问IP" inline-template>
                <div>
                    <ui-tip :content="row.visit_ip" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="MAC地址" inline-template>
                <div>
                    <ui-tip :content="row.mac" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="域名" inline-template>
                <div>
                    <ui-tip :content="row.domain" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="类型" inline-template>
                <div>
                    <ui-tip :content="row.type | type_filter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="被引用数" inline-template>
                <div>
                    <el-button type="text" @click.native="check_details(row)">{{row.use?row.use:''}}</el-button>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <permission
                            tag="ElSwitch"
                            :route="apis.url_post_servers_status"
                            :key="row.id"
                            :value="row.status?false:true"
                            on-text="启用"
                            off-text="停用"
                            @change="change_status(row)"></permission>
                </div>
            </el-table-column>
            <el-table-column label="创建时间" inline-template>
                <div>
                    <ui-tip :content="row.create_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="更新时间" inline-template>
                <div>
                    <ui-tip :content="row.update_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="上报时间" inline-template>
                <div>
                    <ui-tip :content="row.reporting_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                    <permission tag="span"
                                class="operate"
                                :route="apis.url_edit_server"
                                @click="edit(scope.row)">编辑
                    </permission>
                    <span>|</span>
                    <permission tag="span"
                                class="operate"
                                :route="apis.url_edit_server"
                                @click="manage(scope.row)">成员管理
                    </permission>
                    <span>|</span>
                    <permission tag="span"
                                class="operate"
                                :route="apis.url_servers_log"
                                @click="log(scope.row)">日志
                    </permission>
                    <span>|</span>
                    <permission tag="span"
                                class="operate"
                                :route="apis.url_update_server"
                                @click="deleteServer(scope.row)">删除
                    </permission>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="page-fixed"
                @size-change="handle_size_change"
                @current-change="handle_current_change"
                :current-page="searchData.page"
                :page-sizes="[20, 50, 100, 200,500]"
                :page-size="searchData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <add-edit v-model="add_edit_visiable"
                  @search="search"
                  :server-data="serverData"
                  :action="action"
                  @add-update="add_update"
                  @edit-update="edit_update">
        </add-edit>
        <!--<manage v-model="manage_visiable"-->
        <!--:action="action"-->
        <!--:loading="loading"-->
        <!--:manageData="manageData">-->
        <!--</manage>-->
        <export-dialog v-model="export_visible"></export-dialog>
        <batch-set v-model="batchSetDialog" @confirm="confirm_set"></batch-set>
        <details-dialog v-model="details_visiable" :details-data="detailsData" :cur-name="curName"></details-dialog>
        <member-management v-model="memberManagementShow"
                           :title="memberManagementTitle"
                           :list="memberManagementList"
                           :server-id="serverId"
                           :name="name">
        </member-management>
        <log v-model="log_show" :title="log_title" :logList="logList"></log>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_get_server, api_edit_server,
        api_delete_server, api_get_serveraccount,
        api_post_export_server, api_post_export_user,
        api_post_reporting_batch,
        api_post_servers_status,
        api_get_servers_use_info,
        api_servers_log,
        url_post_servers_status,
        url_post_reporting_batch,
        url_edit_server,
        url_update_server,
        url_add_server,
        url_get_serveraccount,
        url_post_export_server,
        url_servers_log,
        url_post_export_user} from '../../../api/server-management'
    import {mapActions,mapGetters} from 'vuex';
    import {downloadFile} from '@/lib/http';
    import memberManagement from './member-management';
    export default {
        permission:{
            url_edit_server,
            url_update_server,
            url_add_server,
            url_get_serveraccount,
            url_post_export_server,
            url_post_export_user,
            url_post_reporting_batch,
            url_post_servers_status,
            url_servers_log
        },
        page:{
            devinfo:{
                frontEnd:'张明亮',
                backEnd:'张文宇',
                createTime:'2017-8-5',
                updateTime:'2017-8-22'
            }
        },
        refresh(){
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                loading: false,
                time_type_list:[
                    {label: '创建时间', value: 'created'},
                    {label: '更新时间', value: 'updated'}
                ],
                snTypeList:[
                    {label: '服务器名称', value: 'name'},
                    {label: 'IP地址', value: 'ip'},
                    {label: 'MAC地址', value: 'mac'}
                ],
                searchData:{
                    snType: 'name',
                    snText: '',
                    snDate:'created',
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20
                },
                type: '',
                clears:{
                    snType: 'name',
                    snText: '',
                    snDate:'created',
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20
                },
                total:0,
                action:{
                    title:'',
                    type:'',
                    id:''
                },
                // serverData:{
                //     name:'',
                //     ip:'',
                //     mac:'',
                //     domain:'',
                //     type:0,
                //     admin:'',
                //     password:'',
                //     reporting_cycle:'',
                //     network_ip:'',
                //     ip_type:0
                // },
                serverData: {},
                manageData:[],
                inputTimeStart: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_e){
                            return time.getTime() > this.searchData.date_e;
                        }else {
                            return false
                        }
                    }
                },//开始时间
                inputTimeEnd: {
                    disabledDate: (time)=> {
                        if(this.searchData.date_b){
                            return time.getTime() < this.searchData.date_b;
                        }else {
                            return false
                        }
                    }
                },//结束时间
                add_edit_visiable: false,
                manage_visiable:false,
                new_server:{},
                export_visible: false,
                selectList: [],
                batchSetDialog: false,
                details_visiable: false,
                detailsData:[],
                curName: '',
                typeBtn: [
                    {label: '全部', value: ''},
                    {label: '虚拟机', value: 0},
                    {label: '云服务', value: 1},
                    {label: '超级浏览器', value: 2}
                ],
                memberManagementShow:false,
                memberManagementTitle:'',
                memberManagementList:[],
                serverId:0,
                name:'',
                log_show:false,
                log_title:'',
                logList:[]
            }
        },
        mounted(){
            this.init();
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            type_filter(val){
                switch (val){
                    case 0:
                        return '虚拟机';
                        break;
                    case 1:
                        return '云服务';
                        break;
                    case 2:
                        return '超级浏览器';
                        break;
                }
            }
        },
        methods: {
            ...mapActions({
                set_info:'server-ip/set_info',
                addServer:'server-ip/addServer',
                editServer:'server-ip/editServer'
            }),
            init(){
                this.loading = true;
                //处理年月日 YYYY-MM-dd
                let data=clone(this.searchData);
                if(this.searchData.date_b){
                    data.date_b=datef('YYYY-MM-dd', this.searchData.date_b.getTime()/1000);
                }else {
                    data.date_b='';
                }
                if(this.searchData.date_e){
                    data.date_e=datef('YYYY-MM-dd', this.searchData.date_e.getTime()/1000);
                }else {
                    data.date_e='';
                }
                if(this.type!==''){
                    this.$set(data,'type',this.type)
                }
                this.$http(api_get_server, data).then(res=>{
                    this.loading = false;
                    this.set_info(res.data);
                    this.total = res.count;
                    this.firstLoading = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            //分页器
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.init()
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.init();
            },
            search(){
                this.init();
            },
            clearSearch(data){
                Object.keys(data).forEach(key=>{
                    data[key] = "";
                });
                data.snDate = 'created';
                data.page = 1;
                data.pageSize = 20;
                this.init();
            },
            log(row){
                this.log_title = `服务器：${row.name}的操作日志`;
                let data = {
                    id:row.id
                };
                this.$http(api_servers_log,data).then(res=>{
                    this.logList = res.data
                });
                this.log_show = true
            },
            add(){
                this.add_edit_visiable = true;
                this.serverData = {
                    name:'',
                    ip:'',
                    mac:'',
                    domain:'',
                    type:0,
                    admin:'',
                    password:'',
                    reporting_cycle:'',
                    network_ip:'',
                    ip_type:''
                };
                this.action.title = '添加服务器';
                this.action.type = 'add';
            },
            select_type(val, item){
                this.type = item.value;
                this.init()
            },
            exportServer(){//导出服务器列表
                let data=clone(this.searchData);
                if(this.searchData.date_b){
                    data.date_b=datef('YYYY-MM-dd', this.searchData.date_b.getTime()/1000);
                }else {
                    data.date_b='';
                }
                if(this.searchData.date_e){
                    data.date_e=datef('YYYY-MM-dd', this.searchData.date_e.getTime()/1000);
                }else {
                    data.date_e='';
                }
                delete data.page;
                delete data.pageSize;
                this.$http(api_post_export_server,data).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';

                    let params = {
                        file_code:res.file_code
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:'.xls',
                    });
                }).catch(code => {
                    this.$message({type:"error",message:code.message||code})
                });
            },
            exportServerMembers(){//导出服务器成员
                if(!!this.selectList.length){
                    let server_ids = this.selectList.map(k=>k.id);
                    this.$http(api_post_export_user,{server_ids:server_ids}).then(res=>{
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    })
                }else {
                    this.$message({type:"warning",message:'请选择需要导出的服务器成员'})
                }
            },
            batchSet(){//打开批量设置弹窗
                this.batchSetDialog = true
            },
            confirm_set(val){//确定批量设置上报周期
                let params = {
                    ids: '',
                    reporting_cycle: val
                };
                params.ids = JSON.stringify(this.selectList.map(row => row.id));
                this.$http(api_post_reporting_batch,params).then(res => {
                    this.$message({type: 'success', message: res.message})
                    this.batchSetDialog = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            handle_selection_change(val){//多选列表选中按钮变成可点击
                this.selectList = val
            },
            edit(row){
                this.action.title = `编辑服务器${row.name}`;
                this.action.type = 'edit';
                this.$http(api_edit_server, row.id).then(res=>{
                    this.serverData = res;
                    this.$set(this.serverData, 'create_time', row.create_time);
                    this.add_edit_visiable = true;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message || code});
                })
            },
            deleteServer(row){
                this.$confirm(`您将删除服务器${row.name}，确认此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http(api_delete_server, row.id).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        let i = this.tableData.indexOfFun(row,function (old,row) {
                            return old.id===row.id
                        });
                        this.tableData.splice(i,1);
                        this.total -= 1;
                    }).catch(code=>{
                        this.$message({type:'error',message:code.message||code});
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            manage(row) {
                this.$http(api_get_serveraccount, {server_id: row.id}).then(res => {
                    this.memberManagementTitle = `服务器${row.name}的成员管理`;
                    this.serverId = row.id;
                    this.name = row.name;
                    this.memberManagementList = res;
                    this.memberManagementShow = true;
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                });
            },
            // async manage(row){
            //     this.loading = true;
            //     this.action = {
            //         title:`服务器${row.name}的成员管理`,
            //         server_id:row.id
            //     };
            //     try {
            //         let res = await this.$http(api_get_serveraccount, {server_id:row.id});
            //         this.manageData = res.map(row=>{
            //             return {
            //                 user:{
            //                     label:row.user.user_label,
            //                     value:row.user.user_id
            //                 },
            //                 username:row.username,
            //                 password:row.password,
            //                 isCheck:false
            //             }
            //         });
            //         this.manage_visiable = true;
            //     } catch(code) {
            //       this.$message({type:"error",message:code.message || code});
            //     } finally {
            //         this.loading = false;
            //     }
            // },
            serverEnter(){
                this.search();
            },
            add_update(id,val){
                let time = Date.parse(new Date);
                time=time/1000;
                this.$set(val,"id",id);
                this.$set(val,"create_time",time);
                this.tableData.unshift(val);
                this.tableData.total++;
                this.addServer(val);
            },
            edit_update(id,data){
                let time = Date.parse(new Date);
                time=time/1000;
                this.$set(data,"update_time",time);
                this.tableData.forEach(res=>{
                    if(res.id===id){
                        res.name = data.name;
                        res.ip = data.ip;
                        res.mac = data.mac;
                        res.update_time = time;
                    }
                });
                this.editServer(data);
            },
            change_status(row){
                this.$confirm(`此操作将更改  ${row.name}  服务器状态, 确定进行此操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal:false,
                }).then(() => {
                    let params = {
                        id: row.id,
                        status: row.status ? 0 : 1
                    };
                    this.$http(api_post_servers_status, params).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init()
                    }).catch(fail=>{
                        this.$message({
                            type:"error",
                            message:fail.message||fail
                        })
                    })
                }).catch(()=>{
                    this.$message({
                        type:"info",
                        message:"已取消操作"
                    })
                })
            },
            check_details(row){
                this.$http(api_get_servers_use_info,row.id).then(res => {
                    this.detailsData = res.data;
                    this.curName = row.name;
                    this.details_visiable = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            }
        },
        computed: {
            ...mapGetters({
                'tableData':'server-ip/info'
            }),
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            },
        },
        watch: {},
        props: {},
        components: {
            addEdit:require('./add-edit.vue').default,
            // manage:require('./mange.vue').default,
            labelItem:require('../../../components/label-item.vue').default,
            uiTip:require('../../../components/ui-tip.vue').default,
            searchCard:require('../../../components/search-card.vue').default,
            exportDialog: require('../../report/export-dialog').default,
            batchSet:require('./batch-set.vue').default,
            detailsDialog: require('./details-dialog.vue').default,
            labelButtons:require('@/components/label-all-buttons.vue').default,
            log:require('./log').default,
            memberManagement
        },
    }
</script>
