<template>
    <el-row class="c-has-yet">

        <el-dialog title="批量下架" 
        :visible.sync="openResult"
        >
        <div v-loading="loading2"
        element-loading-text="玩命加载中……">
            <table class="opentable"  >
                <tr style="font-weight:600;background-color:#e4e4e4;">
                    <td>ItemID</td>
                    <td>SPU</td>
                    <td>账号简称</td>
                    <td>结果</td>
                </tr>
                <template v-for='modif in modificationResult'>
                    <tr>
                        <td>{{modif.item_id}}</td>
                        <td style="position: relative"> 
                            <span @click="bind_spu(modif)" class="operate" v-if="modif.goods_id===0">
                             <i class="el-icon-information"
                                style="position: absolute;top:50%;margin-top:-6px;left:75px"
                                title="点击关联"></i>
                            <ui-tip :content="modif.spu||'未关联'" style="padding-left: 12px"></ui-tip>
                        </span>
                        <ui-tip :content="modif.spu" v-else></ui-tip></td>
                        <td><ui-tip :content="modif.account_code" :width="80"></ui-tip></td>
                        <td>
                            <template v-if='/下架成功/.test(modif.offline)'>
                                下架成功
                            </template>
                            <template v-else>
                                <!-- <el-tooltip class="item" effect="dark" :content="" placement="right">
                                   
                                </el-tooltip> -->

                                <el-popover
                                    placement="right"
                                    width="200"
                                    trigger="hover"
                                    :content="modif.offline">
                                     <span style="color:#33b2fc" slot="reference">下架失败</span>
                                </el-popover>
                            </template>
                        </td>
                    </tr>
                </template>
            </table>
            </div>
        </el-dialog>
