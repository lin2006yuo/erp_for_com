<!--产品模板设置&&分类模板设置 添加&&编辑公用页面，更改时需兼顾两个页面-->
<template>
    <div>
        <page-dialog v-model="dialog"
                     :close-on-click-modal="false"
                     :size="type===1?'full':'large'" :title="title">
            <add-edit-header :form="form"
                             ref="header"
                             :type="type"></add-edit-header>
            <el-button type="primary"
                       size="mini"
                       @click.native="add_product"
                       class="mt-sm mb-sm ml-sm">添加产品元素</el-button>
            <el-row :gutter="8">
                <el-col :span="comSpan">
                    <add-edit-middle :form="form" :type="type" ref="middle"></add-edit-middle>
                </el-col>
                <el-col v-if='comSpan<24' :span="_comSpan">
                    <variant-data :form="form"></variant-data>
                </el-col>
            </el-row>
            <div slot="footer">
                <el-button type="primary" size="mini" class="inline" @click.native="submit">确定</el-button>
                <el-button size="mini" class="inline" @click.native="dialog = false">取消</el-button>
            </div>
        </page-dialog>
        <product-category-data v-model="addCategoryData"
                               :form="form"
                               :type="type"
                               title="添加产品元素"
                               @submit="add_category_data"></product-category-data>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_add_amazon_template,api_update_amazon_template} from '../../../../api/product-category-api';
    export default {
        data() {
            return {
                siteList:[],
                addCategoryData:false,
                dialog:this.value,
            }
        },
        computed:{
            comSpan(){
                if(this.form.variant&&this.form.variant.length>0){
                    return 16;
                }
                return 24;
            },
            _comSpan(){
                return 24-this.comSpan;
            },
        },
        watch:{
            dialog(val){
                this.$emit('input',val);
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            get_params(){
                if(this.form.site==='') return this.$message({type:"warning",message:"平台站点为必填项，请完善！"});
                if(this.form.name==='') return this.$message({type:"warning",message:"模板名称为必填项，请完善！"});
                if(this.form.detail.length<=0)return this.$message({type:"warning",message:"请至少添加一条产品元素！"});
                let canSubmit = true;
                let form = clone(this.form);
                form.status = form.status?1:0;
                let class_type_id = this.type===1?`${form.firstTypeId},${form.childTypeId}`:'';
                this.$set(form,'class_type_id',class_type_id);
                if(form.hasOwnProperty('firstTypeId')) delete form.firstTypeId;
                if(form.hasOwnProperty('childTypeId')) delete form.childTypeId;
                form.detail.forEach((row,index)=>{
                    row.sort = index+1;
                    row.sku = row.sku?1:0;
                    row.required = row.required?1:0;
                    row.name = row.name?row.name:row.element_name;
                });
                if(!!form.variant){
                    let variantList = form.detail.map(row=>row.name);
                    form.variant.forEach((row,index)=>{
                        let find = row.relation_field.find(res=>!variantList.includes(res));
                        if(!!find){
                            canSubmit = false;
                            this.$message({type:"warning",message:`${row.name}属性对应的变体有误，请检查变体名称是否存在`});
                        }
                    });
                }
                return canSubmit?form:canSubmit;
            },
            submit(){
                let params = this.get_params();
                if(!params)return;
                let api = params.id?api_update_amazon_template:api_add_amazon_template;
                return this.$http(api,params).then(res=>{
                    this.$message({type:"success",message:res.message||res});
                    this.dialog = false;
                    this.$emit('submit',res);
                    return Promise.resolve();
                }).catch(code=>{
                    this.$message({type:"error",message:code.message||code});
                })
            },
            add_product(){
                if(this.form.firstTypeId==='')return this.$message({type:"warning",message:"请选择一个分类"});
                if(this.$refs.header.childClassName.length>0&&this.form.childTypeId==='') return this.$message({type:'warning',message:'请先选择子分类'});
                this.addCategoryData = true;
            },
            add_category_data(val,variantList){
                this.addCategoryData = false;
                val.forEach(row=>{
                    let find = this.form.detail.find(res=>res.amazon_element_relation_id===row.id);
                    if(find)return this.$message({type:'warning',message:'重复数据已过滤'});
                    let obj = {
                        name:row.name,
                        element_name:row.name,
                        node_tree:row.node_tree,
                        amazon_element_relation_id:row.id,
                        required:false,
                        sort:row.sort,
                        number:1,
                        isTurn:false,
                        select:0,
                        show:1
                    };
                    if(this.type===1){//row.variation = 0 说明有变体
                        this.$set(obj,'sku',false);
                    }
                    this.form.detail.push(obj);
                });
                /*变体数据
                 * */
                if(variantList&&variantList.length>0){
                    variantList.forEach(row=>{
                        let find = this.form.variant.find(res=>res.name===row);
                        if(!!find)return this.$message({type:"warning",message:"重复数据已过滤"});
                        let objVar = {
                            name:row,
                            relation_field:[],
                        };
                        this.form.variant.push(objVar);
                    });
                }
                this.$refs.middle.mounted_data();
            },
        },
        props:{
            value:{},
            title:{
                required:true,
                type:String
            },
            type:{ //类别，1产品，2分类
                required:true,
                type:Number
            },
            form:{
                required:true,
                type:Object
            },
        },
        components: {
            addEditHeader:require('./add-edit-header.vue').default,
            pageDialog:require('../../../../components/page-dialog.vue').default,
            productCategoryData:require('./product-category-data.vue').default,
            addEditMiddle:require('./add-edit-middle.vue').default,
            variantData:require('./variant-data.vue').default,
        }
    }
</script>