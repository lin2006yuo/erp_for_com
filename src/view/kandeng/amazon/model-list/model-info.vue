<template>
    <page class="over-flow-auto" v-loading="loading">
        <relation-data :form="form" @del-site="del_site" @add-site='add_site'></relation-data>
        <el-tabs type="border-card"
                 class="mt-sm"
                 :editable="false"
                 :active-name="currentTab"
                 v-model="currentname"
                 @edit="handle_tabs_edit"
                 v-if="form.data&&form.data.length>0">
            <el-tab-pane
                    v-for="(item, index) in form.data"
                    :label="item.siteName"
                    :name="item.siteName"
                    :key="`${item.siteName}-${index}`">
                <account-tab-base ref="tab_base"
                                  :show-site="true"
                                  :label-width="labelWidth"
                                  :form="item"></account-tab-base>
                <account-tab-title-des ref="title_des"
                                       :editId="index"
                                       :show-site="true"
                                       :curPage="param.curPage"
                                       :label-width="labelWidth"
                                       :form="item"></account-tab-title-des>
                <account-tab-sku-set ref="sku_set"
                                     :show-cur="true"
                                     :label-width="labelWidth"
                                     @get-variation-list="get_variation_list(item,$event)"
                                     :form="item"></account-tab-sku-set>
                <account-tab-describ :edit-id="index"
                                     :rondom="param.curPage==='not'"
                                     :label-width="labelWidth"
                                     :form="item"></account-tab-describ>
            </el-tab-pane>
        </el-tabs>
        <div class="page-fixed">
            <request-button req-key="applyAll" @click="apply_all">应用所有</request-button>
            <request-button req-key="saveAsModel" @click="save_as_model" v-if="param&&param.curPage!=='edit'">存为范本</request-button>
            <request-button req-key="updateCurModel" @click="update_cur_model" v-if="param&&param.curPage==='edit'">更新范本</request-button>
            <el-button @click.native="cancel">取消</el-button>
        </div>
    </page>
</template>
<style lang="stylus">
    .over-flow-auto{
        padding-bottom:45px;
    }
