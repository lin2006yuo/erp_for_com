<template>
    <page-dialog v-model="show" size="large" title="应用公共模块" @open='open'
                 class="ebay-published-oprate"  :close-on-click-modal="false">
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">站点：</label>
            </el-col>
            <el-col :span="14" style="margin:4px 0">
                <span v-if="!canChangeSite">{{siteName}}</span>
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
                <label class="inline">模块组合：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.modular"
                           @change="change_modular"
                           default-first-option filterable clearable
                           class="inline mr-md" style="width:200px">
                    <el-option
                        v-for="res in modularList"
                        :label="res.label"
                        :value="res.value"
                        :key="res.value"
                    ></el-option>   
                </el-select>   
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">刊登风格：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.style"
                           :placeholder="m_placeholder(styleList,'刊登风格')"
                           :disabled="styleList.length<=0"
                           ref="style" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.style.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in styleList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">销售说明：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.sale"
                           class="inline mr-md"
                           :placeholder="m_placeholder(saleList,'销售说明')"
                           :disabled="saleList.length<=0"
                           ref="sale" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.sale.visible = false}"
                           filterable style="width:200px">
                    <el-option v-for="item in saleList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">关联促销：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.promotion"
                           :placeholder="m_placeholder(promotionList,'关联促销')"
                           :disabled="promotionList.length<=0"
                           ref="promotion" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.promotion.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in promotionList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">物流设置：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.trans"
                           :placeholder="comPlaceholder(transList,'物流设置')"
                           :disabled="transList.length<=0"
                           ref="trans" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.trans.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in transList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">不运送地区：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.exclude"
                           :placeholder="comPlaceholder(excludeList,'不运送地区')"
                           :disabled="excludeList.length<=0"
                           ref="exclude" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.exclude.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in excludeList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">备货时间：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.choice"
                           placeholder="全部"
                           :placeholder="m_placeholder(choiceList,'备货时间')"
                           ref="choice" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.choice.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in choiceList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">上门提货(Local Pickup)：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.pickup"
                           :placeholder="m_placeholder(pickupList,'上门提货')"
                           :disabled="pickupList.length<=0"
                           ref="pickup" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.pickup.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in pickupList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">商品所在地：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.location"
                           :placeholder="m_placeholder(locationList,'商品所在地')"
                           :disabled="locationList.length<=0"
                           ref="location" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.location.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in locationList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">橱窗展示(Gallery)图片：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.gallery"
                           :placeholder="m_placeholder(galleryList,'橱窗展示图片')"
                           :disabled="galleryList.length<=0"
                           ref="gallery" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.gallery.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in galleryList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">私人物品(Private Listing)：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.individual"
                           :placeholder="m_placeholder(individualList,'私人物品')"
                           :disabled="individualList.length<=0"
                           ref="individual" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.individual.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in individualList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">买家限制：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.refuse"
                           :placeholder="m_placeholder(refuseList,'买家限制')"
                           :disabled="refuseList.length<=0"
                           ref="refuse" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.refuse.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in refuseList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">退货：</label>
            </el-col>
            <el-col :span="14">
                <el-select class="inline width-super"
                           ref="returngoods"
                           v-mouse-side.mousewheel="()=>{$refs.returngoods.visible = false}"
                           v-model="common.returngoods"
                           filterable clearable default-first-option
                           :disabled="returngoodsList.length<=0"
                           :placeholder="m_placeholder(returngoodsList,'退货')">
                    <el-option
                            :key="item.value"
                            v-for="item in returngoodsList"
                            :label="item.label"
                            :value="item.value"
                    ></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">收款选项：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.receivables"
                           :placeholder="comPlaceholder(receivablesList,'收款选项')"
                           :disabled="receivablesList.length<=0"
                           ref="receivables" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.receivables.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in receivablesList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">接受买家还价(Best Offer)：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.bargaining"
                           :placeholder="comPlaceholder(bargainingList,'接受买家还价')"
                           :disabled="bargainingList.length<=0"
                           ref="bargaining" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.bargaining.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in bargainingList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10" class="text-right">
                <label class="inline">数量：</label>
            </el-col>
            <el-col :span="14">
                <el-select v-model="common.quantity"
                           :disabled="quantityList.length<=0"
                           :placeholder="m_placeholder(quantityList,'数量')"
                           ref="quantity" default-first-option
                           v-mouse-side.mousewheel="()=>{$refs.quantity.visible = false}"
                           class="inline mr-md" filterable style="width:200px">
                    <el-option v-for="item in quantityList"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-col>
        </el-row>
        <el-row class="mb-xs" v-if="ebayStatus==='already'">
            <el-col :span="10" class="text-right">
                定时提交修改：
            </el-col>
            <el-col :span="14">
                <el-date-picker
                    v-model="common.cron_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-col>
        </el-row>
        <el-row v-if="ebayStatus==='already'">
            <el-col :span="10" class="text-right">
                修改备注：
            </el-col>
            <el-col :span="14">
                <el-input
                    type="textarea"
                    :rows=4
                    style="width:35%"
                    placeholder="请输入内容"
                    v-model="common.remark">
                </el-input>
            </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <request-button @click="keep" req-key="commonModule"
                            v-if="ebayStatus==='already'">保存待同步平台</request-button>
            <request-button @click="keep" req-key="commonModule" v-else>确定</request-button>
            <el-button size='mini' @click.native="close" >关   闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .ebay-published-oprate{
        .el-row{
            padding: 3px 0;
            &:last-child{
                margin-bottom:10px;
            }
        }
    }
