<template>
    <page class="p-index">
        <card-search
            class="mb-xs"
            :clears="clears"
            :search-data="searchData"
            :mode="mode"
            @change-select="change_select"
            @change-account-type="change_account_type"
            @key-word="key_word"
            @change-taskName="change_taskName"
            @search="search"></card-search>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm mb-xs">批量设置</el-button>
        <data-table
            :loading="loading"
            :first-loading="firstLoading"
            :paytmList="paytmList"
            @save-member="init"
            @look-over="look_over"
            @edit="edit_row"
            @add-accredit="add_accredit"
            @add-merchandise="add_merchandise"
            @sort-change="sort_change"
            @selection-change="selectionChange"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"></data-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page=paytmList.page
            :page-sizes="[20,50,100,200,500]"
            :page-size=paytmList.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=paytmList.total>
        </el-pagination>
        <add-form
            v-model="addEditpaytm"
            :title="title"
            :edit="edit"
            :add-edit-data="addEditData"
            @add-paytm="add_paytm"></add-form>
        <add-accredit
            v-model="authorizaTion"
            :title="title"
            :indent-impower="indentImpower" :mode-data="modeData"></add-accredit>
        <add-merchandise
            v-model="merchandiseTion"
            :title="title"
            :commodity-impower="commodityImpower"></add-merchandise>
        <edit-batch v-model="settingUp"
                    :batch-title="batchTitle"
                    :batch-data="batchData"
                    @set-clich="setClich"></edit-batch>
    </page>
</template>
<style lang="stylus">

