<template>
    <div class="p-amazon-dailypublished">
        <daily-published-search   :searchData="searchData" :clears="clears" @search="search" :siteList="siteList" :sellerArray="sellerArray"></daily-published-search>
        <daily-published-midle-button @batch-delete="batch_delete_task" @export-data="export_data" @batch-switch="batch_switch" :tableData="tableData" ></daily-published-midle-button>
        <ui-table v-loading="loading"  :element-loading-text="$t('ymx-list.playLoad')" style="margin-top: 10px"
                  :body-height="41" :first-loading="firstLoading"
                  :has-data="tableData.length>0" v-model="checkAll"
                  @check="change_all"
                  :heads="[
                        {isCheck:true,width:2},
                        {label:$t('ymx-list.image'),width:5},
                        {label:$t('ymx-list.localspu'),width:8},
                        {label:$t('ymx-list.account'),width:8},
                        {label:$t('ymx-list.zhName'),width:9},
                        {label:$t('ymx-list.enName'),width:9},
                        {label:$t('ymx-list.localClass'),width:7},
                        {label:$t('ymx-list.cTime'),width:6},
                        {label:$t('ymx-list.seller'),width:6},
                        {label:$t('ymx-list.productLabel'),width:8},
                        {label:$t('ymx-list.taskTime'),width:6},
                        {label:$t('ymx-list.publishStatus'),width:6},
                        {label:$t('ymx-list.taskStatus'),width:6},
                        {label:$t('ymx-list.expectedProfitMargin'),width:6},
                        {label:$t('ymx-list.operat'),width:8}]">
            <tbody>
            <template v-for="(data,index) in tableData">
                <tr  :key="data.id" :class="{'high-light': data.highLight}">
                    <td>
                        <el-checkbox v-model="data.isChecked"  @change="change_check"></el-checkbox>
                    </td>
                    <!--图片-->
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="get_path(data.image_url,'_200x200.',data.base_url)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                <img v-lazy="get_path(data.image_url,'_60x60.',data.base_url)"  height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <!--本地SPU-->
                    <td style="position:relative;">
                        <span>
                            <div  class="infringement-icon" v-if="data.pre_sale" >空卖</div>
                            <div class="localhost-spu">
                                <ui-tip :content="data.spu"></ui-tip>
                            </div>
                        </span>
                    </td>
                    <!--账号简称-->
                    <td>
                        <ui-tip :content="data.code"></ui-tip>
                    </td>
                    <!--产品中文名称-->
                    <td>
                        <ui-tip  :content="data.zn_name"></ui-tip>
                    </td>
                    <!--产品英文名称-->
                    <td>
                        <ui-tip  :content="data.en_name"></ui-tip>
                    </td>
                    <!--本地分类-->
                    <td><ui-tip :content="data.category_name" :width="90"></ui-tip></td>
                    <!--创建时间-->
                    <td>
                        <times :time="data.create_time"></times>
                    </td>
                    <!--销售员-->
                    <td>
                        <ui-tip :content="data.seller_name"></ui-tip>
                    </td>
                    <!--产品标签-->
                    <td>
                        <ui-tip :content="data.tag"></ui-tip>
                    </td>
                    <!--任务时间-->
                    <td>
                        <span :class="{'red-font':data.status===3}">{{data.task_time | dateFilter}}</span>
                    </td>
                    <!--刊登状态-->
                    <td>
                        <!--<ui-tip  v-if="data.publish_status===''"  :content=""></ui-tip>-->
                        <ui-tip  v-if="data.publish_status===0"  :content="$t('ymx-list.toUpload')"></ui-tip>
                        <ui-tip  v-else-if="data.publish_status===1"  :content="$t('ymx-list.onTheCross')"></ui-tip>
                        <ui-tip  v-else-if="data.publish_status===2"  :content="$t('ymx-list.haveAlreadyUploaded')"></ui-tip>
                        <ui-tip  v-else-if="data.publish_status===3"  :content="$t('ymx-list.failToUpload')"></ui-tip>
                        <ui-tip  v-else-if="data.publish_status===4"  :content="$t('ymx-list.reedit')"></ui-tip>
                        <ui-tip  v-else-if="data.publish_status===5"  :content="$t('ymx-list.publishedDraft')"></ui-tip>
                    </td>
                    <!--任务状态-->
                    <td>
                        <ui-tip v-if="data.status===0" :content="$t('ymx-list.haveNotStarted')" ></ui-tip>
                        <ui-tip v-else-if="data.status===1" :content="$t('ymx-list.underway')" ></ui-tip>
                        <ui-tip v-else-if="data.status===2" :content="$t('ymx-list.offTheStocks')" ></ui-tip>
                        <ui-tip v-else-if="data.status===3" :content="$t('ymx-list.hasBeenPostponed')" ></ui-tip>
                        <ui-tip v-else-if="data.status===4" :content="$t('ymx-list.canceled')" ></ui-tip>
                    </td>
                    <!--利润率-->
                    <td>
                        <ui-tip :content="data.profit"></ui-tip>
                    </td>
                    <!--操作-->
                    <td>
                        <!--$t('p-ebay.publish')-->
                        <!--<permission tag="ElButton"-->
                        <!--:disabled="data.status!==0&&data.status!==3&&data.publish_status!==3&&data.publish_status!==4&&data.publish_status!==5"-->
                        <!--:route="apis.url_amazon_field"-->
                        <!--type="primary" size="mini"-->
                        <!--@click="go_publish(data)">{{$t('ymx-list.up')}}</permission>-->
                        <trends-select class="inline" type="primary"
                                       :selects="fiter(data)" @trigger="check(data,$event)"></trends-select>
                    </td>
                </tr>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handle_size_change"
            @current-change="handle_current_change"
            :current-page=searchData.page
            :page-sizes="[20, 50,100, 200, 500]"
            :page-size=searchData.pageSize
            layout="total, sizes, prev, pager, next, jumper"
            :total=total>
        </el-pagination>
        <all-swith-cell
            v-model="all_Swith_dialog"
            :tableData="swith_value"
            :seller_arr="seller_arr"
            :code_arr="code_arr"
            @init="search"
        ></all-swith-cell>
        <swith-cell
            v-model="swith_dialog"
            :dat="swith_data"
            :seller_arr="seller_arr"
            :code_arr="code_arr"
        ></swith-cell>
    </div>
