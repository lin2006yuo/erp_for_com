<template>
    <page class="p-index-ali-publish over-flow-auto"  >
        <el-card class="card">
            <!--关联商品信息-->
            <relevance-goods
                v-loading="loading"
                element-loading-text="玩命加载中..."
                label="关联商品信息"
                :add="isAdd"
                :isCopy="isCopy"
                :isTime="param.isTime"
                @classifys="classifys_edit"
                :relevanceForm="relevanceData"
                :temp-data="tempData"
                ref="goods"
                :true-id="trueId"
                @copy="copy_classify">
            </relevance-goods>
        </el-card>
        <forbidden v-model="biddenShow"  v-if="biddenShow" :forbidden-data="forbiddenData"></forbidden>
        <div class="page-fixed">
            <el-button size="mini" @click.native="preview">预览</el-button>
            <request-button v-if="isAdd" class="p-wish-btn" :mintime="200" req-key="apply_submit" @click.native="apply">应用到所有</request-button>
            <request-button class="p-wish-btn" :mintime="200" req-key="checks_submit" @click.native="checks">敏感词检测</request-button>
            <request-button v-if="showTemp" class="p-wish-btn" :mintime="200" req-key="api_publish_express_save_draft" :disabled="disable" @click.native="save('api_publish_express_save_draft')" >保存为草稿</request-button>
            <request-button v-if="isAdd" class="p-wish-btn" :mintime="200" req-key="api_aliexpress_publish_submit" :disabled="disable" @click.native="publish('api_aliexpress_publish_submit')">提交刊登</request-button>
            <request-button v-if="!isAdd" class="p-wish-btn" :mintime="200" req-key="api_aliexpress_publish_submit" :disabled="disable" @click.native="update('api_aliexpress_publish_submit')">提交刊登</request-button>
            <el-button size="mini" class="p-wish-btn" @click.native="cancel">取消</el-button>
        </div>
    </page>
</template>
<style lang="stylus" scoped>
    .p-index-ali-publish{
        .card{
            margin-left: 0;
            margin-bottom:30px;
        }
        .p-wish-btn{
            /*float: right;*/
            /*margin: 20px;*/
        }
    }
