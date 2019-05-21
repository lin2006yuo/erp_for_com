<template>
    <el-row class="c-has-yet">
        <el-dialog :title="$t('ebay-list.BatchOff')"
        :visible.sync="openResult">
        <div v-loading="loading2"
        :element-loading-text="$t('ebay-list.playLoad')">
            <table class="opentable"  >
                <tr style="font-weight:600;background-color:#e4e4e4;">
                    <td>ItemID</td>
                    <td>SPU</td>
                    <td>{{$t('ebay-list.account')}}</td>
                    <td>{{$t('ebay-list.Result')}}</td>
                </tr>
                <template v-for='modif in modificationResult'>
                    <tr>
                        <td>{{modif.item_id}}</td>
                        <td style="position: relative">
                            <span @click="bind_spu(modif)" class="operate" v-if="modif.goods_id===0">
                             <i class="el-icon-information"
                                style="position: absolute;top:50%;margin-top:-6px;left:75px"
                                :title="$t('ebay-list.clickLink')"></i>
                            <ui-tip :content="modif.spu||$t('ebay-list.interrelated')" style="padding-left: 12px"></ui-tip>
                        </span>
                        <ui-tip :content="modif.spu" v-else></ui-tip></td>
                        <td><ui-tip :content="modif.account_code" :width="80"></ui-tip></td>
                        <td>
                            <template v-if='/下架成功/.test(modif.offline)'>
                                {{$t('ebay-list.removeSucceed')}}
                            </template>
                            <template v-else>
                                <!-- <el-tooltip class="item" effect="dark" :content="" placement="right">

                                </el-tooltip> -->

                                <el-popover
                                    placement="right"
                                    width="200"
                                    trigger="hover"
                                    :content="modif.offline">
                                     <span style="color:#33b2fc" slot="reference">{{$t('ebay-list.removeFailed')}}</span>
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
                :price="price"
                :site-list="siteList"
                @secondClear="secondClear"
                @enter="search"
                :clears="clears"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       v-for="(item,index) in btnslist" :key="index"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
            <el-button class="inline ml-xxs" size="mini" type="primary"
                        @click.native="batch_open_close">{{buttonTitle}}</el-button>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                        @click.native="change_price">{{$t('ebay-list.mdfPrice')}}</el-button>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="batchCopy">{{$t('ebay-list.bCopy')}}</el-button>
            <el-button type="primary ml-xxs" size="mini" class="inline"
                       @click.native="loadin">{{$t('ebay-list.modifyOnline')}}</el-button>
            <permission tag="ElButton"
                        size="mini"
                        class="inline"
                        @click.native="realWareSet"
                        type="primary ml-xxs"
                        :route="apis.url_ebay_virtual_send">
                {{$t('ebay-list.warehouseSetting')}}
            </permission>
            <trends-select class="inline btn-trends-select-relative ml-mini"
                           :selects="exportBtn"
                           :dropdownWidth="dropdownWidth"
                           ref="trends"
                           type="primary"
                           @trigger="mark_handle">
            </trends-select>
            <el-select v-model="option" :placeholder="$t('ebay-list.moreModify')" clearable class="inline ml-sm">
                <el-option v-for="item in options" :key="item.value"
                           :label="item.label" :value="item.value"
                           @click.native="process(item)"></el-option>
            </el-select>
        </div>
        <ui-table
            ref="table"
            v-loading="loading" :first-loading="firstLoading"
            :element-loading-text="$t('ebay-list.playLoad')"
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                        {isCheck:true,width:2},
                        {label:$t('ebay-list.image'),width:5},
                        {label:'ItemID',width:8},
                        {label:$t('ebay-list.localspu'),width:5},
                        {label:$t('ebay-list.upTitle'),width:8},
                        {label:$t('ebay-list.account'),width:5},
                        {label:$t('ebay-list.site'),width:4},
                        {label:$t('ebay-list.saleType'),width:4},
                        {label:$t('ebay-list.price'),width:5,isSort:true,order_type:'order_price'},
                        {label:$t('ebay-list.UploadPrice'),width:5},
                        {label:$t('ebay-list.UploadDays'),width:5},
                        {label:$t('ebay-list.soldQuan'),width:5,isSort:true,order_type:'order_sold_quantity'},
                        {label:$t('ebay-list.pageviews'),width:4},
                        {label:$t('ebay-list.CollectionNumber'),width:4},
                        {label:$t('ebay-list.UploadTime'),width:8,isSort:true,order_type:'order_publish_date'},
                        {label:$t('ebay-list.eTime'),width:8},
                        {label:$t('ebay-list.editStatus'),width:5},
                        {label:$t('ebay-list.ListingCategory'),width:4},
                        {label:$t('ebay-list.operat'),width:6}
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
                        <i class="plus" style="visibility: hidden" v-else></i>
                        <ui-tip :content="data.item_id"></ui-tip>
                    </td>
                    <td style="position: relative">
                        <span class="copyright" :title="$t('ebay-list.tipRight')" v-if="!!data.tort_flag" @click="get_RightRocord(data)">{{$t('ebay-list.Right')}}</span>
                         <span @click="bind_spu(data)" class="operate" v-if="data.goods_id===0">
                             <i class="el-icon-information"
                                style="position: absolute;top:50%;margin-top:-6px;left: 5px"
                                :title="$t('ebay-list.clickLink')"></i>
                            <ui-tip :content="data.spu||$t('ebay-list.interrelated')" style="padding-left: 12px"></ui-tip>
                        </span>
                        <ui-tip :content="data.spu" v-else></ui-tip>
                    </td>
                    <td>
                        <ui-tip :is-operate="true" :content="data.title" :width="90"
                                 @cur-click="cur_click(data)"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.account_code" :width="80"></ui-tip></td>
                    <td>{{filterSite(data.site)}}</td>
                    <td>{{way(data.listing_type)}}</td>
                    <td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>
                    <td>{{data.symbol}} {{data.insertion_fee}}</td>
                    <td>{{data.listing_duration | filterDay}}</td>
                    <td><ui-tip :content='data.sold_quantity'></ui-tip></td>
                    <td>{{data.hit_count}}</td>
                    <td>{{data.watch_count}}</td>
                    <td>{{data.start_date}}</td>
                    <td>{{data.end_date}}</td>
                    <td>{{data.listing_status_txt}}</td>
                    <td><ui-tip :content='data.listing_cate'></ui-tip></td>
                    <td>
                        <trends-select  class="inline" @trigger="operate(data,$event)" :selects="operatesList" type="primary"></trends-select>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>{{$t('ebay-list.image')}}</td>
                        <td colspan="2">{{$t('ebay-list.platsku')}}</td>
                        <td colspan="3">{{$t('ebay-list.localsku')}}</td>
                        <template v-for="tm1 in data.v_varkey" v-if="data.v_varkey">
                            <td :key="tm1">{{tm1}}</td>
                        </template>
                        <td>{{$t('ebay-list.costprice')}}</td>
                        <td>{{$t('ebay-list.price')}}</td>
                        <td>{{$t('ebay-list.quantity')}}</td>
                        <td>{{$t('ebay-list.localStatus')}}</td>
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
                                <span>{{$t('ebay-list.priceIn')+(Number(item.adjusted_cost_price)-Number(item.cost_price)).toFixed(2)}}</span>
                            </div>
                            <div class="priceclass" v-if="Number(item.adjusted_cost_price)<Number(item.cost_price)">
                                <span>{{$t('ebay-list.priceDe')+(Number(item.item.cost_price)-Number(item.adjusted_cost_price)).toFixed(2)}}</span>
                            </div>
                        </td>
                        <td>{{data.symbol}} {{item.v_price}}</td>
                        <td>{{item.v_qty || 0}}</td>
                        <td>{{filterSalesStatus(item.status)}}</td>
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
        <batch-mdf-account v-model="batchMdfdialog"
                           :ids="selectIds"
                           :is-copy="templateCopy"
                           :title="accountTitle"
                           @submit="submit_account"></batch-mdf-account>
        <batch-real-ware v-model="realWaredialog"
                         :title="realWareTitle"
                         @submit="submit_RealWare"></batch-real-ware>
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
        <action-images  v-model="actionImagesShow"
                        :select-ids="selectIds"
                        :account-id="accountId" status="1"
                        @change-data="change_images"></action-images>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="$t('ebay-list.viewLarger')"></blowup-image>
        <batch-mdf-time v-model="mdfTimeDialog"
                         :title="mdfTimeTitle"
                         :paramData="selectIds"
                         :type="curType"></batch-mdf-time>
        <import-file v-model="fileDisplay"
                     :submit-url="submitapi"
                     :is-multiple="false"
                     :typeList="typeList"
                     @download-file="download_file"
                     @errmeaage="geterrmessage"
        >
        </import-file>
        <batch-mdf-Id v-model="mdfItemIdDialog"
                        :title="mdfItemIdTitle"
                        @mdf="mdfItemId"></batch-mdf-Id>
        <fanseright-dialog v-model="copyrightShow"
                           :look-tip="false"
                           :spu-name="spuName"
                           :tableData="tableList"></fanseright-dialog>
        <el-dialog
            :title="$t('ebay-list.errorMessage')"
            :visible.sync="errorMessage"
            width="700px">
            <el-table :data="errorTableData">
                <el-table-column prop="row" :label="$t('ebay-list.errorLines')"></el-table-column>
                <el-table-column prop="errMsg" :label="$t('ebay-list.errorMessage')"></el-table-column>
            </el-table>
        </el-dialog>
    </el-row>