</template>

<style lang="stylus">
    .p-amazon-dailypublished{
        .high-light{
            background-color: rgba(173,227,255, 0.5);
        }
        .red-font{
            color:red;
        }
        .infringement-icon{
            position:absolute;
            top:0;
            left:0;
            font-size:12px;
            color:red;
            line-height:normal;
            cursor:pointer;
            border:1px solid red;
            padding:1px 3px;
        }
        .localhost-spu{
            box-sizing:border-box;
            padding-left:35px;
        }
    }
</style>

<script>
    import {api_publish_amazon_task,api_get_amazon_account,api_publish_amazon_batch_delete_task,api_publish_amazon_seller,api_amazon_export} from '../../../../api/amazon-publish-list';
    import {get_path} from '../../ebay/kandeng-list/add-edit-listing/get-path';
    import {url_amazon_field} from '../../../../api/amazon-publish-info';
    import {dailyList} from './action';
    import {downloadFile} from "@/lib/http-plus";
    import {api_mymall_category_tree} from '@/api/shopee-publish';
    export default {
        permission:{
            url_amazon_field
        },
        data(){
            return {
                total:0,
                loading:false,
                firstLoading:true,
                tableData:[],
                searchData: {
                    page:1,
                    pageSize:50,
                    account_id:"",
                    status:"",
                    tag_id:"",
                    start_time:new Date(),
                    end_time:new Date(),
                    seller_id:[],
                    department_id:"",
                    spus:''
                },
                clears:{
                    page:1,
                    pageSize:50,
                    account_id:"",
                    status:"",
                    tag_id:"",
                    start_time:new Date(),
                    end_time:new Date(),
                    seller_id:[],
                    spus:''
                },
                imgPath:'',
                imgDialog:false,
                account:[],
                checkAll:false,
                all_Swith_dialog:false,
                swith_dialog:false,
                seller_arr:[],
                code_arr:[],
                swith_data:{},
                sellerArray:[],
            }
        },
        created(){
            // this.$http(api_sales_staffs).then(res=>{
            //     this.seller_arr=res.map(row=>{
            //         return{
            //             label:row.realname,
            //             value:row.id
            //         }
            //     })
            // });
        },
        mounted(){
            this.search();
            this.$http(api_publish_amazon_seller,2)
                .then(res=>{
                    this.sellerArray=[...res];
                    this.getuser(this.sellerArray);
                })
                .catch(err=>{
                    console.log(err);
                })
        },
        methods:{
            dailyList,
            get_path,
            search(){
                this.loading=true;
                this.checkAll=false;
                let params=clone(this.searchData);
                params.category_id=params.category?params.category[params.category.length-1]:'';
                let array = params.spus.split(',');
                if(array.length>500){
                    this.$message({
                        type:'info',
                        message:'批量搜索只支持500条数据'
                    })
                }else{
                    params.start_time&&(params.start_time = datef('YYYY-MM-dd',new Date(params.start_time)/1000));
                    params.end_time&&(params.end_time = datef('YYYY-MM-dd',new Date(params.end_time)/1000));
                    //处理seller_id选择的数据
                    if(params.seller_id.length){
                        if(typeof (params.seller_id[params.seller_id.length-1])==='string'){
                            params.department_id=parseInt(params.seller_id[params.seller_id.length-1]);
                            params.seller_id="";
                        }else{
                            params.seller_id=params.seller_id[params.seller_id.length-1];
                        }
                    }else{
                        params.seller_id="";
                        params.department_id="";
                    }
                    this.$http(api_publish_amazon_task,params)
                        .then(res=>{
                            res.data.forEach(item=>{
                                item.isChecked=false;
                            });
                            this.loading=false;
                            this.firstLoading=false;
                            this.tableData=[...res.data];
                            this.total=res.count;
                            this.searchData.pageSize=parseInt(res.pageSize);
                            this.searchData.page=parseInt(res.page);
                        })
                        .catch(err=>{
                            console.log(err);
                            this.loading=false;
                        })
                }
            },
            getuser(arr){
                arr.forEach(el=>{
                    if(el.children.find(row=>row.children)){
                        this.getuser(el.children);
                    }else{
                        this.seller_arr=[...this.seller_arr,...el.children]
                    }
                })
            },
            data_format(val) {
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
            handle_size_change(val){
                this.searchData.pageSize = val;
                this.search();
            },
            handle_current_change(val){
                this.searchData.page = val;
                this.search();
            },
            row_click(index){
                console.log(index);
            },
            check_row(obj){
                console.log(obj.isChecked);
            },
            get_account(){
                this.$http(api_get_amazon_account).then(res => {
                    this.account = res;
                    // this.searchData.account_id = this.accounts.length>0?this.accounts[0].account_id:'';
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message:code.message || code
                    });
                    this.account.splice(0, this.accounts.length+1);
                })
            },
            export_data(){
                if(this.tableData.length<=0){
                    this.$message({type:'info',message:'请先获取导出数据……'});
                    return;
                }
                let params=clone(this.searchData);
                params.category_id=params.category?params.category[params.category.length-1]:'';
                let array = params.spus.split(',');
                if(array.length>500){
                    this.$message({
                        type:'info',
                        message:'批量搜索只支持500条数据'
                    })
                }else{
                    params.start_time&&(params.start_time = datef('YYYY-MM-dd',new Date(params.start_time)/1000));
                    params.end_time&&(params.end_time = datef('YYYY-MM-dd',new Date(params.end_time)/1000));
                    //处理seller_id选择的数据
                    if(params.seller_id.length){
                        if(typeof (params.seller_id[params.seller_id.length-1])==='string'){
                            params.department_id=parseInt(params.seller_id[params.seller_id.length-1]);
                            params.seller_id="";
                        }else{
                            params.seller_id=params.seller_id[params.seller_id.length-1];
                        }
                    }else{
                        params.seller_id="";
                        params.department_id="";
                    }
                    delete params.page;
                    delete params.pageSize;
                    this.$http(api_amazon_export,params).then(res=>{
                        if(res.status==1){
                            downloadFile({
                                url: config.apiHost + `downloadFile/downExportFile`,
                                get:{file_code:res.file_code},
                                fileName:res.file_name,
                                suffix: '.csv'
                            })
                        }else{
                            this.$message({type:'success',message:res.message});
                        }
                    })
                }
            },
            batch_switch(){
                let is_check=this.tableData.filter(row=>row.isChecked==true);
                if(is_check.length<=0){
                  this.$message({type:'info',message:this.$t('ymx-list.pleaseSelect')})
                }else{
                    this.all_Swith_dialog=true;
                }
            },
            change_check(){
                let arr=this.tableData.filter(item=>{
                    return item.isChecked;
                })
                if(arr.length===this.tableData.length){
                    this.checkAll=true;
                }else{
                    this.checkAll=false;
                }
            },
            change_all(val){
                this.tableData.forEach(item=>{
                    this.$set(item,'isChecked',val);
                })
            },
            check(data,e){
                let array = this.dailyList(data);
                let operate = array.find(function (operate) {
                    return operate.value === e.value
                });
                operate.action.call(this, data);
            },
            batch_delete_task(){
                let array = this.tableData.filter(item=>{
                    return item.isChecked
                })
                let idArr = array.map(item=>{
                    return item.id;
                })
                let ids = idArr.join(',');
                if(array.length){
                    this.$confirm('此操作将取消所选SPU刊登任务, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(api_publish_amazon_batch_delete_task,{ids:ids})
                            .then(res=>{
                                console.log(res);
                                this.$message({
                                    type:'success',
                                    message:res.message || '执行成功'
                                })
                                this.search();
                            })
                            .catch(err=>{
                                this.$message({
                                    type:'error',
                                    message:err.message ||err
                                })
                            })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '取消成功'
                        });
                    });
                }else{
                    this.$message({
                        type:'info',
                        message:"请先选择要操作的数据！"
                    })
                }
            },
            fiter(data){
                return this.dailyList(data).filter(row=>{
                    return  this.$hasPermission(row.api)
                })
            }
        },
        computed:{
            swith_value(){
                let arr=this.tableData.filter(row=>row.isChecked==true);
                return arr.map(row=>{
                    return{
                        id:row.id,
                        spu:row.spu,
                        code:row.code,
                        seller_name:row.seller_name,
                        seller_id:'',
                        account_id:''
                    }
                })
            },
        },
        watch:{

        },
        filters:{
            dateFilter(val){
                return datef('YYYY-MM-dd', val);
            }
        },
        props: {
            siteList:{
                required: true,
                type: Array,
            }
        },
        components:{
            dailyPublishedSearch:require('./daily-published-search.vue').default,  //搜索框
            uiTable:require("../../../../components/ui-table.vue").default,
            uiTip:require("../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
            dailyPublishedMidleButton:require('./daily-published-midle-button.vue').default,
            allSwithCell:require("./all-Swith-cell.vue").default,
            swithCell:require("./swith-cell.vue").default,
        }
    }
</script>

