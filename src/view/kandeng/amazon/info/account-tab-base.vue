<template>
    <div>
        <div class="p-title-bg-color">
            <span>{{$t('ymx-detail.info')}}</span>
        </div>
        <div class="p-head-border-color">
            <el-form :label-width="labelWidth" :model="form" :rules="rules_1" ref="base_info_1">
                <el-form-item :label="`${$t('ymx-detail.tempRef')}：`" v-if="!showSite&&!!form.doc_id&&curPage==='not'">
                    <el-button type="primary"
                               size="mini"
                               @click.native="quote_model">{{$t('ymx-detail.oneClick')}}</el-button>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.platAccount')}：`" v-if="!showSite">
                    <el-tag type="danger">{{form.code}}</el-tag>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.platStation')}：`"
                              required
                              prop="siteId" v-if="!showSite">
                    <el-tag type="danger">{{comSite}}</el-tag>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.platStation')}：`"
                              required
                              prop="siteId" v-if="showSite">
                    <el-tag type="danger">{{form.siteName}}</el-tag>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.classifiTemp')}：`" required
                              prop="category_template_id">
                    <el-select class="inline width-base"
                               filterable clearable
                               :value="form.category_template_id"
                               @input="(val)=>{first_change(val)}">
                        <el-option v-for="(item, index) in form.categoryTemplatList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="index"></el-option>
                    </el-select>
                    <el-button type="text" size="mini" class="inline"
                               @click.native="reload_category_templat">{{$t('ymx-detail.refreshTemp')}}</el-button>
                </el-form-item>
                <el-form-item :label="`${$t('ymx-detail.productCate')}：`" required>
                    <product-category :site="form.siteName"
                                      :form="form"
                                      @delete-category="delete_category"
                                      @submit="category_submit"></product-category>
                </el-form-item>
            </el-form>
            <el-form :model="form" :label-width="labelWidth">
                <!--从后端获取的属性-->
                <template v-for="(item,index) in form.basic">
                        <el-form-item v-if="is_show(item)"
                                      :prop="`basic[${index}].value`"
                                      :rules="{required: item.require === 1, message:$t('ymx-detail.required'), trigger:'blur'}"
                                      :label="`${item.name}：`">
                            <el-select v-model="item.value"
                                       class="inline width-base"
                                       v-if="item.key!=='warehouse_id'"
                                       filterable clearable>
                                <el-option
                                    v-for="res in item.option"
                                    :label="res.label"
                                    :value="res.value"
                                    :key="res.value"
                                ></el-option>
                            </el-select>
                            <el-select v-model="item.value"
                                       v-if="item.key==='warehouse_id'"
                                       class="inline width-base"
                                       filterable clearable>
                                <el-option
                                        v-for="res in form.amazonWarehouseList"
                                        :label="res.name"
                                        :value="res.id"
                                        :key="res.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="item.select === 0">
                            <el-form-item v-if="item.key==='Timer'"
                                          :label="`${item.name}：`">
                                <el-date-picker class="inline width-base"
                                                v-model="item.value"
                                                type="datetime"
                                                :placeholder="$t('ymx-detail.selectDate')">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item v-if="item.key==='Spu'"
                                          :label="`${item.name}：`">
                                <el-tag type="danger">{{item.value}}</el-tag>
                            </el-form-item>
                            <el-form-item v-if="item.key==='Department'"
                                          :label="`${item.name}：`">
                                <el-input v-model="item.value"
                                          class="inline width-base"></el-input>
                                <reference-value @click-reference="click_reference(item,$event)"></reference-value>
                            </el-form-item>
                            <template v-else>
                                <el-form-item :label="`${item.name}：`"
                                              v-if="item.key!=='Timer'&&item.key!=='Spu'"
                                              :prop="`basic[${index}].value`"
                                              :rules="{required: item.require === 1, message:$t('ymx-detail.required'), trigger:'blur'}">
                                    <el-input v-model="item.value"
                                              class="inline width-base"></el-input>
                                </el-form-item>
                            </template>
                        </template>
                    </template>
            </el-form>
            <!--产品&&分类所带出的属性-->
            <fix-attribute ref="base-info-fix"
                           :label-width="labelWidth"
                           @reload="reload_product_templat"
                           :form="form"></fix-attribute>
            <el-form :model="form" :label-width="labelWidth">
                <el-form-item :label="`${$t('ymx-detail.seller')}：`">
                    <span>{{form.realName}}</span>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style lang="stylus" type="text/stylus" scoped>
    .width-base{
        width 315px;
    }
    .p-title-bg-color {
        background: #FAECE7;
        span {
            color: #FFF;
            font-weight: bold;
            padding: 5px 10px;
            font-size: 1.7rem;
            display: inline-block;
            background: #ffb732;
        }
        .el-input__inner {
            height: 26px !important;
        }
    }

    .p-head-border-color {
        padding: 20px;
        border-left: 3px solid #ffb732;
    }
