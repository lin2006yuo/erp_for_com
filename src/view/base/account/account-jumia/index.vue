<template>
    <page class="p-index">
        <search-card @search="search" @enter='search' :params="params" :clears="clears">
            <div>
                <!--<label-buttons label="账号类型："-->
                               <!--:buttons="accountType"-->
                               <!--@select="changeType"-->
                               <!--class="inline mr-sm "></label-buttons>-->
                <label-buttons label="状态："
                               :buttons="status"
                               @select="changeSelect"
                               class="inline mr-sm "></label-buttons>
            </div>
            <div  class="mb-mini">
                <el-select v-model="params.snType"
                           class="inline s-width-mini"
                >
                    <el-option
                        :key="item.value"
                        v-for="item in snData"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <label-item label="">
                    <el-input v-model="params.snText"
                              placeholder="请输入..."
                              class="inline width-super mr-sm"
                              v-sf.snText></el-input>
                </label-item>
                <label class="inline ml-sm">账号状态：</label>
                <el-select class="inline s-width-small"
                           v-sf.site_status
                           v-model="params.site_status">
                    <el-option v-for="item in accountStatus"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </div>
            <label class="inline">销售员：</label>
            <param-account
                class="inline s-width-default"
                ref="paramSale"
                placeholder="可输入搜索"
                v-model="params.seller_id"
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
                v-model="params.customer_id"
                v-sf.customer_id
                :param="{type:'customer',data:{content:''}}"
                :fixUrl="true"
                :fixResult="sale_fix_result"
                type="memberShipSales"
                url="get|user/:type/staffs">
            </param-account>
            <el-select v-model="params.taskName"
                       class="inline s-width-default ml-sm"
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
                       filterable>
                <el-option
                        v-for="res in taskCondition"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select v-model="params.taskTime"
                       class="inline s-width-small"
                       filterable>
                <el-option
                        v-for="res in taskTime"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
            <el-select class="inline s-width-small ml-sm"
                       v-sf.time_type
                       v-model="params.time_type">
                <el-option v-for="item in dataList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-date-picker
                type="date"
                v-sf.start_date
                placeholder="开始时间"
                v-model="params.start_time"
                class="inline date"
                :picker-options="pickerStart"
            ></el-date-picker>&nbsp;--&nbsp;<el-date-picker
            type="date"
            placeholder="结束时间"
            v-sf.end_date
            v-model="params.end_time"
            class="inline date mr-sm"
            :picker-options="pickerEnd"></el-date-picker>
        </search-card>
        <!--<permission-->
                <!--tag="ElButton"-->
                <!--:route="apis.url_joom_list_add"-->
                <!--class="mt-xs mb-xs ml-sm"-->
                <!--type="primary"-->
                <!--size="mini"-->
                <!--@click="add_form">添加</permission>-->
        <permission tag="ElButton"
                    size="mini"
                    type="primary"
                    @click.native="batchSetup"
                    :disabled="selectData.length <= 0"
                    class="mt-xs mb-xs"
                    :route="apis.url_post_batch_set">批量设置</permission>
        <data-table
                ref="table"
                :tableData="jumiaList"
                :loading="loading"
                :first-loading="firstLoading"
                @sort-change="sort_change"
                @look-form="look_form"
                @log-form="log_form"
                @edit-form="edit_form"
                @permit-form="permit_form"
                @selection-change="selectionChange">
        </data-table>
        <!-- 添加 -->
        <add v-model="addVisable"
             :is-look="isLook"
             :title="title"
             :id="id"
             @add-update-joom="update_joom"></add>
        <!-- 授权 -->
        <account-permit v-model="permitVisable"
             :is-look="isLook"
             :title="title"
             :id="id"
             @status-change="change_status"></account-permit>
        <!--日志-->
        <log-record
            v-model="logDialog"
            :log-data="logForm"
            :title="title"
        ></log-record>
        <el-pagination
                    class="page-fixed"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page=searchData.page
                    :page-sizes="[20, 50, 100, 200,500]"
                    :page-size=searchData.pageSize
                    layout="total, sizes, prev, pager, next, jumper"
                    :total=searchData.total>
        </el-pagination>
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
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
    import labelButtons from '../../../../components/label-buttons.vue';
    import {api_joom_list} from '../../../../api/joom';
    import {url_joom_list_add} from '../../../../api/joom';
    import {url_post_batch_set} from '../../../../api/jumia-account';
    import {api_site_status} from '@/api/ymx';
    import {api_jumia_account,api_jumia_post_batch_set,api_jumia_account_log} from '../../../../api/jumia-account';
    export default{
        permission:{
            url_joom_list_add,
            url_post_batch_set
        },
    	page:{},
        refresh(){
            this.init(this.params);
        },
        created(){
//            this.init(this.params);//-------list列表
        },
        mounted(){
            this.site_status();
        },
        data(){
            return{
                firstLoading: true,
                jumiaList:[],
                accountType:[
                    {name:"本的仓",status:'account_name'},
                    {name:"海外仓", status:'code'}
                ],
                status:[
                    {name:"全部",status:''},
                    {name:"已启用",status:'true'},
                    {name:"已停用", status:'false'}
                ],
                snData:[
                    {label:"账户",value:"account_name"},
                    {label:"简称",value:"code"},
                ],
                taskNameList:[
                    {label:"抓取订单数据",value:'download_order'},
                    {label:"抓取listing数据",value:'download_listing'},
                    {label:"同步发货状态",value:'sync_delivery'},
                ],
                taskCondition:[
                    {label:"=",value:'eq'},
                    {label:"<",value:'lt'},
                    {label:">",value:'gt'},
                ],
                dataList:[
                    {label:"注册日期",value:'register'},
                    {label:'交接日期',value:'fulfill'},
                ],
                accountStatus:[],
                taskTime:[
                    {label: "全部", value: ''},
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
                params:{
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    snText:'',
                    taskCondition:'eq',
                    taskName:'download_order',
                    snType:'account_name',
                    taskTime:'',
                },
                clears:{
                    site_status:'',         //账号状态
                    time_type:'register',   //时间类型
                    start_time:'', //开始时间
                    end_time:'',	//截止时间
                    seller_id:'', //销售员id
                    customer_id:'',//客服id
                    taskCondition:'eq',
                    snText:'',
                    taskName:'download_order',
                    snType:'account_name',
                    taskTime:'',
                },
                searchData:{
                    status:'',
                    platform_status:'',
                    page:1,
                    pageSize:50,
                    total:0,
                },
                pickerStart: {
                    disabledDate: (time) => {
                        if (this.params.end_time) {
                            return time.getTime() > this.params.end_time;
                        } else {
                            return time.getTime()>Date.now();
                        }
                    }
                },
                pickerEnd: {
                    disabledDate: (time) => {
                        if (this.params.start_time) {
                            return time.getTime() < this.params.start_time||time.getTime()>Date.now();
                        }
                    }
                },
                logForm:[],
                logDialog:false,
                loading:false,
                currentRow:'',
                addVisable:false,
                permitVisable:false,
                rowIndex:'',
                title:"",
                isLook:false,
                id:"",
                order_by:'',
                sort:'',
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表
            }
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
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    is_invalid:'',
                    site_status:"",
                    // is_invalid:1,
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                    let params = {};
                    if(val.is_stop === true){
                        this.$set(params,'is_invalid',0)
                    }else if(val.is_start === true){
                        this.$set(params,'is_invalid',1)
                    }
                    for(let key in val){
                        if(key !== 'is_stop'&&key !== 'is_start'&&val[key] !== ''){
                            this.$set(params,key,val[key])
                        }
                    }
                    this.$set(params,'ids',this.selectData.join(','));
                    this.$http(api_jumia_post_batch_set,params).then(res=>{
                        this.settingUp = false;
                        this.init();
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('downloadAdd',false);
                        }, 300)
                    })
            },
            change_taskName(){
                this.params.taskTime = '';
            },

            sort_change(val){
                if(!val.column||!val.column.label)return;
                switch(val.column.label){
                    case '平台账号' :
                        this.order_by = 'name';
                        break;
                    case '账号简称':
                        this.order_by = 'code';
                        break;
                    case '公司名称':
                        this.order_by = 'company';
                        break;
                    default:
                        this.order_by = '';
                }
                console.log(this.order_by,'this.order_by');
                this.sort = val.order==='ascending'?'asc':'desc';
                this.init(this.params);
            },
            // 列表更新
            update_joom(data){
            	let find = this.jumiaList.find(row=>{
            		return row.id === data.id;
                });
            	if(!find){
                    this.jumiaList.unshift(data);
                }else{
                    Object.assign(find,data);
                }
            },
            // 状态按钮组
            init_status_btn(){
                let curBtn = this.status;
                this.status = [];
                this.$nextTick(()=>{
                    this.status = curBtn;
                })
            },
            init(params){//-------------list列表函数
                this.jumiaList = [];
                this.loading = true;
                let data = clone(this.searchData);
                Object.assign(data,params);
                this.order_by&&this.$set(data,'order_by',this.order_by);
                this.sort&&this.$set(data,'sort',this.sort);
                data.start_time?params.start_time = datef('YYYY-MM-dd', data.start_time / 1000):'';
                data.end_time?params.end_time = datef('YYYY-MM-dd', data.end_time / 1000):'';
                this.$http(api_jumia_account,data).then(res => {
                    res.data.forEach(res=>{
                        res.is_invalid = res.is_invalid === 1;
                        res.platform_status = res.platform_status === 1;
                    });
                    this.jumiaList = res.data;
                    this.searchData.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                }).catch(code => {
                    this.$message({
                        type: 'error',
                        message: code.message||code,
                    });
                })
            },
            selected(val){
                this.params.authorization = val;
                this.init(this.params);
            },
            search(){
                this.init(this.params);
            },
            add_form(){
                this.addVisable = true;
                this.title = "添加账号";
                this.isLook = false;
                this.id = 0;
            },
            look_form(row){
                this.addVisable = true;
                this.title = `查看${row.account_name}账号`;
                this.isLook = true;
                this.id = row.id;
            },
            edit_form(row){
                this.addVisable = true;
                this.title = `编辑${row.account_name}账号`;
                this.isLook = false;
                this.id = row.id;
            },
            log_form(row){   //-日志
                this.$http(api_jumia_account_log,row.id).then(res => {
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
            permit_form(row){
                // console.log("2");
                //保存当前账号
                this.currentRow=row;
                // console.log("currentRow:",this.currentRow)
                this.permitVisable = true;
                this.isLook = false;
                this.title = `给账号:${row.account_name}授权`;
                this.id = row.id;
            },
            handleSizeChange(val) {//---------------分页每页显示条数
                this.searchData.page = 1;
                this.searchData.pageSize = val;
                this.init(this.params);
            },
            handleCurrentChange(val) {//------------分页当前页
                this.searchData.page = val;
                this.init(this.params);
            },
            changeSelect(select){//----------------更改启用/禁用/全部按钮时的事件
                if (select === 0) {
                    delete this.searchData.status ;
                    this.init(this.params);
                }
                if (select === 1) {
                    this.searchData.status = 'true';
                    this.init(this.params);
                }
                if (select === 2) {
                    this.searchData.status = 'false';
                    this.init(this.params);
                }
            },
            // 账号类型
            changeType(select){
                // this.params
            },
            platformSelect(select){
                if (select === 0) {
                    delete this.searchData.platform_status;
                    this.init(this.params);
                }
                if (select === 1) {
                    this.searchData.platform_status = 1;
                    this.init(this.params);
                }
                if (select === 2) {
                    this.searchData.platform_status = 0;
                    this.init(this.params);
                }

            },
            //更新状态
            change_status(val){    
                // this.$set(this.currentRow,'jumia_enabled',1);
                this.currentRow.jumia_enabled=val;
            },
            // 列表数据添加
            add_update_wish(val){
                this.jumiaList.unshift(val);
                this.searchData.total++;
            },
            update_wish(id,val){//------------------编辑
                this.jumiaList.forEach(res=>{
                    if(res.id===id){
                    	Object.assign(res,val);
                    }
                });
            },
            save_member(){
                this.init(this.params);
            },
            cur_delete(){
                this.init(this.params);
            },
            gain_token(){
                this.init(this.params);//-------list列表
            },
            snText(){
                this.params.snText = this.params.snText.replace(/\s*/g,'')
            },
            sale_fix_result(res){
                return res.map(row=>{
                    return {
                        value:row.id,
                        label:row.realname
                    }
                })
            },
        },
        computed:{
            changeLabel(){
                if(this.params.snType === 'account_name'){
                    return `账户`;
                }else{
                    return `简称`;
                }
            }
        },
        components:{
            labelButtons,
            dataTable:require('./data-table.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require("../../../../components/label-item.vue").default,
            uiTip:require('../../../../components/ui-tip.vue').default,
            add:require('./add.vue').default,
            accountPermit:require('./account-authorize.vue').default,
            editBatch:require('./edit-batch.vue').default,
            logRecord:require('../look-log.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
