<template>
    <page class="p-index">
        <search-card @search="search" @enter="search" :params="params" :clears="clears">
            <div>
                <label-buttons label="状态："
                               :buttons="userStatus"
                               @select="changeSelect"
                               class="inline">
                </label-buttons>
                <label class="inline ml-sm mb-mini">授权状态：</label>
                <el-select class="inline s-width-small mb-mini"
                           v-sf.authorization
                           v-model="params.authorization">
                    <el-option v-for="item in authorList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </div>
            <el-select class="inline s-width-small"
                       v-sf.snType
                       v-model="params.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="params.snText"
                      @input="keyword"></el-input>

            <el-select v-model="params.taskName"
                       class="inline s-width-large ml-sm"
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
            <el-select v-model="params.taskCondition"
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
            <el-select v-model="params.taskTime"
                       class="inline s-width-small"
                       v-sf.taskTime
                       filterable>
                <el-option
                        v-for="res in taskTimeList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <label class="inline ml-sm  mr-sm">站点：</label>
            <el-select class="inline s-width-small mr-sm"
                       v-sf.site
                       v-model="params.site" filterable clearable>
                <el-option v-for="item in siteList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </search-card>
        <permission tag="ElButton"
                    :route="apis.url_ymx_add"
                    class="mt-xs mb-xs ml-sm"
                    size="mini" type="primary"
                    @click="add_form">添加</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm">批量设置</el-button>
        <add-form v-model="addVisable"
                  :add-edit-site-list="addEditSiteList"
                  :addData="addData"
                  @add_ymx="add_ymx">
        </add-form>
        <data-table
                :ymxList="ymxList"
                :add-edit-site-list="addEditSiteList"
                :loading="loading"
                :first-loading="firstLoading"
                @notice-info="notice_info"
                @sort-change="sort_change"
                @save-member="save_member"
                @cur-delete="cur_delete"
                @selection-change="selectionChange">
        </data-table>
        <div class="block">
            <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=params.page
                    :page-sizes="[20,50,100,200,500]"
                    :page-size=params.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=total>
            </el-pagination>
        </div>
        <edit-batch v-model="settingUp"
                    :title="title"
                    :batch-data="batchData"
                    @set-clich="setClich">
        </edit-batch>
        <!--通知弹框-->
        <notice-info v-model="noticeDialog"
                     :notice-data="noticeData"
                     @sync-notice="sync_notice"
                     @set-notice="set_notice">
        </notice-info>
    </page>
