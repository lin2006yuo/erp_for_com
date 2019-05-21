<template>
    <page>
        <search :params="params"
                @search="search"
                :secondClear="secondClear"
                :clears="clears"></search>
        <div class="mt-xs mb-xs ml-sm">
            <trends-select class="inline btn-trends-select-relative ml-mini"
                           :selects="filterHandles"
                           :dropdownWidth="dropdownWidth"
                           ref="trends"
                           type="primary"
                           @trigger="mark_handle">
            </trends-select>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="deleteList">批量删除</el-button>

        </div>
        <ui-table
            ref="table"
            v-loading="loading" :first-loading="firstLoading"
            :element-loading-text="$t('ebay-list.playLoad')"
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            :heads="[
                        {isCheck:true,width:2},
                        {label:'bestofferId',width:5},
                        {label:'offer时间/有效期',width:8},
                        {label:'图片',width:5},
                        {label:'SKU标题',width:11},
                        {label:'收件人/买家ID',width:6},
                        {label:'买家（评级）',width:12},
                        {label:'相关Item',width:8},
                        {label:'Item价格',width:5,},
                        {label:'bestoffer价',width:5},
                        {label:'数量',width:4},
                        {label:'状态',width:4},
                        {label:'BestOffer状态',width:7},
                        {label:'卖家最后一次还价',width:7},
                        {label:'操作人',width:5},
                        {label:$t('ebay-list.operat'),width:6}
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <ui-tip :content="data.best_offer_id"></ui-tip>
                    </td>
                    <td style="position: relative">
                        <ui-tip :content="data.expire_time"></ui-tip>
                    </td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="data.img"
                                 @click="search_img(data.img)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                          <img v-lazy="data.img"
                                               @click="search_img(data.img)"
                                               height="60px" width="60px" style="border:none">
                                    </span>
                        </el-popover>
                    </td>
                    <td>
                        <ui-tip :content="data.title"
                                :width="90"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.buyer_id" :width="80"></ui-tip></td>
                    <td><ui-tip :content="data.buyer_info"></ui-tip></td>
                    <td><ui-tip :is-operate="true" @cur-click="cur_click(data)" :content="data.item_id"
                                :width="90"></ui-tip></td>
                    <td>{{data.item_price}}</td>
                    <td>{{data.best_offer_price}}</td>
                    <td>{{data.number}}</td>
                    <td>{{data.local_status}}</td>
                    <td>{{data.status}}</td>
                    <td>{{data.seller_offer_price}}</td>
                    <td>{{data.operator_name}}</td>
                    <td>
                        <trends-select  class="inline"
                                        @trigger="operate(data,$event)"
                                        :selects="operatesList"
                                        ref="trend"
                                        :dropdownWidth="operateWidth"
                                        type="primary">
                        </trends-select>
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
        <bargaining v-model="bargainShow"
                    :bestOfferId="bestOfferIds"
                    @change-status="changeStatus"
                    :reject="reject"></bargaining>
    </page>
</template>