<!-- offlineEbayProduct -->

        <search ref="search"
                :search-data="searchData"
                :site-list="siteList"
                @enter="search"
                :clears="clears"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
            <el-button type="primary" size="mini" class="inline"
                        @click.native="batch_open_close">{{buttonTitle}}</el-button>
            <el-button type="primary" size="mini" class="inline"
                        @click.native="change_price">已更改价格</el-button>
            <el-select v-model="option" placeholder="更多批量修改" clearable class="inline ml-sm">
                <el-option v-for="item in options" :key="item.value"
                           :label="item.label" :value="item.value"
                           @click.native="process(item)"></el-option>
            </el-select>
        </div>
        <ui-table
            ref="table"
            v-loading="loading" :first-loading="firstLoading"
            element-loading-text="玩命加载中..."
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                        {isCheck:true,width:2},
                        {label:'产品图片',size:75},
                        {label:'ItemID',width:10},
                        {label:'本地SPU',width:6},
                        {label:'刊登标题',width:10},
                        {label:'账号简称',width:5},
                        {label:'站点',width:5},
                        {label:'出售方式',width:5},
                        {label:'价格',width:9,isSort:true,order_type:'order_price'},
                        {label:'刊登费用',width:5},
                        {label:'刊登天数',width:5},
                        {label:'已售量',width:5,isSort:true,order_type:'order_sold_quantity'},
                        {label:'浏览量',width:4},
                        {label:'收藏量',width:4},
                        {label:'刊登时间',width:7,isSort:true,order_type:'order_publish_date'},
                        {label:'结束时间',width:7},
                        {label:'修改状态',width:5},
                        {label:'Listing分类',width:6},
                        {label:'操作',size:120}
                       ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',data.listing_status===5?'redborder':'']" @click="addClass(index)"
                    :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
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
                        <i @click="show_detail(data)" v-if="data.variation" :class="[data.show? 'minus':'plus','fl']"></i>
                        <i class="plus" style="background: none" v-else></i>
                        <ui-tip :content="data.item_id"></ui-tip>
                    </td>
                    <td style="position: relative">
                         <span @click="bind_spu(data)" class="operate" v-if="data.goods_id===0">
                             <i class="el-icon-information"
                                style="position: absolute;top:50%;margin-top:-6px;left: 5px"
                                title="点击关联"></i>
                            <ui-tip :content="data.spu||'未关联'" style="padding-left: 12px"></ui-tip>
                        </span>
                        <ui-tip :content="data.spu" v-else></ui-tip>
                    </td>
                    <td>
                        <ui-tip :is-operate="true" :content="data.title" :width="90"
                                 @cur-click="cur_click(data)"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.account_code" :width="80"></ui-tip></td>
                    <td>{{filterSite(data.site)}}</td>
                    <td>{{data.listing_type | way}}</td>
                    <td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>
                    <td>{{data.symbol}} {{data.insertion_fee}}</td>
                    <td>{{data.listing_duration | filterDay}}</td>
                    <td><ui-tip :content='data.sold_quantity'></ui-tip></td>
                    <td>{{data.hit_count}}</td>
                    <td>{{data.watch_count}}</td>
                    <td><times :time="data.start_date"></times></td>
                    <td><times :time="data.end_date"></times></td>
                    <td>{{data.listing_status |filterStatus}}</td>
                    <td><ui-tip :content='data.listing_cate'></ui-tip></td>
                    <td>
                        <trends-select  class="inline" @trigger="operate(data,$event)" :selects="operatesList" type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>产品图片</td>
                        <td colspan="2">平台SKU</td>
                        <td colspan="3">本地SKU</td>
                        <template v-for="tm1 in data.v_varkey" v-if="data.v_varkey">
                            <td :key="tm1">{{tm1}}</td>
                        </template>
                        <td>成本价</td>
                        <td>价格</td>
                        <td>可售量</td>
                        <td>本地状态</td>
                        <td v-if="data.v_varkey" :colspan="`${9-(data.v_varkey&&data.v_varkey.length)}`" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td :colspan="9" :rowspan="`${(data.varians&&data.varians.length)+1}`" v-else></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.varians" :key="item.id" v-if="data.varians" class="variant">
                        <td>
                            <el-popover placement="right" trigger="hover">
                                <img v-lazy="sku_image(item,200)"
                                     @click="search_sku_img(item)"
                                     width="200px" height="200px">
                                <span slot="reference">
                                  <img v-lazy="sku_image(item,60)"
                                       @click="search_sku_img(item)"
                                       height="60px" width="60px" style="border:none">
                                </span>
                            </el-popover>
                        </td>
                        <td colspan="2"><ui-tip :content="item.channel_map_code" :width="98"></ui-tip></td>
                        <td colspan="3"><ui-tip :content="item.v_sku" :width="98"></ui-tip></td>
                        <template v-for="(tm2,km2) in data.v_varkey">
                            <td :key="tm2"><ui-tip :content="item.variation[tm2]" :width="98"></ui-tip></td>
                        </template>
                        <!--<td>{{item.cost_price}}</td>-->
                        <td>
                            <div>{{item.cost_price}}</div>
                            <div class="costclass" v-if="Number(item.adjusted_cost_price)>Number(item.cost_price)">
                                <span>涨价：{{(Number(item.adjusted_cost_price)-Number(item.cost_price)).toFixed(2)}}</span>
                            </div>
                            <div class="priceclass" v-if="Number(item.adjusted_cost_price)<Number(item.cost_price)">
                                <span>降价：{{(Number(item.item.cost_price)-Number(item.adjusted_cost_price)).toFixed(2)}}</span>
                            </div>
                        </td>
                        <td>{{data.symbol}} {{item.v_price}}</td>
                        <td>{{item.v_qty || 0}}</td>
                        <td>{{item.status | filterSalesStatus}}</td>
                    </tr>
                </template>
            </template>
            </tbody>
        </ui-table>
        <el-pagination
            class="page-fixed"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[20, 50, 100, 200,500]"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <auto-add v-model="autoAddShow"
                  :select-ids="selectIds"></auto-add>
        <bind-spu v-model="bindVisable"
                  :is-multiattribute="isMultiattribute"
                  :channel-sku="channelSku"
                  :local-sku="localSku"
                  :is-ebay="true"
                  type="ebay"
                  @valids-ebay="valids_ebay">
        </bind-spu>
        <add-goods v-model="addlistVisable" @selected="selecteds"></add-goods>
        <action-log v-model="logVisable" :product-id="productId" type="ebay"></action-log>
        <restart-rule v-model="restartRuleShow" :select-ids="selectIds"></restart-rule>
        <action-promotion v-model="actionPromotionShow" :select-ids="selectIds" :accountId="accountId" :siteId="siteId"></action-promotion>
        <action-auction v-model="actionAuctionShow" :select-ids="selectIds" @change-data="change_auction" :ebay-status="ebayStatus"></action-auction>
        <action-price-quantity v-model="actionPriceQuantityShow" :select-ids="selectIds" @change-data="change_price_quantity" :ebay-status="ebayStatus"></action-price-quantity>
        <modify-title-ebay v-model="modifyTitleShow" :status="1"
                           :table-data="selectIds"
                           @submit="modify_submit"
                           @change-spu="change_spu"
        ></modify-title-ebay>
        <action-store v-model="actionStoreShow" :select-ids="selectIds" :accountId="accountId" :ebay-status="ebayStatus"></action-store>
        <action-common-module v-model="actionCommonModuleShow"
                              :select-ids="selectIds"
                              :site-id="siteId"
                              :site-name="siteName"
                              :ebay-status="ebayStatus"></action-common-module>
        <action-published-style v-model="actionPublishedStyleShow" :select-ids="selectIds"></action-published-style>
        <action-sales-instructions v-model="actionSalesInstructionsShow" :select-ids="selectIds"></action-sales-instructions>
        <action-images  v-model="actionImagesShow" :select-ids="selectIds" :account-id="accountId" status="1" @change-data="change_images"></action-images>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="`查看大图`"></blowup-image>
        <batch-mdf-time v-model="mdfTimeDialog"
                         :title="mdfTimeTitle"
                         :paramData="selectIds"
                         :type="curType"></batch-mdf-time>
    </el-row>
    
</template>
<style lang="stylus">
    .c-has-yet{
        .redborder{
            background-color: rgba(250, 172, 171, 0.5)!important;
        }
    }
    .costclass{
        background: red;
        color:#fff;
        border-radius:2px;
    }
    .priceclass{
        background: #00CC66;
        color:#fff;
        border-radius:2px;
    }
