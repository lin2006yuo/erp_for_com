<template>
    <page class="p-index">
        <search-card @search="search" @enter='search' :params="params" :clears="clears">
            <div>
                <label-buttons label="状态："
                               :buttons="status"
                               @select="changeSelect"
                               class="inline mr-sm "></label-buttons>
            </div>
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
                       class="inline s-width-small mr-sm"
                       filterable>
                <el-option
                        v-for="res in taskTime"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                ></el-option>
            </el-select>
        </search-card>
        <permission
                tag="ElButton"
                :route="apis.url_joom_list_add"
                class="mt-xs mb-xs ml-sm"
                type="primary"
                size="mini"
                @click="add_form">添加</permission>
        <permission tag="ElButton"
                    size="mini"
                    type="primary"
                    @click.native="batchSetup"
                    :disabled="selectData.length <= 0"
                    class="mt-xs mb-xs ml-sm"
                    :route="apis.url_post_batch_set">批量设置</permission>
        <data-table
                ref="table"
                :tableData="jumiaList"
                :loading="loading"
                :first-loading="firstLoading"
                @sort-change="sort_change"
                @look-form="look_form"
                @edit-form="edit_form"
                @selection-change="selectionChange">
        </data-table>
        <!-- 添加 -->
        <add v-model="addVisable"
             :is-look="isLook"
             :title="title"
             :id="id"
             @add-update-joom="update_joom"></add>
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
    import {api_jumia_account,api_jumia_post_batch_set} from '../../../../api/jumia-account';
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
        data(){
            return{
                firstLoading: true,
                jumiaList:[],
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
                taskTime:[
                    {label: "全部", value: ''},
                    {label: "未启用", value: 0},
                    {label: "1小时", value: 60},
                    {label: "2小时", value: 120},
                    {label: "3小时", value: 180},
                    {label: "5小时", value: 300},
                    {label: "6小时", value: 360},
                    {label: "8小时", value: 480},
                    {label: "10小时", value: 600},
                    {label: "12小时", value: 720},
                    {label: "24小时", value: 1440},
                ],
                params:{
                    snText:'',
                    taskName:'download_order',
                    snType:'account_name',
                    taskCondition:'eq',
                    taskTime:'',
                },
                clears:{
                    snText:'',
                    taskName:'download_order',
                    snType:'account_name',
                    taskCondition:'eq',
                    taskTime:'',
                },
                searchData:{
                    status:'',
                    platform_status:'',
                    page:1,
                    pageSize:50,
                    total:0,
                },
                loading:false,
                addVisable:false,
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
            selectionChange(val){
                this.selectData = val.map(row=>{
                    return row.id
                });
            },
            batchSetup(){
                this.settingUp = true;
                this.batchTitle = "批量设置";
                this.batchData = {
                    // is_invalid:1,
                    is_stop:false,
                    is_start:false,
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                if(val.is_stop === false&&val.is_start === false&&val.download_order === ''&&val.sync_delivery===''&&val.download_listing === ''){
                    this.$message({type: 'warning',message: '请至少修改一项数据'});
                    this.$reqKey('downloadAdd',false);
                }else{
                    this.settingUp = false;
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
                        this.init();
                        this.$message({type:'success',message: res.message});
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        setTimeout(() => {
                            this.$reqKey('downloadAdd',false);
                        }, 300)
                    })
                }
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
                this.$http(api_jumia_account,data).then(res => {
                    res.data.forEach(res=>{
                        res.status = res.status === 1;
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
            }
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
            editBatch:require('./edit-batch.vue').default
        }
    }
</script>
