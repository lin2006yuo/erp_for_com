<template>
    <page class="p-index">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <div>
                <label-button class="inline"
                              label="状态："
                              :buttons="statusList"
                              @select="changButton" ></label-button>
            </div>
            <div class="mb-mini">
                <el-select class="inline s-width-small"
                           v-sf.snType
                           v-model="searchData.snType">
                    <el-option v-for="item in conditionList"
                               :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-input class="inline"
                          v-sf.snText
                          :placeholder="`请输入${changeLabel}...`"
                          v-model="searchData.snText">
                </el-input>
                <label class="inline ml-sm">账号状态：</label>
                <el-select class="inline s-width-small"
                           v-sf.site_status
                           v-model="searchData.site_status">
                    <el-option v-for="item in accountStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <label class="inline ml-sm">授权状态：</label>
                <el-select
                    class="inline width-xs"
                    v-sf.authorization
                    v-model="searchData.authorization"
                    placeholder="请选择">
                    <el-option
                        v-for="item in authorList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label class="inline ml-sm">速卖通状态：</label>
                <el-select
                    class="inline width-xs"
                    v-sf.aliexpress_enabled
                    v-model="searchData.aliexpress_enabled"
                    placeholder="请选择">
                    <el-option
                        v-for="item in enabledList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <label class="inline">销售员：</label>
            <param-account
                class="inline s-width-default"
                ref="paramSale"
                placeholder="可输入搜索"
                v-model="searchData.seller_id"
                v-sf.seller_id
                :param="{type:'sales',data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="memberShipSales"
                url="get|user/:type/staffs">
            </param-account>
            <label class="inline ml-sm">客服：</label>
            <param-account
                class="inline s-width-default"
                ref="paramCustomer"
                placeholder="可输入搜索"
                v-model="searchData.customer_id"
                v-sf.customer_id
                :param="{type:'customer',data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="memberShipSales"
                url="get|user/:type/staffs">
            </param-account>
            <el-select v-model="searchData.taskName"
                       class="inline s-width-middle ml-sm"
                       v-sf.taskName
                       @change="change_taskName"
                       filterable>
                <el-option
                        v-for="res in taskNameList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="searchData.taskCondition"
                       class="inline"
                       style="width:60px"
                       v-sf.taskCondition
                       filterable>
                <el-option
                        v-for="res in taskList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"></el-option>
            </el-select>
            <el-select v-model="searchData.taskTime"
                       class="inline s-width-small mr-sm"
                       v-sf.taskTime
                       filterable>
                <el-option
                        v-for="res in taskTimeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select class="inline s-width-default ml-sm"
                       v-sf.time_type
                       v-model="searchData.time_type">
                <el-option v-for="item in dataList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                type="date"
                v-sf.start_date
                placeholder="开始时间"
                v-model="searchData.start_time"
                class="inline date"
                :picker-options="searchData.time_type!=='token'?pickerStart:tokenStart"
                ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
                type="date"
                placeholder="结束时间"
                v-sf.end_date
                v-model="searchData.end_time"
                class="inline date mr-sm"
                :picker-options="searchData.time_type!=='token'?pickerEnd:tokenEnd"
            ></el-date-picker>
        </search-card>
        <!--<permission-->
                <!--tag="ElButton"-->
                <!--:route="apis.url_aliexpress_add"-->
                <!--class="mt-xs mb-xs ml-sm"-->
                <!--type="primary"-->
                <!--size="mini"-->
                <!--@click.native="addDialogM">添加</permission>-->
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="mt-xs mb-xs">批量设置</el-button>
        <!--<add label="添加账号"-->
             <!--v-model="addDialog2"-->
             <!--@add-result="add_result"-->
             <!--:add-form="addForm"></add>-->
        <data-table
                :table-datas="tableDatas"
                :is-loading="isLoading"
                :switch-type="smtSwitch"
                :first-loading="firstLoading"
                @edit-result="edit_result"
                @log-form="log_form"
                @size-change="change_size"
                @current-change="change_page"
                @save-member="save_member"
                @cur-delete="cur_delete"
                @selection-change="selectionChange"
        ></data-table>
        <log-record
            v-model="logDialog"
            :log-data="logForm"
            :title="title"
        ></log-record>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :smt-data="smtData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">
    .smt-mt{
        margin-top:5px;
    }
