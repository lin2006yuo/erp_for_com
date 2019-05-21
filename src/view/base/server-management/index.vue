<template>
    <page>
        <el-row class="wish-searchList">
            <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
                <el-row>
                    <label-buttons class="inline" label="类型：" :buttons="typeBtn" @select="select_type"></label-buttons>
                    <label-buttons v-if="disabledBtn" class="inline ml-sm" label="外网类型：" :buttons="outsideStatus" @select="outside_type"></label-buttons>
                </el-row>
                <el-row>
                    <label-buttons class="inline" label="上报周期状态：" :buttons="typeReport" @select="reporting_type"></label-buttons>
                    <label-buttons class="inline ml-sm" label="状态：" :buttons="typeStatus" @select="status_type"></label-buttons>
                </el-row>
                <label-item class="mr-sm">
                    <el-select v-model="searchData.snType"
                               class="s-width-default mr-xs"
                               v-sf.snType>
                        <el-option v-for="type in snTypeList"
                                   :key="type.value"
                                   :label="type.label"
                                   :value="type.value">
                        </el-option>
                    </el-select>
                    <order-input class="width-super mr-sm"
                                 v-model="searchData.snText"
                                 placeholder="可批量搜索，Shift+回车换行..."
                                 @keydown="serverEnter"
                                 v-sf.snText></order-input>
                </label-item>
                <label-item label="被引用数：" class="inline mr-sm">
                    <natural-number-input v-model.number="searchData.sNum"
                                          v-sf.sNum
                                          :min="0"
                                          :is-appear="false"
                                          class="width-xs">
                    </natural-number-input>
                    <label>~</label>
                    <natural-number-input v-model.number="searchData.eNum"
                                          v-sf.eNum
                                          :min="0"
                                          :is-appear="false"
                                          class="width-xs">
                    </natural-number-input>
                </label-item>
                <label-item>
                    <el-select v-model="searchData.snDate"
                               class="s-width-default mr-xs"
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
        </el-row>
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
        <permission tag="trendsSelect"
                    class="inline ml-xs"
                    type="primary"
                    :route="apis.url_post_export_user"
                    :selects="exportServerOptions"
                    @trigger="exportServerMembers">
        </permission>
        <permission tag="ElButton"
                    :route="apis.url_post_reporting_batch"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    :disabled="selectList.length===0"
                    @click.natvie="batchSet">批量设置上报周期</permission>
        <permission tag="ElButton"
                    :route="apis.url_post_batch_status"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    :disabled="selectList.length===0"
                    @click.natvie="batch_status">批量设置</permission>
        <permission tag="ElButton"
                    :route="apis.url_servers_notify"
                    type="primary"
                    size="mini"
                    class="ml-sm mt-xs mb-xs"
                    :disabled="selectList.length===0"
                    @click.natvie="mass_notify">通知</permission>
        <el-table :data="tableData"
                  class="scroll-bar"
                  v-loading="loading"
                  highlightCurrentRow
                  element-loading-text="玩命加载中..."
                  @sort-change="sort_change"
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
                    <ui-tip :content="row.type" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="被引用数" sortable inline-template>
                <div>
                    <el-button type="text" @click.native="check_details(row)" :class="[row.use?'':'disabled activeRed']">{{row.use?row.use:''}}</el-button>
                </div>
            </el-table-column>
            <el-table-column label="状态" inline-template>
                <div>
                    <ui-tip :content="row.status | statusFilter" :width="98"></ui-tip>
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
            <el-table-column label="最新上报时间" inline-template>
                <div>
                    <ui-tip :content="row.reporting_time | timeFilter" :width="98"></ui-tip>
                </div>
            </el-table-column>
            <el-table-column label="操作" width="180">
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
                  :server-data="serverData"
                  :action="action"
                  @update="init">
        </add-edit>
        <export-dialog v-model="export_visible"></export-dialog>
        <batch-set v-model="batchSetDialog" @confirm="confirm_set"></batch-set>
        <details-dialog v-model="details_visiable" :details-data="detailsData" :cur-name="curName"></details-dialog>
        <member-management v-model="memberManagementShow"
                           :title="memberManagementTitle"
                           :list="memberManagementList"
                           :server-id="serverId"
                           :name="name"
                           @submit="submit">
        </member-management>
        <log v-model="log_show" :title="log_title" :logList="logList"></log>
        <status-page v-model="batchPage" :batchids="batchids" @submit="init"></status-page>
        <notify-page v-model="notifyPage" :batchids="batchids" :title="title" @submit="init"></notify-page>
    </page>
