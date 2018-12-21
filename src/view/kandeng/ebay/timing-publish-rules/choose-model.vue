<template>
    <page-dialog v-model="show" title="选择范本" size="full" @open="open"
                 class="add-rule" :close-on-click-modal="false">
        <div class="mb-sm">
            <el-select v-model="params.searchChooese" clearable class="inline" style="width:100px">
                <el-option v-for="item in goods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <order-input v-model="params.snText" v-if='params.searchChooese!=="title"'
                         @keydown="search"
                         class="width-super inline mr-sm"></order-input>
            <el-input v-else v-model="params.snText" @keyup.enter.native="search"
                      placeholder="模糊搜索..."
                      class="width-super inline mr-sm" ></el-input>
            <label-item label="平台账号：">
                <param-account v-model="params.account_id" url="get|Publish/Ebay/getAccounts"
                               class="mb-mini mr-sm" type="ebay"
                ></param-account>
            </label-item>
            <label-item label="站点：">
                <el-select v-model="params.site" placeholder="请选择" clearable class="mb-mini mr-sm" filterable style="width:120px">
                    <el-option v-for="item in siteList" :key="item.id" :label="item.label" :value="item.id"></el-option>
                </el-select>
            </label-item>
            <label-item label="出售方式：">
                <el-select v-model="params.listing_type" placeholder="请选择" clearable class="mb-mini mr-sm" filterable style="width:100px">
                    <el-option v-for="item in saleWay" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </label-item>
            <label-item label="范本分类：">
                <el-select v-model="params.cate" placeholder="请选择" clearable class="mb-mini mr-sm" filterable style="width:100px">
                    <el-option v-for="item in modelList" :key="item.label" :label="item.label" :value="item.label"></el-option>
                </el-select>
            </label-item>
            <el-button type='primary' size="mini" @click.native="search">搜索</el-button>
            <el-button type='warning' size="mini" @click.native="clear">清空搜索</el-button>
        </div>
        <el-table class="scroll-bar" v-loading="loading" v-if="tableData" style="width: 100%;"
                  :data="tableData" @selection-change="handleSelectionChange"
                  v-resize="{height:150}" element-loading-text="玩命加载中...">
            <el-table-column type="selection" width="35">
            </el-table-column>
            <el-table-column prop="image" label="图片" width="80" inline-template>
                <img :src="row.img" width="64px" height="64px">
            </el-table-column>
            <el-table-column inline-template label="SPU" width="120">
                <div v-copy>{{row.spu}}</div>
            </el-table-column>
            <el-table-column inline-template label="刊登标题" width="220">
                <ui-tip :content="row.title"></ui-tip>
            </el-table-column>
            <el-table-column label="账号" inline-template>
                <span>{{filterAccount(row.account_id)}}</span>
            </el-table-column>
            <el-table-column prop="site" label="站点" width="100" inline-template>
                <span>{{filterSite(row.site)}}</span>
            </el-table-column>
            <el-table-column label="出售方式" width="100" inline-template>
                <span>{{row.listing_type | way}}</span>
            </el-table-column>
            <el-table-column prop="start_price" label="价格">
            </el-table-column>
            <el-table-column prop="publish_price" label="刊登费用">
            </el-table-column>
            <el-table-column prop="quantity" label="可售数">
            </el-table-column>
            <el-table-column label="刊登天数" inline-template>
                <span>{{ row.listing_duration | filterDay}}</span>
            </el-table-column>
            <el-table-column prop="model_cate" label="范本分类">
            </el-table-column>
            <el-table-column prop="timing_count" label="定时刊登">
            </el-table-column>
            <el-table-column prop="draft_count" label="已刊登">
            </el-table-column>
        </el-table>
        <el-pagination
            style="text-align: right"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" :disabled="btnDisabled" @click.native="get_data">确定执行规则</el-button>
            <el-button size="mini" @click.native="closed">取消</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus" scoped>
    .add-rule
        .c-r
            color red
            font-weight bolder
            padding 0px 3px
        .l-h
            line-height 26px
        .radio-color
            color #ccc
        .el-card{
            overflow: auto;
        }