</style>
<script>
    import {api_site_status} from '@/api/ymx';
    import labelButton from "../../../../components/label-buttons";
    import {aliexpress_account,api_post_user_update,api_aliexpress_account_log} from "../../../../api/aliexpress";
    import {url_aliexpress_add} from "../../../../api/aliexpress";
    import add from "./add";
    import dataTable from "./data-table";
    export default{
        permission:{
            url_aliexpress_add
        },
        page:{
            multiple:true,
        },
        refresh(){
            this.init();
        },
        created(){
            this.init();
        },
        data(){
            return {
                firstLoading:true,
                statusList:[
                    {name:"全部",status:-1},
                    {name:"启用",status:1},
                    {name:"停用",status:0},
                ],
                enabledList:[
                    {label:"全部",value:''},
                    {label:"有效",value:1},
                    {label:"失效",value:0},
                ],
                authorList:[
                    {label:"全部",value:-1},
                    {label:"未授权",value:0},
                    {label:"已授权",value:1},
                ],
                dataList:[
                    {label:"注册日期",value:'register'},
                    {label:'交接日期',value:'fulfill'},
                    {label:'密钥有效期',value:'token'}
                ],
                accountStatus:[],
                searchData:{
                    authorization:-1,
                    snType:"account_name",
                    aliexpress_enabled:'',
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    snText:"",
                    taskName:"download_listing",
                    taskCondition:"eq",
                    taskTime:"",
                },
                clears:{
                    authorization:-1,
                    aliexpress_enabled:'',
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    snType:"account_name",
                    snText:"",
                    taskName:"download_listing",
                    taskCondition:"eq",
                },
                conditionList:[
                    {label:"账户",value:"account_name"},
                    {label:"简称",value:"code"},
                ],
                taskNameList:[
                    {label:"抓取Listing数据",value:"download_listing"},
                    {label:"抓取订单数据",value:"download_order"},
                    {label:"抓取站内信数据",value:"download_message"},
                    {label:"同步发货状态",value:"sync_delivery"},
                ],
                taskList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],

                smtSwitch:-1,
                addDialog2:false,
                tableDatas:{
                    tatolSize:0,
                    lists:[],
                    page:1,
                    pageSize:50
                },
                addForm:{
                    code:"",
                    account_name:"",
                    server_id:"",
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    download_message:0,
                    download_health:0,
                    trad_percent:"0"
                },
                isLoading:true,
                selectData:[],
                logForm:[],
                logDialog:false,
                settingUp:false,
                smtData:{},
                title:'',
                taskTimeList: [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:'30分钟',value:30},
                    {label:'1小时',value:60},
                    {label:'2小时',value:120},
                    {label:'3小时',value:180},
                    {label:'4小时',value:240},
                    {label:'5小时',value:300},
                    {label:'6小时',value:360},
                    {label:'7小时',value:420},
                    {label:'8小时',value:480},
                    {label:'9小时',value:540},
                    {label:'10小时',value:600},
                    {label:'11小时',value:660},
                    {label:'12小时',value:720},
                    {label:'24小时',value:1440}
                ],
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time||time.getTime()>Date.now();
                        }
                    }
                },
                tokenStart: {
                    disabledDate: (time) => {
                        if (this.searchData.end_time) {
                            return time.getTime() > this.searchData.end_time
                        }else {
                            return false
                        }
                    }
                },
                tokenEnd: {
                    disabledDate: (time) => {
                        if (this.searchData.start_time) {
                            return time.getTime() < this.searchData.start_time
                        }else {
                            return false
                        }
                    }
                }
            }
        },
        mounted(){
            this.site_status();
        },
        methods:{
            site_status(){
                this.$http(api_site_status).then(res=>{
                    let data = res.map(row=>{
                        return {
                            label:row.remark,
                            value:row.status,
                        }
                    });
                    this.accountStatus= [{label: "全部", value: ""}, ...data]
                }).catch(code => {
                    this.$message({type:"error",code:code.message||code})
                });
            },
            sale_fix_result(res){
                let data=res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                });
                data.unshift({value:0,label:'空'});
                return data
            },
            selectionChange(select){
                this.selectData = select.map(res=>{
                    return res.id;
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title = '批量设置';
                this.smtData = {
                    is_invalid:'',
                    site_status:'',
                    download_listing:'',
                    download_order:'',
                    sync_delivery:'',
                    download_message:'',
                    download_health:'',
                };
            },
            log_form(row){   //-日志
                this.$http(api_aliexpress_account_log,row.id).then(res => {
                    this.title=`账号简称:${row.account_name}的操作日志`;
                    this.logDialog=true;
                    this.logForm=res
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                });
            },
            setClich(val){
                val.is_invalid!==''&&( val.is_invalid = val.is_invalid ? 1 : 0);
                let parmes = val;
                this.$set(parmes,'ids',this.selectData);
                this.$http(api_post_user_update,parmes).then(res=>{
                    this.settingUp = false;
                    this.init();
                    this.$message({type:'success',message: res.message});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                });
            },
            change_taskName(){
                this.searchData.taskTime = '';
            },
            init_status_btn(){
                let curBtn = this.statusList;
                this.statusList = [];
                this.$nextTick(()=>{
                    this.statusList = curBtn;
                });
            },
//--------------------------------------------------------------tableDatas初始数据
            init(){
                this.isLoading = true;
                let params = {
                    taskName:this.searchData.taskName,
                    taskCondition:this.searchData.taskCondition,
                    taskTime:this.searchData.taskTime,
                    aliexpress_enabled:this.searchData.aliexpress_enabled
                };
                this.tableDatas.page && (params.page = this.tableDatas.page);
                this.tableDatas.pageSize && (params.pageSize = this.tableDatas.pageSize);
                this.searchData.status > -1 && (params.status =  this.searchData.status);
                params.authorization = this.searchData.authorization;
                this.searchData.snType && (params.snType = this.searchData.snType);
                this.searchData.time_type && (params.time_type = this.searchData.time_type);
                this.searchData.site_status && (params.site_status = this.searchData.site_status);
                this.searchData.seller_id!=='' && (params.seller_id = this.searchData.seller_id);
                this.searchData.customer_id!=='' && (params.customer_id = this.searchData.customer_id);
                this.searchData.snText && (params.snText = this.searchData.snText.trim());
                this.searchData.start_time&&(params.start_time = datef('YYYY-MM-dd', this.searchData.start_time / 1000));
                this.searchData.end_time&&(params.end_time = datef('YYYY-MM-dd', this.searchData.end_time / 1000));
                this.tableDatas.lists=[];
                this.$http(aliexpress_account,params).then(res=>{
                    this.tableDatas.lists=res.data;
                    this.tableDatas.tatolSize=res.count;
                    this.tableDatas.lists.map(row=>{});
                    this.isLoading = false;
                    this.firstLoading = false
                }).catch(code=>{
                    console.log(code);
                    this.isLoading = false;
                });
            },
            authorChange(){
                this.init();
            },
//            -----------------------------------------------------  搜索
            search(){
                this.init();
            },
            clear_search(){
                this.searchData.snType = "account_name";
                this.searchData.snText = "";
                this.init();
            },
            addDialogM(){
                this.addDialog2=true;
                this.addForm={
                        code:"",
                        account_name:"",
                        download_listing:0,
                        download_order:0,
                        sync_delivery:0,
                        download_message:0,
                        trad_percent:"0",
                        download_health:0,
                }
            },
            change_condition(){

            },
            changButton(index){
                this.smtSwitch = this.statusList[index].status;
                this.init();
            },
            add_result(id,val){
            	this.$set(val,'id',id);
            	this.$set(val,'is_invalid',1);
                this.tableDatas.lists.unshift(val);
                this.tableDatas.tatolSize++;
            },
            /*table页面更新*/
            edit_result(id,data){
                this.tableDatas.lists.forEach(res=>{
                	if(res.id===id){
                        Object.assign(res,data);
                    }
                })
            },
            change_page(page){
                this.tableDatas.page = page;
                this.init();
            },
            change_size(size){
                this.tableDatas.pageSize = size;
                this.init();
            },
            save_member(){
                this.init();
            },
            cur_delete(){
                this.init();
            }
        },
        computed:{
            changeLabel(){
                if(this.searchData.snType === 'account_name'){
                    return `账户`;
                }else{
                    return `简称`;
                }
            }
        },
        components: {
            labelButton,
            add,
            dataTable,
            searchCard:require('../../../../components/search-card.vue').default,
            editBatch:require('./edit-batch.vue').default,
            logRecord:require('../look-log.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,

        }
    }
</script>
