<template>
    <page class="p-index">
        <search-card @search="search" @enter='search' :params="searchData" :clears="clears">
            <div>
                <label-button class="inline"
                              label="状态："
                              :buttons="statusList"
                              @select="changButton" ></label-button>
                <div class="inline">
                    <label class="inline ml-sm mb-mini">授权状态：</label>
                    <el-select class="inline s-width-small mb-mini"
                               v-sf.authorization
                               v-model="searchData.authorization"
                               @change="authorChange">
                        <el-option v-for="item in authorList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
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
        </search-card>
        <permission
                tag="ElButton"
                :route="apis.url_aliexpress_add"
                class="mt-xs mb-xs ml-sm"
                type="primary"
                size="mini"
                @click.native="addDialogM">添加</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm">批量设置</el-button>
        <add label="添加账号"
             v-model="addDialog2"
             @add-result="add_result"
             :add-form="addForm"></add>
        <data-table
                :table-datas="tableDatas"
                :is-loading="isLoading"
                :switch-type="smtSwitch"
                :first-loading="firstLoading"
                @edit-result="edit_result"
                @size-change="change_size"
                @current-change="change_page"
                @save-member="save_member"
                @cur-delete="cur_delete"
                @selection-change="selectionChange"
        ></data-table>
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
    import labelButton from "../../../../components/label-buttons";
    import {aliexpress_account,api_post_user_update} from "../../../../api/aliexpress";
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
                authorList:[
                    {label:"全部",value:-1},
                    {label:"未授权",value:0},
                    {label:"已授权",value:1},
                ],
                searchData:{
                    authorization:-1,
                    snType:"account_name",
                    snText:"",
                    taskName:"download_listing",
                    taskCondition:"eq",
                    taskTime:"",
                },
                clears:{
                    authorization:-1,
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
                settingUp:false,
                smtData:{},
                title:'',
            }
        },
        methods:{
            selectionChange(select){
                this.selectData = select.map(res=>{
                    return res.id;
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title = '批量设置';
                this.smtData = {
                    is_invalid:1,
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    download_message:0,
                    download_health:0,
                };
            },
            setClich(val){
                this.settingUp = false;
                val.is_invalid = val.is_invalid ? 1 : 0;
                let parmes = val;
                this.$set(parmes,'ids',this.selectData);
                this.$http(api_post_user_update,parmes).then(res=>{
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
                };
                this.tableDatas.page && (params.page = this.tableDatas.page);
                this.tableDatas.pageSize && (params.pageSize = this.tableDatas.pageSize);
                this.smtSwitch > -1 && (params.status = !!this.smtSwitch);
                params.authorization = this.searchData.authorization;
                this.searchData.snType && (params.snType = this.searchData.snType);
                this.searchData.snText && (params.snText = this.searchData.snText.trim());

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
            },
            taskTimeList(){
                let list1 = [
                    {label:"全部",value:''},
                    {label:"未启用",value:0},
                    {label:'10分钟',value:10},
                    {label:'20分钟',value:20},
                    {label:'30分钟',value:30}
                ];
                let list2 = [
                    {label:"全部",value:''},
                    {label:"未启用",value:0},
                    {label:"1小时",value:60},
                    {label:"2小时",value:120},
                    {label:"3小时",value:180},
                    {label:"5小时",value:300},
                    {label:"6小时",value:360},
                    {label:"8小时",value:480},
                    {label:"10小时",value:600},
                    {label:"12小时",value:720},
                    {label:"24小时",value:1440}
                ];
                return this.searchData.taskName==='download_listing'?list2:list1
            },
        },
        components: {
            labelButton,
            add,
            dataTable,
            searchCard:require('../../../../components/search-card.vue').default,
            editBatch:require('./edit-batch.vue').default
        }
    }
</script>
