<template>
    <el-row class="c-general-info">
        <rainbow-header title="一般信息" backgroundColor="#EB5405">
            <el-form :model="form" ref="form" :rules="rules" label-width="220px">
              <!--基本信息   start -->
                <el-form-item label="范本名称：">
                    <el-row>
                        <el-col :span="largeSpan">
                            <el-input v-model="form.list.draft_name" placeholder="当存为范本时，此名称必填！"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="平台账号：">
                    <el-row v-if="param&&param.curPage==='model'">
                        <el-col :span="commonSpan">
                            <el-select v-model="form.code"
                                       @input="change_account"
                                       filterable clearable>
                                <el-option
                                        v-for="res in accountsList"
                                        :label="res.code"
                                        :value="res.code"
                                        :key="res.code"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                    <el-tag v-else type="success">{{form.code}}</el-tag>
                </el-form-item>
                <el-form-item label="平台站点：" prop="list.site">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.site"
                                        :disabled="param.curPage==='already'&&param.isAdd===false"
                                       ref="site"
                                       v-mouse-side.mousewheel="()=>{$refs.site.visible=false}"
                                       filterable
                                       @change="change_site">
                                <el-option
                                        v-for="item in siteList"
                                        :label="item.name"
                                        :value="item.siteid"
                                        :key="item.siteid"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="出售方式：">
                    <el-radio-group :value="form.list.listing_type"
                                    @input="(val)=>{change_listing_type(val)}"
                                    fill="#20a0ff" text-color="#ffffff">
                        <el-radio-button :label="2" type="primary">拍卖</el-radio-button>
                        <el-radio-button :label="1" type="primary">一口价</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="SKU属性：">
                    <el-radio-group :value="form.list.variation"
                                    :disabled="form.list.listing_type===2||enabled"
                                    @input="(val)=>{change_variation(val)}"
                                    fill="#20a0ff" text-color="#ffffff">
                        <el-radio-button :label="0" type="primary">单属性</el-radio-button>
                        <el-radio-button :label="1" type="primary">多属性</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="站点定时刊登：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-date-picker
                                    style="width:100%"
                                    v-model="form.list.timing"
                                    type="datetime"
                                    placeholder="选择日期时间">
                            </el-date-picker>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="引用模块组合：">
                    <el-row>
                        <el-col :span="commonSpan">
                            <el-select v-model="form.list.comb_model_id"
                                       ref="combModel"
                                       v-mouse-side.mousewheel="()=>{$refs.combModel.visible=false}"
                                       :disabled="modelList&&modelList.length<=0"
                                       :placeholder="placeHolder"
                                       @change="change_comb_model"
                                       filterable clearable>
                                <el-option
                                        v-for="item in modelList"
                                        :label="item.model_name"
                                        :value="item.id"
                                        :key="item.id"
                                ></el-option>
                            </el-select>
                        </el-col>
                    </el-row>
                </el-form-item>
              <!--基本信息   start -->
              <!--刊登  分类 start-->
              <span class="c-box-label">刊登分类</span>
                <el-form-item label="第一分类：" required>
                    <el-row>
                        <el-col :span="3">
                            <el-input v-model="inputValue1"
                                      :disabled="param.curPage==='already'&&param.isAdd===false"
                                      placeholder="请输入分类编码"
                                      @blur="get_category(inputValue1,1)"></el-input>
                        </el-col>
                        <el-col :span="20">
                            <el-button type="primary"
                                       class="ml-sm mr-sm"
                                       :disabled="param.curPage==='already'&&param.isAdd===false"
                                       size="mini"
                                       @click.native="select_new_category">选择平台产品分类</el-button>
                            <div class="inline">{{form.list.primary_category_pahtname}}</div>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="第二分类：">
                    <el-row>
                        <el-col :span="3">
                            <el-input v-model="inputValue2"
                                      placeholder="请输入分类编码"
                                      @blur="get_category(inputValue2,2)"></el-input>
                        </el-col>
                        <el-col :span="20">
                            <el-button type="primary"
                                       size="mini"
                                       class="ml-sm mr-sm"
                                       @click.native="select_new_category_">选择平台产品分类</el-button>
                            <div class="inline">{{form.list.second_category_name}}</div>
                            <el-button type="danger"
                                       size="mini"
                                       class="inline ml-sm mr-sm"
                                       @click.native="clears_category_name"
                                       v-if="form.list.second_category_name"
                                       >清 除</el-button>
                            <a class="link"
                               href="http://pages.ebay.com/help/sell/fees.html"
                               target="_blank">查看ebay费用</a>
                        </el-col>
                    </el-row>
                </el-form-item>
                    <!--选择产品分类弹出框 start-->
                    <category-dialog v-model="categoryDialog"
                                     :site="form.list.site"
                                     :accountId="form.list.account_id"
                                     :request="form.list.primary_category_pahtname"
                                     @submit="category_submit"></category-dialog>
                    <!--选择产品分类弹出框 end-->
              <!--刊登  分类 end-->
              <!--商店  分类 start-->
              <span class="c-box-label">商店分类</span>
                <el-form-item>请确认您的eBay账号开通了商店，否则无法使用商店分类</el-form-item>
                <el-form-item label="第一分类：">
                    <el-row :gutter="8">
                        <el-col :span="largeSpan">
                            <el-input v-model="form.list.store_name" :disabled="true"></el-input>
                        </el-col>
                        <el-col :span="surplusLar">
                            <el-button type="primary" size="mini" @click.native="select_first_store">选择商店分类</el-button>
                            <i class="icon-refresh" title="获取最新商店分类" @click="update_category"></i>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="第二分类：">
                    <el-row :gutter="8">
                        <el-col :span="largeSpan">
                            <el-input v-model="form.list.second_store_name" :disabled="true"></el-input>
                        </el-col>
                        <el-col :span="surplusLar">
                            <el-button type="primary" size="mini" @click.native="select_second_store">选择商店分类</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                    <!--选择商店分类弹出框 start-->
                        <store-dialog v-model="storeDialog" :account-id="form.list.account_id" @submit="store_submit"></store-dialog>
                    <!--选择商店分类弹出框 end-->
              <!--商店  分类 end-->
              <!--物品状况与属性 start-->
                <span class="c-box-label">物品状况与属性</span>
                <el-form-item label="OE 兼容信息：" v-if="form.set.item_compatibility_enabled"><!--item_compatibility_enabled0/1-->
                    <oe-component v-model="form.set.compatibility"></oe-component>
                </el-form-item>
                <el-form-item label="UPC：" required>
                    <el-row :gutter="8">
                        <el-col :span="commonSpan">
                            <el-input v-model="form.set.upc"></el-input>
                        </el-col>
                        <el-col :span="surplusCom">
                            <label>如果没有可以填写 <span class="operate" @click="just_copy">Does not apply</span>。如果设置了多属性，此项不需要填写</label>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="物品状况：" required>
                    <el-row :gutter="8">
                        <el-col :span="commonSpan">
                            <el-select v-model="form.set.condition_id"
                                       ref="condition"
                                       v-mouse-side.mousewheel="()=>{$refs.condition.visible=false}"
                                       filterable>
                                <el-option
                                        v-for="item in conditionList"
                                        :label="item.label"
                                        :value="item.value"
                                        :key="item.value"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="surplusCom">
                            <a class="link" href="http://pages.ebay.com/help/sell/contextual/condition_1.html" target="_blank">帮助</a>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="物品状态描述：">
                    <el-row :gutter="8">
                        <el-col :span="largeSpan">
                            <el-input v-model="form.set.condition_description" type="textarea"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
            </el-form>
            <!--出现联动数据-->
            <el-form  :form="form.specificsList" label-width="220px"
                      v-if="form.specificsList&&form.specificsList.length>0">
                <div class="tag-flex mb-sm"
                     v-for="(items,index) in form.specificsList"
                     :key="index" v-if="items.custom===0&&items.max_values<=1">
                    <span style="width:220px"
                          :title="items.category_specific_name"
                           :class="[items.min_values?'tag-flex-asterisk':'','tag-flex-label','apostrophe']">
                            <span>{{`${items.category_specific_name}：`}}</span>
                    </span>
                    <div class="tag-flex-content">
                        <el-row>
                            <el-col :span="commonSpan">
                                <el-select @change="change_specific(items)"
                                           default-first-option
                                           v-model="items.specific_value"
                                           placeholder="请搜索或选择商品属性"
                                           filterable clearable
                                           v-if="items.selection_mode==='SelectionOnly'&&items.max_values<=1">
                                    <el-option
                                            v-for="item in filter_options(items)"
                                            :label="item.category_specific_value"
                                            :value="item.category_specific_value"
                                            :key="item.category_specific_value"
                                    ></el-option>
                                </el-select>
                                <el-select
                                        default-first-option
                                        v-if="items.selection_mode==='FreeText'&&items.max_values<=1"
                                        @change="change_specific"
                                        v-model="items.specific_value"
                                        filterable allow-create clearable
                                        :placeholder="com_placeholder(items)">
                                    <el-option
                                            v-for="item in filter_options(items)"
                                            :label="item.category_specific_value"
                                            :value="item.category_specific_value"
                                            :key="item.category_specific_value"
                                    ></el-option>
                                </el-select>
                            </el-col>
                        </el-row>
                    </div>
                </div>
                <template v-for="(items,index) in form.specificsList" v-if="items.max_values>1">
                    <div class="tag-flex mb-sm">
                        <span style="width:220px"
                              :title="items.category_specific_name"
                              :class="[items.min_values?'tag-flex-asterisk':'','tag-flex-label','apostrophe']">
                                <span>{{`${items.category_specific_name}：`}}</span>
                        </span>
                        <el-checkbox-group
                                class="tag-flex-content"
                                v-model="items.specific_value">
                                    <el-checkbox v-for="it in items.detail"
                                                 class="inline"
                                                 :label="it.category_specific_value"
                                                 :key="it.category_specific_value">{{it.category_specific_value}}</el-checkbox>
                            <el-input v-if="items.selection_mode==='FreeText'"
                                      class="inline"
                                      placeholder="添加自定义多属性"
                                      @blur="add_new_value(items)"
                                      @keyup.enter.native="add_new_value(items)"
                                      v-model="items.add_new"></el-input>
                        </el-checkbox-group>
                    </div>
                </template>
                <div v-for="(items,index) in form.specificsList"
                     :key="index"
                     v-if="items.custom===1" class="mb-sm">
                    <div class="inline" style="width:220px;text-align: right">
                        <el-input
                                @blur="change_specific_k(items.category_specific_name,index)"
                                class="inline"
                                style="width:200px;"
                                v-model="items.category_specific_name"
                        ></el-input>：
                    </div>
                    <el-input
                            @blur="change_specific_v(items.specific_value,index)"
                            class="inline"
                            style="width:15%"
                            v-model="items.specific_value"></el-input>
                    <i class="delete-icon ml-sm"
                       v-if="form.specificsList.length>1&&index!==0"
                       @click="delete_new_specific(items,index)"></i>
                </div>
                <el-form-item>
                    <el-button type="primary" size="mini" class="inline" @click.native="add_new_specific">添加自定义属性</el-button>
                </el-form-item>
            </el-form>
            <!--物品状况与属性 end-->
        </rainbow-header>
    </el-row>