</template>
<style lang="stylus">
.mt{margin: 10px 0 10px 20px}
.star-red{
    color: red;
}
.star-green{
    color: green;
}
</style>
<script>
    import  addForm  from  './add-form.vue'
    import labelButtons from '../../../../components/label-buttons.vue';
    import dataTable from './data-table.vue'
    import {ymx_list,ymx_add,ymx_site,ymx_post_batch_set,api_get_notice_info,api_post_set_amazon_notice} from '../../../../api/ymx';
    import {url_ymx_add} from '../../../../api/ymx';

    export default{
        permission:{
            url_ymx_add
        },
        page:{},
        refresh(){
            this.init();
        },
        created(){
            this.init();//-------list列表
        },
        data(){
            return{
                firstLoading: true,
                addVisable:false,
                sort_type:'',
                sort_val:'',
                addData:{
                    code:"",
                    account_name:"",
                    site:'',
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    merchant_id:'',
                    access_key_id :'',
                    secret_key:'',
                    sync_feedback:0,
                    download_health:0,
                    authorization_type:'',
                    developer_access_key_id:'',
                    developer_secret_key:'',
                    auth_token:'',
                },
                userStatus:[
                    {name:"全部",status:''},
                    {name:"已启用",status:1},
                    {name:"已停用", status:0},
                ],
                taskNameList:[
                    {label:"抓取Listing数据",value:'download_listing'},
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"同步发货状态",value:'sync_delivery'},
                    {label:"同步健康数据",value:'download_health'},
                ],
                taskList:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],
                authorList:[
                    {
                        value: 0,
                        label: '未授权'
                    },
                    {
                        value: 1,
                        label: '已授权'
                    },{
                        value: -1,
                        label: '全部'
                    }
                ],
                conditionList:[
                    {
                        value: 'account_name',
                        label: '账户'
                    },{
                        value:'code',
                        label: '简称'
                    }
                ],
                siteList:[],
                fSelect:0,
                ymxList:[],
                params:{
                    page:1,
                    pageSize:50,
                    authorization:-1,
                    snType:'account_name',
                    snText:'',
                    site:'',
                    taskName:'download_listing',
                    taskCondition:'eq',
                    taskTime:'',
                },
                clears:{
                    page:1,
                    pageSize:50,
                    authorization:-1,
                    snType:'account_name',
                    snText:'',
                    taskName:'download_listing',
                    taskCondition:'eq',
                },
                total:0,
                site:'',
                loading:true,
                addEditSiteList:[],
                selectData: [],
                settingUp:false,
                title: '',
                batchData:{},
                noticeDialog:false,
                noticeData:{}
            }
        },
        mounted(){
            this.get_site();
        },
        methods:{
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.title = "批量设置";
                this.batchData = {
                    status:1,
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    sync_feedback:0,
                    download_health:0
                }
            },
            setClich(val){
                this.settingUp = false;
                val.status = val.status ? 1 : 0;
                let params = val;
                this.$set(params,'ids',this.selectData.join(','));
                this.$http(ymx_post_batch_set,params).then(res=>{
                    this.init();
                    this.$message({type:'success',message: res.message});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                    console.log(params)
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch(val.column.label){
                    case '简称':
                        this.sort_type = 'code';
                        break;
                    case '亚马逊账户':
                        this.sort_type = 'account_name';
                        break;
                    case '站点':
                        this.sort_type = 'site';
                        break;
                    default:
                        this.sort_type = '';
                }
                this.sort_val = val.order==='descending'?2:1;
                this.init();
            },
            change_taskName(){
                this.params.taskTime = '';
            },
            init_status_btn(){
              let curBtn = this.userStatus;
              this.userStatus = [];
              this.$nextTick(()=>{
                  this.userStatus = curBtn;
              })
            },
            //站点
            get_site(){
                this.$http(ymx_site).then(res=>{
                    res = res.map(row=>{
                        return {
                            label:row.site,
                            value:row.site,
                        }
                    });
                    this.addEditSiteList = clone(res);
                    this.siteList = res;
                    this.siteList.unshift({label:'全部',value:''});
                }).catch(code=>{
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            init(){//-------------list列表函数
                this.loading = true;
                let params = window.clone(this.params);
                if(params.site === ''){
                    delete params.site;
                }
                this.sort_val&&this.$set(params,'sort_val',this.sort_val);
                this.sort_type&&this.$set(params,'sort_type',this.sort_type);
                this.$http(ymx_list,params).then(res => {
                    res.data.forEach(res=>{
                        res.status = res.status === 1 ? true : false;
                    });
                    this.ymxList = res.data;
                    this.total = res.count;
                    this.loading = false;
                    this.firstLoading = false;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code})
                })
            },
            search(){
//                if (this.params.site === '') {
//                    console.log("test", 11111)
//                    delete this.params.site;
//                }
                this.init();
            },
            clear(){
                this.params.authorization = -1;
                this.params.snType = 'account_name';
                this.params.snText = '';
                this.params.site = '';
                this.search();
            },
            keyword(){
                this.params.snText = this.params.snText.replace(/\s*/g,'')
            },
            add_form(){//------------------增加弹框打开
                this.addVisable = true;
                this.addData = {
                    code:"",
                    account_name:"",
                    server_id:'',
                    site:'',
                    download_listing:0,
                    download_order:0,
                    sync_delivery:0,
                    merchant_id:'',
                    access_key_id :'',
                    secret_key:'',
                    sync_feedback:0,
                    download_health:0,
                    authorization_type:'',
                    developer_access_key_id:'',
                    developer_secret_key:'',
                    auth_token:'',
                }
            },
            add_ymx(){//------------------添加
                Object.keys(this.addData).forEach(key=>{
                    if(typeof this.addData[key] === 'string'){
                        this.addData[key] = this.addData[key].trim();
                    }
                });
                this.$http(ymx_add,this.addData).then(res=>{
                    this.addVisable = false;
                    this.$message({
                        showClose: true,
                        type:'success',
                        message: res.message
                    });
                    this.$set(this.addData,"is_invalid",0);
                    this.$set(this.addData,"id",res.id);
                    this.$set(this.addData,"status",0);
                    this.ymxList.unshift(this.addData);
                    this.total++;
                }).catch(code=>{
                    this.$message({
                        showClose: true,
                        message: code.message || code,
                        type: 'error'
                    });
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormYmx', false);
                    }, 300)
                });
            },
            save_member(){
                this.init();
            },
            notice_info(row){//-----通知
                this.$http(api_get_notice_info,{id:row.id}).then(res => {
                    this.noticeData = res;
                    this.noticeDialog = true
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            sync_notice(){//-----同步

            },
            set_notice(id,account_id,arr){//----设置
                let params = {
                    id: id,
                    account_id: account_id,
                    notice_type: []
                };
                params.notice_type = arr.map(row => {
                    return {
                        name: row.name,
                        checked: row.checked?1:0
                    }
                });
                this.$http(api_post_set_amazon_notice, params).then(res => {
                    this.$message({type: 'success', message: res.message});
                    this.noticeDialog = false
                }).catch(code => {
                    this.$message({type: 'error', message: code.message||code})
                })
            },
            cur_delete(){
                this.init();
            },
            handleSizeChange(val) {//------------分页
                this.params.page = 1;
                this.params.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.params.page = val;
                this.init();
            },
            changeSelect(select){//-------------全部/启用/禁用按钮
                this.fSelect = this.userStatus[select].status;
                if (select === 0) {
                    delete this.params.status;
                    this.init();
                }
                if (select === 1) {
                    this.params.status = 1;
                    this.init();
                }
                if (select === 2) {
                    this.params.status = 0;
                    this.init();
                }
            }
        },
        computed:{
            changeLabel(){
            	if(this.params.snType === 'account_name'){
            		return `账户`;
                }else{
            		return `简称`;
                }
            },
            taskTimeList(){
                let list1 = [
                    {label: "全部", value: ''},
                    {label:"未启用",value:0},
                    {label:"30分钟",value:30},
                    {label:"60分钟",value:60}
                ];
                let list2 = [
                    {label: "全部", value: ''},
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
               return this.params.taskName==='download_listing'?list2:list1;
            },
        },
        components:{
            labelButtons,
            addForm,
            dataTable,
            searchCard:require('../../../../components/search-card.vue').default,
            editBatch:require('./edit-batch').default,
            noticeInfo:require('./notice-info').default
        }
    }
</script>
