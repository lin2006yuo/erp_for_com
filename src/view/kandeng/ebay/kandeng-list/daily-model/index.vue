<template>
    <div class="c-daily-model">
        <search-card @search="search"
                     @enter="search"
                     :params="params"
                     :clears="clears">
        <el-select class="inline s-width-default" v-model="params.snType">
            <el-option
                :key="item.value"
                v-for="item in snTypeList"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <order-input v-model="params.snText"
                     class="inline mr-sm width-super"
                     v-sf.snText
                     @keydown.native="enter_search"
                     :placeholder="$t('ebay-list.searchTip')"></order-input>
        <label class="ml-sm mb-mini">{{$t('ebay-list.pc')}}：</label>
        <el-cascader
            filterable
            clearable
            expand-trigger="hover"
            class="mb-mini"
            v-model="params.categoryId"
            :options="categoryTree"
            change-on-select
        ></el-cascader>
        <label class="ml-sm mb-mini">销售员：</label>
        <el-cascader
            clearable
            filterable
            expand-trigger="hover"
            class="mb-mini"
            v-model="params.sellerId"
            :options="salerList"
            change-on-select
        ></el-cascader>
        <label class="ml-sm mb-mini">任务状态：</label>
        <el-select class="inline s-width-default" v-model="params.status">
            <el-option
                :key="item.value"
                v-for="item in statusList"
                :label="item.label"
                :value="item.value"
            ></el-option>
        </el-select>
        <label class="ml-sm mb-mini">任务时间：</label>
        <el-date-picker class="inline date" v-sf.startDate v-model="params.startDate" type="date"
                        :picker-options="pickerstart" :placeholder="$t('ebay-list.sTime')"></el-date-picker>
        --
        <el-date-picker class="inline date mr-sm" v-sf.endDate v-model="params.endDate" type="date"
                            :picker-options="pickerend" :placeholder="$t('ebay-list.eTime')"></el-date-picker>
        </search-card>
        <div class="mt-xs mb-xs ml-sm">
            <!--<el-button class="inline ml-xxs" size="mini" type="primary"-->
                       <!--@click.native="batchTurn">批量转接</el-button>-->
            <!--<el-button class="inline ml-xxs" size="mini" type="primary"-->
                       <!--@click.native="exportOut">导出</el-button>-->
            <permission tag="ElButton"
                        size="mini"
                        class="inline"
                        @click.native="batchTurn"
                        type="primary ml-xxs"
                        :route="apis.url_daily_publish_seller">
                批量转接
            </permission>
            <permission tag="ElButton"
                        size="mini"
                        class="inline"
                        @click.native="exportOut"
                        type="primary ml-xxs"
                        :route="apis.url_ebay_daily_publish_export">
               导出
            </permission>
        </div>
        <ui-table
            ref="table"
            @check="head_check"
            v-model="checkAll"
            v-loading="loading"  :element-loading-text="$t('ebay-list.playLoad')"
            :body-height="41"
            :first-loading="firstLoading"
            :has-data="table&&table.length>0"
            :heads="[   {isCheck:true,width:2},
                        {label:$t('ebay-list.image'),width:8},
                        {label:$t('ebay-list.localspu'),width:10},
                        {label:$t('ebay-list.zhName'),width:15},
                        {label:$t('ebay-list.upTitle'),width:15},
                        {label:$t('ebay-list.seller'),width:10},
                        {label:$t('ebay-list.localClass'),width:12},
                        {label:'任务时间',width:10},
                        {label:'任务状态',width:10},
                        {label:$t('ebay-list.operat'),width:8},
                       ]">
            <tbody>
            <template>
                <tr v-for="(row,index) in table" :key="row.id">
                    <td><el-checkbox v-model="row.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover
                            placement="right"
                            trigger="hover">
                            <img v-lazy="middle_img(row.thumb,'_60x60.')"  @click="large_img(row.thumb)" width="200px" height="200px">
                            <span slot="reference">
                              <img v-lazy="row.thumb" height="60px" width="60px" @click="large_img(row.thumb)" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <!--本地spu-->
                    <td class="relative">
                      <ui-tip  :content="row.spu" :width="98"></ui-tip>
                    </td>
                    <td><ui-tip :content="row.name" :width="90"></ui-tip></td>
                    <td><ui-tip :content="row.en_title" :width="90"></ui-tip></td>
                    <td><span>{{row.seller_name}}</span></td>
                    <td><ui-tip :content="row.category_chain" :width="90"></ui-tip></td>
                    <td><times :time="row.task_time"></times></td>
                    <td>
                        <span :class="row.status_txt==='已延期'?'color-red':''">{{row.status_txt}}</span>
                    </td>
                    <td>
                        <el-button type="primary ml-xxs" size="mini" class="inline"
                                   @click.native="TurnSales(row)">转接</el-button>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="size_change"
            @current-change="current_change"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
        </el-pagination>
        <change-owner v-model="changeShow"
                      @change-seller="changeSeller"
                      :current-seller="currentSeller"
                      :seller-list="sellerList">
        </change-owner>
    </div>
