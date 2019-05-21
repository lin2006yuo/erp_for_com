
<template>
    <page class="p-add-listing over-flow-auto" ref="pageLock">
        <el-card v-loading="loading" :element-loading-text="loadingText">
            <rainbow-header title="关联产品信息" backgroundColor="#E70012">
                <el-form :model="form.goodsInfo" label-width="235px">
                    <el-form-item label="本地SPU：">{{form.goodsInfo.spu}}</el-form-item>
                    <el-form-item label="产品名称：">{{form.goodsInfo.name}}</el-form-item>
                    <el-form-item label="本地分类：">{{form.goodsInfo.category_name_tree}}</el-form-item>
                    <el-form-item label="物流属性：">{{form.goodsInfo.transport_property_txt}}</el-form-item>
                    <el-form-item label="来源渠道：" v-if="param.isAdd">
                        <el-button type="primary" size="mini" @click.native="add_account">添加平台账号</el-button>
                    </el-form-item>
                </el-form>
            </rainbow-header>
            <!--多个账号  选项卡-->
            <totr-dialog v-model="showTotr"
                         @check="check"
                         :totrvalue="totrvalue"></totr-dialog>
            <el-tabs type="border-card"
                     :editable="param&&param.curPage==='notYet'"
                     class="mt-sm"
                     @tab-click="tab_click"
                     :active-name="currentTab"
                     v-model="currentname"
                     @edit="handle_tabs_edit"
                     v-if="form.data&&form.data.length>0">
                <el-tab-pane
                        v-for="(item, index) in form.data"
                        :label="item.code"
                        :name="item.code"
                        :key="item.code">
                    <!--一般信息-->
                    <general-info :form="item"
                                  :param="param"
                                  :common-span="commonSpan"
                                  :accounts-list="accounts"
                                  :large-span="largeSpan"
                                  :site-list="siteList"
                                  @change-site="change_site(index,$event)"
                                  @change-account="change_account"
                                  @change-specific="change_specific(item,index)"
                                  @delete-new-specific="delete_new_specific(item,index,$event)"
                                  ref="generalForm"></general-info>
                    <!--&lt;!&ndash;标题与价格   一口价&& 拍卖&ndash;&gt;-->
                    <title-price
                            ref="titlePrice"
                            :form-spu="form.goodsInfo.spu"
                            :form="item"
                            @submit-product="submit_product(index,$event)"
                            @blur-price="blur_price1(index)"
                            :siteList="siteList"
                            :account-list="accountList"
                            :account-id="item.list.account_id"
                            :large-span="largeSpan"
                            :common-span="commonSpan"
                            :small-span="smallSpan"
                            :is-edit="param.isAdd"
                    ></title-price>
                    <!--SKU 设置-->
                    <sku-settings ref="skuSettings"
                                  @blur-price="blur_price2(index,$event)"
                                  @submit-sku="submit_sku"
                                  @batch-mdf-price="batch_mdf_price(index,$event)"
                                  :account-id="item.list.account_id"
                                  :reference-price="allPricing"
                                  :form="item"
                                  :param="param"
                                  :base-url="comBaseUrl"
                                  :siteList="siteList"
                                  :local-attr="form.goodsSku"
                                  :attr-info="form.attrInfo"></sku-settings>
                    <!--图片与描述-->
                    <picture-des :form="item"
                                 ref="pictureDes"
                                 :curPage="param.curPage"
                                 :isCopy="isCopy"
                                 :spu="form.goodsInfo.spu"
                                 :account="item.code"
                                 :base-url="comBaseUrl"
                                 :common-span="commonSpan"
                                 :goods-id="param.goods_id"
                                 :especialIds="especialIds"
                                 :channelId="form.channel_id"
                                 :large-span="largeSpan"></picture-des>
                    <!--&lt;!&ndash;物流设置&ndash;&gt;-->
                    <set-logistics :form="item"
                                   ref="logisticsForm"
                                   :curPage="param.curPage"
                                   :siteList="siteList"
                                   :location-list="locationList"
                                   :common-span="commonSpan"
                                   :large-span="largeSpan"
                                   :small-span="smallSpan"
                    ></set-logistics>
                    <!--商品所在地-->
                    <location :form="item"
                              :location-list="countryList"
                              :common-span="commonSpan"
                              :large-span="largeSpan"></location>
                    <!--退货，-->
                    <return-data
                            :form="item"
                            ref="returnForm"
                            :common-span="commonSpan"
                            :large-span="largeSpan"
                    ></return-data>
                    <!--买家限制-->
                    <refuse :form="item"></refuse>
                    <!--补充与重上规则-->
                    <replenish :form="item"></replenish>
                    <!--收款选项-->
                    <proceeds :form="item"
                              ref="proceedsForm"
                              :curPage="param.curPage"
                              :siteList="siteList"
                              :common-span="commonSpan"
                              :large-span="largeSpan"></proceeds>
                    <!--其他-->
                    <others :form="item"
                            :common-span="commonSpan"
                            :large-span="largeSpan"></others>

                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!--检验及测试刊登费 弹框-->
        <expense-detection v-model="expenseDialog" :obj-data="expenseData"></expense-detection>
        <!--添加平台账号-->
        <add-account :account-list="accounts" v-model="addAccountDialog" @add-data="add_data"></add-account>
        <div class="page-fixed">
            <div class="fr" style="margin-right: 55px;">
                <el-button size="mini"
                           class="inline"
                           @click.native="apply_all"
                           type="primary"
                           v-if="form.data&&form.data.length>1"
                           :disabled="form.data&&form.data.length<=0">应用到所有
                </el-button>
                <permission tag="request-button"
                            class="inline" :mintime="300"
                            @click="translate_all"
                            req-key="translateAll"
                            :disabled="(form.data&&form.data.length<=0)||disabledAll"
                            :route="apis.url_translate_batch">翻译全部账号</permission>
                <permission tag="request-button"
                            class="inline" :mintime="300"
                            :disabled="(form.data&&form.data.length<=0)||isDisabled"
                            req-key="translateCur" @click="translate_cur"
                            :route="apis.url_translate_batch">翻译当前账号</permission>
                <permission tag="request-button"
                            reqKey="getListingFee"
                            :route="apis.url_get_listing_fee" :mintime="300"
                            class="inline" @click.native="detection_kd"
                            :disabled="(form.data&&form.data.length<=0)">检验及测试刊登费
                </permission>
                <permission tag="request-button"
                            reqKey="update" :mintime="300"
                            :route="apis.url_save_listing"
                            v-if="param.curPage==='model'&&(param.status===0||param.status===4||param.status===1)"
                            class="inline"
                            @click="update"
                            :disabled="(form.data&&form.data.length<=0)">保存
                </permission>
                <permission tag="request-button"
                            req-key="publishSingle" :mintime="300"
                            v-if="param.curPage==='model'||param.curPage==='notYet'||param.isCopy"
                            class="inline"
                            @click="immediately_publish_single"
                            :disabled="(form.data&&form.data.length<=0)||immdisabled"
                            :route="apis.url_publish_immediately">立即刊登
                </permission>
                <permission tag="request-button"
                            req-key="publishBatch" :mintime="300"
                            v-if="param.curPage==='notYet'"
                            class="inline"
                            @click="immediately_publish_batch"
                            :disabled="(form.data&&form.data.length<=0)"
                            :route="apis.url_publish_immediately">批量刊登
                </permission>
                <permission v-if="param.isCopyListing"
                            tag="request-button" :mintime="300"
                            req-key="terraceTemplate"
                            :route="apis.url_cDraft_listing"
                            class="inline"
                            @click.native="kd_terrace_template"
                            :disabled="(form.data&&form.data.length<=0)">更新Listing
                </permission>
                <!--已下架页面--》编辑-->
                <permission tag="request-button" :mintime="300"
                            v-if="param.curPage==='soldOut'"
                            req-key="relistItm"
                            class="inline"
                            :route="apis.url_relist_itm"
                            :disabled="(form.data&&form.data.length<=0)"
                            @click="relist_itm">立即重上
                </permission>
                <permission tag="request-button"
                            v-if="param.curPage!=='already'||param.isCopy"
                            req-key="saveAs" :mintime="300"
                            :route="apis.url_save_listing"
                            class="inline"
                            @click="save_as"
                            :disabled="(form.data&&form.data.length<=0)">另存为
                </permission>
                <permission tag="request-button"
                            v-if="param.curPage==='notYet'"
                            req-key="saveDraft" :mintime="300"
                            :route="apis.url_save_ebay_draft"
                            class="inline"
                            @click="save_draft"
                            :disabled="(form.data&&form.data.length<=0)">共享范本
                </permission>
                <el-button size="mini" class="inline" @click.native="cancel">{{$t('common.cancel')}}</el-button>
            </div>
        </div>
        <!--侵权记录-->
        <fanseright-dialog v-model="copyrightShow"
                           :look-tip="true"
                           @fanseright="fanseRight"
                           :tableData="tableData"></fanseright-dialog>
    </page>
</template>
<style lang="stylus" scoped>
    .p-add-listing {
        .p-titleBgcol {
            background: #FAECE7;
            span {
                color: #FFF;
                font-weight: bold;
                padding: 5px 10px;
                font-size: 1.7rem;
                display: inline-block;
                background: #E70012;
            }
        }
        .p-titleColour {
            padding: 20px;
            border-left: 3px solid #E70012;
        }
    }