</style>
<style>
.opentable{
    width: 100%;
    border: 1px solid #ccc;
    border-collapse: collapse;
}
.opentable>tr>td{
    width: 25%;
    line-height: 25px;
    height: 25px;
    border: 1px solid #ccc;
    padding: 5px;
    box-sizing: border-box;
    text-align: center;
}
</style>

<script>
    import {
    	api_listing_management,
        api_get_relatedProduc,
        api_get_action_logs,
        api_up_draftitle,
        api_ebay_variations,
        api_up_title,
        api_export_draft_info,
        url_up_title,
        url_up_listing_duration,
        url_save_listing,
        url_export_draft_info
    } from '../../../../../api/ebay-kandeng-public-module';
    import {
    	api_offline_ebay_product,
        api_rsync_ebay_product,
        api_rsync_edit_ebay_product,
        api_ebay_adjust_price,
        url_offline_ebay_product,
        url_ebay_replenishment,
        url_ebay_reshelf,
        url_ebay_promotion,
        url_rsync_ebay_product,
        url_rsync_edit_ebay_product,
        url_edit_ebay_product_price_quantity,
        url_edit_ebay_product_auction_price,
        url_edit_ebay_shop_category,
        url_ebay_common_module,
        url_update_ebay_product_images
    } from '../../../../../api/ebay-kandeng-operated'
    import {api_add_goods} from "../../../../../api/supplier-quote"
    import {operateList} from './action';//------操作按钮引入
    import {get_path} from '../add-edit-listing/get-path';
    import {mapGetters} from 'vuex';
    import search from "./search.vue";
    import {downloadFile} from '../../../../../lib/http';
    export default{
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'曾绍辉、乔衡山',
                createTime:'2017-06-30',
                updateTime:'2017-10-12'
            }
        },
        permission: {
            url_export_draft_info,
            url_up_title,url_save_listing,url_offline_ebay_product,url_ebay_replenishment,url_ebay_reshelf,url_ebay_promotion,url_rsync_ebay_product,url_rsync_edit_ebay_product,
            url_edit_ebay_product_price_quantity,url_edit_ebay_product_auction_price,url_edit_ebay_shop_category,url_ebay_common_module,url_update_ebay_product_images
        },
        data(){
            return {
                loading2:true,
                openResult:false,
                modificationResult:[],
                isOpen:false,
                accountCode:'',
                firstLoading:true,
                mdfTimeDialog:false,
                curType:"",
                mdfTimeTitle:"",
                isMultiattribute:"",
                goodsIdSpu:{
                    goods_id:"",
                    spu:"",
                },
                argumentData:[/*关联参数*/],
                searchData: {
                    searchType:'select',
                    searchChooese:"itemID",
                    snText:"",
                    item_id:"",
                    spu:"",
                    sku:"",
                    title:"",
                    listing_sku:"",
                    account_id: "",
                    account_code:'',
                    site: "",
                    listing_type:"",
                    listing_duration:"",
                    replen:"",
                    goods_type:"",
                    work_off:"",
                    sales_status:"",
                    restart:"",
                    category:"",
                    promotion_id:"",
                    paypal_emailaddress:"",
                    picture_gallery:"",
                    location:"",
                    quantity:"",
                    best_offer:"",
                    return_time:"",
                    sub_title:"",
                    dispatch_max_time:"",
                    listing_cate:"",
                    user_id:"",
                    listing_status:3,
                    application:"",
                    name:"start",
                    start_date: "",
                    end_date:"",
                    adjust_range:'',
                    adjusted_price:'',
                },
                clears:{
                    searchType:'select',
                    searchChooese:"itemID",
                    name:"start",
                    listing_status:3,
                },
                btnList:[//----------------------------------------------操作按钮
                    {name:'批量下架',clickName:'',status:1,api:url_offline_ebay_product},
                    {name:'自动补货设置',clickName:'',status:2,api:url_ebay_replenishment},
                    {name:'重上规则设置',clickName:'',status:3,api:url_ebay_reshelf},
                    {name:'促销折扣设置',clickName:'',status:4,api:url_ebay_promotion},
                    {name:'同步Listing',clickName:'',status:5,api:url_rsync_ebay_product},
//                    {name:this.buttonTitle,clickName:'',status:7},
//                    {name:'一键关闭列表',clickName:'',status:8},
                    {name:'导出为小平台格式',clickName:'',status:9,},
                ],
                options: [ //----------------------更多操作按钮
                    {
                        value: '1',
                        label: '修改一口价及可售量',
                        status:1,
                        api:url_edit_ebay_product_price_quantity,
                        action(data){
                            if(!this.way_same(1)){
                                this.$message({
                                    type:"warning",
                                    message: `请选择出售方式同为“一口价”的Listing做修改`
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.actionPriceQuantityShow = true;
                        }
                    },
                    {
                        value: '2',
                        label: '修改拍卖价',
                        status:2,
                        api:url_edit_ebay_product_auction_price,
                        action(data){
                            if(!this.way_same(2)){
                                this.$message({
                                    type:"warning",
                                    message: `请选择出售方式同为“拍卖”的Listing做修改`
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.actionAuctionShow = true;
                        }
                    },
                    {
                        value: '3',
                        label: '修改刊登标题',
                        status:3,
                        api:url_up_title,
                        action(data){
                            this.selectIds = window.clone(data);
                            this.modifyTitleShow = true;
                        }
                    },
                    {
                        value: '4',
                        label: '修改商店分类',
                        status:4,
                        api:url_edit_ebay_shop_category,
                        action(data){
                            if(!this.juge_same()){
                                this.$message({type:"warning",message:"请选择相同店铺修改"});
                                return ;
                            }
                            this.accountId=data[0].account_id;
                            this.selectIds = window.clone(data);
                            this.actionStoreShow = true;
                        }
                    },
                    {
                        value: '5',
                        label: '应用公共模块',
                        status:5,
                        api:url_ebay_common_module,
                        action(data){
                            if(this.sameSite)return this.$message({type:"warning",message:"请选择相同站点的Listing做修改！"});
                            this.selectIds = window.clone(data);
                            this.siteId = data[0].site;
                            this.siteName = this.filterSite(data[0].site);
                            this.actionCommonModuleShow = true;
                        }
                    },
                    {
                        value: '8',
                        label: '替换主图、橱窗图片',
                        status:8,
                        api:url_update_ebay_product_images,
                        action(data){
                            if(!this.juge_same()){
                                this.$message({type:"warning",message:"请选择相同账号及站点的Listing做修改！"});
                                return ;
                            }
                            this.selectIds = window.clone(data);
                            this.accountId = data[0].account_id;
                            this.actionImagesShow = true;
                        }
                    },
                    {
                        value: '9',
                        label: '修改一口价刊登天数',
                        status:9,
                        api:url_up_listing_duration,
                        action(data){
                            if(!this.way_same(1)){
                                this.$message({
                                    type:"warning",
                                    message: `请选择出售方式同为“一口价”的Listing做修改`
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.mdfTimeDialog = true;
                            this.curType="一口价";
                            this.mdfTimeTitle='批量修改一口价刊登天数';
                        }
                    },
                    {
                        value: '10',
                        label: '修改拍卖刊登天数',
                        status:10,
                        api:url_up_listing_duration,
                        action(data){
                            if(!this.way_same(2)){
                                this.$message({
                                    type:"warning",
                                    message: `请选择出售方式同为“拍卖”的Listing做修改`
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.mdfTimeDialog = true;
                            this.curType="拍卖";
                            this.mdfTimeTitle='批量修改拍卖刊登天数';
                        }
                    },
                ],
                title:{
                    select:"",
                    prefix:{isPre:false,pre:"",isSuf:false,suf:""},
                    find:{value:"",replace:""},
                    unite:""
                },
                accountList:[],
                option:"",
                flag:0,
                accountId:"",
                siteId:"",
                siteName:"",
                autoAddShow:false,
                restartRuleShow:false,
                actionPromotionShow:false,
                actionAuctionShow:false,
                actionPriceQuantityShow:false,
                modifyTitleShow:false,
                actionStoreShow:false,
                actionCommonModuleShow:false,
                actionPublishedStyleShow:false,
                actionSalesInstructionsShow:false,
                actionImagesShow:false,
                loading:false,
                tableData:[],
                checkAll:false,
                page:1,
                size:50,
                total:0,
                operateList:operateList,
                selectIds:[],
                max:0,
                min:0,
                type:"title",
                ebayStatus:"already",
                addlistVisable:false,
                bindVisable:false,
                channelSku:[],
                localSku:{
                    data:[]
                },
                productId:'',
                logVisable:false,
                order:{
                    order_sold_quantity:"",  //排序
                    order_publish_date:"",
                    order_price:"",
                },
                imgDialog: false,
                imgPath:"",
                costval:1,
                priceval:2,
            }
        },
        created(){
            this.init();
        },
        methods:{
            cur_click(row){ //连接跳转
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
            get_path,
            search_img(image){
                if(image.includes('http')){
                    this.imgPath = this.get_path(image,'.',this.baseUrl);
                }else{
                    this.imgPath = this.get_path(image,'_500x500.',this.baseUrl);
                }
                this.imgDialog = true;
            },
            sku_image(item,size){
            	if(item.mainde_path){
                    if(item.mainde_path.includes('http')){
                        return this.get_path(item.mainde_path,`.`,item.base_url)|| '';
                    }
                    return this.get_path(item.mainde_path,`_${size}x${size}.`,item.base_url);
                }
                return '';
            },
            search_sku_img(images){
                this.imgPath = this.sku_image(images,500);
                this.imgDialog = true;
            },
            get_detail(ids){
                if(typeof ids ==='array') ids = ids.join(',');
                   return this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                        return Promise.resolve(res);
                    }).catch(code=>{
                        console.log(code,'code');
                    })
            },
            modify_submit(val,arr){
                this.$http(api_up_title,{data:val}).then(res=>{
                    this.$message({type:"success",message:res.message});
                    this.modifyTitleShow = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message});
                }).finally(()=>{
                    this.$reqKey('mdfTitleEbay',false);
                })
            },
            change_spu(val){
            	val.forEach(row=>{
            		let find = this.tableData.find(it=>{return it.id===row.id});
            		if(find){
            			find.spu = row.spu;
            			find.goods_id = row.goods_id;
                    }
                })
            },
            sort_click(val){
                this.order.order_sold_quantity = "";
                this.order.order_publish_date = "";
                this.order.order_price = "";
                this.order[val.order_type]=val.order;
                let curData = JSON.stringify(clone(this.searchData));
                sessionStorage.setItem('ebaySearchData',curData);
                this.init();
            },
            init(){
                let curObj = sessionStorage.getItem("ebaySearchData");
                if(!curObj)return;
                let curData = JSON.parse(curObj);
                this.searchData = curData;
                this.tableData = [];
                this.loading=true;
                let data = window.clone(this.searchData);
                if(data.account_code){
                    let splitCode = this.split_search(data.account_code);
                    data.account_code = splitCode&&splitCode.length?splitCode.map(row=>row.trim()):'';
                }
                if(this.searchData.searchChooese!=='title'){
                    let curString = this.searchData.snText.replace(new RegExp(' ','gm'),'\n');
                    let cur = curString.split('\n').filter(row=>!!row);
                    data.snText = cur.map(row=>row.trim())||'';
                }else{
                    data.snText = data.snText.trim();
                }

                data.order_sold_quantity = this.order.order_sold_quantity;
                data.order_publish_date = this.order.order_publish_date;
                data.order_price = this.order.order_price;
                data.item_id = this.searchData.searchChooese==="itemID" ? data.snText : "";
                data.spu = this.searchData.searchChooese==="spu" ? data.snText : "";
                data.sku = this.searchData.searchChooese==="sku" ? data.snText : "";
                data.listing_sku = this.searchData.searchChooese==="listing_sku" ? data.snText : "";
                data.title = this.searchData.searchChooese==="title" ? data.snText : "";
                data.page = this.page;
                data.size = this.size;
                if (data.start_date) {
                    data.start_date = datef("YYYY-MM-dd",data.start_date/1000)
                }else {
                    data.start_date="";
                }
                if (data.end_date) {
                    data.end_date = datef("YYYY-MM-dd",data.end_date/1000)
                }else {
                    data.end_date="";
                }
                switch (data.return_time){
                    case 'Days_14':
                        data.return_time = 1;
                    	break;
                    case 'Days_30':
                        data.return_time = 2;
                        break;
                    case 'Days_60':
                        data.return_time = 3;
                        break;
                    case 'Months_1':
                        data.return_time = 4;
                        break;
                    default:
                    	break;
                }
                delete data.searchChooese;
                delete data.snText;
                delete data.searchType;
                this.$http(api_listing_management,data).then(res=> {
                    res.data.forEach(row => {
                        row.num = "";
                        row.show = false;
                        row.isCheck = false;
                        row.heighLight = false;
                    });
                    this.tableData = res.data;
                    this.total = res.count;
                    this.loading = false;
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code
                    });
                });
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            valids_ebay(channelSku){
                let oldData = clone(channelSku);
                let curObj = this.argumentData[0];
                curObj.goods_id = this.goodsIdSpu.goods_id;
                curObj.spu = this.goodsIdSpu.spu;
                if(this.isMultiattribute){
                    let vars = [];
                    channelSku.forEach(row=>{
                        let map_sku = row.local.map(res=>{
                            return {
                                sku_id:res.sku_id,
                                goods_id:res.goods_id,
                                sku:res.local_sku
                            }
                        });
                        let combine_sku = row.local.map(res=>{return `${res.local_sku}*${res.quantity}`}).join(',');
                        let obj = {
                            id:row.id,
                            sku_id:row.local[0].sku_id,
                            combine_sku:combine_sku,
                            map_sku:[...map_sku],
                        };
                        vars.push(obj);
                    });
                    this.$set(curObj,'vars',[...vars]);
                }else{
                    curObj.listing_sku = channelSku[0].listing_sku;
                    let sku = channelSku[0].local.map(res=>{return `${res.local_sku}*${res.quantity}`}).join(',');
                    curObj.sku = sku;//todo
                    curObj.local_sku = channelSku[0].local[0].local_sku;
                }
                this.$http(api_get_relatedProduc,{data:this.argumentData}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.bindVisable = false;
                    let cur = this.tableData.find(row=>row.id===curObj.id);
                    if(!!cur) {
                        cur.goods_id=curObj.goods_id;
                        cur.spu=curObj.spu;
                    }
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            bind_spu(res){
                this.get_detail(res.id).then(row=>{
                    let data = row.data[0];
                    this.channelSku = [];
                    this.argumentData = [];
                    let vars = [{id:"",sku_id:"",combine_sku:"",map_sku:[]}];
                    let obj = {
                        id:res.id,
                        listing_type:res.listing_type,
                        goods_id:"",
                        account_id:res.account_id,
                        listing_sku:res.listing_sku,
                        spu:"",
                    };
                    this.argumentData.push(obj);
                    /*-------------------------------我是分割线-------------------------*/
                    this.addlistVisable=true;
                    if(data.varians&&data.varians.length>0){
                        this.isMultiattribute = true;
                        this.channelSku=window.clone(data.varians).map((row,row_i)=>{
                            let obj={
                                id:row.id,
                                sku:row.channel_map_code,
                                sku_id:row.sku_id,
                                local:[
                                    {local_sku_id:"",good_id:'',sku_id:'',quantity:1,local_sku:''}
                                ]
                            };
                            obj.key=data.v_varkey.map((item,index)=>{
                                obj[`color${index}`]=row.variation[item];
                                return {name:item,field:`color${index}`}
                            });
                            return obj;
                        });
                    }else {
                        this.isMultiattribute = false;
                        //todo 无sku时
                        let obj = {
                            listing_sku:res.listing_sku,
                            local:[
                                {quantity:1,local_sku_id:'',local_sku:"",sku_id:"",goods_id:"",}
                            ]
                        };
                        this.channelSku.push(obj);
                    }
                }).catch(code=>{
                    console.log(code);
                });

            },
            selecteds(val){
                this.goodsIdSpu.goods_id = val[0].id;
                this.goodsIdSpu.spu = val[0].spu;
                let spu=val.map(row=> row.spu).join(',');
                this.$http(api_add_goods,{page:1,pageSize:100,snType:'spu',snText:spu}).then(res=>{
                    this.localSku=res;
                    this.bindVisable=true;
                }).catch(code=>{
                    this.$message({type: "error", message: code.message || code})
                })
            },
            change_listing_status(val){
                val.forEach(out=>{
                    let find = this.tableData.find( row =>{
                        return row.item_id === out.item_id;
                    });
                    if(!!find){
                        find.listing_status = 5;
                    }
                });
            },
            change_auction(val){
                this.change_listing_status(val);
//                保留功能
//                val.forEach(out=>{
//                    let find = this.tableData.find( row =>{
//                        return row.item_id === out.item_id
//                    });
//                    if(!!find){
//                        find.listing_status = 5;
//                       find.start_price = out.buy_it_nowprice;
//                       find.buy_it_nowprice = out.start_price;
//                      Object.assign(find, out);
//                    }
//                });
            },
            change_price_quantity(val){
                this.change_listing_status(val);
//            	保留功能
//                Array.max = function( array ){
//                    return Math.max.apply( Math, array );
//                };
//                Array.min = function( array ){
//                    return Math.min.apply( Math, array );
//                };
//                val.forEach(row=>{
//                    let find = this.tableData.find(item=>{
//                        return item.id===row.id;
//                    });
//                    if(find.varians.length){
//                        let varian=find.varians.find(vari=>{
//                            return vari.v_sku===row.listing_sku
//                        });
//                        varian.v_price = row.start_price;
//                        varian.v_qty = row.quantity;
//                        Object.assign(varian,row);
//                        let arr=[];
//                        find.varians.forEach(x=>{
//                            arr.push(x.start_price)
//                        });
//                        this.max = Array.max(arr);
//                        this.min = Array.min(arr);
//                        if(arr.length>1){
//                            if(this.max === this.min){
//                                find.rval_price = row.start_price
//                            }else{
//                                find.rval_price = `${this.min}~${this.max}`
//                            }
//                            find.quantity = row.quantity * find.varians.length
//                        }
//                    }else {
//                        Object.assign(find,row);
//                    }
//                    find.listing_status = 5;
//                });
            },
            change_title(val){
                this.change_listing_status(val);
            },
            change_images(val){
                this.change_listing_status(val);
            },
            operate(data,options){
                options.action.call(this,data);
            },
            search(data){
                this.firstLoading = false;
                this.searchData = data;
                if(data.start_date instanceof Object){
                    data.start_date= data.start_date.getTime();
                }
                if(data.end_date instanceof Object){
                    data.end_date= data.end_date.getTime();
                }
                let curData = JSON.stringify(data);
                sessionStorage.setItem('ebaySearchData',curData);
                this.init();
            },
            head_check(val){
                this.flag=1;
                this.tableData.forEach(row=>{
                    row.isCheck=val;
                });
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true
            },
            show_detail(data){
                data.show =!data.show;
                data.show&&this.operate_data_id(data,"id");
            },
            //数据处理（获取子商品）
            operate_data_id(data,status){
            	switch (status){
                    case 'id':
                    	let arr = [];
                    	arr.push(data);
                        this.get_variations(arr);
                    	break;
                    case 'ids':
                        this.get_variations(data);
                        break;
                    default:
                    	break;
                }
            },
            //获取子商品
            get_variations(data){
            	let ids=data.map(x=>x.id);
                return this.$http(api_ebay_variations,{ids:ids.join(",")}).then(res=>{
                    res.data.forEach(it=>{
                    	let find = data.find(row=> {return Number(row.id)===Number(it.listing_id)});
                        if(find){
                            it.varians.forEach(va=>{
                                !!va.variation&&(va.variation=JSON.parse(va.variation));
                            });
                            this.$set(find,"varians",it.varians);
                            this.$set(find,"v_varkey",it.v_varkey);
                        }
                    });
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                let data=this.tableData.filter(row=>row.isCheck);
                switch (status){
                    case 1:         //批量下架
                        this.batch_offline();
                        break;
                    case 2:         //自动补货设置
                        if(!this.way_same(1)){
                            this.$message({
                                type:"warning",
                                message: `请选择出售方式同为“一口价”的Listing做修改`
                            });
                            return;
                        }
                        if(data.length){
                            this.selectIds = window.clone(data);
                            this.autoAddShow = true;
                        } else {
                            this.$message({type:"warning",message:"请选择要设置的商品"})
                        }
                        break;
                    case 3:         //重上规则设置
                        if(data.length){
                            this.selectIds = window.clone(data);
                            this.restartRuleShow=true;
                        } else {
                            this.$message({type:"warning",message:"请选择要设置的商品"});
                        }
                        break;
                    case 4:         //促销折扣设置
                        if(data.length){
                            if(!this.juge_same()){
                                this.$message({type:"warning",message:"请选择相同账号及站点的Listing做修改！"});
                                return ;
                            }
                            this.flag=4;
                            this.selectIds = window.clone(data);
                            this.siteId = data[0].site;
                            this.accountId = data[0].account_id;
                            this.actionPromotionShow = true;
                        } else {
                            this.$message({type:"warning",message:"请选择要设置的商品"});
                        }
                        break;
                    case 5:         //同步到Listing
                        this.rsync();
                        break;
                    case 6:         //上传修改
                        this.rsync_update();
                        break;
                    case 9:
                        if(data.length<=0)return this.$message({type:'warning',message:'请选择需要操作的Listing'});
                        this.import_file(data);
                        break;
                }
            },
            import_file(data){
                let ids = data.map(row=>row.item_id).join(',');
                this.$http(api_export_draft_info,{ids:ids,type:1}).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    let params = {
                        file_code:res.file_code,
                    };
                    downloadFile({
                        url:url,
                        get:params,
                        fileName:res.file_name,
                        suffix:'.xls',
                    });
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                });
            },
            batch_open_close(){ //一键展开
                this.isOpen=!this.isOpen;
                this.tableData.forEach(row=>{
                    row.show = this.isOpen;
                });
                if(this.isOpen===true) this.operate_data_id(this.tableData,"ids");
            },
            batch_offline(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({type:"warning",message:"请选择下架的商品"});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.oprate_offline(ids,data);
                this.modificationResult=data;
            },
            oprate_offline(ids,datas){
                this.$confirm(`您将要对已选Listing执行下架, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.loading2=true;
                        this.openResult=true;
                    return this.$http(api_offline_ebay_product,{productIds:ids}).then(res=>{
                        Object.keys(res.message).forEach(val=>{
                            let find = this.modificationResult.find(vals=>Number(vals.item_id)===Number(val))
                            if(find){
                                find.offline = res.message[val]
                            }
                        })
                        this.modificationResult.forEach(el=>{
                            if(/下架成功/.test(el.offline)){
                                if(datas instanceof Array){
                                    datas.forEach(row=>{
                                let index=this.tableData.indexOfFun(row,function (old,row) {
                                    return old.id===row.id;
                                });
                                this.tableData.splice(index,1);
                                this.total-=1;
                                })
                            } else if(datas instanceof Object){
                            let i = this.tableData.indexOfFun(datas,function (old,datas) {
                                return old.id===datas.id;
                                });
                            this.tableData.splice(i,1);
                            this.total-=1;
                            }
                            return Promise.resolve();
                            }
                            else{
                                let error=el.offline.match(/Error:[\w|' '|,|.]{1,}/)[0]
                                el.offline=error.replace('Error:','')
                            }
                        })
                        this.loading2=false;
                    }).catch(code=>{
                        this.openResult=false;
                        this.$message({message:code.message||code,type:'error'});
                        console.log(code)
                    })
                }).catch(() => {
                    this.openResult=true;
                    this.$message({
                        type: 'info',
                        message: '已取消下架'
                    });
                });
            },
            rsync(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({type:"warning",message:"请选择同步的商品"});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.$confirm(`您将要对已选Listing执行同步, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_rsync_ebay_product,{product_ids:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消同步'
                    });
                });
            },
            change_price(){
                let list = this.tableData.filter(row=>row.isCheck);
                if(list.length===0){
                    return this.$message({type: 'warning', message: '请勾选需要更改的数据'});
                };
                let data = list.map(row=>{
                    let variantsData = [];
                    if(row.variation === 1){
                        variantsData = row.variant.map(res=>{
                            return {
                                cost_price:res.cost_price,
                                adjusted_cost_price:res.adjusted_cost_price,
                                channel_map_code:res.channel_map_code
                            }
                        });
                    }else {
                        variantsData = {
                            cost_price:row.cost_price,
                            adjusted_cost_price:row.adjusted_cost_price,
                        }
                    };
                    return {
                        id:row.id,
                        variation:row.variation,
                        prices:variantsData,
                    };
                });
                this.$confirm(`将去除勾选的价格变动提醒, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_ebay_adjust_price,{data: data}).then(res=>{
                        this.$message({type:"success", message:res.message||res});
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消'});
                });
            },
            rsync_update(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({type:"warning",message:"请选择上传的商品"});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.$confirm(`您将要对已选Listing执行上传, 确认此操作吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_rsync_edit_ebay_product,{product_ids:ids}).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消上传'
                    });
                });
            },
            juge_same(){
                let arr=[],flag=true;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        arr.push(row)
                    }
                });
                let temp=arr[0];
                arr.forEach(row=>{
                    if(row.account_id!==temp.account_id || row.site!==temp.site){
                        flag=false;
                    }
                });
                return flag;
            },
            way_same(val){
                let arr=[],flag=true;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        arr.push(row)
                    }
                });
                arr.forEach(row=>{
                    if(row.listing_type!==val){
                        flag = false;
                    }
                });
                return  flag;
            },
            process(option){
                if (option.status === 0) {
                    return;
                }
                let data = this.tableData.filter(row => row.isCheck);
                if (data.length === 0) {
                    this.$message({message:"请选择要批量修改的数据", type:'warning'});
                    return;
                }
                if(option.action && option.action instanceof  Function){
                    option.action.call(this,data);
                }
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectIds = this.tableData.filter(row=>row.isCheck);
            },
            handleSizeChange(size){
                this.size=size;
                this.init();
            },
            handleCurrentChange(page){
                this.page=page;
                this.init();
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                });
                return name;
            },
            filterSite(val){ // 过滤站点
                let name = "";
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label
                    }
                });
                return name;
            },
        },
        computed:{
            ...mapGetters({accounts:'api/getPublishAccount'}),
            sameSite(){
                let list = this.tableData.filter(row=>row.isCheck);
                let find = list.find(row=>row.site!==list[0].site);
                return !!find
            },
            btnslist(){
                return this.btnList.filter(row=>{
                    if(row.api){
                        return this.$hasPermission(row.api);
                    }else {
                        return true;
                    }
                });
            },
            optionList(){
                return this.options.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
            operatesList(){
                return  operateList.filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
            buttonTitle(){
                return this.isOpen?'一键关闭列表':'一键展开列表'
            },
        },
        watch:{
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
            },
            filterStatus(val){ // 过滤状态
//                0提交1待刊登2刊登中3在线4失败5待更新6更新失败7待下架8下架中9已下架11已结束，12伪删除，13重上,21等待图片上传
                switch (val){
                    case 0:
                        return `提交`;
                        break;
                    case 1:
                        return `待刊登`;
                        break;
                    case 2:
                        return `刊登中`;
                        break;
                    case 3:
                        return `在线`;
                        break;
                    case 4:
                        return `失败`;
                        break;
                    case 5:
                        return `待更新`;
                        break;
                    case 6:
                        return `更新失败`;
                        break;
                    case 7:
                        return `待下架`;
                        break;
                    case 8:
                        return `下架中`;
                        break;
                    case 9:
                        return `已下架`;
                        break;
                    case 11:
                        return `已结束`;
                        break;
                    case 12:
                        return `伪删除`;
                        break;
                    case 13:
                        return `重上`;
                        break;
                    case 21:
                        return `等待图片上传`;
                        break;
                    default:
                        return "--";
                        break;
                }
            },
            filterSalesStatus(val){
                //产品本地状态 0-未出售 1-出售 2-停售 3-试卖 4-作废
                switch (val){
                    case 0:
                        return `未出售`;
                        break;
                    case 1:
                        return `出售`;
                        break;
                    case 2:
                        return `停售`;
                        break;
                    case 3:
                        return `试卖`;
                        break;
                    case 4:
                        return `作废`;
                        break;
                    default:
                        break;
                }
            },
        },
        props:{
            siteList:{
                required:true,
                type:Array,
            }
        },
        components: {
            search,
            uiTable:require("../../../../../components/ui-table.vue").default,
            uiTip:require("../../../../../components/ui-tip.vue").default,
            trendsSelect:require('../../../../../components/trends-select.vue').default,
            autoAdd:require("./auto-add.vue").default,
            restartRule:require('./restart-rule.vue').default,
            actionPromotion:require('./action-promotion.vue').default,
            actionAuction:require("./action-auction.vue").default,
            actionPriceQuantity:require("./action-price-quantity.vue").default,
            modifyTitleEbay:require("./../../../list-operate/modify-title-ebay.vue").default,
            actionStore:require("./action-store.vue").default,
            actionCommonModule:require("./action-common-module.vue").default,
            actionPublishedStyle:require("./action-published-style.vue").default,
            actionSalesInstructions:require("./action-sales-instructions.vue").default,
            actionImages:require("../model-management/action-images.vue").default,
            bindSpu:require("../../../bind-spu.vue").default,
            addGoods:require('../../../wish/info/add-goods.vue').default,
            actionLog:require("../../../wish/list/action-log.vue").default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
            batchMdfTime:require('./batch-mdf-time.vue').default,
        }
    }
</script>