</template>

<script>
    import {api_joom_category_tree,} from '../../../../../api/joom-set-classify';
    import {api_ebay_daily_publish,api_department_user,api_ebay_daily_publish_export,api_daily_publish_seller,} from '@/api/ebay-kandeng-public-module';
    import {
        url_ebay_daily_publish_export,
        url_daily_publish_seller,
    } from '@/api/ebay-kandeng-public-module';
    import {downloadFile} from '../../../../../lib/http';
    import ChangeOwner from "@/view/kandeng/ebay/kandeng-list/daily-model/change-owner";
    export default {
        permission: {
            url_ebay_daily_publish_export,
            url_daily_publish_seller
        },
        name: "index",
        data(){
            return{
                pickerstart:{
                    disabledDate:(time)=>{
                        if(this.params.endDate){
                            return  time.getTime() > this.params.endDate;
                        }else {
                            return false;
                        }
                    }
                },
                pickerend:{
                    disabledDate:(time)=>{
                        if(this.params.startDate){
                            return  time.getTime() < this.params.startDate;
                        }else {
                            return false;
                        }
                    }
                },
                flagSellerId:false,//判断是搜索时是apartmentId(false)还是SellerId(true)
                currentSeller:{},
                changeShow:false,
                checkAll:false,
                selectIds:[],
                table:[],
                firstLoading:true,
                loading:false,
                categoryTree: [],
                salerList:[],
                sellerList:[],
                statusList:[{value:'',label:'全部'},{value:'0',label:'未开始'},{value:'1',label:'进行中'},{value:'2',label:'已完成'},{value:'3',label:'已延期'},],
                params:{
                    snType:'spu',
                    status:'',
                    startDate:'',
                    endDate:'',
                    snText:'',
                    categoryId:[],
                    sellerId:[],
                    departmentId:'',
                },
                clears:{
                    startDate:'',
                    endDate:'',
                    status:'',
                    snText:'',
                    categoryId:[],
                    sellerId:[],
                    departmentId:'',
                },
                pageSize:50,
                page:1,
                count:0,
                snTypeList:[
                    {label:this.$t('ebay-list.localspu'),value:"spu"},
                    {label:this.$t('ebay-list.localsku'),value:"sku"},
                ],
            }
        },
        mounted(){
            this.get_category_tree();//产品分类
            this.get_seller_tree();//销售员分类
            this.init();
        },
        computed:{

        },
        methods:{
            searchSeller(id){
               let find = this.sellerList.find(res=>{
                    return res.value===id
                });
                return !!find;
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            init(){
                this.loading = true;
                let data = this.get_searchData()
                this.$http(api_ebay_daily_publish,data).then(res=> {
                    res.data.forEach(val=>{
                        val.isCheck=false;
                    });
                    this.table=res.data;
                    this.count=res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code,
                    });
                })
            },
            TurnSales(row){//转接
                this.changeShow=true;
                this.currentSeller=row;
            },
            batchTurn(){//批量同步账号
                this.selectIds = this.table.filter(res=>!!res.isCheck);
                if(this.selectIds.length<=0){
                    this.$message({
                        type:"warning",
                        message: this.$t('ebay-list.pleaseSelect')
                    });
                    return;
                }else {
                    this.changeShow=true;
                    this.currentSeller=this.selectIds;
                }
            },
            get_searchData(){
                let data = JSON.parse(JSON.stringify(this.params));
                let splitText = this.split_search(data.snText);
                data.snText = splitText&&splitText.length?splitText.map(row=>row.trim()).join(','):'';
                data.spu = this.params.snType==="spu" ? data.snText : '';
                data.sku = this.params.snType==="sku" ? data.snText : '';
                data.pageSize = this.pageSize;
                delete data.snType;
                delete data.snText;
                if(data.sellerId.length){
                    if(this.searchSeller(data.sellerId[data.sellerId.length-1])){
                        data.sellerId=this.params.sellerId[data.sellerId.length-1];
                        data.departmentId='';
                    }else {
                        data.departmentId=this.params.sellerId[data.sellerId.length-1];
                        data.sellerId='';
                    }
                }else {
                    data.sellerId='';
                    data.departmentId='';
                }
                data.categoryId=this.params.categoryId.length<=1?this.params.categoryId.join(','):this.params.categoryId[this.params.categoryId.length-1],
                data.page = this.page;
                data.startDate = this.params.startDate?datef("YYYY-MM-dd",this.params.startDate/1000):'';
                data.endDate = this.params.endDate?datef("YYYY-MM-dd",this.params.endDate/1000):'';
                return data;
            },
            exportOut(){//导出
                this.$nextTick(()=>{
                    let data = this.get_searchData();
                    this.$http(api_ebay_daily_publish_export,data).then(res=>{
                        let url = config.apiHost+'downloadFile/downExportFile';
                        if(!!res.file_code){
                            let params = {
                                file_code:res.file_code,
                            };
                            downloadFile({
                                url:url,
                                get:params,
                                fileName:res.file_name,
                                suffix:'',
                            });
                        }else {
                            this.$message({type:"success",message:res.message||res});
                        }

                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    });
                });
            },
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            changeSeller(data_){//确认转接
                this.changeShow=false;
                this.$http(api_daily_publish_seller,{data:data_}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.init();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            operate(data,options){
                options.action.call(this,data);
            },
            head_check(val){
                this.table.forEach(res=>{
                    res.isCheck=val;
                });
                this.selectIds = this.table.filter(row=>row.isCheck);
            },
            check_row(){
                this.checkAll=!this.table.find(row=>!row.isCheck);
                this.selectIds = this.table.filter(row=>row.isCheck);
            },
            middle_img(image){
                return image.replace('_60x60.','_200x200.');
            },
            large_img(image){
                this.imgPath = image.replace('_60x60.','_500x500.');
                this.imgDialog = true;
            },
            get_seller_tree(){//获取销售员
                this.$http(api_department_user,1).then(res => {
                    this.salerList = res;
                    this.seller_data(res)
                });
            },
            seller_data(res){//筛选销售员
                if(res.length<=0)return;
                res.forEach(val=>{
                    if(!!val.children){
                        this.seller_data(val.children)
                    }else {
                        this.sellerList.push(val)
                    }
                })
            },
            get_category_tree(){
                this.$http(api_joom_category_tree).then(res => {
                    this.categoryTree = this.data_format(res.data);
                });
            },
            data_format(val){
                if (val.length === 0) {
                    return null
                }
                return val.map(item => {
                    return {
                        label: item.title,
                        value: item.id,
                        children: this.data_format(item.childs)
                    }
                });
            },
            search(){
                this.firstLoading = false;
                this.init();
            },
            enter_search(){

            },
        },
        components:{
            ChangeOwner,
            orderInput:require("../../../../../components/order-input.vue").default,
            searchCard:require('../../../../../components/search-card.vue').default,
            trendsSelect:require('../../../../../components/trends-select.vue').default,
        },
    }
</script>

<style lang="stylus" scoped>
    .c-daily-model{
        .color-red{
            color red;
        }
        .el-card{
            overflow: inherit;
        }
    }
</style>