</template>
<style lang="stylus" scoped>
    .c-trends-select
        width 141px
    .activeRed{
        color #a29f9c
    }
    .disabled{
        pointer-events:none;
    }
    .wish-searchList{
        .el-card{
            overflow: inherit;
        }
    }
</style>
<script>
    import {api_get_server, api_edit_server,
        api_delete_server, api_get_serveraccount,
        api_post_export_server, api_post_export_user,
        api_post_reporting_batch,api_post_servers_status,
        api_get_servers_use_info,api_servers_log,
        api_get_servers_type,
        url_post_servers_status,url_post_reporting_batch,
        url_edit_server,url_update_server,url_add_server,
        url_get_serveraccount,url_post_export_server,
        url_servers_log,url_post_export_user,url_post_batch_status,
        url_servers_notify} from '../../../api/server-management'
    import {mapActions,mapGetters} from 'vuex';
    import {downloadFile} from '@/lib/http';
    import statusPage from './status-page.vue';
    import memberManagement from './member-management';
    import naturalNumberInput from '@/view/base/server-management/natural-number-input'
    export default {
        permission:{
            url_edit_server,url_update_server,url_add_server,
            url_get_serveraccount,url_post_export_server,
            url_post_export_user,url_post_reporting_batch,
            url_post_servers_status,url_servers_log,
            url_post_batch_status,url_servers_notify
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
                    {label: '更新时间', value: 'updated'},
                    {label:'最新上报时间',value:'reporting'}
                ],
                snTypeList:[
                    {label: '服务器名称', value: 'name'},
                    {label: 'IP地址', value: 'ip'},
                    {label: 'MAC地址', value: 'mac'}
                ],
                typeReport:[
                    {label: '全部', value: ''},
                    {label: '正常', value: 1},
                    {label: '异常', value: 2}
                ],
                outsideStatus:[],
                typeStatus:[
                    {label: '全部', value: ''},
                    {label: '已启用', value: 0},
                    {label: '已停用', value: 1},
                    {label: '新增', value: 2}
                ],
                searchData:{
                    snType: 'name',
                    snText: '',
                    all:0,
                    type:0,
                    snDate:'created',
                    date_b:'',
                    date_e:'',
                    page:1,
                    pageSize:20,
                    reporting_time:'',
                    status:0,
                    ip_type:'',
                    sNum:'',
                    eNum:''
                },
                exportServerOptions:[
                    {name:"部分导出服务器成员",value:2},
                    {name:"全部导出服务器成员",value:1},
                ],
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
                    {label: '超级浏览器', value: 2},
                    {label: '代理', value: 3},
                ],
                memberManagementShow:false,
                memberManagementTitle:'',
                memberManagementList:[],
                serverId:0,
                name:'',
                log_show:false,
                log_title:'',
                logList:[],
                disabledBtn:true,
                batchPage:false,
                batchids:[],
                search_type:'',
                use:'',
                notifyPage:false,
                title:''
            }
        },
        mounted(){
            this.init();
            this.servers_type();
        },
        filters:{
            timeFilter(val){
                if(val){
                    return datef('YYYY-MM-dd HH:mm:ss', val);
                } else {
                    return "--";
                }
            },
            statusFilter(val) {
                switch (val) {
                    case 0:
                        return `启用`;
                        break;
                    case 1:
                        return `停用`;
                        break;
                }
            },
        },
        methods: {
            ...mapActions({
                set_info:'server-ip/set_info',
                addServer:'server-ip/addServer',
                editServer:'server-ip/editServer'
            }),
            init(){
                if (this.searchData.sNum !== '' && this.searchData.eNum !== '') {
                    if ((this.searchData.sNum - 0) > (this.searchData.eNum - 0)) {
                        this.$message({type:'warning', message: "注册账号数结束不能小于开始值"});
                    }
                }
                this.loading = true;
                let data=clone(this.searchData);
                //处理年月日 YYYY-MM-dd
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd', this.searchData.date_b/1000):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd', this.searchData.date_e/1000):'';
                if(this.type!==''){
                    this.$set(data,'type',this.type)
                }
                if(this.use) {
                    this.$set(data,'use',this.use);
                }else if(this.use === 0){
                    this.$set(data,'use',0);
                }
                if(this.searchData.snText){
                    let list = this.searchData.snText.split('\n').filter(row=>!!row);
                    data.snText = list.length<=1?this.searchData.snText:list;
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
                let data = {id:row.id};
                this.$http(api_servers_log,data).then(res=>{
                    this.log_title = `服务器：${row.name}的操作日志`;
                    this.logList = res.data;
                    this.log_show = true;
                });
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
                    reporting_cycle:5,
                    network_ip:'',
                    ip_type:'',
                    proxy_ip:'',
                    proxy_agent:'',
                    proxy_port:'',
                    proxy_user_name:'',
                    proxy_user_password:'',
                    thread_quantity:10,
                    gateway:'',
                    user_agent:''
                };
                this.action.title = '添加服务器';
                this.action.type = 'add';
            },
            servers_type(){
                this.$http(api_get_servers_type).then(row=>{
                    this.outsideStatus = row.data;
                    this.outsideStatus.unshift({label:'全部',value:''});
                })
            },
            select_type(val, item){
                this.type = item.value;
                this.searchData.type=item.value;
                this.init();
            },
            reporting_type(val,item){
                this.searchData.reporting_time = item.value;
                this.init();
            },
            outside_type(val,item){
                this.searchData.ip_type = item.value;
                this.init();
            },
            status_type(val,item){
                this.searchData.status = item.value;
                this.init();
            },
            exportServer(){//导出服务器列表
                let data=clone(this.searchData);
                data.date_b=this.searchData.date_b?datef('YYYY-MM-dd', this.searchData.date_b/1000):'';
                data.date_e=this.searchData.date_e?datef('YYYY-MM-dd', this.searchData.date_e/1000):'';
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
            exportServerMembers(val){//导出服务器成员
                let data=clone(this.searchData);
                if(!!this.selectList.length && val.value===2){
                    let server_ids = this.selectList.map(k=>k.id);
                    data.server_ids=server_ids;
                    this.$http(api_post_export_user,data).then(res=>{
                        this.selectList.length=0;
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    })
                }else if(val.value===1){
                    data.all=1;
                    if(data.date_b&&data.date_e){
                        data.date_b = datef('YYYY-MM-dd',new Date(data.date_b).getTime()/1000);
                        data.date_e = datef('YYYY-MM-dd',new Date(data.date_e).getTime()/1000);
                    }
                    this.$http(api_post_export_user,data).then(res=>{
                        if (res.join_queue === 1) {
                            this.export_visible = true;
                            this.$message({type: "success", message: res.message || res});
                        }
                    })
                }else{
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
                this.$http(api_edit_server, row.id).then(res=>{
                    this.action.title = `编辑服务器${row.name}`;
                    this.action.type = 'edit';
                    this.$set(this.action,'type','edit');
                    this.serverData = res;
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
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            manage(row) {
                this.memberManagementTitle = `服务器${row.name}的成员管理`;
                this.serverId = row.id;
                this.name = row.name;
                this.manage_status(this.search_type);
                this.memberManagementShow = true;
            },
            submit(val){
                this.manage_status(val);
            },
            manage_status(val){
                let data = {
                    server_id: this.serverId,
                    status: val,
                };
                this.$http(api_get_serveraccount, data).then(res => {
                    this.memberManagementList = res;
                }).catch(error => {
                    error && this.$message({type: 'error', message: error.message || error});
                });
            },
            serverEnter(){
                this.search();
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
            check_details(row){
                this.$http(api_get_servers_use_info,row.id).then(res => {
                    this.detailsData = res.data;
                    this.curName = row.name;
                    this.details_visiable = true;
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            //批量修改状态
            batch_status(){
                this.batchPage = true;
                this.batchids = JSON.stringify(this.selectList.map(row => row.id));
            },
            //引用数排序
            sort_change(val){
                if(!val.column||!val.column.label)return;
                this.use = val.order==='ascending' ? 0 : 1;
                this.init();
            },
            //批量通知
            mass_notify(){
                this.title = '批量通知服务器的成员';
                this.notifyPage = true;
                this.batchids = JSON.stringify(this.selectList.map(row => row.id));
            }
        },
        computed: {
            ...mapGetters({
                'tableData':'server-ip/info'
            }),
            emptyText() {
                return this.firstLoading?'等待查询数据中...':'暂无数据'
            }
        },
        watch: {
            'searchData.type'(val) {
                if(val!==0){
                    return this.disabledBtn = false
                }else {
                    return this.disabledBtn = true
                }
            }
        },
        props: {},
        components: {
            addEdit:require('./add-edit.vue').default,
            trendsSelect: require('@/components/trends-select').default,
            labelItem:require('@/components/label-item.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
            searchCard:require('@/components/search-card.vue').default,
            exportDialog: require('../../report/export-dialog').default,
            batchSet:require('./batch-set.vue').default,
            detailsDialog: require('./details-dialog.vue').default,
            labelButtons:require('@/components/label-all-buttons.vue').default,
            log:require('./log').default,
            notifyPage : require('./notify-page.vue').default,
            orderInput: require("@/components/order-input.vue").default,
            memberManagement,statusPage,naturalNumberInput
        },
    }
</script>
