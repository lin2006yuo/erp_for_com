<template>
    <div class="c-has-yet">
        <search :search-data="searchData"
                :price="price"
                @secondClear="secondClear"
                :clears="clears"
                :site-list="siteList"
                @search="search"></search>
        <div class="mt-xs mb-xs ml-sm">
            <el-button class="inline" size="mini" type="primary"
                       v-for="(item,index) in btnslist"
                       :key="index"
                       @click.native='clicked(item.status)'>{{item.name}}</el-button>
            <el-button type="primary"
                       size="mini"
                       class="ml-xs inline"
                       :loading="btnloading"
                       @click.native="batch_open_close">{{buttonTitle}}</el-button>
            <el-select v-model="option" :placeholder="$t('ebay-list.moreEdit')" clearable class="inline ml-sm">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                           @click.native="process(item)"></el-option>
            </el-select>
        </div>
        <ui-table
            ref="table"
            v-loading="loading" :element-loading-text="$t('ebay-list.playLoad')"
            :has-data="tableData.length>0"
            v-model="checkAll"
            :body-height="41"
            @check="head_check"
            @sort-click="sort_click"
            :heads="[
                    {isCheck:true,width:2},
                    {label:$t('ebay-list.image'),size:75},
                    {label:`Id/${$t('ebay-list.localspu')}`,width:8,isSort:true,order_type:'order_spu'},
                    {label:$t('ebay-list.nameRemarks'),width:6},
                    {label:$t('ebay-list.upTitle'),width:9},
                    {label:$t('ebay-list.account'),width:5},
                    {label:$t('ebay-list.site'),width:5},
                    {label:$t('ebay-list.saleType'),width:6},
                    {label:$t('ebay-list.price'),width:7,isSort:true,order_type:'order_price'},
                    {label:$t('ebay-list.UploadDays'),width:5},
                    {label:$t('ebay-list.regularRules'),width:6},
                    {label:$t('ebay-list.t'),width:11},
                    {label:$t('ebay-list.kands'),width:6},
                    {label:$t('ebay-list.ListingCategory'),width:5},
                    {label:$t('ebay-list.quantity'),width:5},
                    {label:$t('ebay-list.LogisticsProperties'),size:100},
                    {label:$t('ebay-list.pt'),width:8},
                    {label:$t('ebay-list.operat'),width:6}
                   ]">
            <tbody>
            <template v-for="(data, index) in tableData">
                <tr :class="[data.show ? 'active' : '',data.heighLight?'active-color':'',]"
                    @click="addClass(index)" :key="data.id">
                    <td><el-checkbox v-model="data.isCheck" @change="check_row"></el-checkbox></td>
                    <td>
                        <el-popover placement="right" trigger="hover">
                            <img v-lazy="sku_image(data,200)"
                                 @click="search_img(data.img)"
                                 width="200px" height="200px">
                            <span slot="reference">
                                  <img v-lazy="sku_image(data,60)"
                                       @click="search_img(data.img)"
                                       height="60px" width="60px" style="border:none">
                            </span>
                        </el-popover>
                    </td>
                    <!--SKU属性-->
                    <!--<td>{{data.variation | filterAttedf}}</td>-->
                    <td class="relative">
                        <ui-tip :content="data.id" class="ml-xl"></ui-tip>
                        <br>
                        <i @click="show_detail(data)" v-if="data.variation" :class="[data.show? 'minus':'plus','fl']"></i>
                        <i class="plus" style="background: none" v-else></i>
                        <span @click="bind_spu(data)" class="operate" v-if="data.goods_id===0">
                            <i class="el-icon-information"
                               title="点击关联"
                               style="position: absolute;top:50%;margin-top:-6px;left: 34px"></i>
                            <ui-tip :content="data.spu||$t('ebay-list.interrelated')" ></ui-tip>
                        </span>
                        <ui-tip :content="data.spu"></ui-tip>
                    </td>
                    <td><ui-tip :content="data.draft_name" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.title" :width="88"></ui-tip></td>
                    <td><ui-tip :content="data.account_code" :width="80"></ui-tip></td>
                    <td>{{filterSite(data.site)}}</td>
                    <td>{{way(data.listing_type)}}</td>
                    <td v-if="data.variation">{{data.symbol}} {{data.rval_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type===1">{{data.symbol}} {{data.start_price}}</td>
                    <td v-if="(!data.variation)&&data.listing_type!==1">{{data.symbol}} {{data.start_price}}/{{data.reserve_price}}/{{data.buy_it_nowprice}}</td>
                    <td>{{data.listing_duration | filterDay}}</td>
                    <td>{{data.timing_rule_name}}</td>
                    <td>
                        {{data.timing| filterTime}}<br />
                        {{data.site_timing}}
                    </td>
                    <td v-if="data.listing_status===4||data.listing_status===7||data.listing_status===10||data.listing_status===13">
                        <el-popover placement="left"
                                    :title="$t('ebay-list.FailCauses')"
                                    width="400"
                                    trigger="hover">
                            <div class="word-wrap" v-html="delHtml(data.message)" v-if="putMes(data.message)"></div>
                            <div class="word-wrap" v-else>{{data.message}}</div>
                            <span slot="reference">
                                <el-button type="text">{{data.listing_status_txt}}</el-button>
                            </span>
                        </el-popover>
                    </td>
                    <td v-else>
                        {{data.listing_status_txt}}
                    </td>
                    <td>
                        {{data.listing_cate}}
                    </td>
                    <td>
                        {{data.quantity}}
                    </td>
                    <td>
                        {{data.transport_property_txt}}
                    </td>
                    <td>
                        {{data.create_name}}<br />
                        {{data.create_date}}
                    </td>
                    <td>
                        <permission tag="trendsSelect"
                                    class="inline" @trigger="operate(data,$event)" :selects="operateList()" type="primary"
                                    :route="apis.url_c_listing_by_draft">
                        </permission>
                    </td>
                </tr>
                <template v-if="data.show&&data.varians&&data.varians.length">
                    <tr style="font-weight:bold" class="variant">
                        <td colspan="2" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td>{{$t('ebay-list.image')}}</td>
                        <td colspan="2">{{$t('ebay-list.platsku')}}</td>
                        <td colspan="2">{{$t('ebay-list.localsku')}}</td>
                        <template v-for="tm1 in data.v_varkey">
                            <td>{{tm1}}</td>
                        </template>
                        <td>{{$t('ebay-list.price')}}</td>
                        <td>{{$t('ebay-list.quantity')}}</td>
                        <td>{{$t('ebay-list.localStatus')}}</td>
                        <td v-if="data.v_varkey" :colspan="`${7-(data.v_varkey&&data.v_varkey.length)}`" :rowspan="`${(data.varians&&data.varians.length)+1}`"></td>
                        <td :colspan="7" :rowspan="`${(data.varians&&data.varians.length)+1}`" v-else></td>
                    </tr>
                    <tr v-for="(item,item_i) in data.varians" :key="`${item_i}${item.id}`" class="variant">
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
                        <td colspan="2"><ui-tip :content="item.channel_map_code"></ui-tip></td>
                        <td colspan="2"><ui-tip :content="item.v_sku"></ui-tip></td>
                        <template v-for="(tm2,km2) in data.v_varkey">
                            <td><ui-tip :content="item.variation[tm2]"></ui-tip></td>
                        </template>
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
        <checking-cost v-model="checkingCostShow"
                       :select-ids="selectIds"
                       :site-list="siteList"></checking-cost>
        <timing-pub v-model="timingPubShow" :select-ids="selectIds"></timing-pub>
        <action-auction v-model="actionAuctionShow" :select-ids="selectIds" @change-data="change_auction" :ebay-status="ebayStatus"></action-auction>
        <action-price-quantity v-model="actionPriceQuantityShow" :select-ids="selectIds" @change-data="change_price_quantity" :ebay-status="ebayStatus"></action-price-quantity>
        <modify-title-ebay v-model="modifyTitleShow" :table-data="selectIds"
                           @submit="modify_submit"
                           @change-spu="change_spu"
        ></modify-title-ebay>
        <modify-draftname v-model="modifyDraftNameShow" :table-data="selectIds"
                          @change-data="change_title"
        ></modify-draftname>
        <action-store v-model="actionStoreShow" :select-ids="selectIds"
                      :account-id="accountId" :ebay-status="ebayStatus"></action-store>
        <action-common-module v-model="actionCommonModuleShow"
                              :select-ids="selectIds"
                              :title="actionCommonName"
                              :site-id="siteId"
                              :site-list="siteList"
                              :site-name="siteName"
                              :can-change-site="canChangeSite"
                              :ebay-status="ebayStatus"></action-common-module>
        <batch-mdf-account v-model="batchMdfdialog"
                           :ids="selectIds"
                           :is-copy="templateCopy"
                           :title="accountTitle"
                           @submit="submit_account"></batch-mdf-account>
        <batch-mdf-attr v-model="batchMdfAttr"
                        :table-data="mdfAttrData"></batch-mdf-attr>
        <batch-mdf-sales-method v-model="batchMdfSalesMethod"
        :tableData="selectIds"></batch-mdf-sales-method>
        <batch-mdf-listing v-model="batchMdfList"
                           @submit="submit_itemid"></batch-mdf-listing>
        <bind-spu v-model="bindVisable"
                  :is-multiattribute="isMultiattribute"
                  :channel-sku="channelSku"
                  :local-sku="localSku"
                  :is-ebay="true"
                  type="ebay"
                  @valids-ebay="valids_ebay"></bind-spu>
        <add-goods v-model="addlistVisable"
                   @selected="selecteds"></add-goods>
        <action-published-style v-model="actionPublishedStyleShow" :select-ids="selectIds"></action-published-style>
        <action-sales-instructions v-model="actionSalesInstructionsShow" :select-ids="selectIds"></action-sales-instructions>
        <action-images v-model="actionImagesShow" :select-ids="selectIds"
                       :account-id="accountId" status="2" @change-data="change_images"></action-images>
        <blowup-image v-model="imgDialog" :img-path="imgPath" :title="$t('ebay-list.viewLarger')"></blowup-image>
        <batch-mdf-time v-model="mdfTimeDialog"
                        :title="mdfTimeTitle"
                        :paramData="selectIds"
                        :type="curType"></batch-mdf-time>
        <import-file v-model="importDialog"
                     :submit-url="submitUrl"
                     :is-multiple="false"
                     :is-ebay="isEbay"
                     @download-file="download_file"
                     @files-data="change_table">
        </import-file>
        <add-rule v-model="addRuleDialog" :formData="addRuleData" :isModel="true"
                  @add-rule="add_rule" :title="addRuleTitle" ref="addRule"></add-rule>
    </div>
</template>
<style lang="stylus">
    .ml-xl{
        margin-left:30px
    }
    .word-wrap{
        word-wrap break-word;
    }
    .has-inline{
        display :inline-block !important;
    }
</style>
<script>
    import {
    	api_queque_listing,api_ebay_cancel_queue,api_listing_management,api_c_listing_by_draft,api_up_draftitle,api_share_draft,
        api_get_relatedProduc,api_update_listing,api_c_draft_byDraft,api_get_drfspecifics,api_ebay_variations,api_pre_up_draftname,api_export_draft_info,api_import_draft_info,api_save_timing_rule,api_draft_title_random,url_draft_title_random,batch_change_site,url_share_draft,url_get_by_itemid,url_draf_listingtype,url_up_accounts,url_up_draftitle,url_c_listing_by_draft,
        url_up_draft_cate,url_check_draft_fee,url_up_specifics,url_up_listing_duration,url_c_draft_byDraft,
        url_bulk_heavy_listing,url_save_listing,url_update_listing,url_pre_up_draftname,url_export_draft_info,url_import_draft_info,url_save_timing_rule,url_ebay_d_chinese_listing_duration
    } from '@/api/ebay-kandeng-public-module';
    import {url_edit_ebay_product_price_quantity,url_edit_ebay_product_auction_price,url_edit_ebay_shop_category,
        url_ebay_common_module,url_update_ebay_product_images} from '../../../../../api/ebay-kandeng-operated'
    import {operateList} from './action';//------操作按钮引入
    import {downloadFile} from '../../../../../lib/http';
    import {mapGetters} from 'vuex';
    import {api_add_goods} from "../../../../../api/supplier-quote"
    import {get_path} from '../add-edit-listing/get-path';
    export default{
        page:{
            devinfo:{
                frontEnd:'何伊莎',
                backEnd:'曾绍辉',
                createTime:'2017-0-30',
                updateTime:'2017-08-23'
            }
        },
        permission: {
            url_up_listing_duration,url_c_listing_by_draft,url_up_draft_cate,url_check_draft_fee,url_bulk_heavy_listing,url_draf_listingtype,
            url_edit_ebay_product_price_quantity,url_edit_ebay_product_auction_price,url_edit_ebay_shop_category,url_ebay_common_module,url_update_ebay_product_images,
            url_update_listing,url_save_listing,url_up_draftitle,url_up_accounts,url_up_specifics,url_get_by_itemid,url_export_draft_info,url_share_draft,url_import_draft_info,url_c_draft_byDraft,
            url_save_timing_rule,batch_change_site,url_ebay_d_chinese_listing_duration,url_draft_title_random
        },
        data(){
            return {
                isEbay:true,
                errorMsg:[],
                canChangeSite:false,
                isOpen:false,
                addRuleTitle:'',
                addRuleDialog:false,
                accountTitle:"",
                templateCopy:true,
                importDialog:false,
                submitUrl:api_import_draft_info,
                accountCode:'',
                ids:[],
                mdfAttrData:[],
                btnloading:false,
                batchMdfdialog:false,
                batchMdfSalesMethod:false,
                batchMdfList:false,
                isMultiattribute:"",
                bindVisable:false,
                addlistVisable:false,
                mdfTimeDialog:false,
                mdfTimeTitle:"",
                curType:"",
                channelSku:[],
                argumentData:[/*关联参数*/],
                localSku:{
                    data:[]
                },
                siteName:"",
                siteId:"",
                sortData:{
                    order_price:"",
                    order_spu:"",
                },
                price:{
                    name:'',
                    num:''
                },
                searchData: {
                    price:'',
                    transport_property:'',
                    listing_duration:'',
                    rule_id:'',
                    pub_start:'',
                    pub_end:'',
                    pub_time:'local',
                    listing_status:[],
                    searchType:'select',
                    searchChooese:"spu",
                    snText:"",
                    ids:"",
                    spu:"",
                    sku:"",
                    title:"",
                    account_id: "",
                    account_code:"",
                    site: "",
                    listing_type:"",
                    model_cate:"",
                    category_id:"",
                    page:1,
                    share:'',
                    variation:'',
                    application:1,
                    location:'',
                },
                clears:{
                    searchChooese:"spu",
                    name:"create",
                    searchType:'select',
                    application:1,
                },
                btnList:[//----------------------------------------------操作按钮
                    {name:this.$t('ebay-list.arrayUpload'),clickName:'',status:21,api:url_update_listing},
                    {name:this.$t('ebay-list.batchDel'),clickName:'',status:4,api:url_up_draft_cate},
                    {name:this.$t('ebay-list.EditAccountandSite'),clickName:'',status:6,api:url_up_accounts},
                    {name:this.$t('ebay-list.salesMethods'),clickName:'',status:7,api:url_draf_listingtype},
                    {name:this.$t('ebay-list.AddTimingRules'),clickName:'',status:18,api:url_save_timing_rule},
                    {name:this.$t('ebay-list.BatchTitleEdit'),clickName:'',status:20,api:url_save_timing_rule},
                    {name:this.$t('ebay-list.derive'),clickName:'',status:13,api:url_export_draft_info},
                    {name:this.$t('ebay-list.Import'),clickName:'',status:14,api:url_import_draft_info},
                    {name:this.$t('ebay-list.schedulingListings'),clickName:'',status:22,api:url_import_draft_info},
                ],
                option:"",
                options: [ //----------------------更多操作按钮
                    {//修改一口价及可售量
                        value: '1',
                        label: this.$t('ebay-list.mdfSales'),
                        status:1,
                        api:url_edit_ebay_product_price_quantity,
                        action(data){
                            if(!this.way_same(1)){
                                this.$message({
                                    type:"warning",
                                    message: this.$t('ebay-list.selectBuyItNow')
                                });
                                return;
                            }
                            this.selectIds = window.clone(data);
                            this.actionPriceQuantityShow = true;
                        }
                    },
                    {//修改拍卖价
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
                        api:url_up_draftitle,
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
                            this.accountId = data[0].account_id;
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
                            if(this.sameSite) return this.$message({type:"warning",message:this.$t('ebay-list.selectSameList')});
                            this.siteId = data[0].site;
                            this.siteName = this.filterSite(data[0].site);
                            this.selectIds = window.clone(data);
                            this.actionCommonModuleShow = true;
                            this.canChangeSite = false;
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
                    {//修改平台分类属性
                        value: '10',
                        label: this.$t('ebay-list.mdfPlatformAttr'),
                        status:10,
                        api:url_up_specifics,
                        action(data){
                            let ids = data.map(row=>row.id).join(',');
                            this.mdfAttrData = data.map(row=>{
                                return{
                                    img:row.img,
                                    spu:row.spu,
                                    id:row.id
                                }
                            });
                            this.batch_mdf_attr(ids);
                        }
                    },
                    {
                        value: '11',
                        label: this.$t('ebay-list.BatchDays'),
                        status:11,
                        api:url_up_listing_duration,
                        action(data){
                            this.selectIds = clone(data);
                            this.mdfTimeDialog = true;
                            this.mdfTimeTitle = this.$t('ebay-list.BatchDays');
                            this.curType = "";
                        }
                    },
                    {
                        value: '6',
                        label: this.$t('ebay-list.mdfDraftName'),
                        status:6,
                        api:url_pre_up_draftname,
                        action(data){
                            this.get_draftname({ids:data.map( x=> {return x.id}).join(',')}).then(res=>{
                                this.selectIds = res.data;
                                this.selectIds.reverse();
                                this.modifyDraftNameShow = true;
                            }).catch(code=>{
                                console.log(code);
                            });
                        }
                    },
                ],
                flag:0,
                accountId:"",
                checkingCostShow:false,
                timingPubShow:false,
                actionAuctionShow:false,
                actionPriceQuantityShow:false,
                modifyTitleShow:false,
                modifyDraftNameShow:false,
                actionStoreShow:false,
                actionCommonModuleShow:false,
                actionCommonName:'',
                actionPublishedStyleShow:false,
                actionSalesInstructionsShow:false,
                actionImagesShow:false,
                batchMdfAttr:false,
                loading:true,
                tableData:[],
                checkAll:false,
                goodsIdSpu:{
                    goods_id:"",
                    spu:"",
                },
                page:1,
                size:50,
                total:0,
                idList:[],
                selectIds:[],
                accountList:[],
                type:"title",
                ebayStatus:"model",
                imgDialog: false,
                imgPath:"",
                addRuleData:{
                    timing_rule_name:"",
                    timing_fre:"",
                    start_date:"",
                    end_date:"",
                    count:"",
                    start_interval:"",
                    count_interval:"",
                    total_count:"",
                    name:"",
                    validity:"",
                    start_count:"",
                    count_val:"",
                    start_validity:"",
                    end_validity:"",
                    remark:"",
                    detail:"",
                    draft_ids:""
                },
            }
        },
        created(){
            this.init();
        },
        methods:{
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
                this.searchData.listing_status=[];
                this.price.name='';
                this.price.num='';
            },
            cancel_listing(){
                let arr = this.tableData.filter(row=>row.isCheck);
                if(arr.some(res=> res.listing_status!==1)) return this.$message({type:"warning",message:this.$t('ebay-list.queue')})
                let ids = arr.map(row=>row.id).join(',');
                let data = {
                    ids:ids,
                    // action:"imPublish"
                };
                this.$confirm(this.$t('ebay-list.Ifcancelkandeng'), this.$t('ebay-list.tips'), {
                    confirmButtonText:  this.$t('ebay-list.yes'),
                    cancelButtonText:  this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_ebay_cancel_queue,data).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.cancelTip')
                    });
                });
            },
            must_listing(){//队列刊登
                let arr = this.tableData.filter(row=>row.isCheck);
                let ids = arr.map(row=>row.id);
                let data = {
                    ids:ids,
                    // action:"imPublish"
                };
                this.$confirm(this.$t('ebay-list.Ifarrayupload'), this.$t('ebay-list.tips'),  {
                    confirmButtonText:  this.$t('ebay-list.yes'),
                    cancelButtonText:  this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_queque_listing,data).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        });
                        this.init();
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.cancelTip')
                    });
                });
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
            download_file(){//导入范本--》下载模板
                this.down_ebay_draft_import();
                this.down_ebay_draft_fast_import();
            },
            down_ebay_draft_import (){
                let url = config.apiHost+'downfile';
                let code={
                    code:'ebay_draft_import'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'标准导入创建模板范本',
                    suffix:'.xls',
                })
            },
            down_ebay_draft_fast_import (){
                let url = config.apiHost+'downfile';
                let code={
                    code:'ebay_draft_fast_import'
                };
                downloadFile({
                    url:url,
                    get:code,
                    fileName:'快速导入创建模板范本',
                    suffix:'.xls',
                })
            },
            sort_click(val){
                this.sortData.order_price = "";
                this.sortData.order_spu = "";
                this.sortData[val.order_type] = val.order;
                let curData = JSON.stringify(clone(this.searchData));
                sessionStorage.setItem('ebaySearchData',curData);
                this.init();
            },
            sku_image(item,size){
                if(item.img){
                    if(item.img.includes('http')){
                        return this.get_path(item.img,`.`,item.base_url)|| '';
                    }
                    return this.get_path(item.img,`_${size}x${size}.`,item.base_url);
                }
                return '';
            },
            batch_open_close(){ //一键展开
                this.isOpen=!this.isOpen;
                this.tableData.forEach(row=>{
                    row.show = this.isOpen;
                });
                if(this.isOpen===true) this.operate_data_id(this.tableData,"ids");

            },
            search_sku_img(images){
                this.imgPath = this.sku_image(images,500);
                this.imgDialog = true;
            },
            bind_spu(data){
                this.submit_itemid(data);//功能一样，所以合用
            },
            submit_itemid(data){
                this.channelSku = [];
                this.argumentData = [];
                let vars = [{id:"",sku_id:"",combine_sku:"",map_sku:[]}];
                let obj = {
                    id:data.id,
                    listing_type:data.listing_type,
                    goods_id:"",
                    account_id:data.account_id,
                    listing_sku:data.listing_sku,
                    spu:"",
                };
                this.argumentData.push(obj);

                /*-------------------------------我是分割线-------------------------*/
                this.addlistVisable=true;
                if(data.varians&&data.varians.length>0){
                    this.isMultiattribute = true;
                    // console.log(data.varians,'data.varians');
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
                        listing_sku:data.listing_sku,
                        local:[
                            {quantity:1,local_sku_id:'',local_sku:"",sku_id:"",goods_id:"",}
                        ]
                    };
                    this.channelSku.push(obj);
                }
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
            valids_ebay(channelSku,localSku){
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
                    let params={id:curObj.id,goods_id:curObj.goods_id,isAdd:false,isCopy:false,isTemplate:true,isCopyListing:false,curPage:'model'};
                    this.$open('/add-listing',params);
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            submit_account(data,isCopy){
                //当前调用batch-mdf-account组件是否为了复制范本；
                if(isCopy){//是
                    if(!!data.data.listings){
                        data.data.listings.forEach(item=>{this.tableData.unshift(item)});
                        this.$message({type:"success",message:data.message||data});
                    }else {
                        if(data.data.length>0){
                            data.data.forEach(item=>{this.add_data(item.data)});
                            this.$message({type:"success",message:`${data.message}${data.count}条数据`});
                        }else {
                            this.$message({type:"success",message:`${data.message}`});
                        }
                    }
                    // if(data.result) data.data.forEach(item=>{this.add_data(item.data)});

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
            change_spu(val){
                val.forEach(row=>{
                    let find = this.tableData.find(it=>{return it.id===row.id});
                    if(find){
                        find.spu = row.spu;
                        find.goods_id = row.goods_id;
                    }
                })
            },
            batch_mdf_attr(ids){
                this.$http(api_get_drfspecifics,{ids:ids}).then(res=>{
                    if(res.data.length<=0) return this.$message({type:'warning',message:this.$t('ebay-list.nData')});
                    this.batchMdfAttr = true;
                    this.mdfAttrData.forEach(row=>{
                        let find = res.data.find(item=>parseInt(item.id)===parseInt(row.id));
                        if(!!find){
                            find.specifics.forEach(it=>{
                                let findChild = find.ebay_specifics.find(res=>res.category_specific_name===it.attr_name);
                                if(!!findChild&&it.custom === 0) {
                                    this.$set(findChild, 'attr_value', '');
                                    this.$set(findChild, 'add_new', '');
                                    let nameMutilAttr = [];
                                    let cur;
                                    if (it.attr_value instanceof Array){
                                        nameMutilAttr=findChild.detail.map(v=>{return v.category_specific_value});
                                        it.attr_value.forEach(val=>{
                                           if(!nameMutilAttr.includes(val)){
                                               let obj = {
                                                   category_specific_value:val,
                                                   parent_name:'',
                                                   parent_value:'',
                                               };
                                               findChild.detail.push(obj)
                                           }
                                        });
                                        cur = it.attr_value;
                                    } else {
                                        cur = findChild.max_values > 1 ? [] : it.attr_value||'';
                                    }
                                    findChild.attr_value = cur;
                                }
                                if (it.custom === 1) {
                                    let obj = {
                                        category_specific_name: it.attr_name,
                                        attr_value: it.attr_value,
                                        custom: it.custom
                                    };
                                    find.ebay_specifics.push(obj);
                                }
                            });
                            this.$set(row,'ebay_specifics',find.ebay_specifics);
                        }
                    });
                }).catch(code=>{
                    console.log(code);
                })
            },
            modify_submit(val){
                this.$http(api_up_draftitle,{data:val}).then(res=>{
                    this.init();
                    val.forEach(item=>{
                        this.tableData.forEach(row=>{
                            if(item.id===row.id){
                                row.title = item.title;
                            }
                        });
                    });
                    this.$message({type:"success",message:res.message});
                    this.modifyTitleShow = false;
                }).catch(code=>{
                    this.$message({type:"error",message:code.message});
                }).finally(()=>{
                    this.$reqKey('mdfTitleEbay',false);
                })
            },
            c_draft_byDraft(){
                if(this.selectIds.length<=0)return this.$message({type:"warning",message:this.$t('ebay-list.oneData')});
                let params = {
                    ids:this.ids.join(','),
                };
                this.$http(api_c_draft_byDraft,params).then(res=>{
                    if(res.result) {
                        // 请求回来的数据缺少对应的数据状态,直接进行了页面数据的刷新。
                        // this.init()
                        this.selectIds.forEach(item => {
                            item.isCheck = false
                        });
                        res.data.rows.forEach(item => {
                            this.tableData.unshift(item)
                        });
                        this.ids = []
                    }
                    this.$message({type:"success",message:`${res.message}${res.count}条数据`});
                }).catch(code=>{
                    this.$message({type:"error",message:`${code.message}${code.count}条数据`});
                }).finally(()=>{
                    this.$reqKey('c_draft_byDraft',false)
                });
            },
            add_data(val){
                let newAdd = {};
                let cur = this.tableData.find(row=>row.id===val.draft_id);
                if(!!cur){
                    cur.isCheck = false;
                    Object.assign(newAdd,cur);
                    newAdd.isCheck = true;
                    newAdd.id = val.id;
                    newAdd.draft_id = val.draft_id;
                    newAdd.draft_name = val.draft_name;
                    this.tableData.unshift(newAdd);
                }
            },
//            change_draft(val){
//                val.forEach(out=>{
//                    let find = this.tableData.find( row =>{
//                        return row.id === out.id;
//                    });
//                    Object.assign(find, out);
//                })
//            },
            change_category(val){
                let arr = val.ids.split(',');
                if(arr.length){
                    arr.forEach(out=>{
                        let find = this.tableData.find(row=>{
                            return parseInt(row.id) === parseInt(out);
                        });
                        if(find) find.model_cate = val.name;
                    })
                }else{
                    let find = this.tableData.find(row=>{
                        return parseInt(row.id) === parseInt(val.ids);
                    });
                    if(find)find.model_cate = val.name;
                }

            },
            change_auction(val){
                val.forEach(out=>{
                    let find = this.tableData.find( row =>{
                        return row.id === out.id;
                    });
                    find.start_price = out.buy_it_nowprice;
                    find.buy_it_nowprice = out.start_price;
                    find.listing_status = [5];
                    Object.assign(find, out);
                })
            },
            change_price_quantity(val){
                Array.max = function( array ){
                    return Math.max.apply( Math, array );
                };
                Array.min = function( array ){
                    return Math.min.apply( Math, array );
                };
                val.forEach(row=>{
                    let find = this.tableData.find(item=>{
                        return item.id===row.id;
                    });
                    if(find.varians.length){
                        let varian=find.varians.find(vari=>{
                            return vari.v_sku===row.listing_sku;
                        });
                        varian.v_price = row.start_price;
                        varian.v_qty = row.quantity;
                        Object.assign(varian,row);
                        let arr=[];
                        find.varians.forEach(x=>{
                            arr.push(x.start_price);
                        });
                        this.max = Array.max(arr);
                        this.min = Array.min(arr);
                        if(arr.length>1){
                            if(this.max === this.min){
                                find.rval_price = row.start_price;
                            }else{
                                find.rval_price = `${this.min}~${this.max}`;
                            }
                            find.quantity = row.quantity * find.varians.length;
                        }
                    }else {
                        Object.assign(find,row);
                    }
                    find.listing_status = [5];
                })
            },
            change_title(val){
                val.forEach(out =>{
                    let find = this.tableData.find(row=>{
                        return out.id===row.id;
                    });
                    Object.assign(find, out);
                })
            },
            change_images(val){
                val.forEach(out_row =>{
                    let find = this.tableData.find(row=>{
                        return parseInt(out_row.listing_id)===parseInt(row.id);
                    });
                    if(!!find){
                        if(out_row.imgs.lenth!=0){
                            find.img = out_row.imgs[0];
                        }
                        find.listing_status = [5]
                    }
                })
            },
            split_search(data){
                let curString = data.replace(new RegExp(' ','gm'),'\n');
                let cur = curString.split('\n').filter(row=>!!row);
                return cur
            },
            init(){
                this.tableData = [];
                this.loading=true;
                let data = window.clone(this.searchData);
                if(this.searchData.searchChooese!=='title'){
                    let splitText = this.split_search(data.snText);
                    data.snText = splitText&&splitText.length?splitText.map(row=>row.trim()):'';
                }
                if(data.account_code){
                    let splitCode = this.split_search(data.account_code);
                    data.account_code = splitCode&&splitCode.length?splitCode.map(row=>row.trim()):'';
                }
                data.price = this.price.name+','+this.price.num;
                data.ids = this.searchData.searchChooese==="ids" ? data.snText : '';
                data.spu = this.searchData.searchChooese==="spu" ? data.snText : '';
                data.sku = this.searchData.searchChooese==="sku" ? data.snText : '';
                data.title = this.searchData.searchChooese==="title" ? data.snText : '';
                data.draft_name = this.searchData.searchChooese==="draft_name" ? data.snText : '';
                delete data.searchChooese;
                delete data.snText;
                delete data.searchType;
                data.size = this.size;
                data.page = this.page;
                data.order_price = this.sortData.order_price;
                data.order_spu = this.sortData.order_spu;
                data.pub_start = this.searchData.pub_start?datef("YYYY-MM-dd HH:mm:ss",this.searchData.pub_start/1000):'';
                data.pub_end = this.searchData.pub_end?datef("YYYY-MM-dd HH:mm:ss",this.searchData.pub_end/1000):'';
                if(data.listing_status instanceof Array){
                    data.listing_status=this.searchData.listing_status.join(',');
                }
                this.$http(api_listing_management,data).then(res=> {
                    if(!!res.data.count){
                        res.data.listings.forEach(row => {
                            row.num = "";
                            row.show = false;
                            row.isCheck = false;
                            row.heighLight = false;
                        })
                        this.tableData = res.data.listings;
                        this.total = res.data.count;
                    }else{
                        this.tableData=[]
                    }
                }).catch(code => {
                    this.$message({
                        type:"error",
                        message: code.message || code,
                    });
                }).finally(()=>{
                    this.loading = false;
                });
            },
            check_row(){
                this.checkAll=!this.tableData.find(row=>!row.isCheck);
                this.selectIds = this.tableData.filter(row=>row.isCheck);
                this.ids = [];
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        this.ids.push(row.id);
                    }
                });
            },
            head_check(val){
                this.flag=1;
                if(this.tableData.length>0){
                    this.tableData.forEach(row=>{
                        row.isCheck=val;
                    });
                    this.selectIds = this.tableData.filter(row=>row.isCheck);
                    this.ids = [];
                    this.tableData.forEach(row=>{
                        if(row.isCheck){
                            this.ids.push(row.id);
                        }
                    });
                }

            },
            addClass(index){
                this.tableData.forEach(row=>{
                    row.heighLight=false;
                });
                this.tableData[index].heighLight=true;
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
                this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    // res.data.forEach(it=>{
                    //     let find = data.find(row=> {return Number(row.id)===Number(it.listing_id)});
                    //     if(find){
                    //         it.varians.forEach(va=>{
                    //             !!va.variation&&(va.variation=JSON.parse(va.variation));
                    //         });
                    //         this.$set(find,"varians",it.varians);
                    //         this.$set(find,"v_varkey",it.v_varkey);
                    //     }
                    // });
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
                            this.$set(find,"v_varkey",v_varkey);
                        }
                        data_.push(res.data[key])
                    })
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                });
            },
            get_detail(ids){
                if(ids instanceof Array)ids = ids;
                return this.$http(api_ebay_variations,{ids:ids}).then(res=>{
                    return Promise.resolve(res);
                }).catch(code=>{
                })
            },
            get_draftname(data){
                return this.$http(api_pre_up_draftname,data).then(res=>{
                    return Promise.resolve(res);
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'})
                })
            },
            clicked(status){//------------------------------------操作不同按钮执行的事件
                if(status===8){
                    this.batchMdfList = true;
                }else{
                    let data;
                    if(status!==13&&status!==14){
                        data = this.tableData.filter(row=>row.isCheck);
                        if(data.length===0){
                            this.$message({
                                message: this.$t('ebay-list.regularTip'),
                                type: 'warning'
                            });
                            return;
                        }
                    }
                    switch (status){
                        case 1:         //
                            this.selectIds = window.clone(data);
                            this.checkingCostShow = true;
                            break;
                        case 2:         //自动补货设置
                            this.must_pub(data);
                            break;
                        case 3:         //重上规则设置
                            this.selectIds = window.clone(data);
                            this.timingPubShow=true;
                            break;
                        case 4:         //批量删除
                            this.del_model(data);
                            break;
                        case 5:         //一键展开列表
                            this.batch_open();
                            break;
                        case 9:         //一键关闭列表
                            this.batch_close();
                            break;
                        case 21:         //立即刊登
                            this.must_listing();
                            break;
                        case 22:        //取消定时/队列刊登
                            this.cancel_listing();
                            break;
                        case 6:         //批量修改账号/站点
                            this.selectIds = window.clone(data);
                            this.templateCopy = false;
                            this.actionCommonModuleShow = true;
                            this.canChangeSite = true;
                            this.actionCommonName= this.$t('ebay-list.EditAccountandSite');
                            // this.batchMdfdialog = true;
                            // this.accountTitle = '选择账号';
                            break;
                        case 7:         //批量修改出售方式
                            this.get_detail(data.map(row=>row.id)).then(res=>{
                                let data_  = [];
                                Object.keys(res.data).forEach(key=>{
                                    res.data[key].forEach(val=>{
                                        data_.push(val)
                                    })
                                })
                                this.selectIds = window.clone(data);

                                this.selectIds.forEach(it=>{
                                   let find = data_.find(i=>parseInt(i.listing_id)===it.id);
                                   if(!!find){
                                       // console.log(find,'find')
                                       if(!find.varians||find.varians.length<=0){//单属性varians为空
                                           let arr = [{v_sku:find.local_sku}];
                                           this.$set(find,'varians',arr);
                                       }
                                       this.$set(it,'varians',find.varians);
                                   }else {
                                       let arrs = [{v_sku:it.listing_sku.split('|')[0]}];
                                       this.$set(it,'varians',arrs);
                                   }
                                });
                                this.batchMdfSalesMethod = true;
                            }).catch(code=>{
                                console.log(code);
                            });
                            break;
                        case 13:
                            this.export_draft();
                            break;
                        case 14:
                            this.importDialog = true;
                            break;
                        case 15:
                            this.batchMdfdialog = true;
                            this.accountTitle = this.$t('ebay-list.changeAccount');
                            this.templateCopy = true;
                            break;
                        case 16:
                            this.share_draft(data,1);
                            break;
                        case 17:
                            this.share_draft(data,2);
                            break;
                        case 18:
                            this.open_add_rule();
                            break;
                        case 20:
                            this.draft_title_random(data);
                            break;
                    }
                }
            },
            open_add_rule(){
                this.addRuleTitle=this.$t('ebay-list.AddTimingRules');
                this.addRuleData = {
                    timing_rule_name:"",
                    timing_fre:"",
                    start_date:"",
                    end_date:"",
                    count:"",
                    start_interval:"",
                    count_interval:"",
                    total_count:"",
                    name:"",
                    validity:"",
                    start_count:"",
                    count_val:"",
                    start_validity:"",
                    end_validity:"",
                    remark:"",
                    detail:"",
                    draft_ids:"",
                    realname:""//创建人名称
                };
                this.$refs.addRule.isEdit = false;
                this.addRuleDialog = true;
            },
            draft_title_random(data){
                let ids = data.map(row=>{
                    return {
                        id:row.id,
                        goods_id:row.goods_id
                    }
                });
                this.$http(api_draft_title_random,{data:ids}).then(res => {
                    this.init();
                    this.$message({type:'success',message:res.message||res});
                }).catch(code => {
                    this.$message({type:'',message:res.message||res});
                })
            },
            add_rule(val){
                let ids = this.tableData.filter(row=>row.isCheck).map(row=>row.id).join(',');
                let params = clone(val);
                this.$set(params,'draft_ids',ids);
                this.$http(api_save_timing_rule,params).then(res => {
                    this.$message({type:'success',message:res.message||res});
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            share_draft(data,share){//share=1设为共享范本，share=2取消共享范本
                if(data.find(row=>row.share_type===2))return this.$message({type:'warning',message:this.$t('ebay-list.draft')});
                let ids = data.map(row=>row.id);
                let params = {
                    ids:ids.join(','),
                    share:share
                };
                let share_type = share===1?1:0;
                this.$http(api_share_draft,params).then(res=>{
                    /*item.share_type的值
                    * 0：未共享
                    * 1：已共享
                    * 2:他人共享
                    * */
                    this.$message({type:"success",message:res.message||res});
                    ids.forEach(row=>{
                        let index = this.tableData.findIndex(item=>item.id===row&&share_type!==item.share_type);
                        if(index>-1)this.tableData.splice(index,1);
                    })
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            //导入范本
            change_table(val){
                this.init();
            },
            //导出范本
            export_draft(){
                if(this.ids.length<=0)return this.$message({type:"warning",message:this.$t('ebay-list.oneData')});
                this.ids = this.ids.join(',');
                this.$http(api_export_draft_info,{ids:this.ids,type:0}).then(res=>{
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
            operate(data,options){
                options.action.call(this,data);
            },

            must_pub(data){
                let parm = {
                    ids:data.map(row=>row.id).join(","),
                };
                this.$confirm(this.$t('ebay-list.immkandeng'), this.$t('ebay-list.tips'), {
                    confirmButtonText:  this.$t('ebay-list.yes'),
                    cancelButtonText:  this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_c_listing_by_draft,parm).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        })
                        this.init()
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$t('ebay-list.cancelTip')
                    });
                });
            },
            del_model(arr){
                let parm = {
                    ids:arr.map(row=>row.id),
                }
                this.operate_del(parm,arr)
            },
            operate_del(parm,arr){
                this.$confirm(this.$t('ebay-list.delDraft'), this.$t('ebay-list.tips'), {
                    confirmButtonText: this.$t('ebay-list.yes'),
                    cancelButtonText: this.$t('ebay-list.no'),
                    type: 'warning'
                }).then(() => {
                    this.$http(api_update_listing,parm).then(res=>{
                        this.$message({
                            type:"success",
                            message:res.message||res
                        })
                        // if(arr instanceof Array){
                        //     arr.forEach(row=>{
                        //         let index=this.tableData.indexOfFun(row,function (old,row) {
                        //             return old.id===row.id
                        //         });
                        //         this.tableData.splice(index,1)
                        //         this.total-=1;
                        //     })
                        // } else if(arr instanceof Object){
                        //     let i = this.tableData.indexOfFun(arr,function (old,arr) {
                        //         return old.id===arr.id
                        //     });
                        //     this.tableData.splice(i,1)
                        //     this.total-=1;
                        // }
                        this.init()
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: this.$('ebay-list.cancelDelete')
                    });
                });
            },
            juge_same(){
                let arr=[],flag=true;
                this.tableData.forEach(row=>{
                    if(row.isCheck){
                        arr.push(row)
                    }
                })
                let temp=arr[0]
                arr.forEach(row=>{
                    if(row.account_id!==temp.account_id || row.site!==temp.site){
                        flag=false;
                    }
                });
                return  flag;
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
            batch_open(){ //一键展开
                let arr = this.tableData.filter(row=> {return row.isCheck});
                if(!arr.length){
                    this.$message({
                        message: this.$('ebay-list.pleaseSelectOperationData'),
                        type: 'warning'
                    });
                    return;
                }
                arr.forEach(row=>{
                    row.show = true;
                });
                this.operate_data_id(arr,"ids");
            },
            batch_close(){ //一键关闭
                let arr = this.tableData.filter(row=> {return row.isCheck});
                if(!arr.length){
                    this.$message({
                        message: this.$('ebay-list.pleaseSelectOperationData'),
                        type: 'warning'
                    });
                    return;
                }
                arr.forEach(row=>{
                    row.show = false;
                });
            },
            process(option){
                if (option.status === 0) {
                    return;
                }
                let data = this.tableData.filter(row => row.isCheck);
                if (data.length === 0) {
                    this.$message({message:this.$t('ebay-list.regularTip'), type:'warning'});
                    return;
                }
                if(option.action && option.action instanceof  Function){
                    option.action.call(this,data);
                }
            },
            search(data){
                this.searchData = data;
                this.init();
            },
            handleSizeChange(size){
                this.size=size;
                this.init()
            },
            handleCurrentChange(page){
                this.page=page;
                this.init()
            },
            filterAccount(val){ // 过滤账号
                this.accountList = this.accounts("ebay");
                let name = "";
                this.accountList.forEach(row =>{
                    if(val === row.value){
                        name = row.label
                    }
                });
                return name
            },
            delHtml(data){
                let reg = /(\\n)|(\r)/g;
                let rex = /(\\\/)/g;
                data = data.replace(reg, '')
                data = data.replace(rex, '/')
                return data
            },
            putMes(data){
                let mes=data;
                return mes.indexOf('message":')>-1;
            },
            filterSite(val){ // 过滤站点
                let name = "";
                this.siteList.forEach(row =>{
                    if(val === row.id){
                        name = row.label;
                    }
                });
                return name
            },
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
            operateList,
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
                        return this.$hasPermission(row.api)
                    }else {
                        return true
                    }
                })
            },
            optionList(){
                return this.options.filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            operatesList(){
                return  this.operateList().filter(row=>{
                    return this.$hasPermission(row.api)
                })
            },
            buttonTitle(){
                return this.isOpen?this.$t('ebay-list.closeList'):this.$t('ebay-list.openList');
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
            filterTime(val){
                return val ? datef('YYYY-MM-dd HH:mm:ss',val) : "-- --" ;
            },
            filterName(val){
                return val ? val : "--" ;
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
            filterAttedf(val){
                switch (val){
                    case 0:
                        return this.$t('ebay-list.SingleAttribute');
                        break;
                    case 1:
                        return this.$t('ebay-list.MultiAttribute');
                        break;
                }
            },
            filterPublished(val){
                switch (val){
                    case 0:
                        return this.$t('ebay-list.pubed');
                        break;
                    case 2:
                        return this.$t('ebay-list.unPub');
                        break;
                }
            }
        },
        props:{
            siteList:{
                required:true,
                type:Array,
            },
        },
        components:{
            search:require('./search.vue').default,
            trendsSelect:require('../../../../../components/trends-select.vue').default,
            uiTable:require("../../../../../components/ui-table.vue").default,
            uiTip:require("../../../../../components/ui-tip.vue").default,
            batchMdfAccount:require('./batch-mdf-account.vue').default,
            checkingCost:require("./checking-cost.vue").default,
            timingPub:require('./timing-pub.vue').default,
            actionAuction:require("../already/action-auction.vue").default,
            actionPriceQuantity:require("../already/action-price-quantity.vue").default,
            modifyTitleEbay:require("../../../list-operate/modify-title-ebay.vue").default,
            actionStore:require("../already/action-store.vue").default,
            actionCommonModule:require("../already/action-common-module.vue").default,
            actionPublishedStyle:require("../already/action-published-style.vue").default,
            actionSalesInstructions:require("../already/action-sales-instructions.vue").default,
            actionImages:require("./action-images.vue").default,
            batchMdfAttr:require('./batch-mdf-attr.vue').default,
            batchMdfSalesMethod:require('./batch-mdf-sales-method.vue').default,
            batchMdfListing:require('./batch-mdf-listing.vue').default,
            bindSpu:require('../../../bind-spu.vue').default,
            addGoods:require('../../../wish/info/add-goods.vue').default,
            blowupImage:require("../../../../../components/blowup-image.vue").default,
            batchMdfTime:require('../already/batch-mdf-time.vue').default,
            modifyDraftname:require("./modify-draftname.vue").default,
            importFile:require('@/components/import-file.vue').default,
            addRule:require('@/view/kandeng/ebay/timing-publish-rules/add-rule.vue').default,
        },
    }
</script>