</style>
<script>
    import {api_account_site} from '../../../../api/amazon-publish-list';
    import {
        api_amazon_warehouse,
        api_attr_category,
        api_fix_attribute,
        api_common_attribute
    } from '../../../../api/amazon-publish-info'
    import {get_edit_data,get_product_attribute} from './info-public-methods';
    export default{
        data(){
            return {
                rules_1: {
                    siteId: [
                        {required: true, message: this.$t('ymx-detail.siteReq'), trigger: 'change', type: 'number'}
                    ],
                    category_template_id: [
                        {required: true, message: this.$t('ymx-detail.cateReq'), trigger: 'change', type: 'number'}
                    ]

                }
            }
        },
        methods: {
            get_edit_data,
            get_product_attribute,
            /*重载分类模板*/
            async reload_category_templat(){
                this.$message({type:'warning',message: this.$t('ymx-detail.tempRequest')});
                const res =  await this.get_product_attribute(1, this.form.siteId);
                if(!res||res.length<=0)return this.$message({type:'warning',message: this.$t('ymx-detail.cateNotExist')});
                this.$set(this.form,'categoryTemplatList',res);
                setTimeout(()=>{
                    this.$message({type:'success',message: this.$t('ymx-detail.tempSuccess')});
                },1000);
            },
            /*重载产品模板*/
            async reload_product_templat(){
                this.$message({type:"warning",message: this.$t('ymx-detail.proTemp')});
                let productType = 2;
                await this.get_product_attribute(productType, this.form.siteId).then(id => {
                    /*初始化产品默认模板属性
                    * */
                    if (!id) return this.$message({type: "warning", message: `【${row.code}】${this.$t('ymx-detail.account')}，暂无默认的产品模板，请添加！`});
                    this.$set(this.form,'product_template_id',id);
                    this.get_edit_data(productType, this.form.siteId, id).then(res => {
                        if (res.product) {
                            res.product.attrs.forEach(row => {
                                let restriction = [];
                                this.$set(row, 'require', row.required);
                                this.$set(row, 'type', 2);
                                this.$set(row, 'site', this.form.siteId);
                                this.$set(row, 'value', '');
                                this.$set(row, 'unitValue', '');
                                if (!!row.attribute) restriction = row.attribute.restriction;
                                this.$set(row, 'restriction', restriction);
                            });
                            this.$set(this.form,'commonAttList',res.product.attrs);
                            setTimeout(()=>{
                                this.$message({type:"success",message: this.$t('ymx-detail.proReload')})
                            },1000);
                        }else{
                            this.$message({type:"error",message:'产品模板为空'})
                        }
                    });
                });
            },
            quote_model(){
                this.$emit('quote-model',this.form.doc_id);
            },
            quote_old(){
                this.$emit('quote-old');
            },
            click_reference(item,ref){
                item.value = ref;
            },
            is_show(item){
                return item.select === 1&&item.key!=='VariationTheme'&&item.key!=='SaveMap'
            },
            initial_uppercase(index){
                if(!this.form.descript[index].value) return this.$message({message: this.$t('ymx-detail.enterTitle'), type:'warning'});
                let name= this.form.descript[index].value;
                name= name.map(row=>{
                    row=this.up_first_letter(row);
                    return row;
                });
                this.form.descript[index].value = name.join(' ');
            },
            up_first_letter(str){
                return str.substring(0,1).toUpperCase( ) + str.substring(1);
            },
            // 抛出事件 属性提交事件
            category_submit(category_id,val2,curCategory){
                if(curCategory==='first'){
                    this.$emit('category-submit',category_id);
                    this.do_form_basic_first(category_id,val2);
                }else{
                    this.do_form_basic_second(category_id,val2);
                }
            },
            //删除
            delete_category(name){
                if(name==='first'){/*当删除第一个产品分类时 ItemType/RecommendedBrowseNode/Department的值都需要清空*/
                    this.form.basic.forEach(row=>{
                        switch(row.key){
                            case 'ItemType':
                                row.value = '';
                                break;
                            case 'RecommendedBrowseNode':
                                row.value='';
                                break;
                            case 'Department':
                                row.value = '';
                                break;
                        }
                    });
                }else{/*当删除第二产品分类时，相对应的删除RecommendedBrowseNode中逗号后面的分类值*/
                    this.form.basic.forEach(row=>{
                        if(row.key==='RecommendedBrowseNode'){
                            let list = row.value.split(',');
                            row.value = list[0];
                        }
                    });
                }
            },
            do_form_basic_first(category_id,val2){
                this.form.basic.forEach(row=>{
                    switch(row.key){
                        case 'ItemType':
                            row.value = val2.item_type_keyword||'';
                            break;
                        case 'RecommendedBrowseNode':
                            if(row.value){
                                let list = row.value.split(',');
                                list[0] = String(val2.category_id);
                                row.value = list.join(',');
                            }else{
                                row.value = String(val2.category_id);
                            }
                            break;
                        case 'Department':
                            row.value = val2.department_name||'';
                            break;
                    }
                });
            },
            do_form_basic_second(category_id,val2){
                this.form.basic.forEach(row=>{
                    switch(row.key){
                        case 'ItemType':/*当第一分类没有item_type_keyword值时，选择第二分类时才把item_type_keyword值填写进去*/
                            if(!row.value) row.value = val2.item_type_keyword||'';
                            break;
                        case 'RecommendedBrowseNode':
                            if(row.value){/*当row.value存在*/
                               let list = row.value.split(',');
                               console.log(list.length,'list.length');
                                if(list.length>1){//已经存在两个分类id，拿出最后一个进行修改
                                    list[1] = String(val2.category_id);
                                }else{//否则直接push进去
                                    list.push(String(val2.category_id));
                                }
                                row.value = list.join(',');
                            }else{/*当row.value不存在*/
                                row.value =  String(val2.category_id);
                            }
                            break;
                        case 'Department':/*同理item_type_keyword值*/
                            if(row.value)row.value = val2.department_name||'';
                            break;
                    }
                });
            },
            submit_from(){
                let baseInfoFix = this.$refs['base-info-fix'].submitForm();
                let baseInfo = false;
                this.$refs['base_info_1'].validate((valid) => {
                    baseInfo = valid
                });
                return baseInfoFix && baseInfo
            },

            /*更改站点时 清空当前分类模板并获取分类模板列表
            * */
            get_category_list(){
                this.form.category_template_id = '';
                let type = 1;
                this.get_product_attribute(type,this.form.siteId).then(res=>{
                    this.form.categoryTemplatList = res;
                });
            },

            /*获取分类模板属性
            * */
            common_attribute(){
                let type = 1;
                this.get_edit_data(type,this.form.siteId,this.form.category_template_id).then(res=>{
                    if(res.category){
                        let attrs = res.category.attrs;
                        console.log(attrs.length,'attrs.length');
                        if(attrs.length>0){
                            attrs.forEach(row=>{
                                let restriction = [];
                                this.$set(row,'type',type);
                                this.$set(row,'site',this.form.siteId);
                                this.$set(row,'require',row.required);
                                this.$set(row,'value','');
                                this.$set(row,'unitValue','');
                                if(!!row.attribute)restriction = row.attribute.restriction;
                                this.$set(row,'restriction',restriction);
                            });
                        }
                        let variant = res.category.variant;
                        let objData = {
                            resAttr:attrs,
                            type:type,
                            variant:variant,
                        };
                        this.common_attr(objData);
                    }else{
                        console.log('分类模板无数据');
                    }
                });
            },
            common_attr(objData){
                let val = objData.resAttr;
                let type = objData.type;
                let variant = objData.variant?objData.variant:[];
                let commonAttList =  this.form.commonAttList;
                console.log(commonAttList,'commonAttList');
                let listLength = commonAttList.filter(row=>row.type===type).length;
                let i = commonAttList.findIndex(row=>row.type===type);
                /*更改分类模板时获取变体 Variation Theme
                * */
                if(type===1){
                    this.form.variationTheme = [...variant];
                    this.form.basic.filter(res=>res.key ==='VariationTheme').forEach(row=>{
                        row.value = '';
                    });
                    this.delete_variant();
                }
                if(i>-1){
                    commonAttList.splice(i,listLength,...val);
                }else{
                    type===1?commonAttList.push(...val):commonAttList.unshift(...val);
                }
            },
            /*更改 Variation Theme时，先删除旧的变体属性
            * */
            delete_variant(){
                let nameList = Object.values(this.form.batchOperation).filter(row=>row.isVariant).map(row=>row.name);
                this.form.variant_title = this.form.variant_title.filter(row=>!nameList.includes(row));
                nameList.forEach(row=>{
                    this.form.variant.forEach(res=>{
                        delete res[row];
                    })
                });
            },
            /*获取产品模板&&对应的属性
            * */
            get_attr_product(){
                let productType = 2;
                this.get_product_attribute(productType,this.form.siteId).then(id=>{
                    /*初始化产品默认模板属性
                    * */
                    if(!id)return this.$message({type:"warning",message: this.$t('ymx-detail.setDefault')});
                    this.form.product_template_id = id;
                    this.get_edit_data(productType,this.form.siteId,id).then(res=>{
                        if(res.product){
                            res.product.attrs.map(row=>{
                                this.$set(row,'type',productType);
                                this.$set(row,'site',this.form.siteId);
                                this.$set(row,'require',row.required);
                                this.$set(row,'value','');
                            });
                            let commonAttList = res.product.attrs;
                            let objData = {
                                resAttr:commonAttList,
                                type:productType
                            };
                            this.common_attr(objData);
                        }else{
                            console.log('分类模板暂无数据');
                        }
                    });
                });
            },
            //将站点更改为不可点击状，故此事件暂时不用
            site_change(val){
                if(val==='')return;
                let find = this.form.siteList.find(row=>row.value===val);
                this.form.siteName =!!find?find.label:'';
                this.get_category_list();
                this.get_attr_product();
            },
            first_change(val){
                this.form.category_template_id = val;
                this.common_attribute();
            },
        },
        computed: {
            second_category(){
                let row = this.form.categoryTemplatList.find(item => {
                    return item.id === this.form.category_template_id
                });
                if (!!row)return row.children;

            },
            comSite(){
                if(this.form.siteList&&this.form.siteId){
                    let find = this.form.siteList.find(row=>this.form.siteId === row.value);
                    if(find)return find.label;
                }
            },
        },
        props: {
            form:{
                required:true,
                type:Object
            },
            labelWidth:{
                type:String
            },
            /*由于范本刊登详情页面和Amazon刊登详情页面有所不同，故使用此字段进行区分*/
            showSite:{
                type:Boolean,
                default(){
                    return false
                }
            },
            /*header 对象判断doc_id有无值，有值代表有范本可以一键引用
            * */
            referableNum:{
                type:Number
            },
            /*curPage 判断从哪个页面进入详情的，可选值为'not','edit'，'copy','draft'
            * */
            curPage:{
                type:String
            }
        },
        components: {
            fixAttribute: require('./components/fix-attribute.vue').default,
            productCategory: require('./components/product-category.vue').default,
            limitInput: require('../../ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            referenceValue:require('./reference-value').default,
        }
    }
</script>