</style>
<script>
    import {isExistIllegalWord} from '@/lib/filter-words.js'
    import {api_get_goods_description} from '@/api/product-library';
    import {get_specifics} from './public-methods';
    import {api_ebay_account} from '../../../../../api/publish-smt';
    import {ref_price} from './public-methods';
    import {
        api_relist_itm,
        api_add_listing,
        api_get_listing_fee,
        api_get_countrys,
        api_get_locations,
        api_save_listing,
        api_edit_listing,
        api_infringement_vocabulary,
        api_save_ebay_draft,
        api_get_ebay_site,
        api_cDraft_listing,
        api_queque_listing,
        api_copy_published,
        api_publish_immediately_save,
        api_save_listing_imm,
        api_publish_immediately,
        api_suggested_categories,
        api_category_chain,
        api_translate_batch,
        api_pricing_rules
    } from '@/api/ebay-kandeng-public-module';
    import {
        url_get_listing_fee,
        url_save_listing,
        url_cDraft_listing,
        url_save_ebay_draft,
        url_publish_immediately,
        url_relist_itm,
        url_translate_batch
    } from '../../../../../api/ebay-kandeng-public-module';
    import {get_local} from './get_localtion';
    import {mapActions, mapGetters} from 'vuex';
    export default {
        permission: {
            url_get_listing_fee,
            url_save_listing,
            url_save_ebay_draft,
            url_cDraft_listing,
            url_publish_immediately,
            url_relist_itm,
            url_translate_batch
        },
        page: {
            multiple: true,
            beforeClose() {
                if (!this.isChange) {
                    return true;
                } else {
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: this.$t('common.cancel'),
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code => {
                        return false
                    })
                }
            }
        },
        data() {
            return {
                intervalTime:null,
                immdisabled:false,
                saveDraft:{
                    itemId:'',
                    listId:'',
                },
                draftClear:false,
                arr:[],
                draft_site:[],//存在范本的站点id
                filterList:[],
                objList:{},
                copyrightShow:false,
                tableData:[],
                allPricing:{},
                especialIds: [],//图片详情所传入的ID
                isAdd: false,
                location: [],
                locationList: [],
                countryList: [],
                isChange: false,
                expenseData: {},
                expenseDialog: false,
                /*添加Listing数据*/
                loading: false,
                copyLoading: true,
                btnLoading: false,
                loadingText: "",
                accountList: [],
                saveCategoryid:'',
                vocabulary:[],
                form: {
                    /*关联产品信息*/
                    goodsInfo: {},
                    /*添加平台账号*/
                    accounts: [],
                    /*商品属性*/
                    attrInfo: [],
                    /*产品资料*/
                    lang: [],
                    /*子产品信息*/
                    goodsSku: [],
                    /*平台映射的类目ID*/
                    categoryId: "",
                    /*产品图片*/
                    imgs: [],
                    data: [],
                },
                /*添加平台账号*/
                addAccountDialog: false,
                /*当前账号*/
                currentTab: "",
                currentname: "",
                showTotr:false,
                totrvalue:{
                },
                siteList: [],
                smallSpan: 3,
                commonSpan: 5,
                largeSpan: 15,
                isCopy: false,
                curCode: "",
                scrollTop: 0,
            }
        },
        created() {
            this.get_ebay_countrys();
            this.get_ebay_locations();
            this.get_site();
            this.get_account();
            this.isChange = false;
            this.copyLoading = true;
            if (window.screen.width === 1920) {
                this.smallSpan = 3;
                this.commonSpan = 4;
                this.largeSpan = 15;
            } else if (window.screen.width === 1366) {
                this.smallSpan = 4;
                this.commonSpan = 6;
                this.largeSpan = 16;
            }
        },
        destroyed(){
            clearInterval(this.intervalTime);
        },
        mounted() {
            this.$http(api_infringement_vocabulary).then(res=>{//敏感词列表
                res.forEach(row=>{
                    this.vocabulary.push(row.code)
                });
            }).catch(err=>{
                console.log(err)
            });

            if (window.objlength(this.param) !== 0) {
                this.especialIds = [this.param.goods_id];
                this.dataId = this.param.id;
                this.isAdd = this.param.isAdd;
                this.isCopy = this.param.isCopy;
                // if (this.isCopy) {
                //     this.param.default_account_id = "";
                // } else {
                //     if (this.param.isAdd) { //新增
                //         this.not_publish(this.param);
                //         this.form.data = [];
                //     } else {//编辑
                //         this.param.default_account_id = "";
                //         this.edit_publish(this.param.id);
                //     }
                // }
                if(this.param.isAdd&&!this.isCopy){
                    this.intervalTime = setInterval(()=>{//缓存数据
                        this.saveData();
                    },60000);
                    this.not_publish(this.param);
                    this.form.data = [];
                }else {
                    this.edit_publish(this.param.id);
                }
            }
        },
        watch: {
            "$page.param"(val) {
                if (window.objlength(val) !== 0) {
                    this.especialIds = [val.goods_id];
                    this.dataId = val.id;
                    this.isAdd = val.isAdd;
                    this.isCopy = val.isCopy;
                    // if (val.isAdd) { //新增
                    //     this.form.data.length = 0;
                    //     this.not_publish(val)
                    // } else {//编辑
                    //     this.edit_publish(val.id)
                    // }
                    if (this.param.isAdd&&!this.isCopy) { //新增
                        // this.form.data.length = 0;
                        // this.not_publish(val);
                    }else {
                        this.edit_publish(val.id)
                    }

                }
            },
            "form.data": {
                deep: true,
                handler(val) {
                    if (!this.copyLoading && val && val.length) {
//                        销售要求关闭离开时的提示
//                        this.isChange = true;
                    }
                }
            },
        },
        computed: {
            param(){
                return this.$page.param || {}
            },
            ...mapGetters({
                'dataTable': 'kandeng-result/dataTable'
            }),
            isDisabled(){
                let find = this.form.data.find(row=>row.code===this.currentname);
                return find?!!find.list.is_translated:true
            },
            disabledAll(){
                if(this.form&&this.form.data){
                    return !this.form.data.find(row=>!row.list.is_translated);
                }
            },
            comBaseUrl(){
                return this.form.goodsInfo&&this.form.goodsInfo.base_url?this.form.goodsInfo.base_url:''
            },
            accounts() {
                return this.accountList.map(account => {
                    let vars = this.form.data || [];
                    let find = vars.find((r) => {
                        return r.code === account.code;
                    });
                    account.disabled = !!find;
                    return account;
                })
            },
        },
        activated() {
            this.scrollTop = this.$refs.pageLock.scrollTop;
        },
        deactivated() {
            this.$refs.pageLock.scrollTop = this.scrollTop;
        },
        methods: {
            ...mapActions({
                get_ids: 'kandeng-result/get_ids',
                get_table: 'kandeng-result/get_table',
            }),
            ref_price,
            get_local,
            get_specifics,
            saveData(){//定时缓存
                let data = JSON.stringify(clone(this.form));
                sessionStorage.setItem(this.form.goodsInfo.spu+this.param.default_site_id,data)
            },
            blur_price1(index){
                let obj = this.form.data[index];
                let skuId = '';
                if(!obj.list.sku_id){
                    if(obj.varians&&obj.varians.length>0) skuId = obj.varians[0].sku_id;
                }else{
                    skuId = obj.list.sku_id;
                }
                obj.list.start_price = this.can_change_Price(obj.account_id,skuId,obj.list.start_price,true);
                this.$refs.proceedsForm[index].blur_default_payid();
            },
            blur_price2(index,data){
                let obj = this.form.data[index];
                data.v_price = this.can_change_Price(obj.account_id,data.sku_id,data.v_price,true);
                this.$refs.proceedsForm[index].blur_default_payid();
            },
            batch_mdf_price(index,data){
                let obj = this.form.data[index];
                data.row.forEach(res=>{
                    res.v_price = this.can_change_Price(obj.account_id,res.sku_id,data.newPrice,false);
                });
                this.$refs.proceedsForm[index].blur_default_payid();
            },
            submit_sku(val) {
                this.especialIds = [...this.especialIds, ...val];
            },
            immediately_publish_batch() {//批量刊登
                let cur = this.public_params(false, false);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('publishBatch',false);

                if(!this.copyTip(cur.data)){
                    this.immediately_api(cur.data,'batch');
                }
                // this.immediately_api(cur.data,'batch');
            },
            fanseRight(){//侵权spu继续
                this.copyrightShow=false;
                if(!this.copyTip()){
                    this.immediately_api(this.objList,'single');
                }
            },
            immediately_publish_single() {//立即刊登
                let cur = this.public_params(true, false);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('publishSingle',false);
                let data = JSON.parse(cur.data);
                this.objList = data.filter(row => row.code === this.currentname);
                if(!!this.form.goodsInfo.tort_flag){//侵权数据
                    if(!this.tableData.length){
                        this.$http(api_get_goods_description,this.form.goodsInfo.id, {page: 1, page_size: 50})
                            .then(res => {
                                this.tableData=res.list;
                            }).catch(err => {
                            console.log(err + '出错了');
                        })
                    }
                    this.copyrightShow=true;
                }else {
                    if(!this.copyTip()){
                        this.immediately_api(this.objList,'single');
                    }
                }


            },
            clear_timer(){//清除缓存定时器
                clearInterval(this.intervalTime);
                sessionStorage.removeItem(this.form.goodsInfo.spu+this.form.data[0].list.site);
            },
            check(data){
                if(!!data.data){
                    this.immediately_api(data.data,'batch');
                }else {
                    this.immediately_api(this.objList,'single');
                }
            },
            copyTip(data) {//侵权词
                this.$message({type: "info", message: "敏感词检测中"});
                // this.is_tort=true;
                for (let i of this.form.data) {
                    let bool = isExistIllegalWord(i.set.description, this.vocabulary);
                    let bol = isExistIllegalWord(i.list.title, this.vocabulary);
                    if (bool || bol) {
                        let name = bool?'详情描述':'刊登标题';
                        this.showTotr=true;
                        this.totrvalue={
                            account_code:this.form.goodsInfo.spu,
                            name:name,
                            bool,
                            bol,
                            data:data||''
                        };
                        return true;
                    }
                }
                // this.is_tort = false;
                this.$message({type: "success", message: "无敏感词"});
                return false;
            },
            immediately_api(data,curType) {//立即刊登API
                this.copyrightShow=false;
                this.immediately_save_api(data).then(res => {
                    this.immdisabled=true;
                    this.clear_timer();
                    if(!res)return;
                    if (res.data){
                        res.data.forEach(val=>{
                            let find = this.form.data.find(dataVal=>dataVal.code===val.account_code);
                            if(!!find&&!find.list.hasOwnProperty('id')) this.$set(find.list,'id',val.id)
                        });
                        let idsList = res.data.map(row => parseInt(row.listing_id));
                        let ids = idsList.join(',');
                        this.get_ids(idsList);
                        res.data = res.data instanceof Array?res.data:[res.data];
                        res.data.forEach(row=>{
                            this.$set(row,'listing_status',0);
                        });
                        this.get_table(res.data);
                        let showMessage;
                        this.$http(api_save_listing_imm, {ids: ids}).then(res=>{}).catch(code=>{
                            showMessage = code
                        });
                        setTimeout(()=>{
                            this.immdisabled=false;
                        },2000);
                        // setTimeout(()=>{
                        if(!showMessage) this.$open('/show-message');
                        // },5000);

                    } else {
                        this.$message({type: "warning", message: 'listing_id集合为空'});
                    }
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.immdisabled=false;
                    },2000);
                    curType==='batch'?this.$reqKey('publishBatch',false):this.$reqKey('publishSingle',false);
                });
            },
            immediately_save_api(data) {
                if(this.saveDraft.listId.length>0&&this.param.curPage==='notYet'){
                    data[0].list.id=this.saveDraft.listId
                }else if(this.param.curPage==='notYet'){
                    delete data[0].list.id;
                }
                return this.$http(api_publish_immediately_save, {data: data}).then(res => {
                    if(res.result===false)return this.$message({type:'error',message:res.message||res});
                    return Promise.resolve(res);
                })
            },
            get_site_name(siteId) {
                let find = this.siteList.find(row => row.siteid === siteId);
                if (!!find) return find.country;
            },
            get_site() {//站点
                this.$http(api_get_ebay_site).then(res => {
                    this.siteList = res.data;
                }).catch(code => {
                    console.log(code);
                })
            },
            /*history字段不存在时*/
            arrangement_form(res,params){
                this.$set(this.form, "goodsInfo", res.data.goodsInfo);
                this.$set(this.form, "accounts", res.data.accounts);
                this.$set(this.form, "attrInfo", res.data.attrInfo);
                this.$set(this.form, "lang", !!res.data.lang ? res.data.lang : {});
                this.$set(this.form, "goodsSku", res.data.goodsSku);
                this.$set(this.form, "categoryId", res.data.categoryId);
                this.$set(this.form, "imgs", res.data.imgs);
                if (!!res.data.channel_id) this.$set(this.form, "channel_id", res.data.channel_id);

                res.data.accounts.forEach(row => {
                    if (Number(params.default_account_id) === Number(row.account_id)) {
                        this.arr.push(row);
                    }
                });
                let historyData = sessionStorage.getItem(this.form.goodsInfo.spu+this.param.default_site_id);
                if(!!historyData){//页面存在缓存
                    this.$confirm(`该页面存在数据缓存，是否载入？`, this.$t('ebay-list.tips'), {
                        confirmButtonText: this.$t('common.go'),
                        cancelButtonText: this.$t('common.cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.form=JSON.parse(historyData);
                        if (this.form.data.length > 0) {
                            this.currentTab = this.form.data[0].code;
                            this.currentname = this.form.data[0].code;
                        }
                        return;
                    }).catch(()=>{
                        this.draft_site=res.data.draft_site;
                        if(!!res.data.draft){//当前搜索站点有范本
                            // res.data.draft.code=this.arr[0].code;
                            res.data.draft.list.sub_title='';
                            res.data.draft.set.description=!!this.form.lang.is_store_desc?this.form.lang.description:res.data.draft.set.description;
                            res.data.draft.list.title=this.form.lang.title;
                            res.data.draft.list.timing=0;
                            res.data.draft.list.draft_name='';
                            //展示搜索时的账号
                            res.data.draft.list.account_id = this.accountList.find(res=>{
                                return res.code===this.arr[0].code;
                            }).account_id;
                            res.data.draft.list.account_name=this.arr[0].code;
                            //店铺分类也不带
                            res.data.draft.list.store_category_id=0;
                            res.data.draft.list.store_category2_id=0;
                            if(!!res.data.draft.list.second_store_name){
                                res.data.draft.list.second_store_name='';
                            }
                            if(!!res.data.draft.list.store_name){
                                res.data.draft.list.store_name='';
                            }
                            //paypa账号类也不带
                            res.data.draft.list.paypal_emailaddress='';
                            this.draftClear=true;//不使用当前站点的图片
                            this.edit_data(res.data.draft);
                        }else{//当前搜索站点没范本
                            this.add_data(this.arr);
                        }

                    });
                }else {//页面不存在缓存
                    this.draft_site=res.data.draft_site;
                    if(!!res.data.draft){//当前站点有范本
                        res.data.draft.list.sub_title='';
                        res.data.draft.set.description=!!this.form.lang.is_store_desc?this.form.lang.description:res.data.draft.set.description;
                        res.data.draft.list.title=this.form.lang.title;
                        res.data.draft.list.timing=0;
                        res.data.draft.list.draft_name='';
                        res.data.draft.list.account_id = this.accountList.find(res=>{
                            return res.code===this.arr[0].code;
                        }).account_id;
                        res.data.draft.list.account_name=this.arr[0].code;
                        res.data.draft.list.store_category_id=0;
                        res.data.draft.list.store_category2_id=0;
                        if(!!res.data.draft.list.second_store_name){
                            res.data.draft.list.second_store_name='';
                        }
                        if(!!res.data.draft.list.store_name){
                            res.data.draft.list.store_name='';
                        }
                        res.data.draft.list.paypal_emailaddress='';
                        this.draftClear=true;//不使用当前站点的图片
                        this.edit_data(res.data.draft);
                    }else{//当前搜索站点下没范本
                        this.add_data(this.arr);
                    }
                }


            },
            /*history字段存在时*/
            arrangement_form2(res,params){
                let history = res.data.history;
                if(history['listing']&&history['listing']['primary_categoryid']){
                    let listing = history['listing'];
                    let primary_categoryid = listing['primary_categoryid'];
                    let second_categoryid = listing['second_categoryid'];
                    let historySpec = history['mappingspec']?Object.values(history['mappingspec']):[];
                    this.get_specifics(primary_categoryid,params.default_site_id,true).then(returnData=>{
                    /*
                    *危险区域，不要随意增删字段 Start
                    */
                        /*整理联动属性*/
                        listing.specifics.forEach(list=>{
                            if(list.custom===0){
                                let find = returnData.specificsList.find(spec=>spec.category_specific_name===list.attr_name);
                                if(find){
                                    let curObj = '';
                                    if (list.attr_value instanceof Array) {
                                        curObj = list.attr_value;
                                    } else {
                                        curObj = find.max_values > 1 ? [] : list.attr_value;
                                    }
                                    find.specific_value = curObj;
                                }
                            }else{
                                let obj = {
                                    category_specific_name: list.attr_name,
                                    specific_value: list.attr_value,
                                    custom: list.custom
                                };
                                returnData.specificsList.push(obj);
                            }
                        });
                        /*整理mappingspec数据*/
                        if(historySpec&&historySpec.length>0){
                            historySpec.forEach(spec=>{
                                let find = returnData.mappingspec.find(mapp=>mapp.channel_spec===spec.channel_spec)
                                if(!find){
                                    let curObj = {
                                        is_check: true,
                                        custom:1,
                                        channel_spec:spec.channel_spec,
                                        combine_spec:spec.combine_spec
                                    };
                                    returnData.mappingspec.push(curObj);
                                }
                            });
                        }
                        returnData.mappingspec = returnData.mappingspec.map(row=>{
                            let find = null;
                            if(historySpec&&historySpec.length>0){
                                find = historySpec.find(item=>item.channel_spec === row.channel_spec)
                            }
                            if(row.custom===1){
                                return row;
                            }else{
                                let curRow = {
                                    is_check: !!find,
                                    custom: row.custom,
                                    channel_spec: row.channel_spec,
                                    combine_spec: find?find.combine_spec:'',
                                    selection_mode: row.selection_mode||'',
                                    min_values: row.min_values||'',
                                    specific_value: row.specific_value,
                                    detail: row.detail||[],
                                    relationship: Number(row.relationship),
                                };
                                return curRow
                            }
                        });
                        let spec =  returnData.mappingspec.filter(it=>!!it.is_check);
                        /*整理表格*/
                        if(res.data.goodsSku&&res.data.goodsSku.length>0){
                            if(history['variants']&&historySpec&&historySpec.length>0){
                                let variants = history['variants'];
                                res.data.goodsSku = res.data.goodsSku.map(goods=>{
                                    this.$set(goods,'variation',[]);
                                    if(Object.keys(variants).includes(goods.sku)){
                                        let variantsValue =  variants[goods.sku];
                                        for(let i in variantsValue){
                                            let obj = {
                                                channel_spec: i,
                                                value: variantsValue[i]
                                            };
                                            goods.variation.push(obj);
                                        }
                                    }else{
                                        let specialValue = clone(Object.values(variants)[0]);
                                        for(let i in specialValue){
                                            let obj = {
                                                channel_spec: i,
                                                value: ''
                                            };
                                            goods.variation.push(obj);
                                        }
                                    }
                                    return goods
                                });
                            }
                        }
                    /*
                    *危险区域，不要随意增删字段 End
                    */

                        this.$set(this.form,'useMappingspec',spec);
                        this.$set(this.form,'mappingspec',returnData.mappingspec);
                        this.$set(this.form,'specificsList',returnData.specificsList);
                        this.$set(this.form,'primary_categoryid',primary_categoryid);
                        this.$set(this.form,'second_categoryid',second_categoryid);
                        this.$set(this.form,'primary_category_pahtname',listing.primary_category_pahtname||'');
                        this.$set(this.form,'second_category_name',listing.second_category_name||'');
                        this.$set(this.form,'variation_image',listing.variation_image||'');
                        this.$set(this.form,'variation',listing.variation);
                        this.arrangement_form(res,params)
                    })
                }else{
                    this.arrangement_form(res,params)
                }
            },
            not_publish(params) {/*新增  Listing*/
                this.$http(api_add_listing, {goods_id: params.id,site_id:params.default_site_id}).then(res => {
                    if(res.data.hasOwnProperty('history')){
                        this.arrangement_form2(res,params)
                    }else{
                        this.arrangement_form(res,params)
                    }
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },

            /*详情图前端增加isSwatch字段，用于‘生成图片’的功能*/
            add_isSwatch(val){
                // val.forEach(row=>{
                //     this.$set(row,'isSwatch',false)
                // });
                return val.map(row=>{return {path:row}});
            },
            edit_publish(id, copyData = {}) {/*编辑*/
                this.loading = true;
                this.loadingText = "玩命加载中...";
                this.$http(api_edit_listing, {id: id}).then(res => {
                    this.primary_categoryid=res.list.primary_categoryid;
                    this.draftClear=false;
                    this.edit_data(res,copyData = {})
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                    this.loading = true;
                    this.loadingText = "数据加载出错了...";
                });
            },
            edit_data(res,copyData = {}){
                let obj = {};
                // let img = [];
                // if(!!res.imgs&&res.imgs.length>0){//兼容线上拉下来的数据 path没有值的情况
                //     img = res.imgs.forEach(item=>{
                //         if(!item.path)this.$set(item,'path',item.thumb?item.thumb:'');
                //     });
                // }
                this.form.goodsInfo = res.hasOwnProperty("goods_info") ? res.goods_info : {};
                this.form.attrInfo = res.hasOwnProperty("attrInfo") ? res.attrInfo : [];
                this.form.goodsSku = res.hasOwnProperty("goodsSku") ? res.goodsSku : [];
                if (!this.isCopy) {
                    this.form.data.length = 0;
                }
                this.$set(obj, 'list', res.list);
                obj.list.comb_model_id = '';
                obj.list.mod_location = "";
                obj.list.mod_trans = "";//运费模板
                obj.list.mod_exclude = "";//不送达地区
                obj.list.mod_location = "";//商品所在地ID
                obj.list.mod_return = "";//退货ID
                obj.list.mod_refuse = "";//买家限制
                obj.list.mod_receivables = "";
                if (obj.list.primary_categoryid) {
                    this.get_compatibility_enabled(obj.list.primary_categoryid, obj.list.site, obj);
                }
                this.$set(obj, 'mappingspec', res.mappingspec);
                if(typeof res.set.payment_method==='string'){
                    res.set.payment_method=[res.set.payment_method]
                }
                this.$set(obj, 'set', res.set);
                this.$set(obj, 'varians', res.varians);
                this.$set(obj, 'imgs', this.draftClear?this.form.imgs.map(row=>{return {path:row}}):res.imgs.map(row=>{return {path:row}}));
                this.$set(obj, 'detail_imgs', this.add_isSwatch(res.detail_imgs));
                this.$set(obj, 'gd_imgs', res.gd_imgs);
                if (this.isCopy) {
                    obj.code = copyData.code;
                    obj.list.account_id = copyData.account_id;
                    obj.list.paypal_emailaddress = '';
                } else {
                    obj.code = res.list.account_name;
                }
                if (obj.set.international_shipping && obj.set.international_shipping.length > 0) {
                    obj.set.international_shipping.forEach(item => {
                        if ((item.shiptolocation instanceof Array || item.shiptolocation === null)&&item.shiptolocation[0] !== "Worldwide") {
                            item.shiptolocation = !!item.shiptolocation ? this.filter_location(item) : [];
                            this.$set(item, 'selectAll', false);
                        }
                        if (item.shiptolocation === "Worldwide"||item.shiptolocation[0] === "Worldwide") {
                            item.shiptolocation = window.clone(this.get_local(this.locationList));
                            this.$set(item, 'selectAll', true);
                        }
                    })
                }
                if (obj.set.compatibility) {
                    obj.set.compatibility = obj.set.compatibility instanceof Array ? obj.set.compatibility : JSON.parse(obj.set.compatibility);
                }
                obj.varians.forEach((row, index) => {
                    this.$set(row, 'isCheck', true);
                    /*此条件判断是否为已刊登的编辑页面
                    *编辑状态下站点/分类/已存在的sku详情不允许编辑
                    * */
                    if(this.param.curPage==='already'&&this.param.isAdd===false){
                        this.$set(row,'isDisabled',true);
                    }
                    let cloneVariation = typeof row.variation === 'string' ? JSON.parse(row.variation) : row.variation;
                    let curLine = this.form.goodsSku.find(it =>it.sku === row.v_sku);
                    if (!!curLine) {
                        this.$set(row, "sku_attributes_n", curLine.sku_attributes_n)
                    } else {
                        this.$set(row, "sku_attributes_n", {})
                    }
                    //处理表格展图
                    if(row.hasOwnProperty('path')){
                        row.path = row.path.map(row=>{
                            return {
                                path:row,
                                base_url:obj.list.base_url
                            }
                        })
                    }else{
                        this.$set(row,'path',[])
                    }
                    row.variation = [];
                    for (let i in cloneVariation) {
                        let obj = {
                            channel_spec: i,
                            value: cloneVariation[i]
                        };
                        row.variation.push(obj);
                    }
                });
                obj.list.model_cate = res.list.model_cate;
                obj.list.listing_cate = res.list.listing_cate;
                obj.list.shipping_tax = res.list.shipping_tax === 1;
                obj.list.autopay = res.list.autopay === 1;
                obj.set.local_pickup = res.set.local_pickup === 1;
                obj.set.extended_holiday = res.set.extended_holiday === 1;
                obj.set.listing_enhancement = res.set.listing_enhancement === 1;
                obj.list.restart = res.list.restart === 1;

                obj.set.buyer_requirment_details.link_paypal = obj.set.buyer_requirment_details.link_paypal === 1;
                obj.set.buyer_requirment_details.registration = obj.set.buyer_requirment_details.registration === 1;
                obj.set.buyer_requirment_details.violations = obj.set.buyer_requirment_details.violations === 1;
                obj.set.buyer_requirment_details.strikes = obj.set.buyer_requirment_details.strikes === 1;
                obj.set.buyer_requirment_details.requirements = obj.set.buyer_requirment_details.requirements === 1;
                obj.set.buyer_requirment_details.credit = obj.set.buyer_requirment_details.credit === 1;
                obj.list.timing = res.list.timing <= 0 ? "" : (res.list.timing + obj.list.time_zone) * 1000;
                obj.set.restart_invalid_time = obj.set.restart_invalid_time<=0?'':obj.set.restart_invalid_time*1000;
                const mappingspec = window.clone(obj.mappingspec);
                this.saveCategoryid=obj.list.primary_categoryid;
                this.$nextTick(() => {
                    this.$refs.logisticsForm[0].get_shipping();//调用 set-logistics.vue 页面运输方式
                    this.$refs.logisticsForm[0].get_sales_tax();//调用 set-logistics.vue 获取销售税
                    this.$refs.logisticsForm[0].get_trans_temp();//调用 set-logistics.vue 物流方式模板
                    this.$refs.returnForm[0].get_return();//调用 set-logistics.vue 获取退货模板
                    this.$refs.proceedsForm[0].get_receivablesList();//调用 proceeds.vue 收款选项
                    this.$refs.generalForm[0].get_model();//调用general-info.vue 模板组合
                    this.$refs.titlePrice[0].get_promotion();//title-price  促销设置
                    this.$refs.logisticsForm[0].edit_set_continent();
                    this.$refs.generalForm[0].get_specifics(this.saveCategoryid, obj.list.site).then(item => {
                        this.$nextTick(() => {
                            obj.specificsList.forEach((row, index) => {
                                obj.set.specifics.forEach(its => {
                                    if (its.attr_name === row.category_specific_name) {
                                        let curObj = '';
                                        if (its.attr_value instanceof Array) {
                                            curObj = its.attr_value;

                                            //判断多选是否有自定义属性 多选自定义属性显示
                                            let detailList=[];
                                            detailList= row.detail.map(value=>{
                                                return value.category_specific_value;
                                            });
                                            its.attr_value.forEach(val=>{
                                                let have = detailList.includes(val);
                                                if(have===false){
                                                    let data_ = {
                                                        category_specific_value:val,
                                                        parent_value:'',
                                                        parent_name:''
                                                    }
                                                    row.detail.push(data_)
                                                }
                                            });

                                        } else {
                                            curObj = row.max_values > 1 ? [] : its.attr_value;
                                        }
                                        row.specific_value = curObj;
                                        row.custom = its.custom;
                                    }
                                })
                            });
                            /*在范本中obj.set.specifics这个字段中会出现自定义属性，
                            *已刊登中不会出现，后端拉不到自定义属性
                            * 但刊登成功 同步后，specifics里面就不会有变体绑定的属性了
                            * */
                            let categoryName = obj.specificsList.map(res=>{
                                return res.category_specific_name;
                            });
                            obj.set.specifics.forEach(its => {
                                 if(!categoryName.includes(its.attr_name)){
                                     its.custom = 1;
                                     let curObj = {
                                         category_specific_name: its.attr_name,
                                         specific_value: its.attr_value,
                                         custom: its.custom
                                     };
                                     obj.specificsList.push(curObj);
                                 }
                            });
                            /*obj.list.v_varkey 范本/已刊登 都存在被使用的属性
                            *所以 v_varkey如果存在specificsList没有的属性，那这个属性是自定义上去的
                            * 需要手动添加到属性列表中
                            * 这里的代码起不到作用 但是又不敢轻易删
                            * */
                            if(obj.list.v_varkey){
                                let different = obj.list.v_varkey.filter(it=>{
                                    return !obj.specificsList.find(its=>its.category_specific_name===it)
                                });
                                if(!!different&&different.length>0){
                                    different.forEach(it=>{
                                        let objChild = {
                                            is_check:1,
                                            combine_spec:'',
                                            channel_spec:it
                                        };
                                        let curObj = {
                                            category_specific_name: it,
                                            specific_value: '',
                                            custom: 1
                                        };
                                        mappingspec.push(objChild);
                                        obj.specificsList.push(curObj);
                                    })
                                }
                            }
                            let specificIndex = obj.specificsList.findIndex(row => {
                                return row.custom === 1 && !row.category_specific_name && !row.specific_value;
                            });
                            if (specificIndex > -1) obj.specificsList.splice(specificIndex, 1);
                            obj.mappingspec = [];
                            obj.specificsList.forEach((row) => {
                                let value = '';
                                if (row.specific_value instanceof Array) {
                                    value = row.specific_value.length > 0 ? row.specific_value[0] : '';
                                } else {
                                    value = row.specific_value;
                                }
                                let curRow = {
                                    is_check: false,
                                    custom: row.custom,
                                    channel_spec: row.category_specific_name,
                                    combine_spec: "",
                                    selection_mode: row.selection_mode ? row.selection_mode : '',
                                    min_values: row.min_values ? row.min_values : '',
                                    specific_value: value,
                                    detail: row.detail ? row.detail : [],
                                    relationship: row.relationship ? row.relationship : '',
                                };
                                obj.mappingspec.push(curRow);
                            });
                            /*从线上拉的数据mappingspec为空，
                            *所以不能仅仅依靠mappingspec判断有哪些属性值被勾选；v_varkey多属性时一定存在
                            * */
                            if(mappingspec.length<=0&&obj.list.v_varkey){
                                obj.list.v_varkey.forEach(it=>{
                                    if(mappingspec.find(its=>its.channel_spec===it))return;
                                    let obj = {
                                        is_check:1,
                                        combine_spec:'',
                                        channel_spec:it
                                    };
                                    mappingspec.push(obj);
                                })
                            }
                            obj.mappingspec.forEach((row, index) => {
                                let cur = mappingspec.find(item => {
                                    return item.channel_spec === row.channel_spec
                                });
                                if (!!cur) {
                                    row.is_check = !!Number(cur.is_check);
                                    row.combine_spec = cur.combine_spec;
                                } else {
                                    console.log("属性映射不到");
                                }
                            });
                            let spec =  obj.mappingspec.filter(it=>!!it.is_check);
                            this.$set(obj.list,'useMappingspec',spec);
                            let findPackage = spec.find(item=>item.combine_spec ==='package');
                            if(findPackage){
                                obj.varians.forEach(items=>{
                                    let combine_sku = items.combine_sku.split(',');
                                    if(combine_sku.length>0) {
                                        let packageValue = combine_sku[0].split('*')[1];
                                        this.$set(items.sku_attributes_n, 'package', packageValue);
                                    }else{
                                        console.log('捆绑/打包销售未绑定数据');
                                    }
                                });
                            }
                        });
                    });
                    this.loading = false;
                    setTimeout(() => {
                        this.copyLoading = false;
                    }, 500);
                });
                this.form.data.push(obj);
                // console.log(this.form.data,'edit')
                if (this.form.data.length > 0) {
                    this.currentTab = this.form.data[0].code;
                    this.currentname = this.form.data[0].code;
                }
            },
            //编辑时获取商店分类链
            get_category_chain(obj,name){
                let id = name==='first'?obj.list.store_category_id:obj.list.store_category2_id;
                this.$http(api_category_chain,obj.list.account_id,id).then(res => {
                    if(!res.data)return this.$message({type:'error',message:'数据为空'});
                    if(name==='first'){
                        this.$set(obj.list,'store_name',res.data.name_chain);
                    }else{
                        this.$set(obj.list,'second_store_name',res.data.name_chain);
                    }
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            filter_location(item) {
                let cur = [];
                if (item.shiptolocation.length > 0) {
                    cur = item.shiptolocation.map(row => {
                        let curObj = this.locationList.find(res => res.Location === row);
                        if (!!curObj) return row;
                    }).filter(row => !!row);
                }
                return cur;
            },
            add_account() {
                this.addAccountDialog = true;
            },
            async add_data(arr) {/*add-account  页面上 确定 事件*/
                if (this.isCopy) {
                    arr.forEach(row => {
                        this.curCode = row;
                    });
                    let length = arr.length;
                    if (length <= 0) return;
                    let row = arr[length - 1];
                    this.edit_publish(this.param.id, row);
                } else {
                    await this.get_pricing_rules(arr,this.param.site_code,false);
                    setTimeout(() => {
                        let site = '';
                        let site_code = '';
                        let Skulen = this.form.goodsSku.length;
                        let isTrue = this.form.goodsSku && Skulen > 1;
                        let variation;
                        if(this.form.hasOwnProperty('variation')){
                            variation = this.form.variation
                        }else{
                            variation = isTrue?1:0;
                        }

                        if (this.param.default_site_id !== '') site = this.param.default_site_id;
                        if (this.param.site_code !== '') site_code = this.param.site_code;
                        arr.forEach((row, index) =>{
                            let pricingRule = this.return_pricing(row.account_id,this.form.goodsSku[0].id);
                            this.get_default_shipping(row.account_id,'service');
                            let obj = {
                                code: row.code,
                                account_id:row.account_id,
                                reference:[],
                                /*刊登基本信息*/
                                list: {
                                    assoc_order:1,
                                    useMappingspec:this.form.useMappingspec&&this.form.useMappingspec.length>0?this.form.useMappingspec:[],//前端自定义字段
                                    draft_name:'',
                                    is_virtual_send:0,
                                    account_id: row.account_id,
                                    site: site,
                                    site_code:site_code,
                                    currency: "",
                                    goods_id: this.param.id,
                                    listing_type: 1,//一口价1FixedPriceItem  拍卖2Chinese
                                    goods_type: variation? 2 : 1,
                                    timing: "",
                                    sku: !variation && Skulen > 0 ? `${this.form.goodsSku[0].sku}*1` : "",
                                    local_sku: !variation && Skulen > 0 ? this.form.goodsSku[0].sku : "",
                                    sku_id: !variation && Skulen > 0 ? this.form.goodsSku[0].id : '',
                                    spu: this.form.goodsInfo.spu || "",
                                    listing_sku: "",
                                    comb_model_id: "",
                                    primary_categoryid: this.form.primary_categoryid?this.form.primary_categoryid:'',
                                    second_categoryid: this.form.second_categoryid?this.form.second_categoryid:'',
                                    store_category_id: "",//店铺分类1   old--> store
                                    store_category2_id: "",//店铺分类2  old-->  second_store
                                    store_name: "",//todo 自定义  不用提交后端
                                    second_store_name: "",//todo  同上
                                    private_listing: 0,//是否为私人   old-->  set.individual_listing
                                    picture_gallery: 0,//   old-->  set.picture_gallery
                                    location: "",//   old--> set.location
                                    variation: variation,// old--> varions
                                    paypal_emailaddress: "",
                                    country: "",  // old-->set.country
                                    listing_duration: 1,// old-->set.listing_duration
                                    autopay: false,//  old-->set.autopay
                                    quantity: 1,// old-->set.quantity
                                    best_offer: 0, //一口价   best_offer  Set.auto_accept_price Set.minimum_accept_price 一起使用
                                    buy_it_nowprice: "",
                                    reserve_price: "",
                                    start_price: pricingRule.total_price,
                                    vat_percent: "0.00",
                                    sales_tax_state: "",
                                    sales_tax: "",
                                    shipping_tax: false,
                                    img: "",
                                    title: this.form.lang.title,
                                    sub_title: "",
                                    listing_enhancement: false, //old-->set.listing_enhancement
                                    disable_buyer: 0,//old-->set.refuse: 0,
                                    listing_cate: "",
                                    model_cate: "",
                                    promotion_id: "",
                                    mod_style: "",
                                    mod_sale: "",
                                    mod_trans: "",
                                    mod_exclude: "",
                                    mod_location: "",
                                    mod_return: "",
                                    mod_refuse: "",
                                    mod_receivables: "",//收款选项
                                    draft: 0,
                                    replen: 1,// old-->set.replen,
                                    restart: false, //  old-->set.restart: false,
                                    return_time: "",//  old-->set.return_time
                                    dispatch_max_time: '',//  old-->set.choice_date: "",
                                    is_translated:0,//0：未翻译过，1：已翻译过

//                                -----------------------  我是分割线  ----------------------- 分割线以上为18-12-19日更新的字段
                                    channel_id: this.form.channel_id || '',
                                    primary_category_pahtname: this.form.primary_category_pahtname||'',
                                    second_category_name: this.form.second_category_name||'',
                                    condition: "1000",
                                },
                                imgs: clone(this.form.imgs).map(res=>{return {path:res}}) || [/*sku base_url path thumb main_de*/],
                                detail_imgs: [/*sku path thumb*/],
                                /*基本设置*/
                                set: {
                                    compatibility: [],
                                    item_compatibility_enabled: 0,//判断页面是否显示OE信息
                                    compatibility_count: "",
                                    variation_image: this.form.variation_image,
                                    postal_code: "",
                                    local_pickup: false,
                                    auto_accept_price: "",
                                    minimum_accept_price: "",
                                    upc: "Does not apply",// old-->list.upc
                                    custom_exclude: 1,
                                    exclude_location: "",// old-->exclude
                                    international_shipping:this.get_internat_shipping(row.account_id,site_code),
                                    shipping: [//国内运输方式
                                        {
                                            shipping_service: this.get_default_shipping(row.account_id,site_code,'service'),
                                            shipping_service_cost: this.get_default_shipping(row.account_id,site_code,'cost'),
                                            shipping_service_additional_cost: "",
                                            extra_cost: "",
                                        }
                                    ],
                                    payment_method: ['PayPal'],
                                    payment_instructions: "",
                                    return_policy: "",
                                    return_type: "",
                                    extended_holiday: false,//extension
                                    return_shipping_option: "",
                                    restocking_fee_code: "",
                                    return_description: "",
                                    buyer_requirment_details:
                                        {
                                            link_paypal: false,//old-->set.link_paypal: false,
                                            registration: false,//old-->set.registration
                                            violations: false,//old-->set.violations
                                            violations_count: "",//old-->set.violations_count
                                            violations_period: "",//old-->set.violations_period: "",
                                            strikes: false,//old-->set.strikes
                                            strikes_count: "",//old-->set.strikes_count: "",
                                            strikes_period: "",//old-->set.strikes_period: "",
                                            requirements: false,//old-->set.requirements: false,
                                            requirements_max_count: "",//old-->set.requirements_max_count: "",
                                            credit: false,//old-->set.credit: false,
                                            requirements_feedback_score: "",//old-->set.requirements_feedback_score: "",
                                            minimum_feedback: "",//old-->set.minimum_feedback: false,
                                            minimum_feedback_score: "",//old-->set.minimum_feedback_score: "",
                                        }
                                    ,
                                    restart_rule: 1,
                                    restart_way: 1,
                                    restart_time: "",
                                    restart_invalid_time:"",
                                    restart_count: "",
                                    specifics: [],
                                    description: this.form.lang.description,//old-->list.description
                                    mobile_desc: "",
                                    condition_id: 1000,
                                    condition_description: '',
                                },
                                /*多属性子产品信息*/
                                varians: [],
                                /*属性映射*/
                                mappingspec: this.form.mappingspec?this.form.mappingspec:[],
                                /*联动属性*/
                                specificsList:this.form.specificsList?this.form.specificsList:[],
                            };
                            this.$nextTick(() => {
                                //拍卖
                                this.form.goodsSku.forEach(item => {
                                    let skuPriceObj = this.return_pricing(row.account_id,item.id);
                                    //一口价 展示sku模块
                                    let curObj = {
                                        sku_id: item.id,
                                        isCheck: true,
                                        v_sku: item.sku,
                                        combine_sku: `${item.sku}*1`,
                                        v_price: skuPriceObj.total_price||'',
                                        v_qty: "",
                                        variation: item.variation||[],
                                        sku_attributes_n: item.sku_attributes_n,
                                        path: item.path? [{path:item.path,base_url:this.comBaseUrl}] : [],
                                        upc: "Does not apply",
                                        ean: "Does not apply",
                                        isbn: "Does not apply",
                                    };
                                    if (item.map_sku instanceof Object) {
                                        curObj.map_sku = [item.map_sku]
                                    } else {
                                        curObj.map_sku = [];
                                    }
                                    if(this.form.useMappingspec&&this.form.useMappingspec.length>0){
                                       let findPackage = this.form.useMappingspec.find(useMap=>useMap.combine_spec ==='package');
                                        if(findPackage){
                                            let combine_sku = curObj.combine_sku.split(',');
                                            if(combine_sku.length>0) {
                                                let packageValue = combine_sku[0].split('*')[1];
                                                this.$set(curObj.sku_attributes_n, 'package', packageValue);
                                            }else{
                                                console.log('捆绑/打包销售未绑定数据');
                                            }
                                        }
                                    }
                                    obj.varians.push(curObj);
                                });
                            });
                            this.form.data.push(obj);
                        });
                        let length = this.form.data.length;
                        if (!!length) {
                            this.currentTab = this.form.data[length - 1].code;
                            this.currentname = this.form.data[length - 1].code;
                        }
                        setTimeout(() => {
                            this.copyLoading = false;
                        }, 500);
                    },4000)
                }
            },
            return_pricing(accontId,skuId){
                let price = {};
                if(accontId&&skuId){
                    if(this.allPricing[accontId]&&this.allPricing[accontId][skuId]&&this.allPricing[accontId][skuId].total_price!==undefined){
                        price =  this.allPricing[accontId][skuId];
                    }
                }
                return price
            },
            can_change_Price(accontId,skuId,newPrice,isTip){
                let price = {};
                if(this.allPricing[accontId]&&this.allPricing[accontId][skuId]&&this.allPricing[accontId][skuId].total_price!==undefined){
                    price =  this.allPricing[accontId][skuId];
                }
                let numNewPrice = parseFloat(newPrice);
                let numTotalPrice = parseFloat(price.total_price);
                let priceDifference = numNewPrice > numTotalPrice?(numNewPrice-numTotalPrice):(numTotalPrice-numNewPrice);
                if(parseFloat(price.reduction)&&priceDifference>parseFloat(price.reduction)){
                    if(isTip)this.$message({type:'warning',message:`增加或减少的金额不能超过原刊登价格的${price.reduction}`});
                    return parseFloat(price.total_price);
                }else{
                    return newPrice;
                }
            },
            submit_product(index,val){
                let account_id = this.form.data[index].account_id;
                let pricingRule = this.return_pricing(account_id,val.id);
                this.form.data[index].list.start_price = pricingRule.total_price;
            },
            get_default_shipping(accountId,siteCode,name){
                /*国内运输方式
                * 如果有‘EUB运费’，需要同时把默认运输方式‘Standard Shipping from Outside US’选择出来
                * 如果是US站点，获取的sku列表上只要一个有EUB费用的，首件运费就默认为：1.59
                * */
                if(!accountId||!this.allPricing[accountId])return '';
                let find = Object.values(this.allPricing[accountId]).find(row=>{
                    return row.shipping_fee_EUB&&parseFloat(row.shipping_fee_EUB)>0
                });
                if(!find) return '';
                switch (name){
                    case 'service':
                        return 'StandardShippingFromOutsideUS';
                    case 'cost':
                        return siteCode==='US'?find.shipping_fee_EUB:'';
                }
            },
            get_internat_shipping(accountId,siteCode){
                /*国际运输方式 默认无数据
                * 非US站点，如果有‘国际运费’，需要同时把‘国际运费’填写到‘首件运费’&&‘续件运费’上
                * */
                if(!accountId||!this.allPricing[accountId]||siteCode==='US')return [];
                let list = [];
                let sum = 0;
                let findList = Object.values(this.allPricing[accountId]).filter(row=>{
                    return row.shipping_fee_nternational&&parseFloat(row.shipping_fee_nternational)>0
                });
                if(findList.length>0){
                    findList.forEach(row=>{
                        sum += parseFloat(row.shipping_fee_nternational)
                    });
                    let average = parseFloat(sum/findList.length).toFixed(2);
                    list = [{
                        selectAll:false,
                        shipping_service:"",
                        shipping_service_cost:average,
                        shipping_service_additional_cost:average,
                        shiptolocation:this.get_local(this.locationList),
                    }]
                }
                return list;
            },
            async get_pricing_rules(account,site,isChangeSite){
                let skuList =  this.form.goodsSku.map(row=>row.id);
                if(isChangeSite){
                    if(!account) return this.$message({type:'warning',message:'计算刊登定价找不到相对应的账号id'});
                    let params = {
                        channel_id:1,
                        account_id:account,
                        site_code:site,
                        sku_id:skuList,
                    };
                    let pricing = await this.$http(api_pricing_rules,params);
                    this.allPricing[account] = pricing;
                }else{
                    if(account.length<=0)return this.$message({type:'warning',message:'尚未添加任何账号'});
                    account.forEach(async row=>{
                        let params = {
                            channel_id:1,
                            account_id:row.account_id,
                            site_code:site,
                            sku_id:skuList,
                        };
                        let pricing = await this.$http(api_pricing_rules,params);
                        this.allPricing[row.account_id] = pricing;
                    });
                }
            },
            change_site_pricing(obj,siteCode){
                let skuId = '';
                if(obj.varians&&obj.varians.length){
                    skuId  = obj.varians[0].sku_id;
                    obj.varians.forEach(row=>{
                        let skuObj = this.return_pricing(obj.account_id,row.sku_id);
                        row.v_price = skuObj.total_price?skuObj.total_price:'';
                    });
                }
                if(obj.list.sku_id)skuId = obj.list.sku_id;
                let startPriceObj = this.return_pricing(obj.account_id,skuId);
                obj.list.start_price = startPriceObj.total_price?startPriceObj.total_price:'';

                if(obj.set.shipping&&obj.set.shipping.length>0){
                    obj.set.shipping[0].shipping_service =  this.get_default_shipping(obj.account_id,siteCode,'service');
                    obj.set.shipping[0].shipping_service_cost =   this.get_default_shipping(obj.account_id,siteCode,'cost');
                }else{
                    obj.set.shipping = [//国内运输方式
                        {
                            shipping_service: this.get_default_shipping(obj.account_id,siteCode,'service'),
                            shipping_service_cost: this.get_default_shipping(obj.account_id,siteCode,'cost'),
                            shipping_service_additional_cost: "",
                            extra_cost: "",
                        }
                    ]
                }

                if(obj.set.international_shipping&&obj.set.international_shipping.length>0&&siteCode!=='US'){
                    let findList = Object.values(this.allPricing[obj.account_id]).filter(row=>{
                        return row.shipping_fee_nternational&&parseFloat(row.shipping_fee_nternational)>0
                    });
                    let sum = 0;
                    if(findList.length>0){
                        findList.forEach(row=>{
                            sum += parseFloat(row.shipping_fee_nternational)
                        });
                        let average = parseFloat(sum/findList.length).toFixed(2);
                        obj.set.international_shipping[0].shipping_service_cost = average;
                        obj.set.international_shipping[0].shipping_service_additional_cost = average;
                    }
                }else{
                    obj.set.international_shipping = this.get_internat_shipping(obj.account_id,siteCode);
                }
            },
            handle_tabs_edit(val, action) {/*关闭 选项卡*/
                if (action === "remove") {
                    let cur = this.form.data.findIndex(row => {
                        return row.code === val
                    });
                    if (cur > -1) this.form.data.splice(cur, 1);
                    let length = this.form.data.length;
                    if (!!length) {
                        this.currentTab = this.form.data[length - 1].code;
                        this.currentname = this.form.data[length - 1].code;
                    }
                }
            },
            tab_click(val) {/*点击选项卡*/
            },
            async change_site(index, val) {//一般信息页面  更改站点
                let data = JSON.stringify(clone(this.form));
                sessionStorage.setItem(this.form.goodsInfo.spu+this.form.data[0].list.site,data)
                this.$refs.logisticsForm[index].get_shipping();
                this.$refs.logisticsForm[index].get_sales_tax();
                this.$refs.logisticsForm[index].get_trans_temp();
                this.$refs.returnForm[index].get_return();
                this.$refs.proceedsForm[index].get_receivablesList();
                this.$refs.generalForm[index].get_model();
                this.$refs.skuSettings[index].change_Price_parities();
                if(this.param.curPage==='notYet'){
                  await this.get_pricing_rules(this.form.data[index].list.account_id,val.abbreviation,true);
                  this.change_site_pricing(this.form.data[index],val.abbreviation);
                }
            },
            change_account(val) {//此操作相当于将各个模块重新 mounted
                let cur = this.accounts.find(row => row.code === val);
                if (!cur) return;
                this.form.data[0].list.account_id = cur.account_id;
                this.$nextTick(() => {
                    this.$refs.logisticsForm[0].get_shipping();
                });
                this.form.data[0].list.paypal_emailaddress = '';
                this.currentTab = this.form.data[0].code;
                this.currentname = this.form.data[0].code;
            },
            change_specific(item,index) {//一般信息页面  自定义属性失去焦点
                this.$refs.skuSettings[index].get_mappingspec(item.specificsList);
            },
            delete_new_specific(item,index,value){
                this.$refs.skuSettings[index].delete_mappingspec(value);
            },
            get_ebay_countrys() { /*获取Ebay国家代码 适用于商品所在地*/
                this.$http(api_get_countrys).then(res => {
                    this.countryList = res.data;
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                });
            },
            get_ebay_locations() {/*获取国家代码  适用于物流设置*/
                this.$http(api_get_locations).then(res => {
                    this.locationList = res.data;
                    this.location = res.data.map(row => row.Location);
                }).catch(code => {
                    this.$message({type: "error", message: code.message || code});
                })
            },
            translate_cur(){
                let find = this.form.data.filter(row=>this.currentname === row.code);
                let params = this.arrange_translate_data(find);
                this.$http(api_translate_batch,{data:params}).then(res => {
                    this.$message({type:'success',message:'翻译成功'});
                    this.write_back(res.data);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('translateCur',false);
                })
            },
            translate_all(){
                let list = this.form.data.filter(row=>!row.list.is_translated);
                let params = this.arrange_translate_data(list);
                this.$http(api_translate_batch,{data:params}).then(res => {
                    this.$message({type:'success',message:'翻译成功'});
                    this.write_back(res.data);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.$reqKey('translateAll',false);
                })
            },
            arrange_translate_data(list){
               return list.map(row=>{
                    let string = {};
                    row.specificsList.filter(item=>item.custom===1).forEach(item=>{
                        if(item.specific_value) string[item.category_specific_name] = item.specific_value
                    });
                    row.list.useMappingspec.filter(item=>item.custom===1).forEach(item=>{
                        row.varians.forEach((it,index)=>{
                            let find = it.variation.find(its=>its.channel_spec===item.channel_spec);
                            if(find) string[`${index}-${item.channel_spec}`] = find.value
                        });
                    });
                    string['description'] = row.set.description;
                    string['title'] = row.list.title;
                    string['sub_title'] = row.list.sub_title;
                    return {
                        code:row.code,
                        site:row.list.site,
                        strings:string,
                    }
                });
            },
            write_back(list){
                list.forEach(row=>{
                    let find = this.form.data.find(res=>res.code===row.code);
                    if(find){
                        this.$set(find.list,'is_translated',1);
                        find.list.title = row.strings.title;
                        find.list.sub_title = row.strings.sub_title;
                        find.set.description = row.strings.description;
                        Object.keys(row.strings).filter(res=>res.includes('-')).forEach(item=>{
                            let i = item.split('-')[0];
                            let channel_spec = item.split('-')[1];
                            let findSpec = find.varians[i].variation.find(its=>its.channel_spec===channel_spec);
                            if(findSpec) findSpec.value = row.strings[item];
                        });
                        Object.keys(row.strings).filter(res=>{
                            return res!=='title'&&res!=='sub_title'&&res!=='description'&&!res.includes('-');
                        }).forEach(item=>{
                            let findCate = find.specificsList.find(its=>its.category_specific_name===item);
                            if(findCate)findCate.specific_value = row.strings[item];
                        })
                    }
                });
            },
            detection_kd() {/*检测刊登费*/
                let cur = this.public_params(false, false);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('getListingFee',false);
                return this.$http(api_get_listing_fee,cur).then(res => {
                    this.expenseData = res.data;
                    this.expenseDialog = true;
                    this.isChange = false;
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: "error",message: code.message || code});
                }).finally(()=>{
                    this.$reqKey('getListingFee',false)
                })
            },
            submit_draft(cur){//另存为范本API
                let data = {
                    listing_id:this.saveDraft.listId,
                    goods_id:this.param.goods_id,
                    site_id:this.saveDraft.itemId
                };
                this.$http(api_save_ebay_draft, this.saveDraft.listId.length>0?data:cur).then(res => {
                    this.clear_timer();
                    if(!!res.message){
                        this.$message({type: 'success',message:res.message});
                    }else {
                        this.saveDraft.listId=res.data[0].id;
                        this.$message({type: 'success',message:'另存范本成功'});
                    }

                    console.log(res.message,'message')
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(()=>{
                    this.$reqKey('saveDraft',false)
                })
            },
            save_draft(){//共享范本
                let cur = this.public_params(false, true);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('saveDraft',false);
                let name = "";
                this.param.siteList.forEach(row =>{
                    if(this.saveDraft.itemId === row.id){
                        name = row.label;
                    }
                });
                if(this.draft_site.includes(this.saveDraft.itemId)){
                    this.$confirm(`该spu在${name}站点下已存在范本，继续保存将覆盖原数据，是否继续？`, this.$t('ebay-list.tips'), {
                        confirmButtonText: this.$t('common.go'),
                        cancelButtonText: this.$t('common.cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.submit_draft(cur)
                    }).catch(()=>{
                        this.$reqKey('saveDraft',false);
                        this.$message({type: 'info',message:this.$t('ebay-list.Cancelled')});
                    });
                }else {
                    this.submit_draft(cur)
                }


            },
            save_as() {/*另存为*/
                let cur = this.public_params(false, true);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('saveAs',false);
                this.$http(api_save_listing, cur).then(res => {
                    this.clear_timer();
                    res.data.forEach(val=>{
                        this.saveDraft.listId=val.id;
                        let find = this.form.data.find(row=>row.list.account_id===val.account_id);
                        if(!!find) this.$set(find.list,'id',val.id);
                    });
                    this.$message({
                        type: "success",
                        message: '另存成功！'
                    });
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(()=>{
                    this.$reqKey('saveAs',false)
                })
            },
            update() { /*保存*/
                let cur = this.public_params(true, true);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('update',false);
                return this.$http(api_save_listing, cur).then(res => {
                    this.isChange = false;
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    });
                }).finally(()=>{
                    this.$reqKey('update',false)
                })
            },
            relist_itm() {//立即重上
                return this.$http(api_relist_itm, {ids: this.param.id}).then(res => {
                    this.$message({type: 'success', message: '操作成功' });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                }).finally(()=>{
                    this.$reqKey('relistItm',false)
                })
            },
            kd_terrace_template() {//已刊登
                let cur = {};
                cur = this.public_params(true, false);
                if (cur.hasOwnProperty("validate") && cur.validate === false) return this.$reqKey('terraceTemplate',false);
                return this.$http(api_cDraft_listing, cur).then(res => {
                    this.isChange = false;
                    this.$message({
                        type: "success",
                        message: res.message || res
                    });
                    return Promise.resolve();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(()=>{
                    this.$reqKey('terraceTemplate',false)
                })
            },
            apply_all() {//应用到所有
                let templateData = this.form.data.find(row => {
                    return row.code === this.currentname
                });

                this.form.data.forEach((row, index) => {
                    if (row.code !== this.currentname) {
                        const cloneCode = row.code;
                        const cloneAccountId = row.list.account_id;
                        const clonePaypal = row.list.paypal_emailaddress;
                        const cloneCombId = row.list.comb_model_id;
                        row.list.site = templateData.list.site;
                        this.$nextTick(() => {
                            Object.assign(row, window.clone(templateData));
                            row.list.timing = templateData.list.timing;//站点定时刊登
                            row.set.restart_time = templateData.set.restart_time;//重上时间
                            row.specificsList = templateData.specificsList;
                            row.code = cloneCode; //当前账号
                            row.list.comb_model_id = cloneCombId;//引用模块组合
                            row.list.account_id = cloneAccountId;//账号id
                            row.list.paypal_emailaddress = clonePaypal;//paypal账号
                            // this.blur_price(index);
                            this.$message({type: "success", message: "应用成功！"})
                        });
                    }
                });
            },
            preview() { /*预览*/
                console.log("预览");
            },
            cancel() { /*取消*/
                if (this.isChange) {
                    return this.$confirm(`您的页面有更改尚未保存，确认离开此页面吗？`, '提示', {
                        confirmButtonText: this.$t('common.confirm'),
                        cancelButtonText: this.$t('common.cancel'),
                        type: 'warning'
                    }).then(() => {
                        this.$close('/add-listing');
                    }).catch(code => {
                        return false
                    })
                } else {
                    this.$close('/add-listing');
                }

            },
            get_compatibility_enabled(primary_categoryid, site, row) {
                let params = {
                    site_id:site,
                    query:primary_categoryid,
                    account_id:row.list.account_id,
                };
                this.$http(api_suggested_categories, params).then(res => {
                    if (res.data && res.data.length > 0) {
                        this.$set(row.set, 'item_compatibility_enabled', res.data[0].item_compatibility_enabled);
                    } else {
                        console.log("暂无数据");
                    }
                }).catch(code => {
                    console.log(`api_suggested_categories接口${code}`);
                })
            },
            public_params(needId, needDraft) { /*刊登参数 公用*/
                let cloneForm = window.clone(this.form);
                let validate = true;
                let params = {};
                cloneForm.data.forEach((item, index) => {
                    if (!needId) {
                        if (item.list.hasOwnProperty('id')) {
                            delete item.list.id;
                        }
                    }
                    // if(needDraft&&item.list.draft_name===''){
                    //     validate = false;
                    //     return this.$message({type: "warning", message: `【${item.code}】账号，当存为范本时，范本名称必填！`});
                    // }
                    if (item.list.variation === 1) {
                        let cur = item.mappingspec.find(row => !!row.is_check);
                        if (!cur) {
                            validate = false;
                            return this.$message({type: "warning", message: `【${item.code}】账号，请至少为多属性产品添加一个属性`})
                        }
                    }
                    if (item.list.site === "") {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【平台站点】为必填项，请完善*标必填数据！`})
                    }

                    if (!item.list.primary_categoryid) {  //【提交时】后端不要分类名称字段primary_category_pahtname
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,刊登分类【第一分类】 为必填项，请完善*标必填数据！`})
                    }
                    delete item.list.primary_category_pahtname;
                    delete item.list.second_category_name;

                    if (!item.set.upc) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【UPC】为必填项，请完善*标必填数据！`})
                    }

                    if (!item.set.condition_id) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【物品状况】为必填项，请完善*标必填数据！`});
                    }
                    if(!!item.specificsList){
                        item.specificsList.forEach(spec=>{
                            if(!!spec.min_values&&spec.specific_value.length<=0){
                                validate = false;
                                return this.$message({type: "warning", message: `【${item.code}】账号,【${spec.category_specific_name}】为必填项，请完善*标必填数据！`});
                            }
                        });
                    }

                    if (!item.list.title) {
                        validate = false;
                        return this.$message({type: "warning", message:`【${item.code}】账号,【刊登标题】为必填项，请完善*标必填数据！`})
                    } else if (item.list.title.length > 80) {
                        validate = false;
                        return this.$message({type: "warning", message:`【${item.code}】账号,【刊登标题】最长输入80个字符，目前已超出，请修改！`})
                    }

                    if (!item.list.quantity) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【数量】为必填项，请完善*标必填数据！`})
                    }
                    if (!item.list.listing_duration) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【上架时间】为必填项，请完善*标必填数据！`});
                    }

                    if (item.list.listing_type === 2 && !item.list.start_price) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【拍卖底价】为必填项，请完善*标必填数据！`});
                    }
                    if (item.list.listing_type === 2 && item.list.start_price && parseFloat(item.list.start_price) < 0.01) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【拍卖底价】要求大于或等于0.01`});
                    }
//                    if (item.list.listing_type === 2 && !item.list.reserve_price) {
//                        validate = false;
//                        return this.$message({type: "warning", message: `【${item.code}】账号,【保底拍卖价】为必填项，请完善*标必填数据！`});
//                    }

//                    if (item.list.listing_type === 2 && !parseFloat(item.list.buy_it_nowprice)) {
//                        validate = false;
//                        return this.$message({type: "warning", message: `【${item.code}】账号,【一口价】为必填项，请完善*标必填数据！`});
//                    }
                    if (item.list.listing_type === 2 && parseFloat(item.list.buy_it_nowprice) && parseFloat(item.list.buy_it_nowprice) < 0.01) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【一口价】要求大于或等于0.01`});
                    }
                    if (item.list.listing_type === 1 && item.list.variation === 0 && (!parseFloat(item.list.start_price) || parseFloat(item.list.start_price) < 0.99)) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【一口价】要求必填且大于0.99`})
                    }
                    if (item.list.listing_type === 1 && !!parseFloat(item.list.start_price) && parseFloat(item.list.start_price) < 0.99) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【一口价】要求大于或等于0.99`});
                    }
                    if (item.list.best_offer === ""&&item.list.variation === 0) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【接受买家还价】必填项，请完善*标必填数据！`});
                    }
                    if (item.imgs.length <= 0) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【刊登图片】至少添加一张，请完善*标必填数据！`});
                    }
                    if (!item.set.description) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【详情描述】为必填项，请完善*标必填数据！`});
                    }
                    if (!item.list.location) {
                        validate = false;
                        return this.$message({type: "warning", message:`【${item.code}】账号,【商品所在地】为必填项，请完善*标必填数据！`});
                    }
                    if (!item.list.country) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【国家】为必填项，请完善*标必填数据！`});
                    }
                    if (item.set.return_policy === "") {
                        validate = false;
                        return this.$message({type: "warning", message:`【${item.code}】账号,【接受退货】为必填项，请完善*标必填数据！`});
                    }
                    if (!item.set.return_type) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【接受退货方式】为必填项，请完善*标必填数据！`});
                    }
                    if (!item.list.return_time) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【接受退货周期】为必填项，请完善*标必填数据！`});
                    }
                    if(item.list.disable_buyer){//买家限制 不允许以下买家购买我的商品
                        let vild = (item.set.buyer_requirment_details.strikes&&(!item.set.buyer_requirment_details.strikes_count||!item.set.buyer_requirment_details.strikes_period))
                                    ||(item.set.buyer_requirment_details.violations&&(!item.set.buyer_requirment_details.violations_count||!item.set.buyer_requirment_details.violations_period))
                                    ||(item.set.buyer_requirment_details.credit&&!item.set.buyer_requirment_details.minimum_feedback)
                                    ||(item.set.buyer_requirment_details.requirements&&(!item.set.buyer_requirment_details.requirements_max_count||!item.set.buyer_requirment_details.requirements_feedback_score))

                        if(vild){
                            validate = false;
                            return this.$message({type: "warning", message: `【${item.code}】账号,【买家限制】勾选项为必选，请补充完整！`});
                        }

                    }
                    if (!item.list.paypal_emailaddress) {
                        validate = false;
                        return this.$message({type: "warning", message: `【${item.code}】账号,【paypal 账号】为必填项，请补充完整！`});
                    }
                    if (item.list.listing_type === 1 && item.list.variation === 1) {//一口价多属性
                        item.mappingspec=item.mappingspec.filter(res=>{
                            delete res.detail;
                            return !!res.is_check
                        });
                        item.list.useMappingspec.forEach(res=>{
                            delete res.detail;
                        });
                        let validateVar=[];

                        item.varians = item.varians.map(row => {
                            row.path = row.path.map(val=>val.path);
                            let curVariation = window.clone(row.variation);
                            row.variation = {};
                            curVariation.forEach(val => {
                                if (val.value === "") {
                                    validate = false;
                                    return this.$message({
                                        type: "warning",
                                        message: `【${item.code}】账号,SKU设置 新增属性 需要填写属性值，请完善`
                                    });
                                }
                                row.variation[val.channel_spec] = val.value;
                            });


                            if(validateVar.includes(curVariation.map(v=>{return v.value}).join(','))){
                                validate = false;
                                return this.$message({
                                    type: "warning",
                                    message: `【${item.code}】账号,存在两条属性完全相同的变体,请修改`
                                });
                            }

                            validateVar.push(curVariation.map(v=>{return v.value}).join(','));
                            delete row.isDisabled;
                            return row;

                        });

                        if (item.varians.find(row => !parseFloat(row.v_price))) {
                            validate = false;
                            return this.$message({type: "warning", message:`【${item.code}】账号,SKU设置【销售价】为必填项`});
                        }

                        if(item.varians.find(row=>row.path.length>12)){
                            validate = false;
                            return this.$message({type: "warning", message: `【${item.code}】账号,SKU设置【展图】最多12张，现已超出，请修改。`});
                        }
                        if (item.varians.find(row => row.v_qty==='')) {
                            validate = false;
                            return this.$message({type: "warning", message: `【${item.code}】账号,SKU设置【销售数】为必填项`});
                        }
                    } else {


                        if (!item.list.sku) {
                            validate = false;
                            return this.$message({type: "warning", message: `【${item.code}】账号,【本地sku】为必填项，请完善*标必填数据！`});
                        }
                        //单属性时多传一个sku_id
                        let find= this.form.goodsSku.find(res=>{
                            return res.sku===item.list.local_sku;
                        });
                        if(find)item.list.sku_id = find.id;

                        if (!item.list.local_sku) {
                            validate = false;
                            return this.$message({type: "warning", message:`【${item.code}】账号,【捆绑/打包销售】为必填项，请完善*标必填数据！`});
                        }

                        delete item.mappingspec;
                        delete item.varians;
                    }
                    item.set.extended_holiday = item.set.extended_holiday ? 1 : 0;
                    item.list.restart = item.list.restart ? 1 : 0;
                    item.list.listing_enhancement = item.list.listing_enhancement ? 1 : 0;
                    item.list.shipping_tax = item.list.shipping_tax ? 1 : 0;
                    item.list.img = item.imgs.length > 0 ? this.main_pic(item.imgs[0]) : '';
                    item.imgs = item.imgs.length > 12 ? item.imgs.splice(0, 12).map(v=>v.path) : item.imgs.map(v=>v.path);
                    item.detail_imgs = item.detail_imgs.length>20?item.detail_imgs.splice(0,20).map(v=>v.path):item.detail_imgs.map(v=>v.path);

                    item.set.buyer_requirment_details.link_paypal = item.set.buyer_requirment_details.link_paypal ? 1 : 0;
                    item.set.buyer_requirment_details.registration = item.set.buyer_requirment_details.registration ? 1 : 0;
                    item.set.buyer_requirment_details.violations = item.set.buyer_requirment_details.violations ? 1 : 0;
                    item.set.buyer_requirment_details.requirements = item.set.buyer_requirment_details.requirements ? 1 : 0;
                        // it.minimum_feedback = it.minimum_feedback ? 1 : 0;
                    item.set.buyer_requirment_details.strikes = item.set.buyer_requirment_details.strikes ? 1 : 0;
                    item.set.buyer_requirment_details.credit = item.set.buyer_requirment_details.credit ? 1 : 0;

                    let curTime = new Date(this.form.data[index].list.timing);
                    item.list.timing = datef('YYYY-MM-dd HH:mm:ss', (curTime.getTime() / 1000 - item.list.time_zone));

                    let invalid_time = new Date(item.set.restart_invalid_time).getTime()/1000;
                    item.set.restart_invalid_time = datef('YYYY-MM-dd',invalid_time);
                    item.list.draft_id = item.set.id?item.set.id:0;//用于后端检测范本来源
                    item.list.draft = 0;//始终为0
                    item.set.international_shipping.forEach((row) => {
                        if (row.shiptolocation && (row.shiptolocation.length === this.get_local(this.locationList).length)) {
                            row.shiptolocation = ["Worldwide"];
                        }
                        delete row.selectAll;
                    });
                    /*根据分类提交OE信息*/
                    if (item.set.item_compatibility_enabled) {
                        item.set.compatibility_count = item.set.compatibility.length;
                    }
                    item.set.specifics = [];
                    item.specificsList.forEach(row => {
                        let obj = {
                            attr_name: row.category_specific_name,
                            attr_value: row.specific_value,
                            custom: row.custom,
                        };
                        item.set.specifics.push(obj);
                    });
                    delete item.specificsList;
                    delete item.gd_imgs;
                });
                if (!validate) {
                    params.validate = validate;
                } else {
                    this.saveDraft.itemId=cloneForm.data[0].list.site;
                    params.data = JSON.stringify(cloneForm.data);
                }

                return params;
            },
            main_pic(item) {
                let blob = item.path.includes("blob:");
                let http = item.path.includes("http");
                if (blob || http) {
                    return item.path;
                } else {
                    return `${this.comBaseUrl}${item.path}`;
                }
            },
            get_account() {
                this.$http(api_ebay_account).then(res => {
                    this.accountList = res;
                }).catch(code => {
                    console.log("code", code);
                })
            },
        },
        components: {
            totrDialog:require('../../../ymx/totr-dialog').default,
            addAccount: require('./add-account.vue').default,
            generalInfo: require('./general-info.vue').default,//基本信息
            titlePrice: require('./title-price.vue').default,//标题与价格
            skuSettings: require('./sku-settings.vue').default,//sku设置
            pictureDes: require('./picture-des.vue').default,//照片与描述
            setLogistics: require('./set-logistics.vue').default,//物流设置
            location: require('./location.vue').default,//商品所在地
            returnData: require('./return-data.vue').default,//退货，
            refuse: require('./refuse.vue').default,//买家限制，
            replenish: require('./replenish.vue').default,//补充与重上规则，
            proceeds: require('./proceeds.vue').default,//收款选项，
            others: require('./others.vue').default,//其他，
            expenseDetection: require('./expense-detection.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
            fanserightDialog:require("../not-yet/fanseright-dialog").default,
        }
    }
</script>