</style>
<script>
    import {api_paytm_account,api_get_paytm_account,
        api_put_paytm_account,api_token_paytm_account,
        api_paytm_post_batch_set} from '@/api/paytm';
	export default{
        page:{
            devinfo:{
                frontEnd:'汤敏',
                backEnd:'李佰敏',
                createTime:'2018-5-30',
                updateTime:'2018-6-1'
            }
        },
		data(){
			return {
			    firstLoading: true,
                searchData:{
                    authorization:"",
                    authorization_cat:"",
                    snType:'account_name',
                    snText:'',
                    taskName:'download_order',
                    taskCondition:'eq',
                    taskTime:'',
                    site_status:'',
                    seller_id:'',
                    customer_id:'',
                    time_type:'register',
                    start_time:'',
                    end_time:''
                },
                mode: 0,//账号类型 0:本地仓 1:海外仓
                clears:{
                    snType:'account_name',
                    taskName:'download_order',
                    taskCondition:'eq',
                    time_type:'register',
                    mode: this.mode
                },
                addEditpaytm:false,
                title:'',
                edit:true,
                loading:true,
                paytmList:{
                    list:[],
                    page:1,
                    pageSize:20,
                    total:0,
                },
                addEditData:{
                    code:'',
                    acccount_name:'',
                    download_order:0,
                    down_listing:0,
                    sync_delivery:0,
                    download_listing:0
                },
                authorizaTion:false,
                merchandiseTion:false,
                indentImpower:{
                    mode:'',
                    id:'',
                    email:'',
                    client_id:'',
                    client_secret:'',
                    password:'',
                    account_name:'',
                },
                commodityImpower:{
                    id:'',
                    client_id_cat:'',
                    client_secret_cat:'',
                    account_name:'',
                },
                sort_type:'',
                sort_val:'',
                settingUp: false,//批量设置弹框开关
                batchTitle: '',//批量设置弹框标题
                batchData:{},//批量设置弹框数据
                selectData:[],//被选中列表,
                modeData:false,//判断订单未授权账号类型是否有值
            }
		},
        refresh(){
            this.init();
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
                    is_invalid:'',
                    site_status:'',
                    download_order:'',
                    sync_delivery:'',
                    download_listing:'',
                }
            },
            setClich(val){
                let params = val
                this.$set(params,'ids',this.selectData.join(','));
                this.$http(api_paytm_post_batch_set,params).then(res=>{
                    this.init();
                    this.$message({type:'success',message: res.message});
                    this.settingUp = false;

                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('downloadAdd',false);
                    }, 300)
                })
            },
            search(){
                this.init();
            },
            change_select(){//----------------状态/全部、启用、停用
                this.init();
            },
            change_account_type(type){//-----账号类型切换
                this.mode = type;
                this.init()
            },
            key_word(){//----------------出入框
                this.searchData.snText = this.searchData.snText.replace(/\s*/g,'')
            },
            change_taskName(){//----------------抓取数据
                this.searchData.download_value = '';
            },
            init(){
                let params = window.clone(this.searchData);
                this.$set(params,'page',this.paytmList.page);
                this.$set(params,'pageSize',this.paytmList.pageSize);
                this.$set(params,'mode',this.mode);
                if(params.authorization_cat === ''){
                    delete params.authorization_cat
                };
                if(params.authorization === ''){
                    delete params.authorization
                };
                this.sort_type && (this.$set(params,'sort_type', this.sort_type));
                this.sort_val && (this.$set(params,'sort_val',this.sort_val));
                params.start_time=this.searchData.start_time?datef('YYYY-MM-dd', this.searchData.start_time/1000):'';
                params.end_time=this.searchData.end_time?datef('YYYY-MM-dd', this.searchData.end_time/1000):'';
            	this.loading = true;
                this.$http(api_paytm_account,params).then(res=>{
                	this.paytmList.list= res.data;
                    this.paytmList.total = res.count;
                    this.loading = false;
                    this.firstLoading = false
                });
            },
            add_paytm(){//编辑保存
                Object.keys(this.addEditData).forEach(key=>{
                    if(typeof this.addEditData[key] === 'string'){
                        this.addEditData[key] = this.addEditData[key].trim()
                    }
                });
                delete this.addEditData.mode;
                this.$http(api_put_paytm_account,this.addEditData).then(res=>{
                    this.$message({type: 'success', message: res.message || res});
                    this.addEditpaytm = false;
                    let find = this.paytmList.list.find(row=> Number(row.id)===Number(res.id));
                    if(!!find) Object.assign(res.data,find);
                    this.init();
                }).catch(code=>{
                    this.$message({type: 'error', message: code.message||code,});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('addFormpaytm',false);
                    }, 300)
                })
            },
            look_over(row){
                this.title=`查看：${row.account_name}账号信息`;
                this.edit=false;
                let url = api_get_paytm_account;
                this.get_form_data(url,row.id);
            },
            edit_row(row){
                this.title=`编辑：${row.account_name}账号信息`;
                this.edit=true;
                let url = api_get_paytm_account;
                this.get_form_data(url,row.id);
            },
            get_form_data(url,id){
                this.$http(url,id).then(res=>{
                    this.addEditpaytm = true;
                    this.addEditData = res;
                }).catch(code=>{
                    console.log('code',code)
                }).finally(()=>{
                    this.$reqKey('addFormpaytm',false);
                })
            },
            add_accredit(row){//订单授权
                this.title=`给账户：${row.account_name}授权`;
                this.$http(api_token_paytm_account,row.id).then(res=>{
                    Object.assign(this.indentImpower,res);
                    if(this.indentImpower.mode === ''){
                        this.modeData = false;
                    }else {
                        this.modeData = true;
                    }
                    this.authorizaTion = true;
                })
            },
            add_merchandise(row){//商品授权
                this.title=`给账户：${row.account_name}授权`;
                this.$http(api_token_paytm_account,row.id).then(res=>{
                    Object.assign(this.commodityImpower,res);
                    this.merchandiseTion = true;
                })
            },
            sort_change(val){//------------------ 表格排序
                if (val.column instanceof Object) {
                    let sort_label = val.column.label;
                    switch (sort_label) {
                        case "简称":
                            this.sort_type = "code";
                            break;
                        case "账户名称":
                            this.sort_type = "account_name";
                            break;
                        case "密钥有效期":
                            this.sort_type = "expiry_time";
                            break;
                    }
                    this.sort_val = val.order === "descending" ? "2" : "1";
                    this.init();
                }
            },
            handleSizeChange(val) {//------------分页
                this.paytmList.page = 1;
                this.paytmList.pageSize = val;
                this.init();
            },
            handleCurrentChange(val) {//------------分页
                this.paytmList.page = val;
                this.init();
            },

        },
		components: {
            addMerchandise:require('./add-merchandise.vue').default,
            addAccredit:require('./add-accredit.vue').default,
            addForm:require('./add-form.vue').default,
            dataTable:require('./data-table.vue').default,
            cardSearch: require('./card-search.vue').default,
            editBatch: require('./edit-batch.vue').default
        }
	}
</script>