</style>
<script>
    import {api_save_timing_rule,api_get_draft_list,api_get_ebay_site,api_get_cateList} from '../../../../api/ebay-kandeng-public-module'
    import {mapGetters} from 'vuex';
    export default{
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'曾绍辉',
                createTime:'2017-06-30',
                updateTime:'2017-08-23'
            }
        },
        data(){
            return{
                show:this.value,
                siteList:[],
                goods: [
                    {
                        value: 'title',
                        label: '刊登标题'
                    },
                    {
                        value: 'spu',
                        label: '本地SPU'
                    },
                    {
                        value: 'sku',
                        label: '本地SKU'
                    },
                ],
                saleWay: [
                    {label:"全部",value:""},
                    {label: "一口价", value: 1},
                    {label: "拍卖", value: 2},
                ], //销售方式
                tableData:[],
                total:0,
                loading:false,
                multipleSelection: [],
                chooseList:[],
                modelList:[],
                btnDisabled:false,
                params:{
                    searchChooese:"spu",
                    spu:"",
                    sku:"",
                    title:"",
                    snText:"",
                    account_id:"",
                    listing_type:"",
                    site:"",
                    cate:"",
                },
                clears:{
                    searchChooese:"spu",
                    spu:"",
                    sku:"",
                    title:"",
                },
                page:1,
                pageSize:50,
            }
        },
        methods:{
            clear(){
                this.open();
            },
            open(){
                this.params = {
                    searchChooese:"spu",
                    spu:"",
                    sku:"",
                    title:"",
                    snText:"",
                    account_id:"",
                    listing_type:"",
                    site:"",
                    cate:"",
                };
                this.page=1;
                this.pageSize=50;
                this.tableData = [];
                this.multipleSelection = [];
                this.chooseList = [];
                this.modelList = [];
                this.init();
                this.getCate();
                this.getSite();
            },
        	getCate(){
                let data={
                    ebay_account:"",
                    model_name:"",
                    site:"",
                    type:2,
                    status:"",
//                    page:this.page,
//                    size:this.pageSize
                };
                this.$http(api_get_cateList,data).then(res=>{
                    this.modelList = res.data.map((item)=>{
                        return {
                            label:item.model_name,
                            value:item.id,
                        }
                    });
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            getSite(){
                this.$http(api_get_ebay_site).then(res=>{
                    this.siteList = res.data.map(row=>{
                        return {
                            label:row.name.replace("站点",""),
                            value:row.country,
                            id:row.siteid,
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            init(){
                this.tableData = [];
                let data = window.clone(this.params);
                if(data.searchChooese!=="title"){
                    let curString = data.snText.replace(new RegExp(' ','gm'),'\n');
                    let cur = curString.split('\n').filter(row=>!!row);
                    data.snText = cur&&cur.length?cur.map(row=>row.trim()):'';
                }
                data.spu =data.searchChooese==="spu" ? data.snText : "";
                data.sku = data.searchChooese==="sku" ? data.snText : "";
                data.title = data.searchChooese==="title" ? data.snText : "";
                data.page = this.page;
                data.size = this.pageSize;
                delete data.searchChooese;
                delete data.snText;
                this.getAjaxList(data);
            },
            getAjaxList(data){
                this.loading=true;
                this.$http(api_get_draft_list,data).then(res=> {
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    })
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code,
                    });
                })
            },
            search(){
                this.init();
            },
            handleSizeChange(val){
                this.pageSize=val;
                this.init()
            },
            handleCurrentChange(val){
                this.page=val;
                this.init()
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            get_data(){
                let flag = true;
                this.multipleSelection.forEach(row=>{
                	if(row.draft_count>0){
                		flag = false;
                    }
                });
                if(!flag){
                    this.$confirm(`存在已刊登数大于0的范本，可能会导致重复刊登，是否继续?`, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.confirm();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }else{
                    this.confirm();
                }
            },
            confirm(){
                this.chooseList = window.clone(this.rulesData);
                this.chooseList.draft_ids=this.multipleSelection.map(x=> x.id).join(",");
                this.$confirm(`您将要执行此规则, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.btnDisabled = true;
                    this.$http(api_save_timing_rule,this.chooseList).then(res=>{
                        this.$message({
                            type:"success",
                            message: res.message || res,
                        });
                        this.btnDisabled = false;
                        this.$emit("finished-add",this.chooseList,res.data);
                        this.show = false;
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                        this.btnDisabled = false;
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上传'
                    });
                    this.btnDisabled = false;
                });
            },
            closed(){
                this.$emit("pre","add");
                this.btnDisabled = false;
                this.show = false;
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                })
                return name
            },
            filterSite(val){ // 过滤站点
                let name = ""
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                });
                return name;
            },
        },
        computed:{
            ...mapGetters({accounts:'api/getPublishAccount'})
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            }
        },
        filters:{
            way(value){
                switch(value){
                    case 1:
                        return "一口价";
                        break;
                    case 2:
                        return "拍卖";
                        break;
                    default:
                        break;
                }
            },
            filterDay(val){
                switch (val){
                    case 1:
                        return "GTC";
                        break;
                    case 2:
                        return 1;
                        break;
                    case 3:
                        return 3;
                        break;
                    case 4:
                        return 5;
                        break;
                    case 5:
                        return 7;
                        break;
                    case 6:
                        return 10;
                        break;
                    case 7:
                        return 30;
                        break;
                    default:
                        break;
                }
            }
        },
        props:{
            value:{
                required:true,
                type:Boolean,
            },
//            modelList:{
//                required:true,
//                type:Array,
//            },
            rulesData:{}
        },
        components: {
            pageDialog:require('../../../../components/page-dialog.vue').default,
            searchCard:require('../../../../components/search-card.vue').default,
            labelItem:require("../../../../components/label-item.vue").default,
            paramAccount:require("../../../../api-components/param-account.vue").default,
            orderInput:require('@/components/order-input.vue').default,
            uiTip:require('@/components/ui-tip.vue').default,
        }
    }
</script>