</template>
<style lang="stylus" scoped>
    .c-general-info{
        .c-box-label {
            box-sizing: border-box;
            width: 100%;
            color: #5e6d82;
            font-size: 1.25rem;
            padding: 0 10px 10px 0;
            display: inline-block;
            border-bottom: 2px solid #dee5ee;
            margin-bottom: 20px;
        }
    }
</style>
<script>
    import {api_get_ebay_site,api_sync_store,api_get_combList,api_get_specifics,api_ebay_oe_makes,
        api_edit_combList,api_edit_model,api_suggested_categories} from '../../../../../api/ebay-kandeng-public-module';
    import {change_proceeds,change_refuse_model,get_choice_time} from './batch_methods';
    export default{
        data(){
            return {
                specific_value:[],
                inputValue1:"",
                inputValue2:"",
                categoryNum:0,
                storeNum:0,
                enabled:false,
//                siteList:[],
                modelList:[],
                conditionList:[
                    {label:"New Brand New",value:1000},
                    {label:"New other (see details)",value:1500},
                    {label:"New with defects",value:1750},
                    {label:"Manufacturer refurbished",value:2000},
                    {label:"Seller refurbished",value:2500},
                    {label:"Like New",value:2750},
                    {label:"Used",value:3000},
                    {label:"Very Good",value:4000},
                    {label:"Good",value:5000},
                    {label:"Acceptable",value:6000},
                    {label:"For parts or not working",value:7000},
                ],
                categoryDialog:false,
                storeDialog:false,
                rules:{
                    'list.site':[
                        {required:true,message:"平台站点必填",trigger:"blur,change",type:'number'},
                    ],
                }
            }
        },
        computed:{
            placeHolder(){
                if(this.form.list.site===""){
                    return "请先选择站点"
                }else if(this.form.list.site!==""&&this.modelList&&this.modelList.length<=0){
                    return "暂无数据"
                }else{
                    return "请选择模板组合"
                }
            },
            surplusCom(){
                return Number(23-this.commonSpan);
            },
            surplusLar(){
                return Number(23-this.largeSpan);
            }
        },
        mounted(){
            this.get_model();
        },
        methods:{
            change_proceeds,
            change_refuse_model,
            get_choice_time,
            handleSelect(){},
            add_new_value(items){
                if(items.add_new==='')return;
                let find = items.detail.find(row=>row.category_specific_value===items.add_new);
                if(!!find)return this.$message({type:"warning",message:"已存在，请不要重复添加！"});
                items.detail.push({category_specific_value:items.add_new});
                items.specific_value.push(items.add_new);
                items.add_new = '';
            },
            update_category(){
                this.$http(api_sync_store,{account_id:this.form.list.account_id}).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            clears_category_name(){
                this.form.list.second_category_name = '';
                this.form.list.second_categoryid = '';
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.category_specific_value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            get_category(val,number){
                if(this.form.list.site==='')return this.$message({type:"warning",message:"请选择先站点"});
                if(!val)return;
                let params = {
                    site_id:this.form.list.site,
                    query:val,
                    account_id:this.form.list.account_id,
                };
                this.loading = true;
                this.$http(api_suggested_categories,params).then(res=>{
                    let cur,compatibility_enabled,variations_enabled;
                    if(res.data&&res.data.length>0){
                        cur = res.data[0].category_name;
                        compatibility_enabled = res.data[0].item_compatibility_enabled;
                        variations_enabled = res.data[0].variations_enabled;
                    }else{
                        cur = '该编码下暂无数据，请更换其他分类';
                        compatibility_enabled = '';
                        variations_enabled = 1;
                    }
                    if(number===1){
                        this.form.list.primary_category_pahtname = cur;
                        this.form.list.primary_categoryid = res.data&&res.data.length>0?val:'';
                        this.form.set.item_compatibility_enabled = compatibility_enabled;//判断是否显示OE信息;
                        if(variations_enabled===0){
                            this.change_variation(0);
                            this.enabled = true;
                        }else{
                            this.enabled = false;
                        }
                        this.$emit('get-category');
                        this.get_specifics(this.form.list.primary_categoryid,this.form.list.site,true)
                        //切换站点需清空sku里面的多属性
                        this.form.list.useMappingspec = [];
                        this.form.varians.forEach(row=>row.variation = [])
                    }else if(number===2){
                        this.$set(this.form.list,'second_category_name',cur);
                        this.form.list.second_categoryid = res.data&&res.data.length>0?val:'';
                    }
                }).catch(code=>{
                    this.loading = false;
                    this.$message({type:"error", message: code.message || code});
                })
            },
            change_account(){
                this.$emit('change-account',this.form.code);
            },
            filter_options(items){
                if(!items.detail||items.detail.length<=0)return;
                let cloneArr = window.clone(this.form.specificsList);
                if(!!items.relationship){
                    let detail = [];
                    let parent = items.detail[0].parent_name;
                    let cur = cloneArr.find(row=>row.category_specific_name===parent);
                    if(!!cur){
                        detail = items.detail.filter(item=>item.parent_value===cur.specific_value);
                        if(items.selection_mode==="SelectionOnly"){
                            items.specific_value="";
                        }
                    }
                    return detail;
                }else{
                    return items.detail;
                }
            },
            com_placeholder(items){
                if(!items.detail||items.detail.length<=0)return '请添加商品属性';
                let cur = "";
                if(this.filter_options(items).length<=0){
                    let parentName = items.detail[0].parent_name;
                    let curObj = this.form.specificsList.find(row=>row.category_specific_name===parentName);
                    if(!!curObj) {
                        if (curObj.specific_value === '') {
                            cur = `请先选择${parentName}`;
                        } else {
                            cur = "暂无数据";
                        }
                    }
                }else{
                    cur = "请添加或选择商品属性";
                }
                return cur;
            },
            change_comb_model(val){
                if(val=="")return;
                this.edit_model(val);
            },
            /*编辑   API*/
            edit_model(id){
                let params = {
                    model_type:"comb",
                    id:id,
                };
                this.$http(api_edit_combList,params).then(res=>{
                    let cur = res.data;
                    cur.style&&(this.form.list.mod_style = cur.style);
                    cur.trans&&(this.form.list.mod_trans = cur.trans);
                    cur.location&&(this.form.list.mod_location = cur.location);
                    cur.returngoods&&(this.form.list.mod_return = cur.returngoods);
                    cur.sale&&(this.form.list.mod_sale = cur.sale);
                    (!!cur.exclude)&&(this.form.set.custom_exclude = 3);
                    this.$nextTick(()=>{
                        cur.exclude&&(this.form.list.mod_exclude = cur.exclude)
                    });
                    if(!!cur.individual) this.get_individual(cur.individual);
                    if(!!cur.bargaining) this.get_barginning(cur.bargaining);
                    if(!!cur.gallery) this.get_picture_gallery(cur.gallery);
                    if(!!cur.choice) this.get_choice(cur.choice);
                    if(!!cur.receivables)this.change_proceeds(cur.receivables);
                    if(!!cur.refuse)this.change_refuse_model(cur.refuse);
                    if(!!cur.choice)this.get_choice_time(cur.choice);
                    if(!!cur.quantity)this.get_quantity(cur.quantity);
                }).catch(code=>{
                    console.log("code",code);
                });
            },
            //私人
            get_individual(val){
                let params = {
                    model_type:"individual",
                    id:val
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.set.individual_listing = res.data.individual_listing;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //接受买家还价
            get_barginning(val){
                let params = {
                    model_type:"bargaining",
                    id:val
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.list.best_offer = res.data.best_offer;
                    this.form.list.buy_it_nowprice = res.data.accept_lowest_price;
                    this.form.list.reserve_price = res.data.reject_lowest_price;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //橱窗展示(Gallery)图片
            get_picture_gallery(val){
                let params = {
                    model_type:"gallery",
                    id:val
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.set.picture_gallery = res.data.picture_gallery;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //备货时间
            get_choice(val){
                let params = {
                    model_type:"choice",
                    id:val,
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.set.choice_date = res.data.choice_date;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //获取数量
            get_quantity(val){
                let params = {
                    model_type:"quantity",
                    id:val,
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.list.quantity = res.data.quantity;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //上门提货
            get_pickup(val){
                let params = {
                    model_type:"pickup",
                    id:val
                };
                this.$http(api_edit_model,params).then(res=>{
                    this.form.set.local_pickup = res.data.local_pickup;
                }).catch(code=>{
                    console.log("code",code);
                })
            },
            change_specific(items){
                this.$emit("change-specific");
            },
            change_specific_k(val,index){
                if(!val)return;
                let curList = window.clone(this.form.specificsList);
                curList.splice(index,1);
                let cur = curList.find(row=>{
                    return row.category_specific_name.toLowerCase()===val.toLowerCase();
                });
                if(!!cur)this.$message({type:"warning",message:"属性不能重复，请修改"});
                this.$emit("change-specific");
            },
            change_specific_v(val,index){
                if(!val)return;
                let curList = window.clone(this.form.specificsList);
                curList.splice(index,1);
                let cur = curList.find(row=>{
                    console.log(row.specific_value,'specific_value');
                    return row.specific_value.toLowerCase()===val.toLowerCase()
                });
                if(!!cur) this.$message({type:"warning",message:"属性值不能重复，请修改"});
                this.$emit("change-specific");
            },
            //更改站点
            change_site(val){
                let curSiteList = window.clone(this.siteList);
                let curSite = curSiteList.find(row=>{return row.siteid===val});
                this.form.list.primary_category_pahtname = "";
                this.form.list.primary_categoryid = "";
                this.form.list.second_category_name = "";
                this.form.list.second_categoryid = "";
                if(!!this.form.list.time_zone){
                    this.form.list.time_zone = curSite.time_zone;
                }else{
                    this.$set(this.form.list,"time_zone",curSite.time_zone)
                }
                this.$emit("change-site",curSite);
                if(!!this.form.list.channel_id) this.get_classify(this.form.list.site,this.form.list.channel_id);
            },
            get_classify(site,key){
                let params = {
                    site_id:site,
                    query:key,
                    account_id:this.form.list.account_id,
                };
                this.$http(api_suggested_categories,params).then(res=>{
                    if(!res.data||res.data.length<=0) return this.$message({type:"warning",message:"当前站点下分类数据为空，请更换至其他站点"});
                    this.form.list.primary_categoryid = res.data[0].category_id;
                    this.form.list.primary_category_pahtname = res.data[0].category_name;
                }).catch(code=>{
                    console.log(code);
                })
            },
            // 选择产品分类
            select_new_category(){
                if(this.form.list.site==="")return this.$message({type:"warning",message:"请先选择站点"});
                this.categoryNum = 1;
                this.categoryDialog = true;
            },
            //  选择产品分类2
            select_new_category_(){
                if(this.form.list.site==="")return this.$message({type:"warning",message:"请先选择站点"});
                this.categoryNum = 2;
                this.categoryDialog = true;
            },
            //选择商店 第一分类
            select_first_store(){
                if(this.form.list.site==="")return this.$message({type:"warning",message:"请先选择站点"});
                this.storeNum = 1;
                this.storeDialog = true;
            },
            //选择商店 第二分类
            select_second_store(){
                if(this.form.list.site==="")return this.$message({type:"warning",message:"请先选择站点"});
                this.storeNum = 2;
                this.storeDialog = true;
            },
            store_submit(nameList,currentName){
                if(nameList.length<=0)return this.$message({message:"尚未选择任何分类", type:'warning'});
                let length = nameList.length;
                this.storeDialog = false;
                if(this.storeNum===1){
                    this.form.list.store_name = currentName;
                    this.form.list.store_category_id = nameList[length-1].parent_id;
                }else{
                    this.form.list.second_store_name = currentName;
                    this.form.list.store_category2_id = nameList[length-1].parent_id;
                }
            },
            category_submit(nameList,name,compatibility_enabled,whichHandle,enabled){
                this.categoryDialog = false;
                if(nameList.length<0)return this.$message({message:"尚未选择任何分类", type:'warning'});
                let length = nameList.length;
                if(this.categoryNum===1){
                    if(whichHandle===0){
                        this.form.list.primary_category_pahtname = nameList;
                        this.form.list.primary_categoryid = name;
                        this.form.set.item_compatibility_enabled = compatibility_enabled;
                    }else{
                        this.form.list.primary_category_pahtname = name;
                        this.form.list.primary_categoryid = nameList[length-1].category_id;
                        this.form.set.item_compatibility_enabled = nameList[length-1].item_compatibility_enabled;
                    }
                    if(enabled===0||nameList[length-1].variations_enabled===0) {
                        this.change_variation(0);
                        this.enabled = true;
                    }else{
                        this.enabled = false;
                    }
                    this.$emit('get-category');
                    this.get_specifics(this.form.list.primary_categoryid,this.form.list.site,true);
                    //切换站点需清空sku里面的多属性
                    this.form.list.useMappingspec = [];
                    this.form.varians.forEach(row=>row.variation = [])
                }else{
                    if(whichHandle===0){
                        this.form.list.second_category_name = nameList;
                        this.form.list.second_categoryid = name;
                    }else{
                        this.form.list.second_category_name = name;
                        this.form.list.second_categoryid = nameList[length-1].category_id;
                    }
                }
            },
            get_model(){//模板
                if(!this.form.list||this.form.list.site==='')return;
                let params = {
                    model_type:"comb",
                    site:this.form.list.site,
//                    ebay_account:this.form.published-records.account_id,
                };
                this.$http(api_get_combList,params).then(res=>{
                    this.modelList = res.data;
                }).catch(code=>{
                    console.log(code);
                })
            },
            //Does not apply  复制
            just_copy(){
                this.form.set.upc = "Does not apply";
            },
            //更改出售方式
            change_listing_type(val){
                this.form.list.listing_type = val;
                if(val===2){
                    this.form.list.variation = 0;
                    this.form.list.goods_type = 1;
                }else{
                    this.form.list.variation = this.form.varians&&this.form.varians.length>1?1:0;
                    this.form.list.goods_type = this.form.varians&&this.form.varians.length>1?1:0;
                }
                this.form.list.quantity = 1;
                this.form.list.listing_duration = "";
                this.form.list.buy_it_nowprice = "";
                this.form.list.vat_percent = "";
                this.form.list.best_offer = 0;
                this.form.list.start_price = "";
                this.form.list.reserve_price = "";
                this.form.set.individual_listing = 1;
                this.form.list.promotion_id = "";
            },
            change_variation(val){
                this.form.list.variation = val;
                this.form.list.goods_type = val?2:1;
                if(val){//多属性
                    this.form.list.local_sku = "";
                    this.form.list.sku= "";
                    this.form.list.sku_id= "";
                }else{//单属性
                    let length = this.form.varians&&this.form.varians.length>0?this.form.varians.length:0;
                    this.form.list.local_sku = length>0?this.form.varians[0].v_sku:"";
                    this.form.list.sku = length>0?`${this.form.varians[0].combine_sku}`:"";
                    this.form.list.sku_id = length>0?`${this.form.varians[0].sku_id}`:"";
                }
            },
            //添加自定义属性
            add_new_specific(){
                let cur = this.form.specificsList.find(row=>{
                    if(row.custom===1){
                        return  row.category_specific_name==='';
                    }
                });
                if(!!cur)return this.$message({message:"发现有未填写的属性名，请补充完整!", type:'warning'});
                let params = {
                    category_specific_name:"",
                    specific_value:"",
                    custom:1,
                };
                this.form.specificsList.push(params);
            },
            //删除自定义属性
            delete_new_specific(items,index){
                this.form.specificsList.splice(index,1);
                this.$emit('delete-new-specific',items);
            },
            //获取联动属性
            get_specifics(category_id,site,getDefault){
                if(!category_id||site==="")return;
                /*sku设置页面数据*/
                let params = {
                    category_id:category_id,
                    site:site,
                };
               return  this.$http(api_get_specifics,params).then(res=>{
                   if(res.length<=0){
                       this.form.mappingspec = [];
                       let params = {
                           category_specific_name:"",
                           specific_value:"",
                           custom:1,
                       };
                       res.push(params);
                       this.$set(this.form,'specificsList',res);
                   }else{
                       this.form.mappingspec = [];
                       res.forEach((row,index)=>{
                           if(row.max_values>1){
                               this.$set(row,'specific_value',[]);
                           }else{
                               this.$set(row,'specific_value','');
                           }
                           this.$set(row,'custom',0);
                           //max_values>1属性值类型为多选
                           if(row.max_values>1&&(row.selection_mode='FreeText')){
                               this.$set(row,'add_new','');
                           }
                       });
                       /*未刊登页面&&编辑页面中的更换分类，都为Brand和MPN设置默认值；
                       * */
                       if(this.param.isAdd||getDefault){
                           res.forEach(row=>{
                               row.category_specific_name==='Brand'&&(row.specific_value = 'Unbranded');
                               row.category_specific_name==='MPN'&&(row.specific_value = 'Does Not Apply');
                               row.category_specific_name==='Manufacturer Part Number'&&(row.specific_value = 'Does Not Apply');
                           })
                       };
                       if(this.param.isAdd){
                           res.forEach(row=>{
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
                               this.form.mappingspec.push(curRow);
                           })
                       };
                       if(!this.form.specificsList){
                           this.$set(this.form,'specificsList',res);
                       }else{
                           this.form.specificsList = res;
                       }
                   }
                   return Promise.resolve();
                }).catch(code=>{
                    console.log(code);
                })
            }
        },
        props:{
            form:{
                require:true,
                type:Object
            },
            siteList:{
                require:true,
                type:Array
            },
            commonSpan:{
                require:true,
                type:Number
            },
            largeSpan:{
                require:true,
                type:Number
            },
            accountsList:{
                require:true,
                type:Array
            },
            param:{
                require:true,
                type:Object
            }
        },
        components: {
            classifyTree:require('./classify-tree.vue').default,
            categoryDialog:require('../../category-dialog.vue').default,
            storeDialog:require('./store-dialog.vue').default,
            uiTip:require('../../../../../components/ui-tip.vue').default,
            oeComponent:require('./oe-component.vue').default,
            rainbowHeader:require('@/components/rainbow-header.vue').default,
        }
    }
</script>