</style>
<script>
    import {api_common_modeList,
        api_get_promotion_list,
        api_get_combList,
        api_edit_combList,
        api_get_stylelist,
        api_batch_change_site,
        api_up_conmon_mod} from '../../../../../api/ebay-kandeng-public-module';
    import {api_ebay_common_module} from '../../../../../api/ebay-kandeng-operated';

    export default{
        data(){
            return{
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
                    model_type:"comb",
                    id:val,
                };
                this.$http(api_edit_combList,params).then(res=>{
                    if(res.data){
                        this.common.promotion = res.data.promotion;
                        this.common.sale = res.data.sale;
                        this.common.style = res.data.style;
                        this.common.bargaining = res.data.bargaining;
                        this.common.choice = res.data.choice;
                        this.common.counter = res.data.counter;
                        this.common.exclude = res.data.exclude;
                        this.common.gallery = res.data.gallery;
                        this.common.pickup = res.data.pickup;
                        this.common.location = res.data.location;
                        this.common.individual = res.data.individual;
                        this.common.quantity = res.data.quantity;
                        this.common.receivables = res.data.receivables;
                        this.common.refuse = res.data.refuse;
                        this.common.returngoods = res.data.returngoods;
                        this.common.trans = res.data.trans;
                    }
                }).catch(code=>{
                    console.log(code);
                })
            },
            get_modular(){
                let params= {
                    page:1,
                    size:9999,
                    model_type:"comb",
                    site:this.curSite,
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
                    return "无站点数据"
                }else if(this.curSite&&Array.length<=0){
                    return "该站点下暂无数据"
                }else{
                    return `请选择${str}`;
                }
            },
            m_placeholder(Array,str){
                if(Array.length<=0){
                    return "暂无数据";
                }else{
                    return `请选择${str}`
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
                        model_type:row,
                        site:this.curSite,
                    };
                    curApi = api_common_modeList;
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
                let params = ["sale","choice","promotion","style","counter","gallery","pickup","location","individual","quantity","refuse"];
                params.forEach((row)=>{
                    let curApi;
                    let cur= [];
                    if(row==='style'){
                        curApi = api_get_stylelist;
                    }else if(row==='promotion'){
                        curApi = api_get_promotion_list;
                    }else{
                        curApi = api_common_modeList;
                    }
                    this.$http(curApi,{model_type:row}).then(res=>{
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
                    this.operate_ajax(api_up_conmon_mod,data);
                }else if(this.ebayStatus==='model'&&!this.canChangeSite){//范本页面 ‘应用公共模块’
                    this.selectIds.forEach(row=>{
                        data.push({
                            id: row.id,
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
                        });
                    });
                    this.operate_ajax(api_ebay_common_module,data);
                }else if(this.ebayStatus==='model'&&this.canChangeSite){//范本页面批量转站点
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
                        ids:ids,
                        site:this.curSite,
                        templates:template
                    };
                    this.batch_change_site(params);
                }
            },
            operate_ajax(api,data){
                this.$http(api,{data:data}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.show=false;
                }).catch(code=>{
                    this.$message({message:code.message||code,type:'error'});
                }).finally(()=>{
                    this.$reqKey('commonModule',false);
                });
            },
            //批量转站点
            batch_change_site(params){
                this.$http(api_batch_change_site,params).then(res => {
                    this.$message({type:'success',message:res.message||res});
                    this.show=false;
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('commonModule',false);
                })
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
            siteId:{},
            /*站点名称，范本-》批量更改站点中不需要
            * */
            siteName:{},
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
            pageDialog:require('../../../../../components/page-dialog.vue').default
        }
    }
</script>
