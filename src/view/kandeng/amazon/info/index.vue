<template>
    <page class="over-flow-auto" v-loading="loading" :element-loading-text="$t('ymx-detail.loading')">
        <relevance-goods @add-account="add_account"
                         :show-btn="param.curPage?param.curPage:''"
                         :form="form"></relevance-goods>
        <el-tabs type="border-card"
                 class="mt-sm"
                 :editable="param&&(param.curPage==='not'||param.curPage==='copy'||param.curPage==='draft')"
                 :active-name="currentTab"
                 v-model="currentname"
                 @edit="handle_tabs_edit"
                 v-if="form.data&&form.data.length>0">
            <el-tab-pane
                v-for="(item, index) in form.data"
                :label="item.code"
                :name="item.code"
                :key="`${item.code}-${index}`">
                <div v-show="currentname===item.code">
                    <account-tab-base ref="tab_base"
                                      :referable-num="referableNum"
                                      :curPage="param.curPage"
                                      :label-width="labelWidth"
                                      @quote-model="quote_model(index,$event)"
                                      @quote-old="quote_old(index)"
                                      @reload-product-templat="reload_product_templat"
                                      @category-submit="category_submit(index,$event)"
                                      :form="item"></account-tab-base>
                    <account-tab-title-des ref="title_des"
                                           :editId="index"
                                           :curPage="param.curPage"
                                           :label-width="labelWidth"
                                           :form="item"></account-tab-title-des>
                    <account-tab-sku-set ref="sku_set"
                                         :profit="param.profit"
                                         :label-width="labelWidth"
                                         @get-variation-list="get_variation_list(item,$event)"
                                         :form="item"></account-tab-sku-set>
                    <account-tab-describ :edit-id="index"
                                         :rondom="param.curPage==='not'"
                                         :label-width="labelWidth"
                                         :form="item"></account-tab-describ>
                </div>
            </el-tab-pane>
        </el-tabs>
        <accounts v-model="accountVisible"
                  :accounts="accountList"
                  :col-publish="false"
                  curChannel="Amazon"
                  @select-row="select_row"
                  @select-all="select_all"
                  @selected="assign_info"></accounts>
        <div class="page-fixed">
            <request-button reqKey="useAll" :mintime="comMinTime" :timeout="comTimeOut"
                            v-if="(param.curPage==='not'||param.curPage==='copy'||param.curPage==='draft')&&form.data.length>1"
                            @click="use_all">{{$t('ymx-detail.applyAll')}}
            </request-button>
            <request-button reqKey="syncUpc" :mintime="comMinTime" :timeout="comTimeOut"
                            v-if="(param.curPage==='not'||param.curPage==='copy'||param.curPage==='draft')&&form.data.length>1"
                            @click="sync_upc">{{$t('ymx-detail.synUpc')}} & PartNumber
            </request-button>
            <request-button :req-key="`translate${currentname}`"
                            :disabled="comDisabled" :mintime="comMinTime" :timeout="comTimeOut"
                            @click="translate_cur">{{$t('ymx-detail.onlyTrans')}}（{{currentname}}）{{$t('ymx-detail.account')}}</request-button>
            <request-button reqKey="translateUseAll" :mintime="comMinTime" :timeout="comTimeOut"
                            :disabled="comAllDisabled"
                            @click="translate_all">
                {{$t('ymx-detail.transAll')}}
                <!--翻译所有账号-->
            </request-button>
            <request-button reqKey="keepDraft" :mintime="comMinTime" :timeout="comTimeOut"
                            @click.native="keep_draft">{{$t('ymx-detail.saveDraft')}}</request-button>

            <request-button :reqKey="`${comReqKey}`" :mintime="comMinTime" :timeout="comTimeOut"
                            @click="public_channel" :disabled="is_tort">{{$t('ymx-detail.pubPlatform')}}
            </request-button>
            <el-button size="mini" @click="do_cancel">{{$t('ymx-detail.cancel')}}</el-button>
        </div>
        <infringement-hint :value="infringementShow" @change-show="change_infringement_show" :tableData="infringementData"  @submit-info="submit_Info"></infringement-hint>
        <totr-dialog v-model="totr_dialog" :totrvalue="tort_value" @check="goods_description"></totr-dialog>
    </page>
</template>

<style lang="stylus">
    .over-flow-auto {
        position: relative;
        padding-bottom: 45px;
    }
