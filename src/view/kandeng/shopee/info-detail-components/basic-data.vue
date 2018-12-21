<template>
    <div class="c-basic-data">
        <rainbow-header title="基本信息" background-color="#EB5405">
            <el-form :model="form" label-width="220px" :rules="rules">
                <el-form-item label="账号简称：">
                    <el-tag type="success">{{form.account_code}}</el-tag>
                </el-form-item>
                <el-form-item label="产品分类：">
                    <el-button type="primary" size="mini" @click.native="open_classify">选择分类</el-button>
                    <span class="operate ml-sm">{{form.category_name}}</span>
                </el-form-item>
            </el-form>
                <!--选择产品时出现属性-->
            <el-form :model="form" label-width="220px" v-if="form.attributes&&form.attributes.length>0">
                <template v-for="(item,index) in form.attributes">
                    <el-form-item :label="`${item.attribute_name}：`" :rules="{required: item.is_mandatory === 1, message:'必填选项', trigger:'blur'}">
                        <el-input style='width:15%' v-if="item&&item.input_type==='TEXT_FILED'"
                                  v-model="item.attribute_value"></el-input>
                        <el-select style='width:15%' v-if="item&&item.input_type==='DROP_DOWN'"
                                   v-model="item.attribute_value"
                                   default-first-option filterable clearable>
                            <el-option
                                    v-for="res in item.options"
                                    :label="res"
                                    :value="res"
                                    :key="res"
                            ></el-option>
                        </el-select>
                        <!--<el-select style='width:15%'-->
                                   <!--v-model="item.attribute_value"-->
                                   <!--remote :remote-method="remote_method(item.options,$event)"-->
                                   <!--default-first-option filterable clearable>-->
                            <!--<el-option-->
                                    <!--v-for="res in item.options"-->
                                    <!--:label="res"-->
                                    <!--:value="res"-->
                                    <!--:key="res"-->
                            <!--&gt;</el-option>-->
                        <!--</el-select>-->
                        <filter-select v-if="item&&item.input_type==='COMBO_BOX'&&!!item.change_type"
                                       :source="item"></filter-select>
                        <el-radio-group style='width:95%' v-if="item&&item.input_type==='COMBO_BOX'&&!item.change_type"
                                        v-model="item.attribute_value">
                            <el-radio v-for='it in item.options'
                                      :key="it"
                                      :label="it">{{it}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </template>
            </el-form>
            <el-form :model="form" label-width="220px">
                <el-form-item label="刊登标题：">
                    <limit-input
                            v-model="form.name"
                            :is-textarea="false"
                            :maxlength="80"
                            :cur-span="18"
                    ></limit-input>
                </el-form-item>
                <el-form-item label="主商品货号：">
                    <el-row>
                        <el-col :span="6">
                            <el-input v-model="form.item_sku"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="SKU信息：">
                    <el-button class='mb-sm' type="primary" size="mini" @click.native="add_sku">添加SKU</el-button>
                    <el-row>
                        <el-col :span="18">
                            <basic-sku-table :form="form"></basic-sku-table>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="批发销售：">
                    <el-button class='mb-sm' type="primary" size="mini"
                               @click.native="add_wholesale_price">添加批发价格</el-button>
                    <el-row>
                        <el-col :span="18">
                            <whole-sale :form="form" v-if="form.wholesales.length>0"></whole-sale>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="定时刊登：">
                    <el-date-picker
                            v-model="form.cron_time"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </rainbow-header>
        <!--分类接口与速卖通相同-->
        <category-dialog v-model="categoryShow" :site='form.site_id'
                         channel="shopee" @submit="submit"></category-dialog>
        <add-goods v-model="addGoodsDialog" @add-goods="add_goods"></add-goods>
    </div>
</template>
<style lang="stylus">

</style>
<script>
    import {api_shopee_attribute} from '@/api/shopee-publish';
    export default {
        data() {
            return {
                categoryShow:false,
                rules:{},
                addGoodsDialog:false,
            }
        },
        methods:{
            remote_method(){

            },
            submit(data){
                this.categoryShow = false;
                if(data instanceof Array){
                    let length = data.length;
                    this.form.category_id = data[length-1].category_id;
                    let categoryName = data.map(row=>{
                        return row.category_name;
                    });
                    this.form.category_name = `${this.form.category_id}->>${categoryName.join('->>')}`;
                }else{
                    this.form.category_id = data.category_id;
                    this.form.category_name = `${data.category_id}->>${data.category_name}`
                }
                this.get_shopee_attr();
            },
            open_classify(){
                this.categoryShow = true;
            },
            add_sku(){
                this.addGoodsDialog = true;
            },
            add_wholesale_price(){
                if(this.form.wholesales){
                    if(this.form.wholesales.length<=0){
                        let obj = {
                            min:2,
                            max:3,
                            unit_price:'',
                        };
                        this.form.wholesales.push(obj);
                    }else{
                        let length = this.form.wholesales.length;
                        let curRow = this.form.wholesales[length-1];
                        if(!curRow.min||!curRow.max)return this.$message({type:'warning',message:'有优惠区间尚未填写完整，请补充最小数据量&最大数量'});
                        let obj = {
                            min:curRow.max?Number(curRow.max)+1:'',
                            max:'',
                            unit_price:'',
                        };
                        this.form.wholesales.push(obj);
                    }
                }
            },
            /**获取分类属性
             * */
            get_shopee_attr(){
                this.$http(api_shopee_attribute,{category_id:this.form.category_id}).then(res => {
                    res.forEach(row=>{
                        if(row.input_type==='COMBO_BOX'){
                            if(row.options&&row.options.length>20){
                                this.$set(row,'change_type',true)
                            }else{
                                this.$set(row,'change_type',false)
                            }
                        }
                    });
                    this.$set(this.form,'attributes',res);
                }).catch(code => {
                    console.log(code,'code');
                })
            },
            /*添加sku
            * */
            add_goods(addForm,goods){
                let list = addForm.filter(row=>{
                    return !this.form.variant.find(res=>res.sku===row.sku);
                });
                let keys = clone(goods.keys);
                if(list.length<addForm.length)return this.$message({type:'warning',message:'已过滤重复数据'});
                let listChild = list.map(row=>{
                    let refer_name = keys.map(res=>{
                         return row[res];
                    }).join("_");
                    let name =  keys.map(res=>{
                        return row[res].includes('|')?row[res].split('|')[1]:row[res];
                    }).join("_");
                    return {
                        id:row.id,
                        isCheck:true,
                        sku:row.sku,
                        name:name,
                        refer_name:refer_name,
                        cost_price:row.cost_price,
                        weight:row.weight,
                        price:'',
                        stock:1000
                    }
                });
                this.form.variant = [...this.form.variant,...listChild]
            },
        },
        props:{
            form:{
                type:Object,
                required:true
            }
        },
        components: {
            rainbowHeader:require('@/components/rainbow-header.vue').default,
            limitInput:require('@/view/kandeng/ebay/kandeng-list/add-edit-listing/limit-input.vue').default,
            categoryDialog:require("../../ebay/category-dialog.vue").default,
            basicSkuTable:require('./basic-sku-table.vue').default,
            addGoods:require('@/api-components/add-goods').default,
            wholeSale:require('./whole-sale.vue').default,
            filterSelect:require('./filter-select.vue').default,
        }
    }
</script>