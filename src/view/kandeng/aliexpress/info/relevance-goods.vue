<template>
    <div class="rel-goods">
        <!--关联商品信息-->
        <el-row class="p-relevance-goods-wish">
            <div class="p-titleBgcol">
                <span>{{label}}</span>
            </div>
            <div class="p-titleColour">
                <el-form :model="relevanceForm" ref="relevanceForm" label-width="175px">
                    <el-form-item label="产品名称：">
                        <span> {{relevanceForm.name}}</span>
                    </el-form-item>
                    <el-form-item label="本地SPU：">
                        <span> {{relevanceForm.spu}}</span>
                    </el-form-item>
                    <el-form-item label="产品品牌：">
                        <span v-if="!!relevanceForm.goods_brand">{{relevanceForm.goods_brand}}</span>
                        <span v-else>无品牌信息</span>
                    </el-form-item>
                    <el-form-item label="本地分类：">
                        <span> {{relevanceForm.category_name}}</span>
                    </el-form-item>
                    <el-form-item label="物流属性：">
                        <span> {{relevanceForm.transport_property}}</span>
                    </el-form-item>
                    <el-form-item label="来源渠道：" v-if="closable">
                        <el-button type="primary" @click='add_account' size="mini"> 添加账号</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-row>
        <accounts v-model="accountVisable" :accounts="accounts" @selected="keep_channel"></accounts>
        <el-tabs type="border-card" @tab-click="tab_click" style="width:100%" :active-name="currentTab"  :closable="closable"
                 v-if="relevanceForm.vars&&relevanceForm.vars.length!==0"  class="mt-sm"  @tab-remove="removeTab">
            <el-tab-pane :label="item.account_code" :name="item.account_code"
                         v-for="(item,index) in  relevanceForm.vars"
                         :key="index">
                <div>
                    <!-- 基本信息 -->
                    <titles :singleData="item"
                            ref="titles"
                            :id="relevanceForm.goods_id"
                            :add="add" @classifys="classifys"
                            @get_goods_id="get_goods_id"
                            @get-imgs="get_imgs"
                            :isCopy="isCopy"
                            :isTime="isTime"
                            @copy="copy"
                    ></titles>
                    <!-- SKU信息 -->
                    <attribute-set :tableData="item"
                                   :base-url="relevanceForm.base_url||item.base_url"
                                   :id="relevanceForm.goods_id"
                                   ref="sets"
                                   :add="add"
                                   :isCopy="isCopy"
                                   :true-id="trueId"
                                   :isTime="isTime"
                                   @submit-sku="submit_sku"
                                   :spu="relevanceForm.spu"></attribute-set>
                    <!-- 图片与描述 -->
                    <picture-describe :pictureData="item"
                                      ref="picture"
                                      :base-url="relevanceForm.base_url||item.base_url"
                                      :id="relevanceForm.goods_id"
                                      :spu="relevanceForm.spu"
                                      :true-id="trueId"
                                      :isCopy="isCopy"
                                      :especialIds="especialIds"
                                      :show-mobie-detail="showMobieDetail(item)"
                    ></picture-describe>
                    <!-- 包装信息 -->
                    <pack-info :singleData="item"></pack-info>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<style lang="stylus">
    .rel-goods {
        .acconut-choose {
            min-height: 300px;
            width: 300px;
            overflow-x: hidden;
            .el-select {
                .el-select__tags {
                    top: 40px;
                    > span {
                        display: inline-grid;
                        white-space: normal;
                    }
                }
                .el-input {
                    .el-input__inner {
                        height: 26px !important;
                    }
                    .el-input__icon .el-icon-caret-top {
                        height: 26px !important;
                    }
                }
            }
        }
        .p-relevance-goods-wish {
            .p-titleBgcol {
                background: #FAECE7;
                span {
                    color: #FFF;
                    font-weight: bold;
                    padding: 5px 10px;
                    font-size: 1.7rem;
                    display: inline-block;
                    background: #FF6C36;
                }
            }
            .p-titleColour {
                padding: 20px;
                border-left: 3px solid #FF6C36;
                .channel {
                    height: 26px;
                    .el-select__tags {
                        display: none;
                    }
                    .el-select > .el-input {
                        height: 26px;
                    }
                    .el-input__inner {
                        height: 26px !important;
                    }
                }
            }
        }
    }
