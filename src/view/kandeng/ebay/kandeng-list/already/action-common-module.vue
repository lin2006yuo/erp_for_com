<template>
    <page-dialog v-model="show" size="large" :title="title" @open='open'
                 class="ebay-published-oprate"  :close-on-click-modal="false">
        <el-row class="account_border" v-if="this.ebayStatus==='model'||this.ebayStatus==='draftList'||this.ebayStatus==='soldOut'">
            <el-col :span="10" class="text-right">
                <label class="inline"><span class="red" v-if="ebayStatus==='draftList'||this.ebayStatus==='soldOut'">* </span>{{$t('ebay-list.pa')}}</label>
            </el-col>
            <el-col :span="14">
                <param-account v-model="account_id"
                               url="get|Publish/Ebay/getAccounts"
                               class="inline width-super" type="ebay"></param-account>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right ">
                <label class="inline">{{$t('ebay-list.site')}}：</label>
            </el-col>
            <el-col :span="14">
                <span class="line-h" v-if="!canChangeSite">{{siteName}}</span>
                <el-select v-else v-model="curSite"
                           class="inline"
                           @change="change_site"
                           default-first-option filterable>
                    <el-option
                        v-for="res in siteList"
                        :label="res.label"
                        :value="res.id"
                        :key="res.id"
                    ></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.ModuleCombination')}}</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.modular"
                              @change="change_modular"
                              default-first-option
                              :options="modularList"
                              storageKey="ebayModelComb">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.UploadStyle')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.style"
                              :placeholder="m_placeholder(styleList,$t('ebay-list.UploadStyle'))"
                              default-first-option
                              :disabled="styleList.length<=0"
                              v-mouse-side.mousewheel="()=>{$refs.style.visible = false}"
                              ref="style"
                              :options="styleList"
                              storageKey="ebayStyleList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.SalesInstructions')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.sale"
                              :placeholder="m_placeholder(saleList,$t('ebay-list.SalesInstructions'))"
                              :disabled="saleList.length<=0"
                              ref="sale" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.sale.visible = false}"
                              :options="saleList"
                              storageKey="ebaySaleList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.linkC')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.promotion"
                              :placeholder="m_placeholder(promotionList,$t('ebay-list.linkC'))"
                              :disabled="promotionList.length<=0"
                              ref="promotion" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.promotion.visible = false}"
                              :options="promotionList"
                              storageKey="ebayPromotionList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.wuliuSet')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.trans"
                              :placeholder="comPlaceholder(transList,$t('ebay-list.wuliuSet'))"
                              :disabled="transList.length<=0"
                              ref="trans" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.trans.visible = false}"
                              :options="transList"
                              storageKey="ebayTransList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.cannotSend')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.exclude"
                              :placeholder="comPlaceholder(excludeList,$t('ebay-list.cannotSend'))"
                              :disabled="excludeList.length<=0"
                              ref="exclude" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.exclude.visible = false}"
                              :options="excludeList"
                              storageKey="ebayExcludeList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.StockingTime')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.choice"
                              :placeholder="m_placeholder(choiceList,$t('ebay-list.StockingTime'))"
                              :disabled="choiceList.length<=0"
                              ref="choice" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.choice.visible = false}"
                              :options="choiceList"
                              storageKey="ebayChoiceList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.doorIn')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.pickup"
                              :placeholder="m_placeholder(pickupList,$t('ebay-list.doorIn'))"
                              :disabled="pickupList.length<=0"
                              ref="pickup" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.pickup.visible = false}"
                              :options="pickupList"
                              storageKey="ebayPickupList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.ProductLocation')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.location"
                              :placeholder="m_placeholder(locationList,$t('ebay-list.ProductLocation'))"
                              :disabled="locationList.length<=0"
                              ref="location" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.location.visible = false}"
                              :options="locationList"
                              storageKey="ebayLocationList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.showImg')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.gallery"
                              :placeholder="m_placeholder(galleryList,$t('ebay-list.showImg'))"
                              :disabled="galleryList.length<=0"
                              ref="gallery" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.gallery.visible = false}"
                              :options="galleryList"
                              storageKey="ebayGalleryList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.privatePro')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.individual"
                              :placeholder="m_placeholder(individualList,$t('ebay-list.privatePro'))"
                              :disabled="individualList.length<=0"
                              ref="individual" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.individual.visible = false}"
                              :options="individualList"
                              storageKey="ebayIndividualList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.limitBuyer')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.refuse"
                              :placeholder="m_placeholder(refuseList,$t('ebay-list.limitBuyer'))"
                              :disabled="refuseList.length<=0"
                              ref="refuse" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.refuse.visible = false}"
                              :options="refuseList"
                              storageKey="ebayRefuseList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.Return')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.returngoods"
                              :placeholder="m_placeholder(returngoodsList,$t('ebay-list.Return'))"
                              :disabled="returngoodsList.length<=0"
                              ref="returngoods" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.returngoods.visible = false}"
                              :options="returngoodsList"
                              storageKey="ebayReturnGoodsList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.CollectionOption')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.receivables"
                              :placeholder="m_placeholder(receivablesList,$t('ebay-list.CollectionOption'))"
                              :disabled="receivablesList.length<=0"
                              ref="receivables" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.receivables.visible = false}"
                              :options="receivablesList"
                              storageKey="ebayReceivablesList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.acceptPrice')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.bargaining"
                              :placeholder="m_placeholder(bargainingList,$t('ebay-list.acceptPrice'))"
                              :disabled="bargainingList.length<=0"
                              ref="bargaining" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.bargaining.visible = false}"
                              :options="bargainingList"
                              storageKey="ebayBargainingList">
                </super-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">{{$t('ebay-list.quan')}}：</label>
            </el-col>
            <el-col :span="14">
                <super-select class="inline mr-md" style="width:200px"
                              v-model="common.quantity"
                              :placeholder="m_placeholder(quantityList,$t('ebay-list.quan'))"
                              :disabled="quantityList.length<=0"
                              ref="quantity" default-first-option
                              v-mouse-side.mousewheel="()=>{$refs.quantity.visible = false}"
                              :options="quantityList"
                              storageKey="ebayQuantityList">
                </super-select>
            </el-col>
        </el-row>
        <el-row class="mb-xs" v-if="ebayStatus==='already'">
            <el-col :span="10" class="text-right">
                {{$t('ebay-list.SubmitIn')}}：
            </el-col>
            <el-col :span="14">
                <el-date-picker
                    v-model="common.cron_time"
                    type="datetime"
                    :placeholder="$t('ebay-list.selectTime')">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row v-if="ebayStatus==='already'">
            <el-col :span="10" class="text-right">
                {{$t('ebay-list.ModifyNotes')}}：
            </el-col>
            <el-col :span="14">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    :placeholder="$t('ebay-list.enterTip')"
                    v-model="common.remark">
                </el-input>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <label class="ml-sm mr-md" v-if="!!canChangeSite" >
                <el-checkbox v-model="copyFor" :disabled="ebayStatus==='draftList'||this.ebayStatus==='soldOut'?true:false">{{$t('ebay-list.copy')}}</el-checkbox>
            </label>
            <request-button @click="keep" req-key="commonModule"
                            v-if="ebayStatus==='already'">{{$t('ebay-list.keepsync')}}</request-button>
            <request-button @click="keep" req-key="commonModule" v-else :disabled="ensureDisabled">{{$t('common.confirm')}}</request-button>
            <el-button size='mini' @click.native="close" >{{$t('common.close')}}</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .ebay-published-oprate{
        .account_border{
            border-bottom 1px solid #c4c4c4
        }
        .el-row{
            .line-h{
                line-height 24px;
            }
            padding: 3px 0;
            &:last-child{
                margin-bottom:10px;
            }
        }
    }
