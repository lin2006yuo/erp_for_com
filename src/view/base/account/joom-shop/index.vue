<template>
    <page class="p-index">
        <search-card @search="search" @enter='search':params="params" :clears="clears">
            <div>
                <label-buttons label="状态："
                               :buttons="userStatus"
                               @select="changeSelect"
                               class="inline"></label-buttons>
                <div class="inline mb-mini">
                    <label class="inline ml-sm">授权状态：</label>
                    <el-select class="inline width-xs"
                               v-sf.authorization
                               v-model="params.authorization"
                               @change="selected">
                        <el-option v-for="item in authorList"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                </div>
            </div>
            <el-select class="inline width-xs" v-sf.snType v-model="params.snType">
                <el-option v-for="item in conditionList"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <el-input class="inline mr-sm"
                      v-sf.snText
                      :placeholder="`请输入${changeLabel}...`"
                      v-model="params.snText"
                      @input="snText"></el-input>
        </search-card>
        <permission
            tag="ElButton"
            :route="apis.url_joom_shop_add"
            class="mt-xs mb-xs ml-sm"
            type="primary"
            size="mini"
            @click="add_form">添加</permission>
        <el-button size="mini"
                   :disabled="selectData.length <= 0"
                   @click.native="batchSetup"
                   type="primary"
                   class="ml-sm">批量设置</el-button>
        <data-table
            ref="data_table"
            :joom-list="joomList"
            :first-loading="firstLoading"
            @update-joom='update_joom'
            @add-update-wish='add_update_wish'
            @sort-change="sort_change"
            @save-member="save_member"
            @cur-delete="cur_delete"
            :loading="loading"
            @gain_token="gain_token"
            @selection-change="selectionChange">
        </data-table>
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
                    :title="title"
                    :joom-data="joomData"
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
    import dataTable from './data-table.vue'
    import {api_joom_shop_list,api_joom_shop_add,api_joom_shop_set} from '../../../../api/joom';
    import {url_joom_shop_add} from '../../../../api/joom';
    export default{
        permission:{
            url_joom_shop_add
        },
        page:{},
        refresh(){
            this.init(this.params);
        },
        created(){
            this.init(this.params);//-------list列表
        },
        data(){
            return{
                firstLoading:true,
                joomList:[],
                userStatus:[
                    {name:"全部",status:0},
                    {name:"已启用",status:1},
                    {name:"已停用", status:2}
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
                        value: "",
                        label: '全部'
                    }
                ],
                conditionList:[
                    {
                        value: 'shop_name',
                        label: '店铺名'
                    },{
                        value:'code',
                        label: "店铺简称"
                    },{
                        value:'account_name',
                        label: "账号"
                    },{
                        value:'account_code',
                        label: "账号简称"
                    }
                ],
                params:{
                    authorization:"",
                    snType:'shop_name',
                    snText:''
                },
                clears:{
                    authorization:"",
                    snType:'shop_name',
                    snText:''
                },
                searchData:{
                    status:"",
                    page:1,
                    pageSize:50,
                    total:0,
                },
                loading:true,
                order_type:'',
                sort:'',
                selectData:[],
                settingUp:false,
                joomData:{},
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
                this.joomData = {
                    status:1,
                    download_listing:0,
                    download_order: 0,
                    sync_delivery: 0,
                };
            },
            setClich(val){
                this.settingUp = false;
                val.status = val.status ? 1 : 0;
                let parmes = val;
                this.$set(parmes,'ids',this.selectData.join(','));
                console.log('parmes',parmes);
                this.$http(api_joom_shop_set,parmes).then(res=>{
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
            sort_change(val){
                console.log(val);
                if(!val||!val.column)return;
                switch(val.column.label){
                    case '平台店铺':
                        this.order_type = 'shop_name';
                        break;
                    case '店铺简称':
                        this.order_type = 'code';
                        break;
                    case '平台账号':
                        this.order_type = 'account_name';
                        break;
                    case '账号简称':
                        this.order_type = 'account_code';
                        break;
                    case '密钥有效期':
                        this.order_type = 'expiry_time';
                        break;
                    default:
                        this.order_type = 'expiry_time';
                }
                this.sort = val.order==='ascending'?'asc':'desc';
                this.init(this.params);
            },
            init_status_btn(){
                let curBtn = this.userStatus;
                this.userStatus = [];
                this.$nextTick(()=>{
                    this.userStatus = curBtn;
                })
            },
            init(params){//-------------list列表函数
                let data = window.clone(this.searchData);
                Object.assign(data,params);
                delete data.total;
                if(data.authorization === ""){
                    delete data.authorization;
                }
                this.joomList = [];
                this.loading = true;
                if(this.sort)this.$set(data,'sort',this.sort);
                if(this.order_type)this.$set(data,'order_type',this.order_type);
                this.$http(api_joom_shop_list,data).then(res => {
                    res.data.forEach(res=>{
                        res.is_invalid = res.is_invalid === 1;
                    });
                    this.joomList = res.data;
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
                this.$refs.data_table.editVisible = true;
                this.$refs.data_table.action.name = 'add';
                this.$refs.data_table.action.label = '添加店铺';
                this.$refs.data_table.editData = {
                    code: "",
                    joom_account_id: "",
                    shop_name:"",
                    merchant_id: "",
                    download_order: "",
                    download_listing:"",
                    sync_delivery: "",
                };
                this.$refs.data_table.titleName = `${this.$refs.data_table.action.label}`;
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
//                    delete this.searchData.status;
                    this.searchData.status = "";
                    this.init(this.params);
                }
                if (select === 1) {
                    this.searchData.status = true;
                    this.init(this.params);
                }
                if (select === 2) {
                    this.searchData.status = false;
                    this.init(this.params);
                }
            },
            add_update_wish(val){
                this.joomList.push(val);
                this.searchData.total++;
            },
            update_joom(id,val){//------------------编辑
                this.joomList.forEach(res=>{
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
            dataTable,
            searchCard:require('../../../../components/search-card.vue').default,
            editBatch:require('./edit-batch.vue').default
        }
    }
</script>