</style>
<script>
    import relevanceGoods from './relevance-goods.vue' //-----关联商品信息引入
    import {
    	api_aliexpress_base_info,
        api_aliexpress_puslish,
        api_publish_express_save_draft,
        api_aliexpress_edit_product,
        api_aliexpress_template,
        api_aliexpress_team,
        api_aliexpress_service_template,
        api_aliexpress_sale,
        api_aliexpress_prohibited,
        api_aliexpress_copy_product,
        api_aliexpress_brand,
        api_aliexpress_relation,
        api_aliexpress_custom,
        api_get_same_spu
    } from '../../../../api/publish-smt'
    export default{
        page: {
            multiple: true,
            beforeClose(){
                if(!this.isChange){
                    return true
                }else {
                    return this.$confirm(`检测到有数据更改但未保存，此操作将会丢失已更改的最新数据，仍然进行此操作吗?`, '提示', {
                        confirmButtonText: '继续离开',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        return true
                    }).catch(code=>{
                        return false
                    })
                }
            }
        },

        data(){
            return {
                dataId:0,
                relevanceData:{},
                isAdd:true,
                isEdit:false,
                isCopy:false,
                tempData:{},
                biddenShow:false,
                forbiddenData:[],
                flag:0,
                showTemp:false,
                loading:false,
                isChange:false,
                changeClassify:false,
                trueId:"",
            }
        },
        mounted(){
            if(window.objlength(this.param)!==0){
                this.dataId=this.param.id;
                this.isAdd=this.param.isAdd;
                this.isCopy=this.param.isCopy;
                this.showTemp=!!this.param.show;
                this.trueId = this.param.id||0;
                this.isChange=false;
                if(this.isCopy){
                    this.param.default_account_id = "";
                    this.copy_publish(this.param.id);
                }else {
                    if(this.param.isAdd){ //新增
                        this.not_publish(this.param.id,this.param.default_account_id)
                    }else {//编辑
                        this.param.default_account_id = "";
                        this.edit_publish(this.param.id)
                    }
                }
            }
        },
        computed:{
            disable(){
                switch (this.flag){
                    case 0:
                        return false;
                        break;
                    case 1:
                        return true;
                        break;
                    case 2:
                        return false;
                        break;
                }
            }
        },
        methods:{
        	//预览
            preview(){
                let tab=this.$refs.goods.currentTab;
                let find=this.relevanceData.vars.find(row=>{
                    return row.account_code===tab;
                });
                if(!find){
                	this.$message({type:"warning", message: "请先选择账号"});
                	return ;
                }
                let info_find = window.clone(find);
                info_find.pTitle = find.title;
                info_find.title = `AliExpress详情预览`;
                this.$open('/kandeng/aliexpress/preview',info_find);
            },
            //刊登
            publish(reqKey){
                if(this.flag===1){
                    this.$reqKey(reqKey,false);
                    return ;
                }
                let flag=true;
                if(flag){
                    let data = this.get_data(true);
                    if(!data){
                        this.$reqKey(reqKey,false);
                    	return ;
                    }
                    this.flag=1;
                    data.is_plan_publish=1;
                    this.$http(api_aliexpress_puslish,data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        sessionStorage.setItem('aliInfoId',data.goods_id);
                        this.$close('/kandeng/aliexpress/info');
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        this.flag=2;
                        setTimeout(()=>{
                            this.$reqKey(reqKey,false);
                        },200);
                    });
                }
            },
            //获得保存数据
            get_data(isVerifyParam,reqKey){
                let flag=true;
                let checkData=window.clone(this.relevanceData);
                if(isVerifyParam) {
                    checkData.vars.forEach((row) => {
                        if (this.param.isTime && row.plan_publish_time) {
                            let today = new Date();
                            let plan = new Date(row.plan_publish_time);
                            if (today.getTime() > plan.getTime()) {
                                this.$reqKey(reqKey, false);
                                flag = false;
                                return this.$message({type: "warning", message: '定时刊登时间不允许早于当前时间，请检查！'});
                            }
                        }
                        if (!row.category_id) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择产品分类！'});
                        }
                        if (row.brand_id === '') {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择品牌！'});
                        }
                        let is_check_box_arr = row.attr_info.filter(item => item.attribute_show_type_value === 'check_box' && item.parent_attr_id !== 0);
                        let find_apply = row.attr_info.find(item => item.names_zh === '适用机型');
                        if (!!find_apply && find_apply.value === '') {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择一个适用机型！'});
                        }
                        row.attr_info.forEach(item => {
                            if (!!item.required) {
                                switch (item.attribute_show_type_value) {
                                    case 'list_box':
                                        if (!item.value || (item.value === 4 && !item.input)) {
                                            this.$reqKey(reqKey, false);
                                            flag = false;
                                            this.$message({type: "warning", message: `请选择正确的${item.names_zh}！`});
                                            return flag;
                                        }
                                        break;
                                    case 'check_box':
                                        if (item.isShow && !!find_apply && find_apply.value !== 350525 && is_check_box_arr.length > 0) {
                                            if (!item.list_val.some(attr => attr.isCheck)) {
                                                this.$reqKey(reqKey, false);
                                                flag = false;
                                                this.$message({type: "warning", message: `请勾选一个${item.names_zh}！`});
                                                return flag;
                                            }
                                        }
                                        break;
                                    default:
                                        if (!item.value) {
                                            this.$reqKey(reqKey, false);
                                            flag = false;
                                            this.$message({type: "warning", message: `请填写正确的${item.names_zh}！`});
                                            return flag;
                                        }
                                        break;
                                }
                            }
                        });
                        if (!row.title) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择产品标题！'});
                        }
                        if (row.title.split('').some(row => row.charCodeAt(0) > 127 || row.charCodeAt(0) <= 0)) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '刊登标题存在ASCII码以外的字符，请重新填写！'});
                        }
                        if (!row.productUnit) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择最小计量单位！'});
                        }
                        if (row.package_type === '') {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择销售方式！'});
                        }
                        if (!row.reduceStrategy) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择库存扣减方式！'});
                        }
                        if (!row.deliveryTime) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择发货期！'});
                        }
                        if (!row.freightTemplateId) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: `请选择“${row.account_code}”店铺中的产品运费模板！`});
                        }
                        if (row.promiseTemplateId === '') {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择服务模板！'});
                        }
                        if (!row.grossWeight) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请选择包装后重量！'});
                        }
                        if (row.packageLength === "" || !Number(row.packageLength)) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请填写包装后尺寸！'});
                        }
                        if (row.packageWidth === "" || !Number(row.packageWidth)) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请填写包装后尺寸！'});
                        }
                        if (row.packageHeight === "" || !Number(row.packageHeight)) {
                            this.$reqKey(reqKey, false);
                            flag = false;
                            return this.$message({type: "warning", message: '请填写包装后尺寸！'});
                        }
                        if (row.listing_info.length > 1) {
                            let not_is_null = row.sku_attr_info.some(item => !!item.is_checked);
                            if (row.sku_attr_info.length > 0 && !not_is_null) {
                                this.$reqKey(reqKey, false);
                                flag = false;
                                return this.$message({
                                    type: "warning",
                                    message: '多SKU产品刊登时，请至少勾选一个（除“发货地”以外的）产品属性！并保证属性值不能重复！'
                                });
                            }
                        }
                        row.listing_info.forEach((info) => {
                            if (!parseFloat(info.retail_price)) {
                                this.$reqKey(reqKey, false);
                                flag = false;
                                return this.$message({type: "warning", message: '请填写正确的零售价！'});
                            }
                            if (info.ipm_sku_stock < 0) {
                                this.$reqKey(reqKey, false);
                                flag = false;
                                return this.$message({type: "warning", message: '请填写正确的可售数！'});
                            }
                        });
                    });
                }
                let clonedata=window.clone(this.relevanceData);
                let data={
                    goods_id:this.relevanceData.goods_id,
                    spu:clonedata.spu
                };
                if(!this.isAdd){
                    data.id=this.relevanceData.id;
                }
                data.vars=clonedata.vars.map((row,row_i)=> {
                    delete  row.brand;
                    delete row.categoryArray;
                    delete row.template;
                    delete row.server_template;
                    delete row.group;
                    delete row.relation_template;
                    delete row.custom_template;
                    delete row.same_spus;
                    if(!row.quote_config_status){
                        delete row.aeopNationalQuoteConfiguration;
                    }
                    row.attr_ext_info = [];
                    row.sku_attr_info.forEach(attrInfo => {
                        attrInfo.is_checked = attrInfo.is_checked?1:0;
                        if (attrInfo.is_checked && attrInfo.attribute_id && attrInfo.attribute_id !== "") {
                            row.attr_ext_info.push({"ali_id": attrInfo.id, "attribute_id": attrInfo.attribute_id})
                        }
                    });
                    delete row.index;
                    if (row.sizes) {
                        delete row.sizes;
                    }
                    row.detail = row.description.replace(/\n|\r/g,'');
                    delete  row.description;
                    if (this.relevanceData.vars[row_i].plan_publish_time) {
                        let dates = this.relevanceData.vars[row_i].plan_publish_time;
                        if ((typeof  this.relevanceData.vars[row_i].plan_publish_time) === "object") {
                            row.plan_publish_time = parseInt(dates.getTime() / 1000);
                        } else {
                            row.plan_publish_time = new Date(dates.replace(/-/g, "/")).getTime() / 1000;
                        }
                    } else {
                        row.plan_publish_time = "";
                    }
                    row.isPackSell = row.isPackSell ? 1 : 0;
                    row.is_wholesale = row.is_wholesale ? 1 : 0;
                    if (row.imgs && row.imgs.length > 6) {
                        row.imgs = row.imgs.slice(0, 6);
                    }
                    row.imgs = row.imgs.map(row => row.path);
                    row.attr = [];
                    row.attr_info.forEach(attr => {
                        let data_attr = {};
                        if (!attr.attribute_show_type_value && attr.name !== "") {
                            if (attr.value !== "") {
                                data_attr.attrName = attr.name;
                                data_attr.attrValue = attr.value;
                            }
                        }
                        if (attr.attribute_show_type_value === "input") {
                            if (attr.value !== "") {
                                data_attr.attrNameId = attr.id;
                                data_attr.attrValue = attr.value;
                            }
                        } else if (attr.attribute_show_type_value === "list_box") {
                            if (attr.value !== "") {
                                data_attr.attrNameId = attr.id;
                                data_attr.attrValueId = attr.value;
                                if (attr.value === 4) {
                                    data_attr.attrValue = attr.input;
                                }
                            }
                        } else if (attr.attribute_show_type_value === "interval") {
                            if (attr.value !== "") {
                                data_attr.attrNameId = attr.id;
                                data_attr.attrValue = attr.value;
                            }
                        } else {
                            let ids = [];
                            attr.list_val && attr.list_val.forEach(list => {
                                if (list.isCheck) {
                                    ids.push(list.id)
                                }
                            });
                            if (ids.length > 0) {
                                data_attr.attrValueId = ids;
                                data_attr.attrNameId = attr.id;
                            }
                        }
                        if (window.objlength(data_attr) !== 0) {
                            row.attr.push(data_attr)
                        }
                    });
                    let deliverflag = (row.delivery.length > 0 && row.delivery[0].is_checked && row.delivery[0].is_checked && row.delivery[0].used_vaules.length > 0);
                    row.sku = row.listing_info.map(info => {
                        let infoData = {
                            sku_price: info.retail_price,
                            sku_code: info.sku,
                            ipm_sku_stock: info.ipm_sku_stock,
                            currency_code: info.currency_code,
                            goods_sku_id: info.goods_sku_id,
                            combine_sku: info.combine_sku,
                            cost_price:info.cost_price
                        };
                        if (deliverflag) {
                            infoData.extend = info.extend;
                        }
                        infoData.sku_attr = [];
                        info.sku_attributes.forEach(skuAttr => {
                            let findskuattr = row.sku_attr_info.find(ali_ids => {
                                return ali_ids.id === skuAttr.ali_attr_id
                            });
                            if (findskuattr && findskuattr.is_checked) {
                                if (!skuAttr.ali_attr_val_id&&isVerifyParam) {
                                    this.$reqKey(reqKey,false);
                                    flag = false;
                                    return this.$message({type:"warning", message: `请将“${row.account_code}”店铺中的产品“${findskuattr.names_zh}”属性值填写完整！`});
                                }
                                let attr_sku = {
                                    skuPropertyId: skuAttr.ali_attr_id,
                                    propertyValueId: skuAttr.ali_attr_val_id,
                                    attribute_id: skuAttr.attribute_id,
                                    attribute_value_id: skuAttr.id,
                                    spec:findskuattr.spec
                                };
                                if (!!skuAttr.changeName) {
                                    if (((skuAttr.changeName&&skuAttr.changeName.search('/') >= 0) || (skuAttr.custom_name&&skuAttr.custom_name.search('/') >= 0))&&isVerifyParam) {
                                        this.$reqKey(reqKey, false);
                                        flag = false;
                                        return this.$message({type: "warning", message: `SKU的自定义属性值不支持“/”，请删除或改为“-”!`});
                                    }
                                }
                                skuAttr.customized_name === 1 && (attr_sku.propertyValueDefinitionName = skuAttr.changeName||skuAttr.custom_name);
                                if(skuAttr.customized_pic === 1){
                                    attr_sku.skuImage = (info.d_imgs&&info.d_imgs.length&&info.d_imgs[0].path)||skuAttr.custom_pic;
                                }
                                infoData.sku_attr.push(attr_sku);
                            }
                        });
                        if(infoData.sku_attr && infoData.sku_attr.length>1){
                            infoData.sku_attr.sort(this.sort_attr);
                        }
                        return infoData
                    });
                    let priceArr = row.listing_info.map(row=>Number(row.retail_price));
                    let price = '';
                    if(priceArr.length>1){
                        let sortPrice = priceArr.sort((a,b)=>a-b);
                        let min=sortPrice[0].toFixed(2);
                        price =  min;
                    }else if(priceArr.length===1){
                        price = priceArr[0].toFixed(2);
                    }else{
                        price = 0.00;
                    }
                    row.aeopNationalQuoteConfiguration && row.aeopNationalQuoteConfiguration.forEach(it => {
                        if (row.configuration_type === 'percentage') {
                            delete it.relative;
                            if(Number(it.symbol) === 1){
                                it.percentage = -it.percentage;
                            }
                        } else {
                            if (Number(it.symbol) === 1&&isVerifyParam) {
                                if (Number(it.relative) >= price) {
                                    this.$reqKey(reqKey, false);
                                    flag = false;
                                    return this.$message({type: "warning", message: `区域调价中调整后的金额不能为负数！请重新调整！`});
                                }
                            }
                            delete it.percentage;
                            if(Number(it.symbol) === 1){
                                it.relative = -it.relative;
                            }
                        }
                        delete it.symbol;
                    });
                    row.quote_config_status = row.quote_config_status ? 1 : 0;
                    row.category_id=parseInt(row.category_id);
                    row.packageLength = parseInt(row.packageLength)||1;
                    row.packageWidth = parseInt(row.packageWidth)||1;
                    row.packageHeight = parseInt(row.packageHeight)||1;
                    delete row.attr_info;
                    delete row.listing_info;
                    delete row.sku_attr_info;
                    delete row.local_attr;
                    delete  row.delivery;
                    return row;
                });
                if (flag) {
                    return data
                } else {
                    this.$reqKey(reqKey,false);
                    return flag
                }
            },
            save(reqKey){
                if(this.flag===1){
                    this.$reqKey(reqKey,false);
                    return ;
                }
                let flag=true;
                if(flag){
                    let data= this.get_data(false,reqKey);
                    if(!data){
                        this.$reqKey(reqKey,false);
                        return;
                    }
                    this.flag=1;
                    this.$http(api_publish_express_save_draft,data).then(res=>{
                        this.$message({type:"success",message:res.message||res});
                        this.$close('/kandeng/aliexpress/info');
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'})
                    }).finally(()=>{
                        this.flag=2;
                        setTimeout(()=>{
                            this.$reqKey(reqKey,false);
                        },200);
                    });
                }
            },
            cancel(){//--取消
                this.$close('/kandeng/aliexpress/info');//关闭当前页
            },
            // 应用
            apply(){
                this.$confirm('您确定要将当前页面内容全部覆盖到其他已选的平台帐号中吗？,此操作将会覆盖其他已选帐号中的数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tab=this.$refs.goods.currentTab;
                    let find=this.relevanceData.vars.find(row=>{
                        return row.account_code===tab;
                    });
                    if(!!find){
                        this.relevanceData.vars =this.relevanceData.vars.map((row,row_i)=>{
                            let pastData=row;
                            let data = window.clone(find);
                            delete data.index;
                            delete data.groupId;
                            delete data.group;
                            delete data.template;
                            delete data.freightTemplateId;
                            delete data.promiseTemplateId;
                            delete data.server_template;

                            delete data.relation_template;
                            delete data.relation_template_id;
                            delete data.relation_template_postion;

                            delete data.custom_template;
                            delete data.custom_template_id;
                            delete data.custom_template_postion;
                            row=window.clone(data);
                            if(row.category_id===find.category_id){
                                let findBrand=pastData.brand.find(it=>{
                                    return it.id=== find.brand_id;
                                });
                                if(findBrand){
                                    row.brand_id=data.brand_id;
                                }else{
                                    row.brand_id=pastData.brand_id;
                                }
                                this.$set(row,"brand",pastData.brand);
                            }
                            row.plan_publish_time=find.plan_publish_time;
                            row.account_code=pastData.account_code;
                            row.account_name=pastData.account_name;
                            row.account_id=pastData.account_id;
                            row.group = pastData.group;
                            row.groupId = pastData.groupId;
                            row.index = pastData.index;
                            row.template = pastData.template;
                            row.freightTemplateId = pastData.freightTemplateId;
                            row.promiseTemplateId = pastData.promiseTemplateId;
                            row.server_template = pastData.server_template;
                            row.relation_template = pastData.relation_template;
                            row.relation_template_id = pastData.relation_template_id;
                            row.relation_template_postion = pastData.relation_template_postion;
                            row.custom_template = pastData.custom_template;
                            row.custom_template_id = pastData.custom_template_id;
                            row.custom_template_postion = pastData.custom_template_postion;
                            // this.$refs.goods.$refs.picture[row_i].$refs.uEditor.editor.setContent(row.description);
                            if(pastData.category_id!==find.category_id){
                            this.$http(api_aliexpress_brand, {account_id:row.account_id,category_id:find.category_id}).then(res => {
                                    row.brand = res;
                                    row.brand_id="";
                                    this.$message({type:"success", message: res.message || res});
                                }).catch(code => {
                                    this.$message({type:"error", message: code.message || code});
                                });
                            }
                            return row;
                        });
                        this.$reqKey('apply_submit',false);
                    }else {
                        this.$reqKey('apply_submit',false);
                        this.$message({message:"请选择应用的账号", type:'error'})
                    }
                }).catch(() => {
                    this.$message({type:"info", message: "已取消"});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('apply_submit',false);
                    },200);
                });
            },
            // 敏感词检测
            checks(){
                let data=[];
                window.clone(this.relevanceData).vars.forEach(row=>{
                    let param={
                        account_id:row.account_id,
                        account_code:row.account_code,
                        category_id:row.category_id,
                        title:row.title,
                        detail:row.description,
                        attr_val:[],
                    };
                    row.attr_info&&row.attr_info.forEach(item=>{
                        if(item.attribute_show_type_value==="input"){
                            param.attr_val.push(item.value)
                        }
                        if(!item.attribute_show_type_value){
                            param.attr_val.push(item.value);
                            param.attr_val.push(item.name);
                        }
                    });
                    param.attr_val=param.attr_val.join(";");
                    data.push(param)
                });
                this.$http(api_aliexpress_prohibited,{data:data}).then(res=>{
                    if(res.length>0){
                        this.biddenShow=true;
                        this.forbiddenData=res;
                    }else {
                        this.$message({type: "success", message: "无违规词"});
                    }
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                }).finally(()=>{
                    setTimeout(()=>{
                        this.$reqKey('checks_submit',false);
                    },200);
                });
            },
            update(reqKey){
                this.publish(reqKey);
            },
            //新增刊登 请求
            not_publish(val,account_id){
                this.loading=true;
                this.$http(api_aliexpress_base_info,{goods_id:val}).then(res=>{
                    res.vars=[];
                    res.goods_id=res.id;
                    delete res.id;
                    this.loading=false;
                    this.relevanceData=res;
                    this.$set(this.relevanceData,"default_account_id",account_id);
                    this.$refs.goods.init_data(val,this.relevanceData.spu);
                    this.trueId = 0;
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //编辑修改分类
            classifys_edit(val){
                this.edit_publish(this.dataId,val[val.length-1].category_id);
            },
            //编辑刊登
            edit_publish(val,id){
                if(!this.changeClassify){
                    this.changeClassify=true
                }else {
                    this.isChange=true;
                }
                let parm={id:val};
                if(id&&id!==""){
                    parm.category_id=id;
                }
                this.loading=true;
                this.$http(api_aliexpress_edit_product,parm).then(res=>{
                    let clones=window.clone(res);
                    let data={
                        id:res.id,
                        spu:res.goods_spu,
                        name:res.goods_title,
                        goods_id:res.goods_id,
                        category_name:res.category_name,
                        transport_property:res.transport_property,
                    };
                    clones.categoryArray= clones.category_relation;
                    clones.categoryArray.forEach(it=>{
                    	it.category_id +="";
                    });
                    clones.category_id=clones.category_relation[clones.category_relation.length-1].category_id||"";
                    delete  clones.category_relation;
                    clones.description= clones.detail;
                    delete  clones.detail;
                    if(clones.mobileDetail){
                        if(JSON.stringify(clones.mobileDetail) == "{}"){
                            clones.mobileDetail=[];
                        }else{
                            clones.mobileDetail=clones.mobileDetail;
                        }
                    }else{
                        clones.mobileDetail=[];
                    }
                    clones.imgs= clones.imageURLs.map(row=>{
                        return {path:row}
                    });
                    if(res.plan_publish_time===0){
                        clones.plan_publish_time=""
                    }else {
                        clones.plan_publish_time=datef('YYYY-MM-dd HH:mm:ss', res.plan_publish_time)
                    }
                    clones.isPackSell=clones.isPackSell?true:false;
                    clones.aeopNationalQuoteConfiguration&&clones.aeopNationalQuoteConfiguration.forEach(it=>{
                        if(it.relative===undefined){
                            this.$set(it,'relative','');
                        }
                        if(it.percentage===undefined){
                            this.$set(it,'percentage','');
                        }
                        if(Math.abs(it.relative)>0||Math.abs(it.percentage)>0){
                            if(it.relative>0||it.percentage>0){
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
                    clones.region_group_id_old = clones.region_group_id;
                    clones.region_template_id_old = clones.region_template_id;
                    clones.configuration_type_old = clones.configuration_type;
                    clones.aeopNationalQuoteConfigurationOld = JSON.parse(JSON.stringify(clones.aeopNationalQuoteConfiguration));
                    clones.quote_config_status = clones.quote_config_status ? true : false;
                    clones.index=clones.id+'';
                    let attr_diy=clones.attr_info.diy_attr.map(row=>{
                        return {
                            name:row.attrName,
                            value:row.attrValue,
                        }
                    });
                    clones.attr_info.attr= clones.attr_info.attr.map(rows=>{
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
                    clones.attr_info=[...clones.attr_info.attr,...attr_diy];
                    clones.attr_info.forEach(row=>{
                            if(row.parent_attr_id===0){
                                this.$set(row,'isShow',true);
                            }else{
                                this.$set(row,'isShow',false);
                            }
                    });
                    clones.listing_info.forEach(item=>{
                        item.isCheck = true;
                    });
                    clones.local_attr=clones.local_attr.map(local=>{
                        local.disable=false;
                        return local
                    });
                    clones.sku_attr_info.forEach(item=>{
                        this.$set(item,'is_checked',item.required || item.is_checked ? true : false);
                    });
                    let findDeliveryIndex= clones.sku_attr_info.findIndex(item=>{
                        return item.names_en==='Ships From'
                    });
                    if(findDeliveryIndex!==-1){
                        clones.delivery=[clones.sku_attr_info[findDeliveryIndex]];
                        clones.sku_attr_info.splice(findDeliveryIndex,1)
                    }else {
                        clones.delivery=[];
                    }
                    clones.is_wholesale= clones.is_wholesale ? true : false;
                    if(clones.is_wholesale){
                        setTimeout(()=>{
                            this.$refs.goods&&this.$refs.goods.$refs.sets&&this.$refs.goods.$refs.sets[0].change_batch_price();
                        },600)
                    }
                    const template = this.get_template(clones.account_id);
                    const ser_template = this.get_service_tem(clones.account_id);
                    const grounp = this.get_grounp(clones.account_id);
                    const sales=this.get_sales(clones.account_id);
                    const brands=this.get_brand(clones.account_id,clones.category_id);
                    const relation=this.get_relation(clones.account_id);
                    const custom=this.get_custom(clones.account_id);
                    const same_spu = this.get_same_spu(clones.account_id);
                    Promise.all([template, ser_template, grounp,sales,brands,relation,custom,same_spu]).then(([temp, serv, gro,sale,brand,rela,customer,same_pro]) => {
                    	clones.sales=sale;
                        clones.relation_template=rela;
                        clones.custom_template=customer;
                        clones.template = temp;
                        clones.brand = brand;
                        clones.same_spus = same_pro;
                        clones.server_template = serv;
                        clones.group =gro.map(group=>{
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
                        data.vars=[];
                        data.vars.push(clones);
                        this.relevanceData=data;
                        this.$refs.goods.currentTab=res.account_code;
                        this.$refs.goods.init_data(res.goods_id,this.relevanceData.spu);
                        setTimeout(()=>{
                            this.loading=false;
                        },150)
                    })
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            //复制时 修改分类
            copy_classify(val,index){
                this.copy_publish(this.dataId,val,true,index);
            },
            // 复制
            //参数1 为id，参数2为分类id，参数3，判断是否修改分类请求数据 参数4 替换第几个
            copy_publish(val,id,bool,splice_i){
                if(!this.changeClassify){
                    this.changeClassify=true;
                }else {
                    this.isChange=true;
                }
                let parm={id:val};
                if(id&&id!==""){
                    parm.category_id=id;
                }
                this.loading=true
                this.$http(api_aliexpress_copy_product,parm).then(res=>{
                    let clones=window.clone(res);
                    let data={
                        id:res.id,
                        spu:res.goods_spu,
                        name:res.goods_title,
                        goods_id:res.goods_id,
                        category_name:res.category_name,
                        transport_property:res.transport_property,
                    };
                    clones.index="";
                    if(bool){
                        clones.account_id=this.relevanceData.vars[splice_i].account_id;
                        clones.account_name = this.relevanceData.vars[splice_i].account_name;
                        clones.account_code = this.relevanceData.vars[splice_i].account_code;
                        clones.index=splice_i+"";
                    }
                    if(clones.mobileDetail){
                        if(JSON.stringify(clones.mobileDetail) == "{}"){
                            clones.mobileDetail=[];
                        }else{
                            clones.mobileDetail=clones.mobileDetail;
                        }
                    }else{
                        clones.mobileDetail=[];
                    }
                    clones.categoryArray= clones.category_relation;
                    clones.categoryArray.forEach(it=>{
                        it.category_id +="";
                    });
                    clones.category_id=clones.category_relation[clones.category_relation.length-1].category_id||"";
                    delete  clones.category_relation;
                    clones.description= clones.detail;
                    delete  clones.detail;
                    clones.imgs= clones.imageURLs.map(row=>{
                        return {path:row}
                    });
                    if(res.plan_publish_time===0){
                        clones.plan_publish_time=""
                    }else {
                        clones.plan_publish_time=datef('YYYY-MM-dd HH:mm:ss', res.plan_publish_time)
                    }
                    clones.isPackSell=clones.isPackSell?true:false;
                    let attr_diy=clones.attr_info.diy_attr.map(row=>{
                        return {
                            name:row.attrName,
                            value:row.attrValue,
                        }
                    });
                    clones.attr_info.attr= clones.attr_info.attr.map(rows=>{
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
                    clones.attr_info=[...clones.attr_info.attr,...attr_diy];
                    clones.attr_info.forEach(row=>{
                        if(row.parent_attr_id===0){
                            this.$set(row,'isShow',true);
                        }else{
                            this.$set(row,'isShow',false);
                        }
                    });
                    clones.listing_info.forEach(item=>{
                        item.isCheck = true;
                    });
                    clones.local_attr=clones.local_attr.map(local=>{
                        local.disable=false;
                        return local
                    });
                    clones.sku_attr_info.forEach(item=>{
                        this.$set(item,'is_checked',item.required || item.is_checked ? true : false);
                    });
                    let findDeliveryIndex= clones.sku_attr_info.findIndex(item=>{
                        return item.names_en==='Ships From'
                    });
                    if(findDeliveryIndex!==-1){
                        clones.delivery=[clones.sku_attr_info[findDeliveryIndex]];
                        clones.sku_attr_info.splice(findDeliveryIndex,1)
                    }else {
                        clones.delivery=[];
                    }
                    clones.is_wholesale= clones.is_wholesale ? true : false;
                    if(clones.is_wholesale){
                        setTimeout(()=>{
                            this.$refs.goods.$refs.sets&&this.$refs.goods.$refs.sets[0].change_batch_price();
                        },600)
                    }
                    data.vars=[];
                    data.goods_brand = clones.goods_brand;
                    data.goods_brand_id = clones.goods_brand_id;
                    if(bool){
                        const template = this.get_template(clones.account_id);
                        const ser_template = this.get_service_tem(clones.account_id);
                        const grounp = this.get_grounp(clones.account_id);
                        const sales=this.get_sales(clones.account_id);
                        const brands=this.get_brand(clones.account_id, clones.category_id);
                        const relation=this.get_relation(clones.account_id);
                        const custom=this.get_custom(clones.account_id);
                        const same_spu = this.get_same_spu(clones.account_id);
                        Promise.all([template, ser_template, grounp,sales,brands,relation,custom,same_spu]).then(([temp, serv, gro,sale,brand,rela,customer,same_pro]) => {
                            clones.relation_template=rela;
                            clones.custom_template=customer;
                            clones.sales=sale;
                            clones.template = temp;
                            clones.brand = brand;
                            clones.same_spus = same_pro;
                            clones.server_template = serv;
                            clones.group =gro.map(group=>{
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
                            this.relevanceData.vars.splice(splice_i,1,clones);
                            setTimeout(()=>{
                                this.loading=false;
                            },150)
                        })
                    }else {
                        this.tempData=clones;
                        this.relevanceData=data;
                        this.$refs.goods.get_account();//请求账号
                        setTimeout(()=>{
                            this.loading=false;
                        },150)
                    }
                }).catch(code=>{
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_template(id){
                //参数 {account_id：id}
                return this.$http(api_aliexpress_template, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_grounp(id){
                //参数 {account_id：id}
                return this.$http(api_aliexpress_team, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_service_tem(id){
                return this.$http(api_aliexpress_service_template,  {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_sales(id){
                return this.$http(api_aliexpress_sale, {channel_id:4,account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_brand(account,cate){
                return this.$http(api_aliexpress_brand, {account_id:account,category_id:cate}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_relation(id){
                return this.$http(api_aliexpress_relation,id).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_custom(id){
                return this.$http(api_aliexpress_custom,id).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    this.$message({type:"error", message: code.message || code});
                })
            },
            get_same_spu(id){
                return this.$http(api_get_same_spu, {account_id:id}).then(res => {
                    return Promise.resolve(res);
                }).catch(code => {
                    console.log(code)
                })
            },
            sort_attr(obj1, obj2) {
                let val1 = obj1.spec;
                let val2 = obj2.spec;
                if (val1 < val2) {
                    return -1;
                } else if (val1 > val2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        },
        watch:{
            param(val){
                if(window.objlength(val)!==0){
                    this.dataId=this.param.id;
                    this.isAdd=this.param.isAdd;
                    this.isCopy=this.param.isCopy;
                    this.showTemp=!!this.param.show;
                    this.isChange=false;
                    if(this.isCopy){
                        this.copy_publish(this.param.id)
                    }else {
                        if(this.param.isAdd){ //新增
                            this.not_publish(this.param.id,this.param.default_account_id)
                        }else {//编辑
                            this.edit_publish(this.param.id)
                        }
                    }
                }
            },
            'relevanceData.vars':{
                deep:true,
                handler(val){
                    if(!this.loading&&val&&val.length){
                        this.isChange=true
                    }
                }
            }
        },
        components:{
            relevanceGoods,
            forbidden:require("./forbidden.vue").default
        }
    }
</script>