</style>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import {api_account_site, api_get_amazon_account,api_publish_amazon_infringement} from '../../../../api/amazon-publish-list';
    import {
        api_goods_info, api_fix_attribute, api_amazon_warehouse, api_attr_category, api_save_listing,
        api_amazon_field, api_publish_amazon_edit, api_edit_amazon_draft, api_publish_amazon_draft,
        api_translate,api_pricing_rules} from '@/api/amazon-publish-info';
    import {api_product_list, api_get_amazon_site,api_doc_edit_field} from '../../../../api/product-category-api';
    import {get_product_attribute, get_edit_data} from './info-public-methods';
    import {isExistIllegalWord} from '@/lib/filter-words';
    import {api_infringement} from '@/api/product-library';

    export default {
        page: {
            multiple: true,
            beforeClose() {
                if (!this.isChange) {
                    return true
                } else {
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
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
                curAccount: [],
                labelWidth: '270px',//各个模块标题的宽度
                loading: false,
                editData: {},
                form: {
                    header: {},
                    data: [],
                },
                commonAttList: [],
                currentTab: "",
                currentname: "",
                accounts: [],
                accountVisible: false,
                isChange: false,
                siteList: [],
                amazonWarehouseList: [],
                categoryTemplatList: [],
                //后端返回的详情页面的label&&属性&&规则
                allRuleAttr: {},
                historyIdObj:{},
                oldQuoteData:{},//范本模板数据，原始值，需要在提交时做判断
                initData:{},//从未刊登进入时的初始值，与oldQuoteData原始值相同
                infringementShow:false,
                infringementData:[],
                versionsId:'20190410135500',//版本号
                versionsIdDialogShow:true,
                is_tort:false,
                tort_arr:[],
                totr_dialog:false,
                tort_value:{}
            }
        },
        mounted() {
            this.$http(api_infringement).then(res=>{
                res.forEach(row=>{
                    this.tort_arr.push(row.code);
                });
            }).catch(code=>{
            });
            if (window.objlength(this.param)
                === 0) return;
            if (this.param.curPage === 'draft') {
                this.get_amazon_warehouse();
                this.get_site();
                this.get_account();
                this.init_draft();
            } else {
                this.init();
            }
            this.get_infringement_msg();
            //定时保存草稿
            if(this.param.add){
                this.timer=setInterval(()=>{
                    this.auto_keep_draft();
                },60000);
            }else{
                this.timer='';
            }
        },
        destroyed(){
            clearInterval(this.timer);
            // window.sessionStorage.removeItem(this.param.spu);
        },
        beforeUpdate(){
            this.amazon_random();
        },
        methods: {
            ...mapActions({
                setCateTemplate:'ymxkandeng/setCateTemplate',
                setProductAttr:'ymxkandeng/setProductAttr',
                setProductId:'ymxkandeng/setProductId',
            }),
            get_product_attribute,
            get_edit_data,
            //亚马逊 每日刊登 外部随机分配 预计刊登利润率(前提 是能匹配到刊登定价规则)
            amazon_random(){
                if(this.form.header.profit>0){
                    this.form.data.forEach(row=>{
                        row.variant.forEach((item,index)=>{
                            if(item["Standard Price"].value){
                                item.gross_profit=this.form.header.profit;
                                if(index===row.variant.length-1){
                                    this.form.header.profit=0;
                                }
                            }
                        })
                    })
                }
            },
            /*更新本版*/
            versions_flag(){
                if(this.form.header.detail_version && this.form.header.detail_version!==this.versionsId ){
                    this.$confirm('检测到您的刊登版本并不是最新版本,请ctrl+f5重载代码！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '等会去',
                        type: 'warning'
                    }).then(() => {
                        this.versionsIdDialogShow = false;
                        this.$message({
                            type:'info',
                            message:'请Ctrl+F5重载代码!'
                        })
                        return
                    }).catch(() => {
                        this.versionsIdDialogShow = false;
                        this.$message({
                            type:'info',
                            message:'此刊登版本不是最新版本,为了您正常使用请Ctrl+F5重载代码!'
                        })
                        return
                    });
                }
            },
            /*获取产品模板*/
            async get_attribute(row) {
                let productType = 2;
                await this.get_product_attribute(productType, row.site).then(id => {
                    if (!id||id instanceof Boolean) return;
                    /*初始化产品默认模板属性
                    * */
                    let config2 = {
                        key:row.site,
                        data:id||0
                    };
                    this.setProductId(config2);

                    this.get_edit_data(productType, row.site, id).then(res => {
                        if (res.product) {
                            res.product.attrs.forEach(row => {
                                let restriction = [];
                                this.$set(row, 'require', row.required);
                                this.$set(row, 'type', 2);
                                this.$set(row, 'site', this.param.site);
                                this.$set(row, 'value', '');
                                this.$set(row, 'unitValue', '');
                                if (!!row.attribute) restriction = row.attribute.restriction;
                                this.$set(row, 'restriction', restriction);
                            });
                            let config = {
                                key:row.site,
                                data:res.product.attrs
                            };
                            this.setProductAttr(config);
                        } else {
                            console.log('模板暂无数据');
                        }
                    });
                });
            },
            //获取分类模板信息
            async get_category(row) {
                let type = 1;
                const res = await this.get_product_attribute(type, row.site);
                if(res instanceof Boolean)return;
                let config = {key:row.site,data:res};
                this.setCateTemplate(config);
            },
            //计算刊登销售价
            get_pricing_rules(row){
                let skuId = row.variant.map(res=>{
                    if(res['SKUID']) return res['SKUID'].value
                });
                let params = {
                    channel_id:2,
                    account_id:row.account_id,
                    site_code:row.siteName,
                    sku_id:skuId,
                };
                this.$http(api_pricing_rules,params).then(res => {
                    if(Object.keys(res)&&Object.keys(res).length>0){
                        Object.keys(res).forEach(item=>{
                            if(!res[item].total_price)return;
                            let find = row.variant.find(it=>{
                                return Number(it['SKUID'].value)===Number(item)
                            });
                            if(find){
                                this.$set(find,'gross_profit',res[item].gross_profit.substring(0,res[item].gross_profit.length-1));
                                find['Standard Price'].value = res[item].total_price;
                            }
                        });
                    }else{
                        this.$message({type:'error',message: this.$t('ymx-detail.incorrect')});
                    }
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            cache_show(){
                this.$confirm('该页面存在数据缓存是否载入', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.form=JSON.parse(window.sessionStorage.getItem(this.param.spu));
                    this.currentTab = this.currentTab?this.currentTab:val[0].code;
                    this.currentname = this.currentname?this.currentname:val[0].code;
                    this.$message({
                        type: 'success',
                        message: '载入成功!'
                    });
                })
            },
            /*侵权词*/
            get_infringement_msg(){
                this.$http(api_publish_amazon_infringement,this.param.goods_id)
                    .then(res=>{
                        this.infringementData=[...res];
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
            random_num(Min, Max) {
                let range = Max - Min;
                let rand = Math.random();
                let num = Min + Math.floor(rand * range); //舍去
                return num;
            },
            //添加账号
            select_row(row){
                this.get_attr_collection(row);//获取产品&分类属性
                this.get_category_collection(row);//获取分类模板
            },
            select_all(list){
                list.forEach(row=>{
                    this.get_attr_collection(row);//获取产品&分类属性
                    this.get_category_collection(row);//获取分类模板
                });
            },
            /*获取UPC
            * */
            sync_upc(){
                this.$confirm(this.$t('ymx-detail.cover'), this.$t('ymx-detail.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning'
                }).then(() => {
                    let templateData = this.form.data.find(row => {
                        return row.code === this.currentname;
                    });
                    setTimeout(() => {
                        this.form.data.forEach((row, index) => {
                            if (row.code !== this.currentname) {
                                row.variant.forEach((res,i)=>{
                                    Object.keys(res).forEach(item=>{
                                        if(item==='ProductIdValue'||item==='PartNumber'){
                                            res[item].value = templateData.variant[i][item].value;
                                        }
                                    })
                                });
                                this.$message({type: 'success', message: this.$t('ymx-detail.sucCopy')});
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: this.$t('ymx-detail.applied')
                        });
                        this.$reqKey('syncUpc', false);
                    }, 0);
                });
                this.$reqKey('syncUpc');
            },
            //初始化
            async init() {
                if (!this.param.account_id) return;
                let copy = '';
                this.form.spu = this.param.spu;
                this.siteId = this.param.site || '';
                await this.get_category({site: this.siteId, account_id: this.param.account_id});
                await this.get_attribute({site: this.siteId, account_id: this.param.account_id});
                await this.get_amazon_warehouse();
                await this.get_site();
                await this.get_account();
                if (this.param.curPage === 'not') {// 添加
                    await this.get_all_rule_attr(this.param.site, this.param.spu, this.param.account_id);
                    let findList = this.accountList.filter(item => item.account_id === this.param.account_id);
                    this.form.data = [];
                    this.curAccount = findList;
                    this.assign_info(findList);
                }
                if (this.param.curPage === 'queue') { // 编辑
                    copy = 0;
                    this.edit_data(this.param, copy);
                }
                if (this.param.curPage === 'copy') { // 复制
                    copy = 1;
                    this.edit_data(this.param, copy);
                }
                if(window.sessionStorage.getItem(this.param.spu)){
                    this.cache_show();
                }
                if(this.versionsIdDialogShow){
                    this.versions_flag();
                }
            },
            /*编辑
            * */
            edit_data(params, copy) {
                this.loading = true;
                this.form.data = [];
                let curAccount = this.accounts.find(res => params.account_id === res.account_id);
                this.$http(api_publish_amazon_edit, {id: params.id, copy: copy}).then(res => {
                    let type = 0;
                    let siteName = '';
                    let find = this.siteList.find(row => row.value === res.site);
                    if (!!find) siteName = find.label;
                    this.form.header = res.header;
                    this.form.id = res.id;
                    res.img.forEach(row => {
                        let value = row.value.filter(item => !!item.path).map(item => {
                            return {
                                is_default: item.is_default,
                                isSwatch: item.is_swatch,
                                path: item.path
                            }
                        });
                        row.data.images = value;
                    });
                    let images = res.img.map(row => row.data);
                    /*整理详情与描述模块数据
                    * */
                    let descript = res.descript;
                    descript.forEach(row => {
                        row.field.forEach(res => {
                            if (res.name === 'Description') {
                                res.value = `<p>${res.value}</p>`
                            }
                        })
                    });
                    /*根据最新的站点&产品模板id&分类模板id；获取基本信息模块展示的属性
                    * */
                    this.get_edit_data(type, res.site, res.category_template_id, res.product_template_id).then(item => {
                        if (!item||item instanceof Boolean) return;
                        let cate = item.category;
                        let pro = item.product;
                        let existCate = cate.hasOwnProperty('message')?false:true;
                        let existPro = pro.hasOwnProperty('message')?false:true;
                        let skuObj = this.arrange_sku_table(res, item.category.attrs,existCate);
                        if(!existCate&&!existPro){
                            this.reset_product_category_attr(params, item, res, this.$t('ymx-detail.classProTem'));
                        }else if(!existCate&&existPro){
                            this.reset_product_category_attr(params, item, res, this.$t('ymx-detail.classifiTemp'));
                        }else if(existCate&&!existPro){
                            this.reset_product_category_attr(params, item, res, this.$t('ymx-detail.proTem'));
                        }else{
                            /*存在产品模板和分类模板时
                           *整理产品模板&&分类模板所带的属性
                           * */
                            this.arrange_product_category_attr(params, item, res);
                        }
                        /*获取批量操作的列
                        * */
                        this.editData = {
                            code: res.account_code,
                            account_id: res.account_id,
                            siteId: res.site,
                            realName:res.header.seller_name,
                            currency: curAccount ? curAccount.currency : '',
                            goods_id: res.goods_id,
                            category_id: res.category_id,
                            category_template_id: existCate?res.category_template_id:'',
                            product_template_id: existPro?res.product_template_id:this.objOfProductId[`${params.site}`],
                            basic: res.basic,
                            descript: res.descript,
                            variant: skuObj.variant,
                            batchOperation: skuObj.batchOperation,
                            bindCategoryList: skuObj.bindCategoryList,
                            variant_title: skuObj.variant_title,
                            variant_option: res.variant_option,
                            variant_info: res.variant_info,
                            images: images,
                            categoryTemplatList: clone(this.objOfCategory[`${params.site}`]),
                            amazonWarehouseList: this.amazonWarehouseList,
                            commonAttList: clone(this.objOfCommonAtt[`${params.site}`]),
                            variationTheme: item.category.variant || [],//变体
                            skuActiveName: `${descript[0].skuName}-0`,
                            siteName: siteName,
                            siteList: this.siteList,
                            category_name: res.amazon_category_name,
                            category_name2: res.amazon_category_name2,
                            is_translate:res.is_translate
                        };
                        if (copy === 0) {
                            this.form.data.push(this.editData);
                            this.currentTab = this.editData.code;
                            this.currentname = this.editData.code;
                        }
                    });
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code});
                    this.$close('/kandeng/amazon/info');
                }).finally(()=>{
                    this.loading = false;
                })
            },
            /*引用模板接口
            * */
            quote_model(index,doc_id){
                this.loading = true;
                let params = {
                    id:doc_id,
                    copy:0
                };
                this.$http(api_doc_edit_field,params).then(res => {
                    this.quote_model_data(index,res.data);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    this.loading = false;
                })
            },
            /*引用历史数据接口
            * */
            quote_old(index){
                this.loading = true;
                let dataObj = this.form.data[index];
                let length = this.historyIdObj[dataObj.siteId].length;
                if(length<=0){
                    this.loading = false;
                    return this.$message({type:"warning",message: this.$t('ymx-detail.noRefer')});
                }
                let num = this.random_num(0,length);
                let data =  {
                    spu: this.form.spu,
                    goods_id: dataObj.goods_id,
                    account_id: dataObj.account_id,
                    site: dataObj.siteId,
                    siteName:dataObj.siteName,
                    id:this.historyIdObj[dataObj.siteId][num],
                    copy:1
                };
                this.get_old_data(data).then(res=>{
                    if(!res)return;
                    this.quote_model_data(index,res);
                }).finally(()=>{
                    this.loading = false;
                });
            },
            get_old_data(data){
                let params = {
                    id:data.id,
                    copy:data.copy
                };
                return this.$http(api_publish_amazon_edit,params).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:'error',message: this.$t('ymx-detail.noSite')});
                })
            },
            /*一键引用模板&&一键引用历史模板 整理数据并映射DOM
           * */
            quote_model_data(index,res){
                let obj = this.form.data[index];
                let fixedData = clone(this.initData[obj.account_id]);
                let brand = res.basic.find(row=>row.key==='Brand');
                if(brand) brand.value = '';
                this.$set(obj,'category_template_id',res.category_template_id);
                this.$set(obj,'product_template_id',res.product_template_id);
                //处理sku
                res.sku.forEach(item=>{
                    let find = fixedData.variant.find(row=>row['平台SKU'].value===item['平台SKU'].value);
                    if(find){
                        //应用时不能够应用价格/售价/活动起止时间
                        let list = ['Standard Price','Sale Price','Sale Start Date','Sale End Date'];
                        Object.keys(item).forEach(it=>{
                            if(!list.includes(it))find[it] = item[it];
                        })
                    }
                });
                this.$set(res,'sku',fixedData.variant);
                //处理图片 img
                res.img.forEach(row => {
                    let value = row.value.filter(item => !!item.path).map(item => {
                        return {
                            is_default: item.is_default,
                            isSwatch: item.is_swatch,
                            path: item.path
                        }
                    });
                    row.data.images = value;
                });
                let images = res.img.map(row => row.data);
                images.forEach(row=>{
                    let find = fixedData.images.find(item=>item.name===row.name);
                    if(find) Object.assign(find,row);
                });
                this.$set(obj,'images',fixedData.images);
                //处理描述
                res.descript.forEach(row=>{
                    let find = fixedData.descript.find(item=>item.skuName===row.skuName);
                    if(find)Object.assign(find,row);
                });
                //处理basic
                res.basic.forEach(item=>{
                    let find = fixedData.basic.find(row=>row.key===item.key);
                    if(find) this.$set(find,'value',item.value);
                });
                this.$set(obj,'category_name',res.amazon_category_name);
                this.$set(obj,'category_name2',res.amazon_category_name2);
                this.$set(obj,'descript',fixedData.descript);
                this.$set(obj,'variant_info',res.variant_info);
                this.$set(obj,'basic',fixedData.basic);
                this.$nextTick(()=>{
                    this.handle_desc(fixedData, index);
                });
                let type = 0;//根据站点&&分类模板ID，请求分类模板属性;
                this.get_edit_data(type,obj.siteId,res.category_template_id, res.product_template_id).then(cateObj=>{
                    if (!cateObj||cateObj instanceof Boolean) return;
                    let cate = cateObj.category;
                    let pro = cateObj.product;
                    let existCate = cate.hasOwnProperty('message')?false:true;
                    let existPro = pro.hasOwnProperty('message')?false:true;
                    //整理表格数据
                    let skuObj = this.arrange_sku_table(res,cateObj.category.attrs,existCate);
                    if(!existCate&&!existPro){
                        this.reset_product_category_attr(this.param, cateObj, res, this.$t('ymx-detail.classProTem'));
                    }else if(!existCate&&existPro){
                        this.reset_product_category_attr(this.param, cateObj, res, this.$t('ymx-detail.classifiTemp'));
                    }else if(existCate&&!existPro){
                        this.reset_product_category_attr(this.param, cateObj, res, this.$t('ymx-detail.proTem'));
                    }else{
                        /*存在产品模板和分类模板时
                       *整理产品模板&&分类模板所带的属性
                       * */
                        this.arrange_product_category_attr(this.param, cateObj, res);
                    }
                    if(this.objOfCommonAtt[`${this.param.site}`]){
                        let curCommonAtt =  this.objOfCommonAtt[`${this.param.site}`];
                        curCommonAtt.forEach(it=>{
                            if(it.node_tree==='Product,DescriptionData,MerchantCatalogNumber'||it.node_tree==='Product,DescriptionData,Manufacturer'){
                                it.value = '';
                            }
                        })
                    }
                    this.$set(obj,'variant',skuObj.variant);
                    this.$set(obj,'batchOperation',skuObj.batchOperation);
                    this.$set(obj,'bindCategoryList',skuObj.bindCategoryList);
                    this.$set(obj,'variant_title',skuObj.variant_title);
                    this.$set(obj,'variationTheme',cateObj.category.variant);
                    this.$set(obj,'commonAttList',clone(this.objOfCommonAtt[`${this.param.site}`]));
                    this.oldQuoteData[obj.account_id] = clone(obj);
                });
            },
            /*重新请求模板数据*/
            reset_product_category_attr(curRow, item, res, name) {
                this.$confirm(`${this.$t('ymx-detail.current')}${name}${this.$t('ymx-detail.invaildTip')}`, this.$t('common.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    if(name=== this.$t('ymx-detail.proTem')||name=== this.$t('ymx-detail.classProTem')){
                        res.product_template_info = {};
                        this.get_attribute(curRow);
                    }else{
                        res.category_template_info = {};
                    }
                }).catch(() => {
                    this.$close('/kandeng/amazon/info');
                })
            },
            /*基础信息=》选择产品分类模板后-自动填写sku设置RecommendedNode
            * */
            category_submit(index,id){
                this.form.data[index].variant.forEach(row=>{
                    Object.keys(row).forEach(res=>{
                        if(res==='RecommendedNode'&&row[res].value===''){
                            row[res].value = id;
                        }
                    })
                })
            },
            /*翻译所有
            * */
            translate_all() {
                this.$confirm(this.$t('ymx-detail.transAllTips'), this.$t('ymx-detail.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning'
                }).then(() => {
                    let findList = this.form.data.filter(row=>!row.is_translate);
                    if(findList.length<=0)return this.$message({type:'warning',message: this.$t('ymx-detail.transTips')});
                    if(!this.validate_small_language(findList)){
                        this.$reqKey('translateUseAll', false);
                        return;
                    }
                    let list = this.arrange_translate_data(clone(findList));
                    this.translate_api(list, 'all');
                }).catch(() => {
                    this.$message({type: 'info', message: this.$t('ymx-detail.canceled')});
                    this.$reqKey('translateUseAll', false);
                });
            },
            /*小语种翻译前需要做5%的差异判断*/
            validate_small_language(findList){
                let canSubmit = true;
                findList.forEach(row=>{
                    let judgeQuote = this.small_language_validate(row);
                    if(!judgeQuote.isTrue){
                        this.$message({type:'warning',message:`【${row.code}】${this.$t('ymx-detail.account')}，【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')}，sku：【${judgeQuote.curSku}】->【${this.$t('ymx-detail.title')}】${this.$t('ymx-detail.repet1')}95%,${this.$t('ymx-detail.repet2')}${judgeQuote.curPercent*100}%`});
                        return canSubmit = false;
                    }
                });
                return canSubmit
            },
            /*翻译当前账号*/
            translate_cur() {
                let findList = this.form.data.filter(row=>!row.is_translate&&row.code===this.currentname);
                if(findList.length<=0)return this.$message({type:'warning',message: this.$t('ymx-detail.transTips')});
                if(!this.validate_small_language(findList)){
                    this.$reqKey(`translate${this.currentname}`, false);
                    return;
                }
                let list = this.arrange_translate_data(clone(findList));
                this.translate_api(list, 'cur');
            },
            /*整理翻译需要的参数
            * */
            arrange_translate_data(list) {
                return list.map(row => {
                    let category_template = {};
                    let descript = [];
                    let sku = {};
                    row.commonAttList.forEach(res => {
                        if (res.type === 1 && res.select === 0&&!(res.restriction instanceof Array)){
                            if (res.unitValue) {//提交单位格式为 元素名@属性：属性值，如：SpoutHeight@unitOfMeasure: "CM"
                                category_template[`${res.name}@${res.attribute.name}`] = res.unitValue;
                            }
                            category_template[res.name] = res.value
                        }
                    });
                    row.descript.forEach(res => {
                        let obj = {};
                        res.field.forEach(item => {
                            if (item.key !== 'SKU') {
                                obj[item.key] = item.value;
                            } else {
                                obj[item.key] = res.skuName;
                            }
                        });
                        descript.push(obj);
                    });
                    row.variant.forEach(row => {
                        let obj = {};
                        Object.keys(row).filter(res => row[res].isVariant === 1).forEach(res => {
                            obj[res] = row[res].value;
                        });
                        sku[row['SKU'].value] = obj;
                    });
                    let data = {
                        category_template: category_template,
                        descript: descript,
                        sku: sku
                    };
                    return {
                        account_id: row.account_id,
                        site: row.siteId,
                        data: data
                    }
                });
            },
            /*翻译使用的API，翻译所有和翻译当前共用，传参不同
            * */
            translate_api(list, name) {
                this.$http(api_translate, list).then(res => {
                    this.translate_assignment(res);
                    this.$message({type: 'success', message: this.$t('ymx-detail.transComp')});
                }).catch(code => {
                    this.$message({type: 'error', message: code.message || code})
                }).finally(() => {
                    if (name === 'cur') {
                        this.$reqKey(`translate${this.currentname}`, false);
                    } else if (name === 'all') {
                        this.$reqKey('translateUseAll', false);
                    }
                });
            },
            /*整理翻译后返回的数据
            * */
            translate_assignment(targetData) {
                targetData.data.forEach(row => {
                    let accountIndex = this.form.data.findIndex(res => res.account_id === row.account_id);
                    if (accountIndex > -1) {
                        let find = this.form.data[accountIndex];
                        find.is_translate = 1;
                        Object.keys(row.data.category_template).forEach(item => {
                            if (item.includes('@')) {//映射 属性的值
                                let name = item.split('@');
                                let cur = find.commonAttList.find(its => its.name === name[0]);
                                if (!!cur) cur.unitValue = row.data.category_template[item];
                            } else {
                                let attrObj = find.commonAttList.find(it => it.name === item);
                                if (attrObj) attrObj.value = row.data.category_template[item];
                            }
                        });
                        row.data.descript.forEach(item => {
                            let index = find.descript.findIndex(it => it.skuName === item.SKU);
                            if (index > -1) {
                                let desc = find.descript[index];
                                Object.keys(item).forEach(it => {
                                    let findDesc = desc.field.find(its => its.key === it);
                                    if (findDesc) {
                                        findDesc.value = item[it];
                                        if (it === 'Description') {
                                            console.log("chufa");
                                            this.$refs.title_des[accountIndex].$refs.uEditor[index].editor.setValue(item[it]);
                                        }
                                    }
                                })
                            }
                        });
                        find.variant.forEach(item => {
                            Object.keys(row.data.sku).forEach(it => {
                                if (item['SKU'].value === it) {
                                    Object.keys(row.data.sku[it]).forEach(i => {
                                        if (item[i]) item[i].value = row.data.sku[it][i];
                                    })
                                }
                            });
                        });
                    }

                });
            },
            /*加载草稿箱
            * */
            init_draft() {
                this.loading = true;
                this.$http(api_edit_amazon_draft, this.param.id).then(res => {
                    this.form.header = res.header;
                    this.form.spu = res.header.spu;
                    this.form.draft_id = res.draft_id;
                    let data = res.data.map(item=> {
                        return item.temp
                    });
                    if(data[0]&&data[0].oldQuoteData)this.oldQuoteData = data[0].oldQuoteData;
                    this.$set(this.form, 'data', data);
                    let length = this.form.data.length;
                    if (!!length) {
                        this.currentTab = this.form.data[length - 1].code;
                        this.currentname = this.form.data[length - 1].code;
                    }
                    if(this.versionsIdDialogShow){
                        this.versions_flag();
                    }
                }).catch(code => {
                    console.log(code);
                }).finally(()=>{
                    this.loading = false;
                })
            },
            /*从未刊登模块进入时的请求的基础数据
            * */
            get_all_rule_attr(siteId, spu, accountId) {//后端给我的字段和规则
                return this.$http(api_amazon_field, {site: siteId, spu: spu ,account_id:accountId}).then(res => {
                    let length = Object.keys(this.form.header).length;
                    if (length <= 0) {
                        this.form.header = res.header;
                    }
                    this.historyIdObj[siteId] = res.header.history_id;
                    res.descript.forEach(row => {
                        row.field.forEach(res => {
                            if (res.name === 'Description') {
                                res.value = `<p>${res.value}</p>`
                            }
                        })
                    });
                    res.sku.forEach(row => {
                        let objValue = {
                            type: 'check',
                            value: true,
                        };
                        this.$set(row, 'check', objValue);
                        row['ProductIDType'] && !row['ProductIDType'].value && (row['ProductIDType'].value = 'UPC')
                    });
                    res.img.forEach(row => {
                        if (row.data.images && row.data.images.length > 0) {
                            row.data.images.forEach(it => {
                                this.$set(it, 'isSwatch', false);
                                this.$set(it,'base_url',row.data.baseUrl)
                            });
                            row.data.images[0].isSwatch = true;
                        }
                    });
                    this.allRuleAttr[`${accountId}-${siteId}`] = res;
                    return Promise.resolve(res);
                }).catch(code => {
                    return Promise.resolve(code);
                })
            },
            /*sku设置页面-》切换VariationTheme下拉框
            * */
            get_variation_list(item, val) {
                this.$set(item, 'variationAttr', val);//变体属性的详情
            },
            /*未刊登时，如果有记录，默认带出Brand值
            * */
            get_brand_name(basicData){
                let find = basicData.find(row=>row.key==='Brand');
                return find?find.value:'';
            },
            /*由于后端返回的数据结构跟前端想要的不同；
            * 故：整理为前端想要的格式
            * */
            //单独整理产品模板数据
            arrangement_product_attr(ruleAttr){
                if (ruleAttr.product&&ruleAttr.product_template_info) {
                    let brandName = this.get_brand_name(ruleAttr.basic);
                    /*整理产品模板属性
                    * */
                    ruleAttr.product.attrs.forEach(row => {
                        let curValue = '';
                        let restriction = [];
                        this.$set(row, 'require', row.required);
                        this.$set(row, 'type', 2);//type=2代表是产品模板
                        this.$set(row, 'site', this.param.site);
                        curValue = row.node_tree==='Product,DescriptionData,Manufacturer'?brandName:'';
                        this.$set(row, 'value', curValue);
                        this.$set(row, 'unitValue', '');
                        if (!!row.attribute) restriction = row.attribute.restriction;
                        this.$set(row, 'restriction', restriction);
                    });
                    Object.keys(ruleAttr.product_template_info).forEach(it => {
                        if (it.includes('@')) {//映射 属性的值
                            let name = it.split('@');
                            let find = ruleAttr.product.attrs.find(its => its.name === name[0]);
                            if (!!find) find.unitValue = ruleAttr.product_template_info[it];
                        } else { //映射元素的值
                            let find = ruleAttr.product.attrs.find(its => its.name === it);
                            if (!!find) find.value = ruleAttr.product_template_info[it];
                        }
                    });
                    return ruleAttr.product.attrs;
                } else {
                    console.log('模板暂无数据');
                }
            },
            //整理产品模板和分类模板
            arrange_product_category_attr(curRow, item, res) {
                /*整理产品模板属性
                * */
                res.product.attrs = this.arrangement_product_attr(res);
                /*整理分类模板属性
               * */
                item.category.attrs.forEach(row => {
                    let restriction = [];
                    this.$set(row, 'require', row.required);
                    this.$set(row, 'type', 1);
                    this.$set(row, 'site', this.param.site);
                    this.$set(row, 'value', '');
                    this.$set(row, 'unitValue', '');
                    if (!!row.attribute) restriction = row.attribute.restriction;
                    this.$set(row, 'restriction', restriction);
                });
                let attrs = item.category.attrs;
                Object.keys(res.category_template_info).forEach(it => {
                    if (it.includes('@')) {//映射 属性的值
                        let name = it.split('@');
                        let find = attrs.find(its => its.name === name[0]);
                        if (!!find) find.unitValue = res.category_template_info[it];
                    } else {
                        let find = attrs.find(its => its.name === it);
                        if (find) find.value = res.category_template_info[it];
                    }
                });
                this.objOfCommonAtt[`${curRow.site}`] = [...res.product.attrs,...attrs];
                console.log(this.objOfCommonAtt[`${curRow.site}`],'this.objOfCommonAtt[`${curRow.site}`] ');
            },
            /*关闭已添加的账号
            * */
            handle_tabs_edit(val, action) {
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
            arrange_sku_table(res, categoryList,Bool) {
                let bindCategoryList = [];
                /*初步整理SKU列表，将可勾选列的位置提到总列的最前面
                * */
                res.sku.forEach(row => {
                    let objValue = {
                        type: 'check',
                        value: true,
                    };
                    this.$set(row, 'check', objValue);
                });
                let variant = res.sku;
                let variant_title = this.arrange_header(clone(Object.keys(variant[0])));//获取sku头部
                if(!Bool){
                    /*无分类模板时，需要将之前的变体属性全部置空，让销售重新添加*/
                    res.variant_info_arr = [];
                }
                /*整理sku列表中 每个sku对应的变体属性值
                * */
                let variant_info_arr = res.variant_info_arr;
                if (variant_info_arr.length > 0) {
                    let details = variant_info_arr[0].field;
                    let detailsKeys = Object.keys(details).filter(item => !item.includes('@'));//过滤掉单位
                    let arrangeVariantInfoArr = [];

                    /*处理variant_info_arr数组长度以及位置与variant数组长度对应不上的问题*/
                    variant.forEach(item=>{
                        let find = variant_info_arr.find(it=>it.skuName===item['平台SKU'].value);//如果有返回当前sku的变体值，就将记录的数据push到新的数组里面
                        if(find){
                            arrangeVariantInfoArr.push(find);
                        }else{
                            let customField = clone(details);
                            Object.keys(customField).forEach(it=>customField[it]='');
                            let obj = {//如果没有，就自己造一个
                                skuName:item['平台SKU'].value,
                                field:customField
                            };
                            arrangeVariantInfoArr.push(obj);
                        }
                    });

                    //sku模块 展示绑定关系表格的数据
                    detailsKeys.forEach(i => {
                        bindCategoryList.push({attr_name: i, option_value: ''})
                    });

                    //将绑定的变体属性插入在'参考_XX'属性的后面 Start
                    let list = variant_title.filter(row => row.includes('参考'));
                    let lastName = '';
                    if (list.length <= 0) list = variant_title.filter(row => row!=='SKUID'&&row.includes('SKU'));
                    lastName = list[list.length - 1];
                    let findIndex = variant_title.findIndex(row => row === lastName);

                    //在列表头部加入变体
                    if (findIndex > -1) variant_title.splice(findIndex + 1, 0, ...detailsKeys);

                    //将绑定的变体属性插入在'参考_XX'属性的后面 End；
                    arrangeVariantInfoArr.forEach((row, index) => {
                        let skuValue = variant[index]['平台SKU'].value;
                        if (skuValue === row.skuName) {
                            let find = variant[index];//找到对应的行SKU数据
                            let details = Object.keys(row.field).filter(item => !item.includes('@'));//当前SKU下变体属性的名称数组集合
                            let unitDetails = Object.keys(row.field).filter(item => item.includes('@'));//当前SKU下变体属性的名称数组集合
                            details.forEach(its => {
                                let findChild = categoryList.find(i => i.name === its);
                                if (findChild) {
                                    this.$set(findChild, 'key', its);
                                    this.$set(findChild, 'is_required', findChild.required);
                                    this.$set(findChild, 'type', findChild.select ? 'select' : 'input');
                                    this.$set(findChild, 'value', row.field[its]);
                                    this.$set(findChild, 'isVariant', 1);
                                    this.$set(find, its, clone(findChild));//为当前行SKU，添加变体属性
                                }
                            });
                            unitDetails.forEach(its => {
                                let unitName = its.split('@');
                                let findName = Object.keys(find).find(it => it === unitName[0]);
                                if (findName) find[findName].unitValue = row.field[its];
                            });
                        }
                    });
                }
                return {
                    bindCategoryList: bindCategoryList,
                    batchOperation: clone(variant[0]),
                    variant: variant,
                    variant_title: variant_title,
                }
            },
            add_account() {
                this.accountVisible = true;
                let arr=[];
                let arr2=[];
                let arr3=[];
                /*发送请求获取当前侵权信息*/
                this.$http(api_publish_amazon_infringement,this.param.goods_id)
                    .then(res=>{
                        this.infringementData=[...res];
                        arr3=res.filter(item=>{
                            return item.channel==="amazon";
                        })
                        arr3.forEach(item=>{
                            arr.push(item.account_name.toLowerCase());
                        })
                        for(let i=0;i<arr.length;i++){
                            let str=this.accounts.find(item=>{
                                return item.account_name===arr[i];
                            })
                            arr2.push(this.accounts.indexOf(str));
                        }
                        for(let j=0;j<arr2.length;j++){
                            if(arr2[j]>=0){
                                this.accounts.splice(arr2[j],1);
                            }
                        }
                    })
                    .catch(err=>{
                        console.log(err);
                    })
            },
            assign_info(val) {
                this.$message({type:'success',message:this.$t('ymx-detail.loading')});
                this.$reqKey('url_post_publish_express_batch_copy',false);
                this.param.curPage === 'copy' ? this.copy_data(val) : this.add_data(val);
                setTimeout(()=>{
                    this.accountVisible = false;
                },3000)
            },
            /*过滤数据
            * */
            filter_account(accountList){
                let formData = clone(this.form.data);
                return  accountList.filter(row=>{
                    return !formData.find(item=>item.code===row.code);
                });
            },
            //copy时数据渲染事件
            copy_data(val) {
                let filterVal = this.filter_account(val);
                if(filterVal.length!==val.length)this.$message({type:'warning',message: this.$t('ymx-detail.filterDup')});
                filterVal.forEach(async row => {
                    let obj = clone(this.editData);
                    let notTranslateSite = ['US','UK','CA','AU','IN'];/*不翻译的站点集合*/
                    let includes = notTranslateSite.includes(row.site_name)?1:0;
                    const curForm = {
                        code: row.code,//
                        account_id: row.account_id,
                        currency: row.currency,//
                        siteId: row.site,//
                        siteName: row.site_name,//
                        categoryTemplatList: clone(this.objOfCategory[`${row.site}`]),
                        commonAttList: clone(this.objOfCommonAtt[`${row.site}`]),
                        category_id: '',
                        category_name: '',
                        category_name2: '',
                        category_template_id: '',
                        product_template_id: this.objOfProductId[`${row.site}`],
                        bindCategoryList: obj.bindCategoryList,
                        is_translate:row.site_name===this.editData.siteName?this.editData.is_translate:includes,
                    };
                    if (obj.siteId !==row.site) {//站点不相同时更改以下数据
                        this.arrange_parameter(obj, curForm, false);
                    } else {
                        obj.code = curForm.code;
                        obj.account_id = curForm.account_id;
                    }
                    this.form.data.push(obj);

                });
                let length = filterVal.length;
                if (!!length) {
                    this.currentTab = this.currentTab?this.currentTab:filterVal[0].code;
                    this.currentname = this.currentname?this.currentname:filterVal[0].code;
                }
            },
            //添加时数据渲染事件
            add_data(val) {
                let notTranslateSite = ['US','UK','CA','AU','IN'];/*不翻译的站点集合*/
                let formData = clone(this.form.data);
                let filterVal = val.filter(row=>{
                    return !formData.find(item=>item.code===row.code);
                });
                if(filterVal.length!==val.length)this.$message({type:'warning',message: this.$t('ymx-detail.filterDup')});
                filterVal.forEach(async row => {
                    await this.get_all_rule_attr(row.site, this.param.spu, row.account_id).then(ruleAttr=>{
                        if(ruleAttr&&ruleAttr.descript&&ruleAttr.basic){
                            let cloneRule = clone(ruleAttr);
                            let descript = ruleAttr.descript;/*描述*/
                            let basic = ruleAttr.basic;/*基本信息*/
                            let images = ruleAttr.img.map(row => row.data);/*图片*/
                            let variant = this.arrange_variant(row);/*sku设置*/
                            let variant_title = this.arrange_header(clone(Object.keys(variant[0])));/*sku设置表格头*/
                            let batchOperation = variant[0];/*sku设置表格头下面用于批量操作的数据*/
                            let variant_option = ruleAttr.variant_option;/*sku设置绑定变体*/
                            let product = this.arrangement_product_attr(clone(ruleAttr));
                            let productId = ruleAttr.product_template_info.id;
                            if(!productId) return this.$message({type:"warning",message:'产品模板ID不存在！'});
                            let params = {
                                siteId: row.site,
                                code: row.code,
                                doc_id:ruleAttr['header']['doc_id'],
                                currency: row.currency,
                                account_id: row.account_id,
                                realName: row.realname,
                                siteName: row.site_name,
                                category_template_id: '',
                                is_translate:notTranslateSite.includes(row.site_name)?1:0,
                                product_template_id: productId,
                                category_name: ruleAttr.amazon_category_name||'',
                                category_name2: ruleAttr.amazon_category_name2||'',
                                category_id: ruleAttr.category_id||'',
                                variant_title: clone(variant_title),
                                variant: clone(variant),
                                variant_option: variant_option,
                                batchOperation: clone(batchOperation),
                                images: images,
                                descript: descript,
                                basic: basic,//后端返回
                                siteList: this.siteList,
                                categoryTemplatList: clone(this.objOfCategory[`${row.site}`]),
                                amazonWarehouseList: this.amazonWarehouseList,
                                // commonAttList: this.auto_addition(clone(this.objOfCommonAtt[`${row.site}`])),
                                commonAttList: product,
                                variationTheme: [],//变体
                                bindCategoryList: [],
                                skuActiveName: `${descript[0].skuName}-0`,
                            };
                            if (this.param.curPage === 'not') {
                                this.$set(params, 'goods_id', this.param.goods_id);
                            } else if (this.param.curPage === 'draft') {
                                this.$set(params, 'goods_id', this.form.header.goods_id);
                            }
                            this.get_pricing_rules(params);
                            this.form.data.push(params);
                            console.log(this.form.data,'this.form.data');
                            this.oldQuoteData[row.account_id] = clone(params);
                            this.initData[row.account_id] = clone(params);
                        }else{
                            this.$message({type:'error',message:ruleAttr.message||ruleAttr});
                            this.cancel();
                        }
                    })
                });
                let length = val.length;
                if (!!length) {
                    this.currentTab = this.currentTab?this.currentTab:val[0].code;
                    this.currentname = this.currentname?this.currentname:val[0].code;
                }
            },
            //产品模板-》SpuPartNumber 自动填写默认值：spu+四个随机字母
            auto_addition(productList){
                if(productList&&productList.length>0){
                    let find = productList.find(row=>row.name==="SpuPartNumber");
                    if(find){
                        find.value = this.form.spu+this.get_random_letter();
                    }
                }
                return productList
            },
            /*
            * 重载产品模板-》需要回写vuex中的模板数据
            *           -》自动填写SpuPartNumber
            * */
            reload_product_templat(curForm){
                let config = {
                    key:curForm.site,
                    data:clone(curForm.commonAttList)
                };
                this.setProductAttr(config);
                curForm.commonAttList = this.auto_addition(curForm.commonAttList);
            },
            //获取站点相对应的分类模板
            get_category_collection(row) {
                console.log(this.objOfCategory.hasOwnProperty(`${row.site}`),'this.objOfCategory');
                if (this.objOfCategory.hasOwnProperty(`${row.site}`))return;
                this.get_category(row);
            },
            //获取站点相对应的产品&分类属性
            get_attr_collection(row) {
                if (this.objOfCommonAtt.hasOwnProperty(`${row.site}`)&&this.objOfProductId.hasOwnProperty(`${row.site}`)) return;
                this.get_attribute(row);
            },
            //重新整理受站点影响字段
            arrange_parameter(row, form,isGeneral,templateData) {
                /*
                 * 不同站点不管是不是通用模板都需要重置:
                 * variant=》'RecommendedNode','ProductIdValue','PartNumber','Standard Price','Sale Price'
                 * basic=》'Item Type Keyword', 'RecommendedBrowseNode','Brand Name'
                 * code /account_id /currency /siteId /siteName /categoryTemplatList /category_name /category_name2 /is_translate /category_id
                 * */

                /*不是通用模板的情况下 basic要重置：
                * basic=》'Item Type Keyword', 'RecommendedBrowseNode','Brand Name','Department','VariationTheme'
                * */
                row.code = form.code;
                row.account_id = form.account_id;
                row.currency = form.currency;
                row.siteId = form.siteId;
                row.siteName = form.siteName;
                row.categoryTemplatList = form.categoryTemplatList;
                row.category_name = form.category_name;
                row.category_name2 = form.category_name2;
                row.is_translate = form.is_translate;
                row.category_id = form.category_id;
                //不是通用模板时，以下内容才需要重置
                if(!isGeneral){
                    row.category_template_id = form.category_template_id;
                    row.product_template_id = form.product_template_id;
                    row.variationTheme = [];
                    row.bindCategoryList = [];
                    row.commonAttList = form.commonAttList;
                    form.bindCategoryList.map(item => item.attr_name).forEach(item => {
                        row.variant.forEach(res => {
                            delete res[item]
                        });
                    });
                }else{
                    /*
                    *通用模板需要重置：
                    * commonAttList-》Manufacturer(为空时自动取品牌)
                    * */
                    this.arrangement_commonAttList(row,form);
                }
                let resetList1 = ['Item Type Keyword', 'RecommendedBrowseNode','Brand Name'];
                if(!isGeneral)resetList1 = [...resetList1,...['Department','VariationTheme']];
                row.basic.forEach((res,index) => {
                    if (!!resetList1.find(item => res.name === item)) res.value =  form.basic&&form.basic[index]?form.basic[index].value:'';
                });
                const ResetList2 = ['RecommendedNode','ProductIdValue','PartNumber','Standard Price','Sale Price'];
                this.arrangement_variant(ResetList2,row,form);

                if(templateData&&isGeneral){
                    row.variant_title = templateData.variant_title;
                }else{
                    row.variant_title = this.arrange_header(Object.keys(row.variant[0]));
                }
                let cloneFirstRow =  clone(row.variant[0]);
                row.batchOperation = this.arrangement_variant_row(ResetList2,cloneFirstRow);
            },
            //相同站点或者不同站点通用模板需要特殊处理的字段 Manufacturer(为空时自动取品牌);
            arrangement_commonAttList(newRow,form){
                newRow.commonAttList.forEach((val,index)=>{
                    if(val.node_tree==='Product,DescriptionData,Manufacturer') val.value = form.commonAttList[index]?form.commonAttList[index].value:'';
                });
            },
            //相同站点需要重置 brand name
            arrangement_basic(curRow){
                curRow.basic.forEach(row=>{
                    if(row.name==='Brand Name') row.value = '';
                })
            },
            //根据传参判断sku列表中哪个字段需要置空
            arrangement_variant(resetList,curRow,form){
                /*resetList:需要被特殊处理的字段数组
                * curRow：当前按被执行过'应用所有'的账号，格式-》对象
                * form：在执行'引用所有'之前，提前保存的当前账号数据，格式-》对象
                * */
                if(form){
                    curRow.variant.forEach((res,index)=>{
                        Object.keys(res).forEach(item=>{
                            if(!!resetList.find(val=>val===item)){
                                if(form.variant&&form.variant[index]){
                                    let templateRow = form.variant[index];
                                    res[item].value = templateRow[item]?templateRow[item].value:'';
                                }else{
                                    res[item].value = '';
                                }
                            }
                        })
                    });
                }else{
                    curRow.variant.forEach(res=>{
                        this.arrangement_variant_row(resetList,res);
                    });
                }
            },
            arrangement_variant_row(resetList,row){
                Object.keys(row).forEach(item=>{
                    if(!!resetList.find(val=>val===item)){
                        row[item].value = '';
                    }
                })
                return row;
            },
            arrange_header(title) {
                let list = ['BindingGoods', 'check','gross_profit'];
                list.forEach(res => {
                    let findIndex = title.findIndex(row => row === res);
                    if (findIndex > -1) {
                        title.splice(findIndex, 1);
                        if (res === 'check') {
                            title.unshift('check');
                        }
                    }
                });
                return title;
            },
            arrange_variant(row) {
                let sku = this.allRuleAttr[`${row.account_id}-${row.site}`].sku;
                return sku;
            },
            //处理描述部分
            handle_desc(tempData, index) {
                tempData.descript.forEach((res, index_i) => {
                    let find = res.field.find(item => item.key === 'Description');
                    if(this.$refs.title_des[index]&&find){
                        let des = this.$refs.title_des[index];
                        if(des.$refs.uEditor[index_i]){
                            des.$refs.uEditor[index_i].editor.setValue(find.value);
                        }
                    }
                });
            },
            /*判断是否为通用模板
            * */
            is_general(form){
                let find = form.categoryTemplatList.find(row=>form.category_template_id===row.value);
                if(find&&find.site===0)return true;
                return false;
            },
            //判断有没有产品模板和分类模板属性
            judge_empty(array){
                return (array instanceof Array&&array.length>0)?true:false;
            },
            judge_Data(rowData){
                let comMessage = `【${rowData.code}】账号，产品模板属性为空，请点击按钮【重新产品模板】，重载数据`;
                let cateMessage = `【${rowData.code}】账号，分类模板为空，请点击【重载分类模板】，重载数据`;
                let isCom = this.judge_empty(rowData.commonAttList);
                let isCate = this.judge_empty(rowData.categoryTemplatList);
                if(isCom&&isCate){
                    return true
                }else if(!isCom&&isCate){
                    this.$message({type:'warning',message:comMessage});
                    return false
                }else if(isCom&&!isCate){
                    this.$message({type:'warning',message:cateMessage});
                    return false
                }else{
                    this.$message({type:'warning',message:`${cateMessage} ; ${comMessage}`});
                    return false;
                }
            },
            // 应用到所有
            use_all() {
                this.$confirm(this.$t('ymx-detail.cover'), this.$t('ymx-detail.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning'
                }).then(() => {
                    //获取当前操作的 账号
                    let templateData = this.form.data.find(row => {
                        return row.code === this.currentname;
                    });
                    if(!this.judge_Data(templateData))return this.$reqKey('useAll', false);
                    //判断当前 操作的 账号是否 选择 的是 通用 分类模板
                    let isGeneral = this.is_general(templateData);
                    setTimeout(() => {
                        this.form.data.forEach((row, index) => {
                            if(!this.judge_Data(row))return this.$reqKey('useAll', false);
                            if (row.code !== this.currentname) {
                                const curForm = {
                                    code: row.code,
                                    account_id: row.account_id,
                                    currency: row.currency,
                                    siteId: row.siteId,
                                    siteName: row.siteName,
                                    categoryTemplatList: clone(row.categoryTemplatList),
                                    commonAttList: clone(row.commonAttList),
                                    category_id: clone(row.category_id),
                                    category_name: row.category_name,
                                    category_name2: row.category_name2,
                                    category_template_id: row.category_template_id,
                                    product_template_id: row.product_template_id,
                                    bindCategoryList: row.bindCategoryList,
                                    is_translate:row.is_translate,
                                    basic:clone(row.basic),
                                    variant:clone(row.variant)
                                };
                                //先应用所有
                                Object.assign(row, clone(templateData));
                                this.$set(row,'code',curForm.code);
                                this.$set(row,'account_id',curForm.account_id);
                                this.$set(row,'siteId',curForm.siteId);
                                //受站点影响需特殊处理的字段
                                if (templateData.siteId !== row.siteId) {
                                    this.arrange_parameter(row, curForm,isGeneral,templateData);
                                }else{
                                    /*
                                     *相同站点需要重置：
                                     * commonAttList-》Manufacturer(为空时自动取品牌)
                                     * variant-》upc，partNumber，Standard Price，Sale Price
                                     * basic-》Brand Name
                                     * */
                                    this.arrangement_commonAttList(row,curForm);
                                    const ResetList3 = ['ProductIdValue','PartNumber','Standard Price','Sale Price'];
                                    this.arrangement_variant(ResetList3,row,curForm);
                                    this.arrangement_basic(row);
                                }
                                //虽不受站点影响仍需特殊处理的描述部分
                                this.handle_desc(templateData, index);
                                this.$message({type: 'success', message: this.$t('ymx-detail.copy')});
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: this.$t('ymx-detail.applied')
                        });
                        this.$reqKey('useAll', false);
                    }, 0);
                }).catch(() => {
                    this.$reqKey('useAll', false);
                });
            },
            /*用于标题与描述部分*/
            which_title(val) {
                switch (val) {
                    case 'Title':
                        return this.$t('ymx-detail.uploadTitle');
                    case 'Description':
                        return this.$t('ymx-detail.desc');
                    default:
                        return val
                }
            },
            //验证是否可以提交
            validate_data() {
                let canSubmit = true;
                this.form.data.forEach(row => {
                    let list = ['US','UK','CA','AU','IN'];
                    if(list.includes(row.siteName)){
                        let judgeQuote = this.judge_quote(row);
                        if(!judgeQuote.isTrue)return canSubmit = this.five_points_tip(row);
                    }else{
                        let judgeQuote = this.small_language_validate(row);
                        if(!judgeQuote.isTrue){
                            this.$message({type:'warning',message:`【${row.code}】${this.$t('ymx-detail.account')}，【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')}，sku：【${judgeQuote.curSku}】->【${this.$t('ymx-detail.title')}】${this.$t('ymx-detail.repet1')}95%,${this.$t('ymx-detail.repet2')}${judgeQuote.curPercent*100}%`});
                            return canSubmit = false;
                        }
                    }
                    if (!row.siteId) return canSubmit = this.public_message(row.code, this.$t('ymx-detail.station'));
                    if (!row.category_template_id) return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.info')}】${this.$t('ymx-detail.module')}->${this.$t('ymx-detail.classifiTemp')}`);
                    if (!row.product_template_id) return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.info')}】${this.$t('ymx-detail.module')}->${this.$t('ymx-detail.proTem')}`);
                    let findRecommend= row.basic.find(row=>row.key==='RecommendedBrowseNode'&&row.value==='');
                    if(findRecommend) return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.info')}】${this.$t('ymx-detail.module')}->RecommendedBrowseNode${this.$t('ymx-detail.attr')}`);
                    let findBasic = row.basic.find(res => res.require && res.value === '');
                    if (findBasic) return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.info')}】${this.$t('ymx-detail.module')}->${findBasic.name}`);
                    let findCommonAttr = row.commonAttList.find(res => res.require && res.value === '');
                    if (findCommonAttr) return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.info')}】${this.$t('ymx-detail.module')}->${findCommonAttr.name}`);
                    /*判断标题与描述是否必填*/
                    let listDescript = row.descript.map(res => {
                        let find = res.field.find(item => item.require === 1 && item.value === '' && item.key !== 'SKU');
                        if (find) {
                            return {
                                skuName: res.skuName,
                                find: find
                            }
                        }
                    }).filter(item => !!item);
                    if (listDescript.length > 0) {
                        let findDescript = listDescript[0];
                        return canSubmit = this.public_message(row.code, `【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')}->SKU:${findDescript.skuName}->${this.which_title(findDescript.find.key)}`);
                    }
                    /*判断标题与描述部分是否超出最大字符长度*/
                    let listDes = row.descript.map(res => {
                        let find = res.field.find(item => item.value.length > item.maxLength);
                        if (find) {
                            return {
                                skuName: res.skuName,
                                find: find
                            }
                        }
                    }).filter(item => !!item);
                    if (listDes.length > 0) {
                        let findDes = listDes[0];
                        return canSubmit = this.limit_maxLength(row.code, `【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')}->SKU:${findDes.skuName}->${this.which_title(findDes.find.key)}`);
                    }
                    /*判断SKU设置是否必填*/
                    let listVariant = row.variant.map((res, index) => {
                        let find = Object.values(res).find(item => item.require === 1 && item.value === '');
                        if (find) {
                            return {
                                find: find,
                                index: index
                            }
                        }
                    }).filter(item => !!item);
                    if (listVariant.length > 0) {
                        let findVariant = listVariant[0];
                        return canSubmit = this.public_message(row.code,`【${this.$t('ymx-detail.skuSet')}】${this.$t('ymx-detail.module')}->第${findVariant.index + 1}行->${findVariant.find.name}`);
                    }
                    let findImage = row.images.find(res => res.name !== '主图' && res.images.length <= 0);
                    if (findImage) {
                        this.$message({
                            type: "warning",
                            message: `${row.code}${this.$t('ymx-detail.account')}，【${this.$t('ymx-detail.image')}】${this.$t('ymx-detail.module')}->${this.$t('ymx-detail.subSku')}:${findImage.name}至少添加一张图片`
                        });
                        canSubmit = false;
                    }
                });
                return canSubmit;
            },
            //一键引用，提交时需要判断 标题/五点/描述（描述仅限英语站点） 是否与原数据一致，若一致不允许提交
            judge_quote(source){
                let obj = this.oldQuoteData[source.account_id];
                let canSubmit = {
                    isTrue:true
                };
                if(obj){
                    source.descript.forEach((res,index)=>{
                        if(!canSubmit.isTrue) return;
                        let curSku = res.skuName;
                        res.field.forEach((row,i)=>{
                            if(!canSubmit.isTrue) return;
//                            if(row.key==="Title"||row.key==="BulletPoint"||row.key==="Description" ){
                            if(row.key==="Title"||row.key==="BulletPoint"){
                                let percent = 0;
                                switch (row.key){
                                    case 'Title':
                                        percent = 0.9;
                                        break;
                                    case 'BulletPoint':
                                        percent = 0.95;
                                        break;
                                    case 'Description'://取消对描述的判断 Description
                                        percent = 0.95;
                                        break;
                                }
                                if(obj.descript[index]&&obj.descript[index].field[i]){
                                    canSubmit = this.calculation_repeat(row,obj.descript[index].field[i],percent,curSku);
                                }
                            }
                        })
                    });
                }
                return canSubmit
            },
            calculation_repeat(source1,source2,percent,curSku){
                let curIndex = 0;
                let curPercent = 0;
                let isSame = false;
                if(source1.key==='Title'&&source1.value){
                    curPercent = this.split_string(source1.value,source2.value);
                }else if(source1.key==='Description'&&source1.value){
                    let reg = /<[^>]+>/ig;
                    let nbsp = /&nbsp;/ig;
                    let pureData = source1.value.replace(reg,'').replace(nbsp,'');
                    let templateData = source2.value.replace(reg,'').replace(nbsp,'');
                    curPercent = this.split_string(pureData,templateData);
                }else if(source1.key==='BulletPoint'&&source1.value.length>0){
                    source1.value.forEach((row,index)=>{
                        if(source1.value[index+1]&&(source1.value[index+1]===row)){
                            isSame = true;
                            curPercent = 1;
                            return
                        }
                    });
                    if(!isSame){
                        let list = [];
                        source1.value.forEach((row,index)=>{
                            list.push(this.split_string(row,source2.value[index]));
                        });
                        curPercent = Math.max.apply(null,list);
                        curIndex = list.findIndex(row=>row===curPercent);
                    }
                }
                return {
                    key:source1.key,
                    isTrue:!(curPercent>percent),
                    curPercent:curPercent,
                    isSame:isSame,
                    curSku:curSku,
                    curIndex:curIndex
                }
            },
            /*小语种判断重复率*/
            small_language_validate(source){
                let obj = this.oldQuoteData[source.account_id];
                let canSubmit = {
                    isTrue:true
                };
                if(obj){
                    source.descript.forEach((res,index)=>{
                        if(!canSubmit.isTrue) return;
                        let curSku = res.skuName;
                        res.field.forEach((row,i)=>{
                            if(!canSubmit.isTrue) return;
                            if(row.key==="Title"){
                                let percent = 0.95;
                                if(obj.descript[index]&&obj.descript[index].field[i]){
                                    let curPercent = this.split_string(row.value,obj.descript[index].field[i].value);
                                    canSubmit = {
                                        key:row.key,
                                        isTrue:!(curPercent>percent),
                                        curPercent:curPercent,
                                        curSku:curSku,
                                    };
                                }
                            }
                        })
                    });
                }
                return canSubmit
            },
            split_string(source1,source2){
                let current  = source1.split('').filter(row=>!!row).map(row=>row.trim());
                let reverseCurrent  = clone(current).reverse();
                let template = source2.split('').filter(row=>!!row).map(row=>row.trim());
                let reverseTemplate  = clone(template).reverse();
                let list = current.filter((row,index)=>template[index]=== row);
                let reverseList = reverseCurrent.filter((row,index)=>reverseTemplate[index]=== row);
                let sequencePercent = list.length/template.length;
                let reversePercent = reverseList.length/template.length;
                return sequencePercent>reversePercent?sequencePercent:reversePercent;
            },
            //必填提示
            public_message(code, name, otherTip){
                if (otherTip) {
                    this.$message({type: 'warning', message: `【${code}】${this.$t('ymx-detail.account')}，${name}${this.$t('ymx-detail.requiredFilled')}`});
                } else {
                    this.$message({type: 'warning', message: `【${code}】${this.$t('ymx-detail.account')}，${name}${this.$t('ymx-detail.requiredFilled2')}`});
                }
                return false;
            },
            //五点描述提示
            five_points_tip(row){
                let obj = this.judge_quote(row);
                let message = '';
                if(obj.isSame){
                    this.$message({type:'warning',message:`Bullet-Point ${this.$t('ymx-detail.dupl')}`});
                    return false
                }
                switch (obj.key){
                    case 'Title':
                        message = `【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')}，sku：【${obj.curSku}】->【${this.$t('ymx-detail.title')}】${this.$t('ymx-detail.repet1')}90%`;
                        break;
                    case 'BulletPoint':
                        message = `【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')},sku:【${obj.curSku}】->【Bullet-Point】->第【${obj.curIndex+1}】${this.$t('ymx-detail.repet1')}95%`;
                        break;
                    case 'Description':
                        message = `【${this.$t('ymx-detail.titleDes')}】${this.$t('ymx-detail.module')},sku:【${obj.curSku}】->【${this.$t('ymx-detail.desc')}】${this.$t('ymx-detail.repet1')}95%`;
                        break;
                }
                this.$message({type:'warning',message:`【${row.code}】${this.$t('ymx-detail.account')}，${message},${this.$t('ymx-detail.repet2')}${Number(obj.curPercent).toFixed(2)*100}%`});
                return obj.isTrue;
            },
            //字符长度限制
            limit_maxLength(code, name) {
                this.$message({type: 'warning', message: `【${code}】${this.$t('ymx-detail.account')}，${name}${this.$t('ymx-detail.maximum')}`});
                return false;
            },
            arrangement_data(sourceData, isdraft) {
                return sourceData.map(row => {
                    let basic = {};
                    let descript = [];
                    let sku = [];
                    let img = {
                        SpuImage: [],
                        SkuImage: []
                    };
                    row.basic.forEach(res => {
                        if (res.key === 'Timer') {
                            let time = new Date(res.value).getTime() / 1000;
                            res.value = !!time?datef('YYYY-MM-dd HH:mm:ss', time):'';
                        }
                        basic[res.key] = res.value;
                    });
                    let category_template = {
                        id: row.category_template_id,
                    };
                    let product_template = {
                        id: row.product_template_id,
                    };
                    row.commonAttList.forEach(res => {
                        if (res.node_tree === 'Product,DescriptionData,Manufacturer' && res.value === '') {
                            res.value = this.form.header.brand;
                        }
                        if (res.node_tree === 'Product,DescriptionData,MfrPartNumber' && res.value === '') {
                            res.value = basic['Spu'];
                        }
                        if (res.type === 1) {
                            if (res.unitValue) {//提交单位格式为 元素名@属性：属性值，如：SpoutHeight@unitOfMeasure: "CM"
                                category_template[`${res.name}@${res.attribute.name}`] = res.unitValue;
                            }
                            category_template[res.name] = res.value
                        } else if (res.type === 2) {
                            if (res.unitValue) {//同上
                                product_template[`${res.name}@${res.attribute.name}`] = res.unitValue;
                            }
                            product_template[res.name] = res.value
                        }
                    });
                    row.descript.forEach(res => {
                        let obj = {
                            detail_id:res.detail_id||0
                        };
                        res.field.forEach(item => {
                            if (item.key !== 'SKU') {
                                obj[item.key] = item.value;
                            } else {
                                obj[item.key] = res.skuName;
                            }
                        });
                        descript.push(obj);
                    });
                    row.variant.forEach(res => {
                        let obj = {};
                        row.variant_title.forEach(item => {
                            if (res[item] && res[item].unitValue) {//提交单位格式为 元素名@属性：属性值，如：SpoutHeight@unitOfMeasure: "CM"
                                obj[`${res[item].key}@${res[item].attribute.name}`] = res[item].unitValue;
                            }
                            if (item !== 'check' && !!res[item].key) obj[res[item].key] = res[item].value;
                        });
                        sku.push(obj);
                    });
                    let cloneImages = clone(row.images);
                    cloneImages.filter(res => res.name === '主图').forEach(res => {
                        res.images = res.images.filter(item=>!!item).splice(0, 9);
                        img.SpuImage = res.images.map(item => {
                            return {
                                base_url: item.base_url,
                                path: item.path,
                            }
                        });
                    });
                    cloneImages.filter(res => res.name !== '主图').forEach(res => {
                        res.images = res.images.filter(item=>!!item).splice(0, 9);
                        let imageList = res.images.map((item, index) => {
                            return {
                                path: item.path,
                                is_default: index === 0 ? 1 : 0,
                                is_swatch: item.isSwatch
                            };
                        });
                        let ImageData = {
                            sku: res.name,
                            data: imageList
                        };
                        img.SkuImage.push(ImageData);
                    });
                    let objData = {
                        is_translate:row.is_translate,
                        account_id: row.account_id,
                        code: row.code,
                        goods_id: row.goods_id,
                        spu: this.form.spu,
                        site: row.siteId,
                        category_id: row.category_id,
                        amazon_category_name: row.category_name,
                        amazon_category_name2: row.category_name2,
                        category_template: category_template,
                        product_template: product_template,
                        basic: basic,
                        descript: descript,
                        sku: sku,
                        img: img
                    };
                    if (isdraft) {
                        this.$set(row,'oldQuoteData',this.oldQuoteData);
                        this.$set(objData, 'temp', row);
                    }
                    if (this.param.curPage !== 'copy' && !!this.form.id) this.$set(objData, 'id', this.form.id);
                    return objData;
                });
            },
            clear_cache(){
                let spu=this.form.header.spu;
                window.sessionStorage.removeItem(spu);
            },
            exit_page(){
                this.clear_cache();
                clearInterval(this.timer);
            },
            //自动缓存数据
            auto_keep_draft(){
                let spu=this.param.spu;
                window.sessionStorage.setItem(spu,JSON.stringify(this.form));
            },
            //保存为草稿箱
            keep_draft() {
                let params = {
                    data: this.arrangement_data(this.form.data, true),
                    draft_id: this.form.draft_id ? this.form.draft_id : 0
                };
                this.$http(api_publish_amazon_draft, params).then(res => {
                    if (res.data) {
                        this.form.draft_id = res.data.draft_id;
                    } else {
                        console.log(res.data, 'res.data');
                    }
                    if(res.status==1){
                        this.$notify({
                            title: '成功',
                            message: this.$t('ymx-detail.saveSucDraf'),
                            type: 'success'
                        })
                        this.clear_cache();
                    }else{
                        this.$message({type: 'error', message:"草稿箱保存失败"});
                    }
                }).catch(code => {
                    return this.$message({type: 'error', message:code.message});
                }).finally(()=>{
                    this.$reqKey('keepDraft',false)
                })
            },
            /*敏感词检测*/
            tort(){
                this.$message({type:"info",message:"敏感词检测中"});
                this.is_tort=true;
                for(let i of this.form.data){
                    for(let _i of i.descript){
                        let find_title=_i.field.find(row=>row.key=='Title');
                        let find_value=_i.field.find(row=>row.key=='Description');
                        let bool=isExistIllegalWord(find_title.value, this.tort_arr);
                        let bol=isExistIllegalWord(find_value.value,this.tort_arr);
                        if(bool||bol){
                            this.is_tort=false;
                            this.tort_value={
                                name:bool?'标题':'详情',
                                account_code:_i.skuName,
                                bool,
                                bol,
                            };
                            this.totr_dialog=true;
                            return true;
                        }
                    }
                }
                this.is_tort=false;
                return false;
            },
            /*刊登到平台
            * */
            public_channel() {
                if(!this.tort()){
                    this.goods_description();
                }else{
                    this.$reqKey(`${this.comReqKey}`, false);
                }
            },
            /*展示侵权词
            * */
            goods_description(){
                if(this.infringementData.length){
                    if (!this.validate_data()) {
                        this.$reqKey(`${this.comReqKey}`, false);
                        return
                    }else if(this.validate_data()){
                        this.infringementShow=true;
                    }
                }else{
                    if (!this.validate_data()) {
                        this.$reqKey(`${this.comReqKey}`, false);
                        return
                    }
                    let data = this.arrangement_data(this.form.data);
                    this.$http(api_save_listing, {data: data}).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.message || res
                        });
                        this.cancel();
                        this.exit_page();
                    }).catch(code => {
                        this.$message({
                            type: "error",
                            message: code.message || code
                        })
                    }).finally(() => {
                        this.$reqKey(`${this.comReqKey}`, false);
                    });
                }
            },
            //刊登到平台-》侵权记录
            submit_Info(){
                this.infringementShow=false;
                let data = this.arrangement_data(this.form.data);
                this.$http(api_save_listing, {data: data}).then(res => {
                    this.$message({
                        type: 'success',
                        message: res.message || res
                    });
                    this.exit_page();
                    this.cancel();
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                }).finally(() => {
                    this.$reqKey(`${this.comReqKey}`, false);
                });
            },
            do_cancel(){
                this.$confirm(this.$t('ymx-detail.closeNote'), this.$t('ymx-detail.tips'), {
                    confirmButtonText: this.$t('ymx-detail.confirm'),
                    cancelButtonText: this.$t('ymx-detail.cancel'),
                    type: 'warning'
                }).then(() => {
                    this.cancel();
                    this.exit_page();
                })
            },
            cancel() {
                switch(this.param.curPage){
                    case 'not':
                        this.$close(`/kandeng/amazon/info?id=${this.param.goods_id}`);
                        break;
                    case 'draft':
                        this.$close(`/kandeng/amazon/info?id=${this.form.draft_id}`);
                        break;
                    default:
                        this.$close(`/kandeng/amazon/info`);
                }
            },
            // 获取账号
            async get_account() {
                await this.$http(api_get_amazon_account).then(res => {
                    res.forEach(row => {
                        this.$set(row, 'disabled', false);
                    });
                    this.accounts = res;
                }).catch(code => {
                    this.$message({
                        type:'error',
                        message:code.message || code
                    })
                })
            },
            async get_site() {
                await this.$http(api_get_amazon_site).then(res => {
                    this.siteList = res.site;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            /*获取仓库*/
            async get_amazon_warehouse() {
                await this.$http(api_amazon_warehouse).then(res => {
                    this.amazonWarehouseList = res;
                }).catch(code => {
                    this.$message({
                        type: "error",
                        message: code.message || code
                    })
                });
            },
            /*展示侵权词弹框
            * */
            change_infringement_show(val){
                this.infringementShow=val;
            },
            //产生四个随机字母
            get_random_letter(){
                let result = [];
                for(let i =0;i<4;i++){
                    let ranNum = Math.ceil(Math.random()*25);
                    result.push(String.fromCharCode(65+ranNum));
                }
                return result.join('')
            }
        },
        computed: {
            ...mapGetters({
                objOfCategory:'ymxkandeng/categoryTemplateList',
                objOfCommonAtt:'ymxkandeng/productAttr',
                objOfProductId:'ymxkandeng/productId',
            }),
            comTimeOut(){
                return 60000;
            },
            comMinTime(){
                return 1000;
            },
            param(){
                return this.$page.param || {};
            },
            referableNum(){
                let find = this.form.data.find(row=>row.code===this.currentname);
                if(!find||Object.keys(this.historyIdObj).length<=0)return 0;
                return this.historyIdObj[find.siteId]?this.historyIdObj[find.siteId].length:0
            },
            comDisabled(){
                let cur = false;
                if(this.form&&this.form.data){
                    let find = this.form.data.find(row=>row.code===this.currentname);
                    if(find) cur = !!find.is_translate;
                }
                return cur
            },
            comAllDisabled(){
                let cur = false;
                if(this.form&&this.form.data){
                    let find = this.form.data.find(row=>!row.is_translate);
                    cur = !find
                }
                return cur;
            },
            comReqKey() {
                let value = '';
                if (this.param.curPage === 'not') {
                    value = this.param.goods_id;
                } else if (this.param.curPage === 'draft') {
                    value = this.param.id;
                }
                return `publicChannel${value}${this.param.curPage}`
            },
            accountList() {
                this.accounts.forEach(row => {
                    let find = this.form.data.find(res => res.code === row.code);
                    row.disabled = !!find;
                });
                return this.accounts;
            }
        },
        components: {
            relevanceGoods: require('./relevance-goods.vue').default,
            accounts: require('../../aliexpress/info/accounts.vue').default,
            accountTabBase: require('./account-tab-base.vue').default,
            accountTabSkuSet: require('./account-tab-sku-set.vue').default,
            accountTabDescrib: require('./account-tab-describ.vue').default,
            accountTabTitleDes: require('./account-tab-title-des.vue').default,
            infringementHint:require('./infringement-hint.vue').default,
            totrDialog:require("../../ymx/totr-dialog.vue").default,
        }
    }
</script>