</style>
<script>
    import {
        api_aliexpress_account,
        api_aliexpress_permission,
        api_aliexpress_sku,
        api_aliexpress_template,
        api_aliexpress_service_template,
        api_aliexpress_team,
        api_aliexpress_sizeTemp,
        api_aliexpress_sale,
        api_aliexpress_brand,
        api_aliexpress_relation,
        api_aliexpress_custom,
        api_get_same_spu,
        api_express_get_accounts,
        api_pricing_rules
    } from "../../../../api/publish-smt"
    import attributeSet from './attribute-set.vue'; //-----多属性设置引入
    import pictureDescribe from './picture-describe.vue'; //-----图片与描述引入
    import {api_git_img} from '../../../../api/amazon-publish';
    export default{
        data(){
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                allPricingRules:[],
                especialIds:[],//图片详情所传入的ID
                accountVisable: false,
                currentTab: "",
                channelid: [],
                account: [],
                single: {
//                    detail_images:[],
                    category_id: "",
                    brand_id: "",
                    account_id: "",
                    salesperson_id:"",
                    warehouse_id: "",
                    title: "",
                    deliveryTime: 5,
                    promiseTemplateId: "",
                    freightTemplateId: "",
                    imageURLs: "",
                    productUnit: "",
                    is_wholesale:false,
//                    is_plan_publish:"",
                    relation_template_id:"",
                    relation_template_postion:"",
                    custom_template_id:"",
                    custom_template_postion:"",
                    plan_publish_time: "",
                    package_type: 0,
                    lotNum: "",
                    packageLength: "",
                    packageWidth: "",
                    packageHeight: "",
                    grossWeight: "",
                    isPackSell: "",
                    baseUnit: "",
                    addUnit: "",
                    addWeight: "",
                    wsValidNum: 14,
                    bulkOrder: 2,
                    bulkDiscount: 5,
                    reduceStrategy: "payment_success_deduct",
                    groupId: "",
                    currencyCode: "",
                    detail: "",
                    mobileDetail: [],
                },
                imagDataList:[],
            }
        },
        computed: {
            accounts(){
                return this.account.map(account => {
                    let vars = this.relevanceForm.vars || [];
                    let find = vars.find((r) => {
                        return r.account_id === account.account_id;
                    });
                    account.disabled = !!find;
                    return account;
                });
            },
            closable(){
                if(this.isCopy){
                    return true
                }else {
                    if(this.add){
                        return true
                    }else {
                        return false
                    }
                }
            },
        },
        methods: {
            showMobieDetail(item){
                if(item.mobileDetail&&Array.isArray(item.mobileDetail)) {
                    return !!(item.mobileDetail && item.mobileDetail.length);
                }else if(item.mobileDetail&&item.mobileDetail.mobileDetail&&Array.isArray(item.mobileDetail.mobileDetail)){
                    return !!(item.mobileDetail.mobileDetail && item.mobileDetail.mobileDetail.length);
                }
            },
            get_goods_id(val){
                this.especialIds = [...this.especialIds,val];
            },
            init_data(goods_id,spu){//在info/index页面使用
                this.especialIds = [goods_id];
                this.get_account(spu).then(res=>{
                    if(this.relevanceForm&&this.relevanceForm.default_account_id!==""){
                        let arr=[];
                        let find=this.account.find(row=>{
                            return row.account_id===this.relevanceForm.default_account_id;
                        });
                        if(find){
                            arr.push(find);
                            this.keep_channel(arr);
                        }
                    }
                });
            },
            submit_sku(val){
                this.especialIds = [...this.especialIds,...val];
            },
            get_account(spu){//在 info/index页面也有请求
                return this.$http(api_express_get_accounts,{spu:this.relevanceForm.spu||this.relevanceForm.goods_spu||spu}).then(res => {
                    this.account = res.map(row => {
                        row.disabled = false;
                        return row;
                    });
                    return Promise.resolve(res)
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                });
            },
        	//获取新的图片
            get_imgs(val){
            	let find = this.relevanceForm.vars.find(row=>{
                    return row.account_id===val.account_id;
                });
            	if(!!find){
            		this.$set(find,'imgs',val.imgs);
                }
            },
            // 复制状态下修改分类
            copy(val){
                let index=this.relevanceForm.vars.findIndex(row=>{
                    return row.account_code===this.currentTab;
                });
                 this.$emit('copy',val,index)
            },
            //编辑状态下，修改分类
            classifys(val){
                this.$emit("classifys",val);
            },
            //验证使用
            sumbit(){
                if(this.$refs.titles){
                    let length = this.$refs.titles.length;
                    let data = [];
                    for (let i = 0; i < length; i++) {
                        data[i] = false;
                        data[i] = this.$refs.titles[i].sumbit();
                    }
                    return data;
                }else {
                    return [false]
                }
            },
            //复制添加账号
            copy_accout(val){
                setTimeout(()=>{
                    this.$reqKey('url_post_publish_express_batch_copy',false);
                },200);
                let length;
                    if(this.relevanceForm.vars){
                        length= this.relevanceForm.vars.length
                    }else {
                        this.relevanceForm.vars=[];
                        length=0
                    }
                val.forEach((row,row_i)=>{
                    let temps=window.clone(this.tempData);
                    temps.index=length+row_i+"";
                    temps.account_id=row.account_id;
                    temps.account_name = row.account_name;
                    temps.account_code = row.code;
                    temps.base_url = this.tempData.base_url;
                    if(temps.is_wholesale){
                        setTimeout(()=>{
                            this.$refs.sets[length+row_i]&&this.$refs.sets[length+row_i].change_batch_price();
                        },600)
                    }
                    const template = this.get_template(row.account_id);
                    const ser_template = this.get_service_tem(row.account_id);
                    const grounp = this.get_grounp(row.account_id);
                    const sales=this.get_sales(row.account_id);
                    const relation=this.get_relation(row.account_id);
                    const custom=this.get_custom(row.account_id);
                    const same_spu = this.get_same_spu(row.account_id);
                    Promise.all([template, ser_template, grounp,sales,relation,custom,same_spu]).then(([temp, serv, gro,sale,rela,customer,same_pro]) => {
                        temps.sales=sale;
                        temps.salesperson_id=sale.length&&sale[0].seller_id ? sale[0].seller_id : "";
                        temps.template = temp;
                        temps.relation_template=rela;
                        temps.custom_template=customer;
                        temps.server_template = serv;
                        if(serv.length){
                            temps.promiseTemplateId = 0;
                        }
                        temps.same_spus = same_pro;
                        temps.group =gro.map(group=>{
                            let singlegroup={
                                value:group.group_id,
                                label:group.group_name
                            };
                            if(!!group.children){
                                singlegroup.children=group.children.map(child=>{
                                    let childs={
                                        value:child.group_id,
                                        label:child.group_name
                                    };
                                    return  childs
                                })
                            }
                            return  singlegroup
                        });
                        temps.imgs = [];
                        temps.imgs = this.imagDataList;
                        temps.brand = [];
                        temps.brand_id = "";
                        this.relevanceForm.vars.push(temps);
                        this.currentTab=this.relevanceForm.vars[this.relevanceForm.vars.length-1].account_code
                    })
                })

            },
            //复制时获取新图
            get_new_img(id){
                this.$http(api_git_img,id).then(res=>{
                    this.imagDataList = [];
                    if(!res||res.length<=0) return;
                    res.forEach(row=>{
                        this.imagDataList = [...this.imagDataList,...row.images];
                    });
                    this.baseUrl = res[0].baseUrl||"";
                }).catch(code=>{
                    console.log(code);
                })
            },
            //添加账号数据
            keep_channel(val){
                this.accountVisable = false;
                if (val.length === 0) {
                    this.$reqKey('url_post_publish_express_batch_copy',false);
                    this.$message({type: "warning", message: "请选择账号"});
                    return;
                }
                if(this.isCopy){
                    this.copy_accout(val);
                    return;
                }
                setTimeout(()=>{
                    this.$reqKey('url_post_publish_express_batch_copy',false);
                },200);

                /*处理刊登定价*/
                let total_price = (PricingRules,skuId)=>{
                    let totalPrice = '';
                    if(PricingRules&&PricingRules[skuId]&&PricingRules[skuId].total_price){
                        totalPrice = PricingRules[skuId].total_price;
                    }
                    return totalPrice;
                };

                val.forEach(row => {
                    let find = this.account.find(item => {
                        return row.account_id === item.account_id
                    });
                    //获取权限
                    const permission = this.get_permission(row.account_id);
                    const template = this.get_template(row.account_id);
                    const ser_template = this.get_service_tem(row.account_id);
                    const grounp = this.get_grounp(row.account_id);
                    const sales=this.get_sales(row.account_id);
                    const relation=this.get_relation(row.account_id);
                    const custom=this.get_custom(row.account_id);
                    const same_spu = this.get_same_spu(row.account_id);
                    Promise.all([permission, template, ser_template, grounp,sales,relation,custom,same_spu]).then(([per, temp, serv, gro,sale,rela,customer,same_pro]) => {
                        let data = window.clone(this.single);
                        data.description = this.relevanceForm.description;
                        data.title = this.relevanceForm.packing_en_name;
                        data.description=this.relevanceForm.description;
                        data.groupId = this.relevanceForm.groupId;
                        data.title=this.relevanceForm.title;
                        data.base_url = this.relevanceForm.base_url;
                        data.account_id = find.account_id;
                        data.account_name = find.account_name;
                        data.account_code = find.code;
                        data.template = temp;
                        data.relation_template=rela;
                        data.custom_template=customer;
                        data.sales=sale;
                        data.same_spus = same_pro;
                        data.grossWeight = this.relevanceForm.weight/1000;//由g转换为公斤;
                        data.packageLength = this.relevanceForm.depth;
                        data.packageWidth = this.relevanceForm.width;
                        data.packageHeight = this.relevanceForm.height;
                        data.salesperson_id=sale.length&&sale[0].seller_id ? sale[0].seller_id : "";
                        data.server_template = serv;
                        if(serv.length){
                            data.promiseTemplateId = 0;
                        }
                        data.group = gro.map(group=>{
                            let singlegroup={
                                value:group.group_id,
                                label:group.group_name
                            };
                            if(!!group.children){
                                singlegroup.children=group.children.map(child=>{
                                    let childs={
                                        value:child.group_id,
                                        label:child.group_name
                                    };
                                    return  childs
                                })
                            }
                            return  singlegroup
                        });
                        data.categoryArray = this.relevanceForm.category_relation||[];
                        if(data.categoryArray.length){
                            data.categoryArray.forEach(it=>{
                                it.category_id +="";
                            });
                        }
                        data.aeopNationalQuoteConfiguration=[];
                        data.brand=[];
                        data.attr_info=[];
                        data.imgs=[];
                        data.listing_info=[];
                        data.local_attr=[];
                        data.quote_config_status=0;
                        data.sku_attr_info=[];
                        data.delivery=[];
                        let per_length = data.categoryArray.length;
                        if(per_length){
                            data.category_id = data.categoryArray[0].category_id;
                            if(data.categoryArray[per_length - 1].required_size_model===1){
                                data.required_size_model=1;
                                const  tempsize=this.get_sizeTemp({ category_id:data.category_id,  account_id: data.account_id});
                                const  tempskus=this.get_sku({ category_id:data.category_id,account_id: data.account_id,goods_id:this.relevanceForm.goods_id,});
                                Promise.all([tempsize,tempskus]).then(async ([sizes,sku])=>{
                                    /*获取刊登定价*/
                                    let skuIdList = sku.listing_info.map(item=>item.goods_sku_id);
                                    let PricingRules = await this.$http(api_pricing_rules,{
                                        channel_id:4,
                                        account_id:row.account_id,
                                        site_code:0,
                                        sku_id:skuIdList,
                                    });

                                    data.sizechart_id="";
                                    data.sizes=sizes;
                                    data.sku_attr_info = sku.sku_attr_info.map(skus => {
                                        skus.list_val && skus.list_val.forEach(tags => {
                                            tags.disable = false;
                                        });
                                        this.$set(skus,'is_checked',skus.required || skus.is_checked ? true : false);
                                        return skus
                                    });
                                    let findDeliveryIndex= data.sku_attr_info.findIndex(its=>{
                                        return its.names_en==='Ships From'
                                    });
                                    if(findDeliveryIndex!==-1){
                                        data.delivery=[data.sku_attr_info[findDeliveryIndex]];
                                        data.sku_attr_info.splice(findDeliveryIndex,1)
                                    }else {
                                        data.delivery=[];
                                    }
                                    sku.attr_info.attr= sku.attr_info.attr.map(rows=>{
                                        if (rows.attribute_show_type_value === "check_box") {
                                            rows.list_val = rows.list_val.map(box => {
                                                if(rows.default_id&&box.id&&rows.default_id.includes(box.id)){
                                                    this.$set(box,'isCheck',true);
                                                }else {
                                                    this.$set(box,'isCheck',false);
                                                }
                                                return box
                                            })
                                        } else if(rows.attribute_show_type_value === "input"||rows.attribute_show_type_value === "interval"){rows.value = rows.default_value;
                                        }else  {
                                            rows.value = rows.default_id;
                                            if(rows.attribute_show_type_value === "list_box"&&rows.default_value){
                                                rows.input=rows.default_value;
                                            }
                                        }
                                        return rows
                                    });
                                    let attr_diy=sku.attr_info.diy_attr.map(row=>{
                                        return {
                                            name:row.attrName,
                                            value:row.attrValue,
                                        }
                                    });
                                    data.attr_info=[...sku.attr_info.attr,...attr_diy];
                                    data.attr_info.forEach(row=>{
                                        if(row.parent_attr_id===0){
                                            this.$set(row,'isShow',true);
                                        }else{
                                            this.$set(row,'isShow',false);
                                        }
                                    });
                                    data.brand = sku.brand;
                                    data.aeopNationalQuoteConfiguration= sku.aeopNationalQuoteConfiguration;
                                    data.aeopNationalQuoteConfiguration.forEach(it=>{
                                        if(it.relative===undefined){
                                            this.$set(it,'relative','');
                                        }
                                        if(it.percentage===undefined){
                                            this.$set(it,'percentage','');
                                        }
                                        if(Math.abs(it.relative)>0||Math.abs(it.percentage)>0){
                                            if(it.relative>=0||it.percentage>=0){
                                                this.$set(it,"symbol",'0');
                                            }else{
                                                this.$set(it,"symbol",'1');
                                                it.relative<0&&(it.relative = -it.relative);
                                                it.percentage<0&&(it.percentage = -it.percentage);
                                            }
                                        }else{
                                            this.$set(it,"symbol",'0');
                                        }
                                    });
                                    data.region_group_id_old = data.region_group_id;
                                    data.region_template_id_old = data.region_template_id;
                                    data.configuration_type_old = data.configuration_type;
                                    data.aeopNationalQuoteConfigurationOld = JSON.parse(JSON.stringify(data.aeopNationalQuoteConfiguration));
                                    data.brand_required = sku.brand_required;
                                    data.quote_config_status = sku.quote_config_status ? true : false;
                                    data.listing_info = sku.listing_info.map(info => {
                                        /*刊登定价映射数据*/
                                        info.retail_price = total_price(PricingRules,info.goods_sku_id);
                                        info.isCheck = true;
                                        info.ipm_sku_stock=0;
                                        info.sku_attributes.forEach(ali => {
                                            if (ali.customized_name === 1) {
                                                ali.custom_name = "";
//                                                ali.custom_pic = "";
                                            }
                                        });
                                        return info
                                    });
                                    data.local_attr=sku.local_attr.map(local=>{
                                        local.disable=false;
                                        return local
                                    });
                                    data.imgs=sku.imgs;
                                    data.index=this.relevanceForm.vars.length+'';
                                    let length = this.relevanceForm.vars.length;
                                    this.relevanceForm.vars.push(data);
                                    this.currentTab = this.relevanceForm.vars[length].account_code || "";
                                })
                            }else {
                                data.required_size_model=0;
                                let postData={
                                    category_id:data.category_id,
                                    goods_id:this.relevanceForm.goods_id,
                                    account_id: data.account_id
                                };
                                this.get_sku(postData).then(async sku => {
                                    /*获取刊登定价*/
                                    let skuIdList = sku.listing_info.map(item=>item.goods_sku_id);
                                    let PricingRules = await this.$http(api_pricing_rules,{
                                        channel_id:4,
                                        account_id:row.account_id,
                                        site_code:0,
                                        sku_id:skuIdList,
                                    });
                                    data.sku_attr_info = sku.sku_attr_info.map(skus => {
                                        skus.list_val && skus.list_val.forEach(tags => {
                                            tags.disable = false;
                                        });
                                        this.$set(skus,'is_checked',skus.required || skus.is_checked ? true : false);
                                        return skus
                                    });
                                    let findDeliveryIndex= data.sku_attr_info.findIndex(its=>{
                                        return its.names_en==='Ships From'
                                    });
                                    if(findDeliveryIndex!==-1){
                                        data.delivery=[data.sku_attr_info[findDeliveryIndex]];
                                        data.sku_attr_info.splice(findDeliveryIndex,1)
                                    }else {
                                        data.delivery=[];
                                    }
                                    sku.attr_info.attr= sku.attr_info.attr.map(rows=>{
                                        if (rows.attribute_show_type_value === "check_box") {
                                            rows.list_val = rows.list_val.map(box => {
                                                if(rows.default_id&&box.id&&rows.default_id.includes(box.id)){
                                                    this.$set(box,'isCheck',true);
                                                }else {
                                                    this.$set(box,'isCheck',false);
                                                }
                                                return box
                                            })
                                        } else if(rows.attribute_show_type_value === "input"||rows.attribute_show_type_value === "interval"){rows.value = rows.default_value;
                                        }else  {
                                            rows.value = rows.default_id;
                                            if(rows.attribute_show_type_value === "list_box"&&rows.default_value){
                                                rows.input=rows.default_value;
                                            }
                                        }
                                        return rows
                                    });
                                    let attr_diy=sku.attr_info.diy_attr.map(row=>{
                                        return {
                                            name:row.attrName,
                                            value:row.attrValue,
                                        }
                                    });
                                    data.brand_required = sku.brand_required;
                                    data.attr_info=[...sku.attr_info.attr,...attr_diy];
                                    data.attr_info.forEach(row=>{
                                        if(row.parent_attr_id===0){
                                            this.$set(row,'isShow',true);
                                        }else{
                                            this.$set(row,'isShow',false);
                                        }
                                    });
                                    data.aeopNationalQuoteConfiguration= sku.aeopNationalQuoteConfiguration;
                                    data.aeopNationalQuoteConfiguration.forEach(it=>{
                                        if(it.relative===undefined){
                                            this.$set(it,'relative','');
                                        }
                                        if(it.percentage===undefined){
                                            this.$set(it,'percentage','');
                                        }
                                        if(Math.abs(it.relative)>0||Math.abs(it.percentage)>0){
                                            if(it.relative>=0||it.percentage>=0){
                                                this.$set(it,"symbol",'0');
                                            }else{
                                                this.$set(it,"symbol",'1');
                                                it.relative<0&&(it.relative = -it.relative);
                                                it.percentage<0&&(it.percentage = -it.percentage);
                                            }
                                        }else{
                                            this.$set(it,"symbol",'0');
                                        }
                                    });
                                    data.region_group_id_old = data.region_group_id;
                                    data.region_template_id_old = data.region_template_id;
                                    data.configuration_type_old = data.configuration_type;
                                    data.aeopNationalQuoteConfigurationOld = JSON.parse(JSON.stringify(data.aeopNationalQuoteConfiguration));
                                    data.quote_config_status = sku.quote_config_status ? true : false;
                                    data.brand = sku.brand;
                                    data.listing_info = sku.listing_info.map(info => {
                                        /*刊登定价映射数据*/
                                        info.retail_price = total_price(PricingRules,info.goods_sku_id);
                                        info.isCheck = true;
                                        info.sku_attributes.forEach(ali => {
                                            if (ali.customized_name === 1) {
                                                ali.custom_name = "";
//                                                ali.custom_pic = "";
                                            }
                                        });
                                        return info
                                    });
                                    data.local_attr=sku.local_attr.map(local=>{
                                        local.disable=false;
                                        return local
                                    });
                                    data.imgs=sku.imgs;
                                    data.index=this.relevanceForm.vars.length+'';
                                    let length = this.relevanceForm.vars.length;
                                    this.relevanceForm.vars.push(data);
                                    this.currentTab = this.relevanceForm.vars[length].account_code || "";
                                })
                            }
                        }else{
                            data.required_size_model = 0;
                            data.category_id = "";
                            data.imgs=[];
                            data.index=this.relevanceForm.vars.length+'';
                            this.relevanceForm.vars.push(data);
                            this.currentTab = this.relevanceForm.vars[this.relevanceForm.vars.length-1].account_code || "";
                        }
                    }).catch(code => {
                        this.$message({type:"error", message: code.message || code});
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.$reqKey('url_post_publish_express_batch_copy',false);
                        },200);
                    });
                });
                this.channelid = [];
            },
            //获取接口数据
            get_sku(data){
                //参数 {goods_id：this.relevanceForm.id,category_id:id}
                return this.$http(api_aliexpress_sku, data).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_template(id){
                //参数 {account_id：id}
                return this.$http(api_aliexpress_template, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_brand(account,cate){
                return this.$http(api_aliexpress_brand, {account_id:account,category_id:cate}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_grounp(id){
                //参数 {account_id：id}
                return this.$http(api_aliexpress_team, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_service_tem(id){
                return this.$http(api_aliexpress_service_template,  {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_sizeTemp(data){
                return this.$http(api_aliexpress_sizeTemp, data).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_sales(id){
                return this.$http(api_aliexpress_sale, {channel_id:4,account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_relation(id){
                return this.$http(api_aliexpress_relation,id).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_custom(id){
                return this.$http(api_aliexpress_custom,id).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            get_same_spu(id){
                return this.$http(api_get_same_spu, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            //点击各个账号
            tab_click(val){
                this.currentTab=val.name
            },
            change_account_dialog(val){
                if (!val) {
                    this.channelid = [];
                }
            },
            //弹出添加账号框
            add_account(){
                this.accountVisable = true;
            },
            //获取权限
            get_permission(account_id){
                return this.$http(api_aliexpress_permission, {goods_id:this.relevanceForm.goods_id,account_id:account_id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            //获取品牌 sku数据
            get_brand(category_id){
                return this.$http(api_aliexpress_sku, {goodsid: this.relevanceForm.goods_id, category_id: category_id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            //获取模板数据

            //删除平台账号
            removeTab(val){
              let index=this.relevanceForm.vars.findIndex(row=>{
                   return row.account_code===val;
              });
                let length=this.relevanceForm.vars.length;
                if(length<=1){
                    this.currentTab=""
                }else {
                        if(index===0){
                            this.currentTab = this.relevanceForm.vars[1].account_code||"";
                        }else {
                            this.currentTab = this.relevanceForm.vars[index-1].account_code||"";
                        }
                }
                this.relevanceForm.vars.splice(index, 1);
            }
        },
        watch: {
            relevanceForm(val){
            	if(!!val){
            		!!val.goods_id&&this.get_new_img(val.goods_id);
                }
            }
        },
        props: {
            relevanceForm: {
                required: true,
                type: Object
            },
            label: {
                required: true,
                type: String
            },
            add:{
                required: true,
                type: Boolean
            },
            isCopy:{
                required: true,
                type: Boolean
            },
            tempData:{
                type: Object
            },
            isTime:{
                type: Boolean
            },
            trueId:{
                required: true,
            },

        },
        components: {
            attributeSet: require("./attribute-set.vue").default,
            pictureDescribe,
            titles: require("./titles.vue").default,
            pageDialog: require("../../../../components/page-dialog.vue").default,
            packInfo: require("./pack-info.vue").default,
            accounts: require("./accounts.vue").default,
        }
    }
</script>