</style>
<script>
    import {api_get_combList,
        api_edit_combList,
        api_get_stylelist,
        api_change_site_drafts,
        api_batch_change_site,
        api_up_conmon_mod} from '../../../../../api/ebay-kandeng-public-module';
    import {api_ebay_common_module} from '../../../../../api/ebay-kandeng-operated';

    export default{
        data(){
            return{
                account_id:'',
                copyFor:false,
                curSite:'',
                modularList:[],
                show:this.value,
                common:{ //分类
                    promotion:'',
                    sale:'',
                    style:'',
                    bargaining:'',
                    choice:'',
                    counter:'',
                    exclude:'',
                    gallery:'',
                    pickup:'',
                    location:'',
                    individual:'',
                    quantity:'',
                    receivables:'',
                    refuse:'',
                    returngoods:'',
                    trans:'',
                    cron_time:"",
                    remark:"",
                },
                promotionList:[], // 促销
                saleList:[], // 销售
                styleList:[], //风格
                bargainingList:[], //议价
                choiceList:[], //备货
                counterList:[], //计数器---------
                excludeList:[], //不送达地区
                galleryList:[], //橱窗展示
                pickupList:[], //自提
                locationList:[], //发货地
                individualList:[], //私有
                quantityList:[], //数量
                receivablesList:[], //收款方式
                refuseList:[], //买家限制
                returngoodsList:[], //退货策略-----------
                transList:[], //物流方式
            }
        },
        created(){
            this.init_select();
        },
        methods:{
            open(){
                this.account_id='';
                this.copyFor=this.ebayStatus==='draftList'||this.ebayStatus==='soldOut'?true:false;
                this.init();
                this.curSite = this.siteId;
                this.init_list();
                if(this.curSite!==''&&!this.canChangeSite){
                    this.init_select_site();
                    this.get_modular();
                }
            },
            change_site(){
                this.init();
                if(this.curSite!==''){
                    this.init_select_site();
                    this.get_modular();
                }
            },
            init_list(){
                this.bargainingList = [];
                this.excludeList = [];
                this.receivablesList = [];
                this.returngoodsList = [];
                this.transList = [];
            },
            change_modular(val){
                if(!val){
                    this.init();
                    return;
                }
                let params = {
                    type:"comb",
                    id:val,
                };
                this.$http(api_edit_combList,params).then(res=>{
                    if(!!res){
                        this.common.promotion = res.promotion;
                        this.common.sale = res.sale;
                        this.common.style = res.style;
                        this.common.bargaining = res.bargaining;
                        this.common.choice = res.choice;
                        this.common.counter = res.counter;
                        this.common.exclude = res.exclude;
                        this.common.gallery = res.gallery;
                        this.common.pickup = res.pickup;
                        this.common.location = res.location;
                        this.common.individual = res.individual;
                        this.common.quantity = res.quantity;
                        this.common.receivables = res.receivables;
                        this.common.refuse = res.refuse;
                        this.common.returngoods = res.returngoods;
                        this.common.trans = res.trans;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_modular(){
                let params= {
                    type:"comb",
                    siteId:this.curSite,
                };
                this.$http(api_get_combList,params).then(res=>{
                    this.modularList = [];
                    if(res.data.length>0){
                        this.modularList = res.data.map(row=>{
                            return {
                                label:row.model_name,
                                value:row.id,
                            }
                        });
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            comPlaceholder(Array,str){//有站点过滤
                if(this.curSite===""){
                    return this.$t('ebay-list.noData')
                }else if(this.curSite&&Array.length<=0){
                    return this.$t('ebay-list.siteNoData')
                }else{
                    return `${this.$t('ebay-list.ps')} ${str}`;
                }
            },
            m_placeholder(Array,str){
                if(Array.length<=0){
                    return this.$t('ebay-list.noData');
                }else{
                    return `${this.$t('ebay-list.ps')} ${str}`
                }
            },
            init(){
                this.common={ //分类
                    promotion:'',
                    modular:'',
                    sale:'',
                    style:'',
                    bargaining:'',
                    choice:'',
                    counter:'',
                    exclude:'',
                    gallery:'',
                    pickup:'',
                    location:'',
                    individual:'',
                    quantity:'',
                    receivables:'',
                    refuse:'',
                    returngoods:'',
                    trans:'',
                    cron_time:"",
                    remark:"",
                }
            },
            init_select_site(val){//有站点
                let params = ["bargaining","exclude","receivables","returngoods","trans"];
                params.forEach((row)=>{
                    let curApi;
                    let cur= [];
                    let params ={
                        type:row,
                        siteId:this.curSite,
                    };
                    curApi = api_get_combList;
                    this.$http(curApi,params).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'bargaining':
                                this.bargainingList = cur;
                                break;

                            case 'exclude':
                                this.excludeList = cur;
                                break;
                            case 'receivables':
                                this.receivablesList = cur;
                                break;
                            case 'returngoods':
                                this.returngoodsList = cur;
                                break;
                            case 'trans':
                                this.transList = cur;
                                break;
                        }
                    }).catch(code=>{
                        console.log(code);
                    });
                })
            },
            /*调取下拉框 除站点&&账号之外的所有数据*/
            init_select(){//无站点项
                let params = ["sale","choice","promotion","style","gallery","pickup","location","individual","quantity","refuse"];
                params.forEach((row)=>{
                    let curApi;
                    let cur= [];
                    curApi = api_get_combList;
                    this.$http(curApi,{type:row}).then(res=>{
                        cur = res.data.map((item)=>{
                            return {
                                label:item.model_name,
                                value:item.id,
                            }
                        });
                        switch(row){
                            case 'sale':
                                this.saleList = cur;
                                break;
                            case 'choice':
                                this.choiceList = cur;
                                break;
                            case 'promotion':
                                this.promotionList = cur;
                                break;
                            case 'style':
                                this.styleList = cur;
                                break;
                            case 'counter'://计数器  暂时没有
                                this.counterList = cur;
                                break;
                            case 'gallery':
                                this.galleryList = cur;
                                break;
                            case 'pickup':
                                this.pickupList = cur;
                                break;
                            case 'location':
                                this.locationList = cur;
                                break;
                            case 'individual':
                                this.individualList = cur;
                                break;
                            case 'quantity':
                                this.quantityList = cur;
                                break;
                            case 'refuse':
                                this.refuseList = cur;
                                break;
                        }
                    }).catch(code=>{
                        console.log(code);
                    });
                })
            },
            //保存
            keep(){
                let data = [];
                if(this.ebayStatus==='already'){//已刊登页面 ‘应用公共模块’
                    this.selectIds.forEach(row=>{
                        data.push({
                            item_id: row.item_id,
                            site:row.site,
                            listing_sku:row.listing_sku,
                            mod_style:this.common.style,
                            old_mod_style:0,
                            mod_sale:this.common.sale,
                            old_mod_sale:0,
                            mod_trans:this.common.trans,
                            old_mod_trans:0,
                            mod_exclude:this.common.exclude,
                            old_mod_exclude:0,
                            mod_location:this.common.location,
                            old_mod_location:0,
                            mod_return:this.common.returngoods,
                            old_mod_return:0,
                            mod_refuse:this.common.refuse,
                            old_mod_refuse:0,
                            mod_receivables:this.common.receivables,
                            old_mod_receivables:0,
                            mod_promotion:this.common.promotion,
                            old_mod_promotion:0,
                            mod_choice:this.common.choice,
                            old_mod_choice:0,
                            mod_pickup:this.common.pickup,
                            old_mod_pickup:0,
                            mod_galley:this.common.gallery,
                            old_mod_galley:0,
                            mod_individual:this.common.individual,
                            old_mod_individual:0,
                            mod_bargaining:this.common.bargaining,
                            old_mod_bargaining:0,
                            mod_quantity:this.common.quantity,
                            old_mod_quantity:0,
                            cron_time:this.common.cron_time,
                            account_id:row.account_id,
                            remark:this.common.remark,
                        });
                    });
                    this.operate_ajax(api_up_conmon_mod,{data:data});
                }else if(this.ebayStatus==='model'&&!this.canChangeSite){//刊登记录页面 ‘应用公共模块’
                    let data_={}
                    data_.ids=this.selectIds.map(res=>{
                        return res.id;
                    });
                    data_.modules={
                        mod_style:this.common.style,
                        mod_sale:this.common.sale,
                        mod_trans:this.common.trans,
                        mod_exclude:this.common.exclude,
                        mod_location:this.common.location,
                        mod_return:this.common.returngoods,
                        mod_refuse:this.common.refuse,
                        mod_receivables:this.common.receivables,
                        mod_promotion:this.common.promotion,
                        mod_choice:this.common.choice,
                        mod_pickup:this.common.pickup,
                        mod_galley:this.common.gallery,
                        mod_individual:this.common.individual,
                        mod_bargaining:this.common.bargaining,
                        mod_quantity:this.common.quantity,
                    };
                    this.operate_ajax(api_ebay_common_module,data_);
                }else if((this.ebayStatus==='model'||this.ebayStatus==='draftList'||this.ebayStatus==='soldOut')&&this.canChangeSite){
                    //刊登记录 范本列表 已下架 批量转站点/账号
                    let ids = this.selectIds.map(row=>row.id);
                    let template = {
                        mod_style:this.common.style,
                        mod_sale:this.common.sale,
                        mod_trans:this.common.trans,
                        mod_exclude:this.common.exclude,
                        mod_location:this.common.location,
                        mod_return:this.common.returngoods,
                        mod_refuse:this.common.refuse,
                        mod_receivables:this.common.receivables,
                        mod_promotion:this.common.promotion,
                        mod_choice:this.common.choice,
                        mod_pickup:this.common.pickup,
                        mod_galley:this.common.gallery,
                        mod_individual:this.common.individual,
                        mod_bargaining:this.common.bargaining,
                        mod_quantity:this.common.quantity,
                    };
                    let params = {
                        copy:this.copyFor?1:0,
                        account_id:this.account_id,
                        ids:ids,
                        site:this.curSite,
                        templates:template
                    };
                    this.batch_change_site(params,this.ebayStatus);
                }
            },
            operate_ajax(api,data){
                this.$http(api,data).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    this.$reqKey('commonModule',false);
                });
            },
            //批量转站点
            batch_change_site(params,ebayStatus){
                if(ebayStatus==='model'||ebayStatus==='soldOut'){//刊登记录&&已下架
                    this.$http(api_batch_change_site,params).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.show=false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('commonModule',false);
                    })
                }else if(ebayStatus==='draftList'){//范本列表
                    delete params.copy;
                    let ids = this.selectIds.map(row=>row.listing_id);
                    let params_ = {
                        account_id:params.account_id,
                        listing_ids:ids.join(','),
                        site_id:params.site,
                        templates:params.templates
                    };
                    console.log(params_,'params_')
                    this.$http(api_change_site_drafts,params_).then(res => {
                        this.$message({type:'success',message:res.message||res});
                        this.show=false;
                    }).catch(code => {
                        this.$message({type:'error',message:code.message||code});
                    }).finally(()=>{
                        this.$reqKey('commonModule',false);
                    })
                }

            },
            close(){
                this.show=false;
            },
        },
        watch:{
            show(val){
                this.$emit('input', val);
            },
            value(val){
                this.show = val;
            },
        },
        computed:{
            ensureDisabled(){
                if(this.ebayStatus==='model'&&this.canChangeSite){//刊登记录页面
                    if(this.account_id===''&&this.curSite===''){
                        return true;
                    }
                }else if(this.ebayStatus==='draftList'||this.ebayStatus==='soldOut'){//范本列表 已下架 页面
                    if(this.account_id===''){
                        return true;
                    }
                } else {
                    return false;
                }
            }
        },
        props:{
            value:{},
            selectIds:{},
            ebayStatus:{
                required:true,
                type:String,
            },
            /*站点ID，在范本-》批量更改站点中不需要
            * */
            siteId:{
                default(){
                    return ''
                }
            },
            /*站点名称，范本-》批量更改站点中不需要
            * */
            siteName:{},
            title:{
                type:String,
                default(){
                    return this.$t('ebay-list.publicModel')
                }
            },
            siteList:{
                type:Array,
                default(){
                    return []
                }
            },
            canChangeSite:{
                type:Boolean,
                default(){
                    return false
                },
            },
        },
        components:{
            pageDialog:require('../../../../../components/page-dialog.vue').default,
            paramAccount:require('../../../../../api-components/param-account.vue').default,
        }
    }
</script>