<script>
    import {get_path} from '../kandeng-list/add-edit-listing/get-path';
    import {api_ebay_best_offer,api_ebay_best_offer_delete,api_ebay_best_offer_sync} from '@/api/ebay-kandeng-public-module';
    import {operateList} from './action';
    export default {
        name: "index",
        data(){
            return{
                reject:false,//拒绝
                bargainShow:false,
                loading:false,
                checkAll:false,
                tableData:[],
                flag:0,
                selectIds:[],
                firstLoading:true,
                dropdownWidth:'',
                operateWidth:'',
                filterHandles:[
                    {name: "部分同步", value: 1,action(){this.sync_a(1)}},
                    {name: "全部同步", value: 2,action(){this.sync_a(2)}},],

                params:{
                    bestOfferIds:'',
                    dateType:'expire',
                    accountId:'',
                    status:'',
                    itemId:'',
                    dateStart:'',
                    dateEnd:'',
                    number:''
                },
                bestOfferIds:'',
                clears:{
                    accountId:'',
                    dateType:'expire',
                    status:'',
                    itemId:'',
                    dateStart:'',
                    dateEnd:'',
                    number:''
                },
                page:1,
                pageSize:50,
                count:0,
            }
        },
        mounted(){
            // this.$nextTick(function () {
            //     setTimeout(() => {
            //         this.operateWidth=this.$refs.trend.$el.clientWidth + 'px';
            //     }, 300);
            //
            // });
            this.init();
            this.get_with();//下拉按钮宽度
        },
        methods:{
            get_path,
            operateList,
            size_change(size){
                this.pageSize = size;
                this.init();
            },
            current_change(page){
                this.page = page;
                this.init();
            },
            init(){
                let data = JSON.parse(JSON.stringify(this.params));
                let curString = this.params.itemId.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                data.itemId = cur.map(row=>row.trim()).join(',')||'';
                data.page=this.page;
                data.pageSize=this.pageSize;
                data.dateStart=this.params.dateStart ? datef("YYYY-MM-dd",this.params.dateStart/1000) : '';
                data.dateEnd=this.params.dateEnd ? datef("YYYY-MM-dd",this.params.dateEnd/1000) : '';
                this.loading = true;
                this.$http(api_ebay_best_offer,data).then(res=>{
                    res.data.forEach(row => {
                        row.isCheck = false;
                        row.heighLight = false;
                    });
                    this.tableData = res.data;
                    this.count = res.count;
                    this.loading = false;
                }).catch(code=>{
                    console.log(code);
                })
            },
            head_check(val){
                this.flag=1;
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            cur_click(row){
                let newSite = ".com";
                switch (row.site){
                    case 0: //美国
                        newSite = ".com";
                        break;
                    case 15:  //澳大利亚
                        newSite = ".com.au";
                        break;
                    case 16:  //奥地利
                        newSite = ".at";
                        break;
                    case 186:  //西班牙
                        newSite = ".es";
                        break;
                    case 101:   //意大利
                        newSite = ".it";
                        break;
                    case 193:   //瑞士
                        newSite = ".ch";
                        break;
                    case 71:    //法国
                        newSite = ".fr";
                        break;
                    case 3:     //英国
                        newSite = ".co.uk";
                        break;
                    case 77:    //德国
                        newSite = ".de";
                        break;
                    case 2:    //加拿大
                        newSite = ".ca";
                        break;
                    case 212:   //波兰
                        newSite = ".pl";
                        break;
                    case 146:   //荷兰
                        newSite = ".nl";
                        break;
                    case 205:   //爱尔兰
                        newSite = ".ie";
                        break;
                    default:
                        newSite = ".com";
                        break;
                }
                window.open("https://www.ebay" + newSite + "/itm/"+row.item_id);
            },
            search_img(image){
                if(image.includes('http')){
                    this.imgPath = this.get_path(image,'.',this.baseUrl);
                }else{
                    this.imgPath = this.get_path(image,'_500x500.',this.baseUrl);
                }
                this.imgDialog = true;
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            get_with(){//下拉按钮宽度
                this.$nextTick(function () {
                    setTimeout(() => {
                        this.dropdownWidth=this.$refs.trends.$el.clientWidth + 'px';
                    }, 300);

                });
            },
            mark_handle(row){
                row.action.call(this,row);
            },
            operate(data,options){
                this.bestOfferIds=data.best_offer_id;
                options.action.call(this,data);
            },
            sync_a(status){// 1部分/2全部同步
                if(status===2){
                    this.$http(api_ebay_best_offer_sync).then(res=>{
                        this.$message({type:"success",message: res.message||res});
                    }).catch(code=>{
                        this.$message({type:"error",message: code.message||code});
                    })
                }else if(status===1){
                    if(!this.check_list()){
                        this.$message({
                            type:"warning",
                            message: this.$t('ebay-list.pleaseSelect')
                        });
                        return;
                    }else {
                        let data = this.selectIds.map(res=>{return res.best_offer_id}).join(',');
                        this.$http(api_ebay_best_offer_sync,{bestOfferIds:data}).then(res=>{
                            this.$message({type:"success",message: res.message||res});
                        }).catch(code=>{
                            this.$message({type:"error",message: code.message||code});
                        })
                    }

                }

            },
            check_list(){
                this.selectIds = this.tableData.filter(res=>{
                    return res.isCheck
                });
                return !!this.selectIds.length?true:false;
            },
            changeStatus(){
                this.init();
            },
            deleteList(){//批量删除
                if(!this.check_list()){
                    this.$message({
                        type:"warning",
                        message: this.$t('ebay-list.pleaseSelect')
                    });
                    return;
                }
                let ids = this.selectIds.map(res=>{return res.id}).join(',');

                this.$http(api_ebay_best_offer_delete,{ids:ids}).then(res=>{
                    this.$message({type:"success",message: res.message||res});
                    this.tableData=this.tableData.filter(res=>{
                        return !res.isCheck
                    })
                }).catch(code=>{
                    this.$message({type:"error",message: code.message||code});
                })

            },
            search(){//搜索
                this.firstLoading=false;
                this.init();
            },
            secondClear(){//清空搜索
                this.params.number='';
            },
        },
        computed:{
            operatesList(){
                return  this.operateList().filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
        },
        components:{
            bargaining:require('./bargaining.vue').default,
            search:require('./search.vue').default,
            trendsSelect:require('../../../../components/trends-select.vue').default,
        }
    }
</script>