</template>
<style lang="stylus">
    .c-has-yet{
        .copyright{
              position absolute;
              left 0;
              top:0;
              color red;
              height: 16px;
              cursor: pointer;
              line-height: 16px;
              display: inline-block;
              vertical-align: middle;
              border:1px solid red;
          }
        .inline.ml-xxs{
            margin-left 3px;
        }
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
    import {api_get_goods_description} from '@/api/product-library';
    import {
        api_updata_listing,
        api_ebay_online_export,
        api_ebay_online_export_modify,
        api_online_spu_export,
    	api_listing_management,
        api_get_relatedProduc,
        api_get_action_logs,
        api_up_draftitle,
        api_ebay_variations,
        api_get_ebay_variations,
        api_ebay_virtual_send,
        api_up_title,
        api_export_draft_info,
        url_up_title,
        url_ebay_virtual_send,
        url_up_listing_duration,
        url_save_listing,
        url_export_draft_info,
        url_ebay_online_export,
        url_online_spu_export,
        url_ebay_online_export_modify,
    } from '@/api/ebay-kandeng-public-module';
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
            url_ebay_virtual_send,
            url_export_draft_info,
            url_online_spu_export,
            url_ebay_online_export,
            url_ebay_online_export_modify,
            url_up_title,url_save_listing,url_offline_ebay_product,url_ebay_replenishment,url_ebay_reshelf,url_ebay_promotion,url_rsync_ebay_product,url_rsync_edit_ebay_product,
            url_edit_ebay_product_price_quantity,url_edit_ebay_product_auction_price,url_edit_ebay_shop_category,url_ebay_common_module,url_update_ebay_product_images
        },
        data(){
            return {
                spuName:'',
                copyrightShow:false,
                tableList:[],
                dropdownWidth:'',
                filterHandles:[
                    {name: "在线Listing数据导出",api:url_ebay_online_export, value: 19,action(){this.export_draft(19,'在线Listing数据导出')}},
                    {name: "修改在线数据导出",api:url_ebay_online_export_modify, value: 20,action(){this.export_draft(20,'修改在线数据导出')}},
                    {name: "spu刊登统计导出", api:url_online_spu_export,value: 21,action(){this.export_upload_data(21,'spu刊登统计导出')}},],
                typeList:'csv',
                errorTableData:[],
                errorMessage:false,
                submitapi:api_updata_listing,
                accountTitle:this.$t('ebay-list.changeAccount'),
                templateCopy:false,
                batchMdfdialog:false,
                realWaredialog:false,
                realWareTitle:'',
                loading2:true,
                openResult:false,
                modificationResult:[],
                isOpen:false,
                accountCode:'',
                firstLoading:true,
                mdfTimeDialog:false,
                mdfItemIdDialog:false,
                mdfItemIdTitle:'',
                curType:"",
                mdfTimeTitle:"",
                isMultiattribute:"",
                goodsIdSpu:{
                    goods_id:"",
                    spu:"",
                },
                argumentData:[/*关联参数*/],
                price:{
                    name:'',
                    num:''
                },
                searchData: {
                    ids:"",
                    tort_channel_id:'',
                    price:'',
                    transport_property:'',
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
                    listing_status:'3,5,6,7,8,9,10',
                    application:"",
                    name:"start",
                    start_date: "",
                    end_date:"",
                    adjust_range:'',
                    adjusted_price:'',
                    is_virtual_send:'',
                    variation:''
                },
                clears:{
                    searchType:'select',
                    searchChooese:"itemID",
                    name:"start",
                    listing_status:'3,5,6,7,8,9,10',
                },
                btnList:[//----------------------------------------------操作按钮
                    {name:this.$t('ebay-list.BatchOff'),clickName:'',status:1,api:url_offline_ebay_product},
                    {name:this.$t('ebay-list.autoSupply'),clickName:'',status:2,api:url_ebay_replenishment},
                    {name:this.$t('ebay-list.againSet'),clickName:'',status:3,api:url_ebay_reshelf},
                    {name:this.$t('ebay-list.cxsetting'),clickName:'',status:4,api:url_ebay_promotion},
                    {name:this.$t('ebay-list.syncListing'),clickName:'',status:5,api:url_rsync_ebay_product},
//                    {name:this.buttonTitle,clickName:'',status:7},
//                    {name:'一键关闭列表',clickName:'',status:8},
                    {name:this.$t('ebay-list.smallPlatform'),clickName:'',status:9,},
                ],
                options: [ //----------------------更多操作按钮
                    {
                        value: '1',
                        label: this.$t('ebay-list.mdfSales'),
                        status:1,
                        api:url_edit_ebay_product_price_quantity,
                        action(data){
                            if(!this.way_same(1)){
                                this.$message({
                                    type:"warning",
                                    message: this.$t('ebay-list.mdfSalesTips')
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.actionPriceQuantityShow = true;
                        }
                    },
                    {
                        value: '2',
                        label: this.$t('ebay-list.mdfSalesPrice'),
                        status:2,
                        api:url_edit_ebay_product_auction_price,
                        action(data){
                            if(!this.way_same(2)){
                                this.$message({
                                    type:"warning",
                                    message: this.$t('ebay-list.mdfAuction')
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.actionAuctionShow = true;
                        }
                    },
                    {
                        value: '3',
                        label: this.$t('ebay-list.editTitle'),
                        status:3,
                        api:url_up_title,
                        action(data){
                            this.selectIds = window.clone(data);
                            this.modifyTitleShow = true;
                        }
                    },
                    {
                        value: '4',
                        label: this.$t('ebay-list.mdfCategory'),
                        status:4,
                        api:url_edit_ebay_shop_category,
                        action(data){
                            if(!this.juge_same()){
                                this.$message({type:"warning",message:this.$t('ebay-list.sameStoreModify')});
                                return ;
                            }
                            this.accountId=data[0].account_id;
                            this.selectIds = window.clone(data);
                            this.actionStoreShow = true;
                        }
                    },
                    {
                        value: '5',
                        label: this.$t('ebay-list.publicModel'),
                        status:5,
                        api:url_ebay_common_module,
                        action(data){
                            if(this.sameSite)return this.$message({type:"warning",message:this.$t('ebay-list.selectSameList')});
                            this.selectIds = window.clone(data);
                            this.siteId = data[0].site;
                            this.siteName = this.filterSite(data[0].site);
                            this.actionCommonModuleShow = true;
                        }
                    },
                    {
                        value: '8',
                        label: this.$t('ebay-list.replacePicture'),
                        status:8,
                        api:url_update_ebay_product_images,
                        action(data){
                            this.selectIds = window.clone(data);
                            this.accountId = data[0].account_id;
                            this.actionImagesShow = true;
                        }
                    },
                    {
                        value: '9',
                        label: this.$t('ebay-list.mdfDays'),
                        status:9,
                        api:url_up_listing_duration,
                        action(data){
                            if(!this.way_same(1)){
                                this.$message({
                                    type:"warning",
                                    message: this.$t('ebay-list.selectBuyItNow')
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.mdfTimeDialog = true;
                            this.curType=this.$t('ebay-list.FixedPrice')
                            this.mdfTimeTitle=this.$t('ebay-list.modifyDays');
                        }
                    },
                    {
                        value: '10',
                        label: this.$t('ebay-list.auctionDays'),
                        status:10,
                        api:url_up_listing_duration,
                        action(data){
                            if(!this.way_same(2)){
                                this.$message({
                                    type:"warning",
                                    message: this.$t('ebay-list.mdfAuction')
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.mdfTimeDialog = true;
                            this.curType=this.$t('ebay-list.Auction');
                            this.mdfTimeTitle=this.$t('ebay-list.auctionDays');
                        }
                    },
                    {
                        value: '11',
                        label: this.$t('ebay-list.itemIDSyncListing'),
                        status:11,
                        api:url_up_listing_duration,
                        action(data){
                            this.selectIds = window.clone(data);
                            this.mdfItemIdDialog = true;
                            this.mdfItemIdTitle=this.$t('ebay-list.itemIDSyncListing');
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
                fileDisplay:false,
            }
        },
        created(){
            this.get_with();
            // this.init();
        },
        methods:{
            get_with(){//下拉按钮宽度
                this.$nextTick(function () {
                        this.dropdownWidth=this.$refs.trends.$el.clientWidth + 'px';

                });
            },
            mark_handle(row){
                this.get_with();
                row.action.call(this,row);
            },
            operateList,
            filterSalesStatus(val){
                //产品本地状态 0-未出售 1-出售 2-停售 3-试卖 4-作废
                switch (val){
                    case 0:
                        return this.$t('ebay-list.Unsold');
                        break;
                    case 1:
                        return this.$t('ebay-list.sell');
                        break;
                    case 2:
                        return this.$t('ebay-list.Inactive');
                        break;
                    case 3:
                        return this.$t('ebay-list.TrialSale');
                        break;
                    case 4:
                        return this.$t('ebay-list.zuofei');
                        break;
                    default:
                        break;
                }
            },
            export_upload_data(status,name){//spu刊登统计导出
                let data = this.get_searchData();
                this.loading = false;
                this.$http(api_online_spu_export,data).then(res=>{
                    let url = config.apiHost+'downloadFile/downExportFile';
                    if(!!res.file_code){
                        let params = {
                            file_code:res.file_code,
                        };
                        downloadFile({
                            url:url,
                            get:params,
                            fileName:res.file_name,
                            suffix:'.csv',
                        });
                    }else {
                        this.$message({type:"success",message:res.message||res});
                    }
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                });
            },
            export_draft(status,name){
                this.search(this.searchData);
                this.$nextTick(()=>{
                    let data = this.get_searchData();
                    let api = status===19?api_ebay_online_export:api_ebay_online_export_modify;
                    this.$http(api,data).then(res=>{
                        let url = config.apiHost+'downloadFile/downExportFile';
                        if(!!res.file_code){
                            let params = {
                                file_code:res.file_code,
                            };
                            downloadFile({
                                url:url,
                                get:params,
                                fileName:res.file_name,
                                suffix:'.csv',
                            });
                        }else {
                            this.$message({type:"success",message:res.message||res});
                        }

                    }).catch(code=>{
                        this.$message({type:"error",message:code.message||code});
                    });
                });

            },
            way(value){
                switch(value){
                    case 1:
                        return this.$t('ebay-list.FixedPrice');
                        break;
                    case 2:
                        return this.$t('ebay-list.Auction');
                        break;
                    default:
                        break;
                }
            },
            secondClear(){
                this.price.name='';
                this.price.num='';
            },
            geterrmessage(err){
              this.errorMessage=true;
              this.errorTableData=err;
            },
            loadin(){
                this.fileDisplay=true;
            },
            download_file(){
                let url=config.apiHost+'downfile';
                let code={
                    code:"ebay_import_update_online_listing"
                }
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'标准导入创建模板范本',
                    suffix:'.csv'
                })
            },
            // code=ebay_import_update_online_listing
            loadin(){
                this.fileDisplay=true;
            },
            mdfItemId(data){
                if(!!data.message){
                    return;
                }else {
                    let auto = this.tableData.some(res=>{
                        return res.id===data.data.id
                    });
                    if(!auto){
                        this.tableData.unshift(data.data);
                        this.total+=1;
                    }
                }


            },
            submit_account(data,isCopy){
                if(isCopy){//是
                    if(data.result) data.data.rows.forEach(item=>{this.add_data(item)});
                    let data = this.tableData.filter(row=>{return row.isCheck})
                    this.$message({type:"success",message:`成功操作${data.length}条数据`});
                }else{//否
                    data.ids = data.ids.split(',');
                    data.ids.forEach(row=>{
                        let find = this.tableData.find(res=>res.id === row);
                        if(!!find){
                            find.account_id =  data.account_id;
                        }
                    });
                }
            },
            add_data(val){
                this.tableData.unshift(val);
            },
            realWareSet(){//虚拟仓发货设置
                let data = this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({
                        message: this.$t('ebay-list.selectonelisting'),
                        type: 'warning'
                    });
                    return;
                }else {
                    this.realWaredialog=true;
                    this.realWareTitle=this.$t('ebay-list.warehouseSetting')
                }
            },
            submit_RealWare(data){
                this.realWaredialog=false;
                let data_ = {
                    ids:this.selectIds.map(res=> res.id).join(','),
                    is_virtual_send:data
                };
                return this.$http(api_ebay_virtual_send,data_).then(res=>{
                    this.$message({type:"success",message:res.message});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message});
                })

            },
            batchCopy(){//批量复制
                let data = this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({
                        message: this.$t('ebay-list.selectonelisting'),
                        type: 'warning'
                    });
                    return;
                }else {
                    this.batchMdfdialog = true;
                    this.accountTitle = this.$t('ebay-list.changeAccount');
                    this.templateCopy = true;
                }
            },
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
                   return this.$http(api_get_ebay_variations,{ids:ids}).then(res=>{
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
            get_searchData(){
                let curObj = sessionStorage.getItem("ebaySearchData");
                if(!curObj)return;
                let curData = JSON.parse(curObj);
                this.searchData = curData;
                // this.tableData = [];
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
                data.ids = this.searchData.searchChooese==="ids" ? data.snText : "";
                if(data.ids.length<=0){
                    data.ids=''
                }
                data.item_id = this.searchData.searchChooese==="itemID" ? data.snText : "";
                data.spu = this.searchData.searchChooese==="spu" ? data.snText : "";
                data.sku = this.searchData.searchChooese==="sku" ? data.snText : "";
                data.listing_sku = this.searchData.searchChooese==="listing_sku" ? data.snText : "";
                data.title = this.searchData.searchChooese==="title" ? data.snText : "";
                data.page = this.page;
                data.size = this.size;
                data.price = this.price.name+','+this.price.num;
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
                return data;
            },
            init(){
                let data = this.get_searchData();
                this.$http(api_listing_management,data).then(res=> {
                    if(!(res.data instanceof Array)){
                        res.data.listings.forEach(row => {
                            row.num = "";
                            row.show = false;
                            row.isCheck = false;
                            row.heighLight = false;
                        });
                        this.tableData = res.data.listings;
                        this.total = res.data.count;
                    }else {
                        this.tableData = [];
                        this.total = 0;
                    }
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
                    if(data.varians&&data.varians.length>0){//多属性
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
                    }else {//单属性
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
                        return Number(row.id) === Number(out.id);
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
            //获取侵权记录
            get_RightRocord(data){
                this.spuName=data.spu;
                this.$http(api_get_goods_description, data.goods_id, )
                    .then(res => {
                        this.copyrightShow=true;
                        this.tableList=res.list;
                    }).catch(err => {
                    console.log(err + '出错了');
                })
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
                return this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    let data_ = []
                    Object.keys(res.data).forEach(key=>{
                        let find = data.find(row=>{return Number(row.id)===Number(key)});
                        if(find){
                            res.data[key].forEach(va=>{
                                !!va.variation&&(va.variation=JSON.parse(va.variation));
                            })
                            this.$set(find,"varians",res.data[key]);
                            let varkey = res.data[key][0].variation;
                            let v_varkey=[];
                            for(var p in varkey){
                                v_varkey.push(p)

                            }
                    // this.$set(find,"v_varkey",p);
                        }
                        data_.push(res.data[key])
                    })
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
                                message: this.$t('ebay-list.selectBuyItNow')
                            });
                            return;
                        }
                        if(data.length){
                            this.selectIds = window.clone(data);
                            this.autoAddShow = true;
                        } else {
                            this.$message({type:"warning",message:this.$t('ebay-list.pleaseSelect')})
                        }
                        break;
                    case 3:         //重上规则设置
                        if(data.length){
                            this.selectIds = window.clone(data);
                            this.restartRuleShow=true;
                        } else {
                            this.$message({type:"warning",message:this.$t('ebay-list.pleaseSelect')});
                        }
                        break;
                    case 4:         //促销折扣设置
                        if(data.length){
                            if(!this.juge_same()){
                                this.$message({type:"warning",message:this.$t('ebay-list.selectSameList')});
                                return ;
                            }
                            this.flag=4;
                            this.selectIds = window.clone(data);
                            this.siteId = data[0].site;
                            this.accountId = data[0].account_id;
                            this.actionPromotionShow = true;
                        } else {
                            this.$message({type:"warning",message:this.$t('ebay-list.pleaseSelect')});
                        }
                        break;
                    case 5:         //同步到Listing
                        this.rsync();
                        break;
                    case 6:         //上传修改
                        this.rsync_update();
                        break;
                    case 9:
                        if(data.length<=0)return this.$message({type:'warning',message:this.$t('ebay-list.pleaseSelect')});
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
                    this.$message({type:"warning",message:this.$t('ebay-list.pleaseSelect')});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.oprate_offline(ids,data);
                this.modificationResult=data;
            },
            single_oprate(ids,datas){
                let data_ = [];
                data_.push(datas);
                this.modificationResult=data_;
                this.oprate_offline(ids,datas)
            },
            oprate_offline(ids,datas){
                this.$confirm(this.$t('ebay-list.IfsaleOff'), this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
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
                        //console.log(this.modificationResult,'this.modificationResult')
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
                    this.loading2=true;
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.Cancelled')
                    });
                });
            },
            rsync(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({type:"warning",message:this.$t('ebay-list.tbu')});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.$confirm(this.$t('ebay-list.syncOperation'),this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
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
                        message: this.$t('ebay-list.Cancelled')
                    });
                });
            },
            change_price(){
                let list = this.tableData.filter(row=>row.isCheck);
                if(list.length===0){
                    return this.$message({type: 'warning', message: this.$t('ebay-list.pleaseSelectOperationData')});
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
                this.$confirm( this.$t('ebay-list.tickedPrice'), this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    return this.$http(api_ebay_adjust_price,{data: data}).then(res=>{
                        this.$message({type:"success", message:res.message||res});
                        return Promise.resolve();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({type: 'info', message: this.$t('ebay-list.cancelTip')});
                });
            },
            rsync_update(){
                let data=this.tableData.filter(row=>row.isCheck);
                if(data.length===0){
                    this.$message({type:"warning",message:this.$t('ebay-list.selectProduct')});
                    return ;
                }
                let ids=data.map(row=>row.item_id).join(",");
                this.$confirm(this.$t('ebay-list.Perform'), this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
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
                        message: this.$t('ebay-list.cancelTip')
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
                if (data.length === 0 && option.status!==11&&option.status!==19&&option.status!==20) {
                    this.$message({message:this.$t('ebay-list.pleaseSelect'), type:'warning'});
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
            exportBtn(){
                return this.filterHandles.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
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
                return  this.operateList().filter(row=>{
                    return this.$hasPermission(row.api);
                });
            },
            buttonTitle(){
                return this.isOpen?this.$t('ebay-list.closeList'):this.$t('ebay-list.openList')
            },
        },
        watch:{
            'price.name'(val){
                if(val===''){
                    this.price.num='';
                }
            }
        },
        filters:{
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
                        return this.$t('ebay-list.submit');
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

        },
        props:{
            siteList:{
                required:true,
                type:Array,
            }
        },
        components: {
            search,
            batchMdfAccount:require('../model-management/batch-mdf-account.vue').default,
            batchRealWare:require('../model-management/batch-real-ware.vue').default,
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
            batchMdfId:require('./batch-mdf-itemid.vue').default,
            importFile:require("@/components/import-file.vue").default,
            fanserightDialog:require("../not-yet/fanseright-dialog").default,
        }
    }
</script>