</style>
<script>
    import {api_doc_base_field,api_doc_site_field,api_doc_save,api_doc_edit_field} from '@/api/product-category-api';
    import {get_product_attribute, get_edit_data} from '../info/info-public-methods';
    import {api_pricing_rules} from '@/api/amazon-publish-info';
    export default {
        page:{
            devinfo: {
                frontEnd: '王月如',
                backEnd: '张冬冬',
                createTime: '2018-8-3',
                updateTime: ''
            },
        },
        data() {
            return {
                /*页面数据源*/
                form:{},
                loading:false,
                currentTab:'',
                currentname:'',
                labelWidth:'260px',
                objOfProductId:{},//产品模板ID 站点为key，ID为值
                objOfCommonAtt:{},//产品模板&分类模板属性集 站点为key，属性集为值
                objOfCategory:{},//分类模板列表集  站点为key，列表为值
                editCopyData:{},
                editSite:'',
            }
        },
        mounted(){
            if(Object.keys(this.param).length>0){
                this.get_basics_data();
                let copy = 0;//编辑和复制范本区分 0不复制，1复制
                if(this.param.curPage==='not'){

                }else if(this.param.curPage==='edit'){
                    this.edit_copy_data(this.param,copy)
                }else if(this.param.curPage==='copy'){
                    copy = 1;
                    this.edit_copy_data(this.param,copy)
                }
            }
        },
        methods:{
            get_product_attribute,
            get_edit_data,
            /*计算刊登售价
            * */
            get_pricing_rules(row){
                let skuId = row.variant.map(res=>{
                    if(res['SKUID']) return res['SKUID'].value
                });
                let params = {
                    channel_id:2,
                    account_id:0,
                    site_code:row.siteName,
                    sku_id:skuId,
                };
                this.$http(api_pricing_rules,params).then(res => {
                    Object.keys(res).forEach(item=>{
                        if(!res[item].total_price)return;
                        let find = row.variant.find(it=>Number(it['SKUID'].value)===Number(item));
                        if(find)find['Standard Price'].value = res[item].total_price
                    });
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code})
                })
            },
            /*根据站点 调用产品模板属性
            * */
            async product_attribute(site){
                if(this.objOfCommonAtt.hasOwnProperty(site))return;
                let productType = 2;
                await this.get_product_attribute(productType, site).then(id => {
                    /*初始化产品默认模板属性
                    * */
                    this.objOfProductId[`${site}`] = id ? id : 0;
                    if (!id) return this.$message({type: "warning", message: `【${row.siteName}】站点，暂无默认的产品模板，请添加！`});
                    this.get_edit_data(productType, site, id).then(res => {
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
                            this.objOfCommonAtt[`${site}`] = res.product.attrs;
                        } else {
                            console.log('模板暂无数据');
                        }
                    });
                });
            },
            /*根据【站点】获取分类模板列表
            * */
            async get_category(site) {
                if(this.objOfCategory.hasOwnProperty(site))return;
                let type = 1;
                const res = await this.get_product_attribute(type, site);
                this.objOfCategory[`${site}`] = clone(res);
            },
            /*SKU组件中抛出事件 变体属性的详情
            * */
            get_variation_list(item, val) {
                this.$set(item, 'variationAttr', val);
            },
            handle_tabs_edit(){
                console.log(this.currentTab,'this.currentTab');
                console.log(this.currentname,'this.currentname');
            },
            del_site(val){
                let index = this.form.data.findIndex(row=>row.siteId===val);
                if(index>-1) {
                    let find = this.form.data.splice(index,1);
                    if((this.currentname === find[0].siteName)&&this.form.data.length>0){
                        this.currentname = this.form.data[index-1].siteName;
                        this.currentTab = this.form.data[index-1].siteName;
                    }
                }
            },
            async add_site(val){
                /*添加站点时需要获取【当前站点】下的产品属性&&详情数据
                * */
                 await this.product_attribute(val);
                 await this.get_category(val);
                 /*已经请求过的有记录，可以不用再次请求
                 * */
                if(this.objOfCommonAtt.hasOwnProperty(val)&&this.objOfCategory.hasOwnProperty(val)){
                    this.request_data(val);
                }else{
                    let curSiteObj = this.get_siteName(val);
                    this.$message({type:'success',message:`${curSiteObj.label}站点数据请求中...`});
                    setTimeout(()=>{
                        this.request_data(val);
                    },2000)
                }
            },
            request_data(val){
                if(this.param.curPage==='not'||this.param.curPage==='edit'){
                    this.get_doc_site(val)
                }else if(this.param.curPage==='copy'){
                    this.copy_data(val);
                }
            },
            /*（1）根据站点请求的数据源
            * */
            get_doc_site(site){
                let params = {
                    goods_id:this.form.goods_id,
                    site:site
                };
                let siteName = '';
                let find = this.form.sites.find(row=>row.value === site);
                if(find)siteName = find.label;
                this.$http(api_doc_site_field,params).then(res => {
                    let curSiteObj = this.get_siteName(site);
                    let cur = {
                        category_name:'',
                        category_name2:'',
                        category_id:'',
                        category_template_id:'',
                        siteName:curSiteObj.label,
                        siteId:curSiteObj.value,
                        currency:curSiteObj.currency,
                    };
                    Object.assign(cur,res.data);
                    this.arrange_form(cur);
                }).catch(code => {
                    this.$message({type:'error',message:code.message||code});
                })
            },
            /*（2）整理根据站点请求的数据源，并展现在页面中
            * */
            arrange_form(cur){
                cur.descript.forEach(row => {
                    row.field.forEach(res => {
                        if (res.name === 'Description') {
                            res.value = `<p>${res.value}</p>`
                        }
                    })
                });
                cur.sku.forEach(row => {
                    let objValue = {
                        type: 'check',
                        value: true,
                    };
                    this.$set(row, 'check', objValue);
                });
                cur.img.forEach(row => {
                    if (row.data.images && row.data.images.length > 0) {
                        row.data.images.forEach(it => {
                            this.$set(it, 'isSwatch', false);
                        });
                        row.data.images[0].isSwatch = true;
                    }
                });
                let batchOperation = cur.sku[0];
                let variant_title = this.arrange_header(Object.keys(cur.sku[0]));
                let images = cur.img.map(row => row.data);
                this.$set(cur,'commonAttList',clone(this.objOfCommonAtt[`${cur.siteId}`]));
                this.$set(cur,'product_template_id',this.objOfProductId[cur.siteId]);
                this.$set(cur,'categoryTemplatList',clone(this.objOfCategory[`${cur.siteId}`]));
                this.$set(cur,'bindCategoryList',[]);
                this.$set(cur,'variationTheme',[]);//变体
                this.$set(cur,'skuActiveName',`${cur.descript[0].skuName}-0`);
                this.$set(cur,'variant_title',variant_title);
                this.$set(cur,'variant',cur.sku);
                this.$set(cur,'batchOperation',clone(batchOperation));
                this.$set(cur,'images',images);
                this.get_pricing_rules(cur);
                this.form.data.push(cur);
                this.currentTab = cur.siteName;
                this.currentname = cur.siteName;
            },
            /*整理表格头部
            * */
            arrange_header(title) {
                let list = ['BindingGoods', 'check'];
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
            /*未选择站点前，根据goods_id，获取 【关联产品信息】
            * */
            async get_basics_data(){
                await this.$http(api_doc_base_field,{goods_id:this.param.goods_id}).then(res => {
                    let usedList = res.data.sites.filter(row=>!!row.used).map(row=>row.value);
                    Object.assign(this.form,res.data);
                    this.$set(this.form,'siteList',usedList);
                    this.$set(this.form,'data',[]);
                }).catch(code => {
                    console.log(code);
                    this.$message({type:'error',message:code.message||code});
                })
            },
            /* 更新范本 == 更新一条数据
            * */
            update_cur_model(){
                if(!this.validate_data()){
                    return this.$reqKey('updateCurModel',false)
                }
                let data = this.arrange_save_data(this.form.data);
                this.$http(api_doc_save,{data:data}).then(res => {
                    this.$message({type:'success',message:res.message})
                    this.$close(`/kandeng/amazon/model/info?id=${this.param.curPage}${this.param.id}`);
                }).catch(code => {
                    this.$message({type:'error',message:code.message})
                }).finally(()=>{
                    this.$reqKey('updateCurModel',false);
                });
            },
            /*存为范本 == 新增一条数据
            * */
            save_as_model(){
                if(!this.validate_data()){
                    return this.$reqKey('saveAsModel',false)
                }
                let data = this.arrange_save_data(this.form.data);
                this.$http(api_doc_save,{data:data}).then(res => {
                    this.$message({type:'success',message:res.message});
                    this.$close(`/kandeng/amazon/model/info?id=${this.param.curPage}${this.param.goods_id}`);
                }).catch(code => {
                    this.$message({type:'error',message:code.message})
                }).finally(()=>{
                    this.$reqKey('saveAsModel',false);

                });
            },
            /*取消 关闭当前详情
            * */
            cancel(){
                this.$confirm(`此操作将关闭页面且不会保存现有数据，确认进行此操作吗？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    switch (this.param.curPage){
                        case 'edit':
                            this.$close(`/kandeng/amazon/model/info?id=${this.param.curPage}${this.param.id}`);
                            break;
                        case 'not':
                            this.$close(`/kandeng/amazon/model/info?id=${this.param.curPage}${this.param.goods_id}`);
                            break;
                        case 'copy':
                            this.$close(`/kandeng/amazon/model/info?id=${this.param.curPage}${this.param.id}`);
                            break;
                    }
                });
            },
            /*保存数据整理
            * */
            arrange_save_data(sourceData){
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
                            res.value = datef('YYYY-MM-dd HH:mm:ss', time);
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
                    row.variant.forEach(res => {
                        let obj = {};
                        row.variant_title.forEach(item => {
                            if (res[item] && res[item].unitValue) {//提交单位格式为 元素名@属性：属性值，如：SpoutHeight@unitOfMeasure: "CM"
                                obj[`${res[item].key}@${res[item].attribute.name}`] = res[item].unitValue;
                            }
                            if (item !== 'check' && !!res[item].key) obj[res[item].key] = res[item].value
                        });
                        sku.push(obj);
                    });
                    let cloneImages = clone(row.images);
                    cloneImages.filter(res => res.name === '主图').forEach(res => {
                        res.images = res.images.splice(0, 9);
                        img.SpuImage = res.images.map(item => {
                            return {
                                base_url: item.base_url,
                                path: item.path,
                            }
                        });
                    });
                    cloneImages.filter(res => res.name !== '主图').forEach(res => {
                        res.images = res.images.splice(0, 9);
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
                        goods_id: this.form.goods_id,
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
                    if (this.param.curPage !== 'copy' && !!this.form.id) this.$set(objData,'id',row.id||0);
                    return objData;
                });
            },
            /*获取站点ID/站点名称/货币单位
            * */
            get_siteName(val){
                let find = this.form.sites.find(row=>row.value===val);
                return !!find?find:{};
            },
            /*应用所有
            * */
            apply_all() {
                this.$confirm('您确定要将当前页面内容覆盖到其他已选的平台帐号中吗？,此操作将会覆盖其他已选帐号中的部分数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let templateData = this.form.data.find(row => {
                        return row.siteName === this.currentname;
                    });
                    setTimeout(() => {
                        this.form.data.forEach((row, index) => {
                            if (row.siteName !== this.currentname) {
                                const curForm = {
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
                                    id:row.id||0,
                                };
                                //先应用所有
                                Object.assign(row, clone(templateData));
                                row.siteId = curForm.siteId;
                                this.$set(row,'id',curForm.id);
                                //受站点影响需特殊处理的字段
                                if (templateData.siteId !== row.siteId) {
                                    this.arrange_parameter(row, curForm, false);
                                }
                                //虽不受站点影响仍需特殊处理的描述部分
                                this.handle_desc(templateData, index);
                                this.$message({type: 'success', message: '复制成功'});
                            }
                        });
                        console.log(this.form.data,'this.form.data');
                        this.$message({
                            type: 'success',
                            message: '已应用到所有'
                        });
                        this.$reqKey('applyAll', false);
                    }, 0);
                }).catch(() => {
                    this.$message({type: 'info', message: '已取消操作'});
                    this.$reqKey('useAll', false);
                });
            },
            //重新整理受站点影响字段
            arrange_parameter(row, form, isCopy) {
                //isCopy为true需要特殊处理几个字段
                row.currency = form.currency;
                row.siteId = form.siteId;
                row.siteName = form.siteName;
                row.categoryTemplatList = form.categoryTemplatList;
                row.commonAttList = form.commonAttList;
                row.category_id = form.category_id;
                row.category_name = form.category_name;
                row.category_name2 = form.category_name2;
                row.category_template_id = form.category_template_id;
                row.product_template_id = form.product_template_id;
                row.variationTheme = [];
                row.bindCategoryList = [];
                row.basic.forEach(res => {
                    let list = ['Item Type Keyword', 'RecommendedBrowseNode', 'Department', 'VariationTheme'];
                    if (!!list.find(item => res.name === item)) res.value = '';
                });
                form.bindCategoryList.map(item => item.attr_name).forEach(item => {
                    row.variant.forEach(res => {
                        delete res[item]
                    });
                });
                row.variant_title = this.arrange_header(Object.keys(row.variant[0]));
                row.batchOperation = clone(row.variant[0]);
            },
            //处理描述部分
            handle_desc(tempData, index) {
                tempData.descript.forEach((res, index_i) => {
                    let find = res.field.find(item => item.key === 'Description');
                    this.$refs.title_des[index].$refs.uEditor[index_i].editor.setValue(find.value);
                });
            },
            /*验证是否可以提交
            * */
            validate_data() {
                let canSubmit = true;
                this.form.data.forEach(row => {
                    if (!row.category_template_id) return canSubmit = this.public_message(row.siteName, `【基本信息】模块->分类模板`);
                    if (!row.product_template_id) return canSubmit = this.public_message(row.siteName, `【基本信息】模块->产品模板`);
                    if (!row.category_id) return canSubmit = this.public_message(row.siteName, `【基本信息】模块->产品分类`);
                    let findBasic = row.basic.find(res => res.require && res.value === '');
                    if (findBasic) return canSubmit = this.public_message(row.siteName, `【基本信息】模块->${findBasic.name}`);
                    let findCommonAttr = row.commonAttList.find(res => res.require && res.value === '');
                    if (findCommonAttr) return canSubmit = this.public_message(row.siteName, `【基本信息】模块->${findCommonAttr.name}`);
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
                        return canSubmit = this.public_message(row.siteName, `【标题与描述】模块->SKU:${findDescript.skuName}->${this.which_title(findDescript.find.key)}`);
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
                        return canSubmit = this.limit_maxLength(row.siteName, `【标题与描述】模块->SKU:${findDes.skuName}->${this.which_title(findDes.find.key)}`);
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
                        return canSubmit = this.public_message(row.siteName, `【SKU设置】模块->第${findVariant.index + 1}行->${findVariant.find.name}`);
                    }
                    let findImage = row.images.find(res => res.name !== '主图' && res.images.length <= 0);
                    if (findImage) {
                        this.$message({
                            type: "warning",
                            message: `${row.siteName}站点，【图片与描述】模块->子SKU:${findImage.name}至少添加一张图片`
                        });
                        canSubmit = false;
                    }
                });
                return canSubmit;
            },
            //必填提示
            public_message(siteName, name, otherTip) {
                if (otherTip) {
                    this.$message({type: 'warning', message: `【${siteName}】站点，${name}有必填项未填写，请补充完整`});
                } else {
                    this.$message({type: 'warning', message: `【${siteName}】站点，${name}为必填项，请补充完整`});
                }
                return false;
            },
            //字符长度限制
            limit_maxLength(siteName, name) {
                this.$message({type: 'warning', message: `【${siteName}】站点，${name}字符长度超出最大限制，请修改`});
                return false;
            },
            /*用于标题与描述部分*/
            which_title(val) {
                switch (val) {
                    case 'Title':
                        return '刊登标题';
                    case 'Description':
                        return '详情描述';
                    default:
                        return val
                }
            },
            /*编辑
            * */
            edit_copy_data(param,copy){
                this.$http(api_doc_edit_field,{id:param.id,copy:copy}).then(res => {
                    res = res.data;
                    let curSiteObj = this.get_siteName(res.site);
                    this.get_category(res.site);
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
                    let type = 0;
                    this.get_edit_data(type, res.site, res.category_template_id, res.product_template_id).then(item => {
                        if (!item) return;
                        let cate = item.category;
                        let pro = item.product;
                        let existCate = cate.hasOwnProperty('message')?false:true;
                        let existPro = pro.hasOwnProperty('message')?false:true;
                        let skuObj = this.arrange_sku_table(res, item,existCate);
                        if(!existCate&&!existPro){
                            this.reset_product_category_attr(curSiteObj.value, item, res,'分类模板和产品模板');
                        }else if(!existCate&&existPro){
                            this.reset_product_category_attr(curSiteObj.value, item, res,'分类模板');
                        }else if(existCate&&!existPro){
                            this.reset_product_category_attr(curSiteObj.value, item, res,'产品模板');
                        }else{
                            /*存在产品模板和分类模板时
                           *整理产品模板&&分类模板所带的属性
                           * */
                            this.arrange_product_category_attr(curSiteObj.value, item, res);
                        }
                        /*获取批量操作的列
                        * */
                        this.editData = {
                            id:copy===1?0:res.id,
                            siteId: curSiteObj.value,
                            currency:curSiteObj.currency ,
                            siteName: curSiteObj.label,
                            goods_id: res.goods_id,
                            category_id: this.form.category_id,
                            category_template_id: existCate?res.category_template_id:'',
                            product_template_id: existPro?res.product_template_id:this.objOfProductId[`${curSiteObj.value}`],
                            basic: res.basic,
                            descript: res.descript,
                            variant: skuObj.variant,
                            batchOperation: skuObj.batchOperation,
                            bindCategoryList: skuObj.bindCategoryList,
                            variant_title: skuObj.variant_title,
                            variant_option: res.variant_option,
                            variant_info: res.variant_info,
                            images: images,
                            categoryTemplatList: clone(this.objOfCategory[`${curSiteObj.value}`]),
                            commonAttList: clone(this.objOfCommonAtt[`${curSiteObj.value}`]),
                            variationTheme: item.category.variant || [],//变体
                            skuActiveName: `${descript[0].skuName}-0`,
                            siteList: this.siteList,
                            category_name: res.amazon_category_name,
                            category_name2: res.amazon_category_name2,
                        };
                        if (copy === 0) {
                            this.form.data.push(this.editData);
                            this.currentTab = curSiteObj.label;
                            this.currentname = curSiteObj.label;
                            this.editSite = curSiteObj.label;
                        }
                    });
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            reset_product_category_attr(site, item, res, name) {
                this.$confirm(`当前${name}无效，点击确定将初始化模板，是否确定继续？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    closeOnClickModal: false,
                }).then(() => {
                    if(name==='产品模板'||name==='分类模板和产品模板'){
                        res.product_template_info = {};
                        this.product_attribute(site);
                    }else{
                        res.category_template_info = {};
                    }
                }).catch(() => {
                    this.$close(`/kandeng/amazon/info?id=${this.param.curPage}${this.param.id}`);
                })
            },
            arrange_product_category_attr(site, item, res) {
                /*整理产品模板属性
                * */
                item.product.attrs.forEach(row => {
                    let restriction = [];
                    this.$set(row, 'require', row.required);
                    this.$set(row, 'type', 2);
                    this.$set(row, 'site', this.param.site);
                    this.$set(row, 'value', '');
                    this.$set(row, 'unitValue', '');
                    if (!!row.attribute) restriction = row.attribute.restriction;
                    this.$set(row, 'restriction', restriction);
                });
                Object.keys(res.product_template_info).forEach(it => {
                    if (it.includes('@')) {//映射 属性的值
                        let name = it.split('@');
                        let find = item.product.attrs.find(its => its.name === name[0]);
                        if (!!find) find.unitValue = res.product_template_info[it];
                    } else { //映射元素的值
                        let find = item.product.attrs.find(its => its.name === it);
                        if (!!find) find.value = res.product_template_info[it];
                    }
                });
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
                this.objOfCommonAtt[`${site}`] = [...item.product.attrs,...attrs];
            },
            //copy时数据渲染事件
            copy_data(val) {
                let obj = clone(this.editData);
                let curSiteObj = this.get_siteName(val);
                let findSameSite = this.form.data.find(item=>item.siteId===curSiteObj.value);
                if(findSameSite)return;
                const curForm = {
                    currency: curSiteObj.currency,//
                    siteId: curSiteObj.value,//
                    siteName: curSiteObj.label,//
                    categoryTemplatList: this.objOfCategory[`${curSiteObj.value}`],
                    commonAttList: this.objOfCommonAtt[`${curSiteObj.value}`],
                    category_id: '',
                    category_name: '',
                    category_name2: '',
                    category_template_id: '',
                    product_template_id: this.objOfProductId[`${curSiteObj.value}`],
                    bindCategoryList: obj.bindCategoryList,
                };
                if (curSiteObj.value !== obj.siteId) {//站点不相同时更改以下数据
                    this.arrange_parameter(obj, curForm, true);
                }
                this.form.data.push(obj);
                this.currentTab = curSiteObj.label;
                this.currentname = curSiteObj.label;
            },
            arrange_sku_table(res, item,Bool) {
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
                    detailsKeys.forEach(i => {
                        bindCategoryList.push({attr_name: i, option_value: ''})//sku模块 展示绑定关系表格的数据
                    });
                    //将绑定的变体属性插入在'参考_XX'属性的后面 Start
                    let list = variant_title.filter(row => row.includes('参考'));
                    let lastName = '';
                    if (list.length <= 0) list = variant_title.filter(row => row.includes('SKU'));
                    lastName = list[list.length - 1];
                    let findIndex = variant_title.findIndex(row => row === lastName);
                    if (findIndex > -1) variant_title.splice(findIndex + 1, 0, ...detailsKeys);//在列表头部加入变体
                    //将绑定的变体属性插入在'参考_XX'属性的后面 End；
                    variant_info_arr.forEach((row, index) => {
                        let skuValue = variant[index]['平台SKU'].value;
                        if (skuValue === row.skuName) {
                            let find = variant[index];//找到对应的行SKU数据
                            let details = Object.keys(row.field).filter(item => !item.includes('@'));//当前SKU下变体属性的名称数组集合
                            let unitDetails = Object.keys(row.field).filter(item => item.includes('@'));//当前SKU下变体属性的名称数组集合
                            details.forEach(its => {
                                let findChild = item.category.attrs.find(i => i.name === its);
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
        },
        components: {
            accountTabBase: require('../info/account-tab-base.vue').default,
            accountTabSkuSet: require('../info/account-tab-sku-set.vue').default,
            accountTabDescrib: require('../info/account-tab-describ.vue').default,
            accountTabTitleDes: require('../info/account-tab-title-des.vue').default,
            relationData:require('./relation-data.vue').default,
        }
    }
</script>