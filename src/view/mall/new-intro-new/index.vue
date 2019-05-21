<template>
    <page-dialog :title="pageTitle" v-model="dialog" size="full" :close-on-click-modal="false">
        <el-row class="product-index">
            <el-col :span="24">
                <el-card class="card" v-loading="loading" element-loading-text="拼命加载中">
                <product-info :check-form="checkData" ref="productForm" :mark-id="public.markId" :category-id="public.value"></product-info>
                <supplier-info :check-form="checkData" ref="supplierForm" :mark-id="public.markId"></supplier-info>
                <specification-info :lookspec-data="checkData.skus" :specData="checkData.specification" ref="specificationForm" :mark-id="public.markId" @changeInput="changeInput"  :category-id="public.value"></specification-info>
                <attributes-info :check-form="checkData" ref="attributesForm" :mark-id="public.markId"></attributes-info>
                <remark-info :check-form="checkData" ref="remarkForm" :mark-id="public.markId"></remark-info>
                <div class="operat-but">
                    <el-col :span="4" :offset="19" v-if="showRemark" >
                        <div class="remark-card">
                            <el-form>
                                <el-form-item label="备注信息">
                                    <el-input type="textarea" v-model="checkData.remark"></el-input>
                                </el-form-item>
                                <div style="margin: 0 0 5px 148px;">
                                    <el-button size="mini" @click.native="close_remark">关闭</el-button>
                                </div>
                            </el-form>
                        </div>
                    </el-col>
                </div>
            </el-card>
            </el-col>
        </el-row>
        <div slot="footer">
            <el-button size="mini" class="p-changeButs" type="primary" @click.native="update(btn)"
                       v-for="btn in processBtns" :key="btn.btn_name" v-if="markId!==1">{{btn.btn_name}}</el-button>
            <el-button size="mini" class="p-changeButs" type="primary" @click.native="close">关闭</el-button>
        </div>
    </page-dialog>
</template>
<style lang="stylus">
    .product-index{
        .p-changeBut{
            float: right;
            margin-bottom: 20px;
        }
        .p-changeButs{
            float: right;
            margin: 10px 5px 20px 5px;
        }
        .p-span_color{
            padding: 4px 12px;
            border:1px solid gainsboro;
        }
        .p-col_margin{
            margin-top: 10px;
            margin-left:60px
        }
        .operat-but{
            .remark-card{
                width:190px;
                border:1px solid #ddd;
                border-radius: 5px;
                background: #fff;
                padding:0 5px;
            }
        }
    }
</style>
<script>
    import productInfo from './product-info.vue'; //-----产品信息引入
    import supplierInfo from './supplier-info.vue'; //-----供应商信息引入
    import specificationInfo from './specification-info.vue'; //-----规格参数信息引入
    import attributesInfo from './attributes-info.vue'; //-----属性信息引入
    import remarkInfo from './remark-info.vue'; //-----备注信息引入
    import {product_tag,product_check,product_update,product_add,product_processBtn,product_process,platform_list,api_add_note} from '../../../api/product_create';//------引入接口文件
    export default{
        page: {
            multiple: true,
        },
        data(){
            return{
                loading:false,
                markId:0,//----标示id
                id:0,//---产品id
                categoryId:0,
                processBtns:[{btn_name:'保存',code:0},{btn_name:'等待审核',code:16},{btn_name:'备注',code:-1}],//--流程按钮
                //------------参数
                checkData:{
                    category:'',
                    name:'',
                    brand_id:'',
                    tort_id:1,
                    retail_price:'',
                    tags:[],
                    properties:[],
                    declare_name:'',
                    declare_en_name:'',
                    hs_code:'',
                    depth:0,
                    width:0,
                    height:0,
                    volume_weight:0,
                    weight:0,
                    net_weight:0,
                    is_packing:'',
                    packing_id:'',
                    unit_id:'',
                    warehouse_id:'',
                    is_multi_warehouse:'',
                    platform_sale:[],
                    source_url:[],
                    description:'',
                    supplier:{price:0,warehouse_id:'',balance_type:''},
                    specification:[],
                    skus:{
                        headers:[],
                        lists:[],
                    },
                    attributes:[],
                    remark:''
                },
                tampSku:[],
                modifySkuArr:[],//-----------修改sku列表临时存储下标数组
                showRemark:false,
                heightRect:{},
                dialog:false,
                pageTitle:""
            }
        },
        mounted(){
                this.markId=this.public.markId;
                this.id=this.public.id;
                this.dialog = this.value;
        },
        watch:{
            "public.value"(val){
                if(val){
                    this.$nextTick(()=>{
                        this.$refs.productForm.get_categories(val);
                    })
                }
            },
            dialog(val){
                this.$emit("input",val)
            },
            value(val){
                this.dialog = val;
            },
        },
        methods:{
            //添加备注
//            初始化数据
            init(){
                switch(this.public.markId){
                    case 1:
                        this.$set(this,'pageTitle','查看产品');
                        break;
                    case 2:
                        this.$set(this,'pageTitle','编辑产品');
                        break;
                    default:
                        this.$set(this,'pageTitle','创建产品');
                }
                if(this.public.markId){//----------查看
                    this.loading=true;
                    this.$http(product_check,this.public.id).then(res=>{
                        this.loading=false;
                        if(res.skus.lists.length>0){
                            res.skus.lists.forEach((item,i)=>{
                                if(item.enabled){
                                    this.tampSku.push(item.id)
                                }
                            });
                        }
                        res.brand_id = res.brand_id==0 ? '': res.brand_id;
                        res.packing_id = res.packing_id==0 ? '': res.packing_id;
                        res.unit_id = res.unit_id==0 ? '': res.unit_id;
                        res.warehouse_id = res.warehouse_id==0 ? '': res.warehouse_id;
                        res.supplier.warehouse_id = res.supplier.warehouse_id==0 ? '': res.supplier.warehouse_id;
                        res.supplier.balance_type = res.supplier.balance_type==0 ? '': res.supplier.balance_type;
                        if(res.supplier instanceof Array){//目前后端供应商数据只返回数组形的空，并且里面的字段的值都是undefined
                            res.supplier = {
                                supplier_id:'',
                                company_name:'',
                                price:'',
                                warehouse_id:'',
                                delivery_days:'',
                                min_quantity:'',
                                tel:'',
                                balance_type:'',
                                contacts:"",
                                link:"",
                                address:"",
                                shipping_method_id:''
                            }
                        }
                        this.checkData = res;
                        this.checkData.specification.forEach((row)=>{
                            this.$set(row,'addValue','');
                            row.attribute_value.forEach((res)=>{
                                this.$set(res,'showUserDefined',false);
                            })
                        });
                        if(res.process_id===1){
                            this.processBtns=[{btn_name:'保存',code:0},{btn_name:'备注',code:-1}]
                        }else{
                            this.processBtns=[{btn_name:'备注',code:-1}]
                        }
                        this.$http(product_processBtn,res.process_id).then(res=>{
                            res.forEach(data=>{
                                this.processBtns.push(data);
                            })
                        }).catch(code=>{this.$message({message:code.message||code,type:'error'})})
                    }).catch(code=>{
                        this.$message({message:code.message||code,type:'error'});
                    });
                }else{
                    this.checkData={ //-----清空
                        category:'',
                        name:'',
                        brand_id:'',
                        tort_id:1,
                        retail_price:'',
                        tags:[],
                        properties:[],
                        declare_name:'',
                        declare_en_name:'',
                        hs_code:'',
                        depth:0,
                        width:0,
                        height:0,
                        volume_weight:0,
                        weight:0,
                        net_weight:0,
                        is_packing:'',
                        packing_id:'',
                        unit_id:'',
                        warehouse_id:'',
                        is_multi_warehouse:0,
                        platform_sale:[],
                        source_url:[],
                        description:'',
                        supplier:{price:0,warehouse_id:'',balance_type:''},
                        specification:[],
                        skus:{},
                        attributes:[],
                        remark:''
                    };
                    /*------------销售状态初始化*/
                    this.get_platform_list();
                    this.processBtns=[{btn_name:'保存',code:0},{btn_name:'等待审核',code:16},{btn_name:'备注',code:-1}] //--流程按钮
                }
            },
            /*------关闭按钮*/
            close(){
                this.dialog = false;
            },
            changeInput(index){ //-----修改sku列表中的input框时change事件
                if(this.modifySkuArr.indexOf(index)===-1){
                    this.modifySkuArr.push(index)
                }
            },
            close_remark(){
                this.showRemark=false;
                this.checkData.remark='';
            },
            update(data){//------不同按钮不同操作
                if(data.code===0){ //---保存
                    this.updateFun(data.code)
                }else if(data.code===16){ //--等待审核
                    this.updateFun(data.code);
                }else if(data.code==='submit'){//--提交审核
                    this.updateFun(16);
                }else if(data.code===-1){//---备注
                    this.showRemark=true;
                }else{
                    if(this.checkData.remark===undefined){//---备注信息
                        this.checkData.remark=''
                    }
                    if(data.remark&&(this.checkData.remark===undefined||this.checkData.remark==='')){
                        this.showRemark=true;
                        this.$message({
                            showClose: true,
                          type:"error",
                            message: '备注信息为必填项'
                        });
                        return
                    }
                    let processData={
                        code:data.code,
                        remark:this.checkData.remark
                    };
                    this.$confirm('此操作为'+data.btn_name+'，确认此操作吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$http(product_process,this.public.id,processData).then(res=>{
                            this.$message({
                                showClose: true,
                              type:"success",
                                message: res.message || res
                            });
                            this.$emit("update");
                            this.dialog = false;
                        }).catch(code=>{this.$message({message:code.message||code,type:'error'})})

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                }

            },
            updateFun(process_id){ //---------提交时封装的函数
                if(!this.checkData.name){
                    return this.$message({type:"warning",message:'产品名称 为必填项，请完善信息！'});
                }
                if(!this.checkData.retail_price){
                    return this.$message({type:"warning",message:'产品最低限价 为必填项，请完善信息！'});
                }
                if(!this.checkData.description){
                    return this.$message({type:"warning",message:'产品描述 为必填项，请完善信息！'});

                }
                if(this.checkData.is_packing===''){
                    return this.$message({type:"warning",message:'产品是否自带包装 为必填项，请完善信息！'});

                }
                if(!this.checkData.supplier.company_name){
                    return this.$message({type:"warning",message:'供应商 为必填项，请完善信息！'});

                }
                if(!this.checkData.supplier.price){
                    return this.$message({type:"warning",message:'采购价 为必填项，请完善信息！'});

                }
                if(!this.checkData.supplier.delivery_days){
                    return this.$message({type:"warning",message:'预估交期 为必填项，请完善信息！'});

                }
                if(!this.checkData.supplier.min_quantity){
                    return this.$message({type:"warning",message:'最小起订量 为必填项，请完善信息！'});

                }
                if(!this.checkData.supplier.warehouse_id){
                    return this.$message({type:"warning",message:'交期仓库 为必填项，请完善信息！'});

                }

                if(!this.checkData.properties.find(row=>row.enabled)){
                    this.$message('带*号的为必填项，请完善信息！');
                    return
                }
//                 if(this.checkData.declare_name && !/^[\u4e00-\u9fa5]*$/.test(this.checkData.declare_name)){
//                    this.$message('商品中文报关名称输入有误，请重新输入！');
//                    return
//                }
//                if(this.checkData.declare_en_name && !/^[A-Za-z ]+$/.test(this.checkData.declare_en_name)){
//                    this.$message('商品英文报关名称输入有误，请重新输入！');
//                    return
//                }
                let newCheckData = window.clone(this.checkData);
                if(!!this.public.value){
                      newCheckData.category_id = this.public.value;
                }
                /*-----物流属性*/
                let propertiesList=[];
                this.checkData.properties.forEach(data=>{
                    if(data.enabled){
                        propertiesList.push({field:data.field,value:data.value})
                    }
                });
                newCheckData.properties=propertiesList;

                /*-----体积计算*/
                this.$set(newCheckData,"volume_weight",this.$refs.productForm.volume_weight);
//                newCheckData.volume_weight = this.$refs.productForm.volume_weight;
                /*-------销售状态*/
                newCheckData.platform_sale = this.checkData.platform_sale.map(data=> {
                    return {name: data.name, value_id: data.value_id}
                });
                /*sku列表*/
                if (newCheckData.skus.lists) {
                    let skuList = [];
                    newCheckData.skus.lists.forEach((data, i)=> {
                        if (this.tampSku.indexOf(data.id) === -1 && data.enabled) {
                            skuList.push({sub: i, action: 'add'})
                        } else if (this.tampSku.indexOf(data.id) > -1 && !data.enabled) {
                            skuList.push({sub: i, action: 'del'})
                        } else if (this.tampSku.indexOf(data.id) > -1 && data.enabled && this.modifySkuArr.indexOf(i) > -1) {
                            skuList.push({sub: i, action: 'modify'})
                        }
                    });
                    let tampSkuList = [];
                    this.checkData.skus.lists.forEach((item, i)=> {
                        skuList.forEach(res=> {
                            if (res.sub === i) {
                                let attrs = [];
                                this.checkData.skus.headers.forEach(data=> {
                                    attrs.push({
                                        attribute_id: item[data.attribute_id].attribute_id,
                                        value_id: item[data.attribute_id].id
                                    })
                                });
                                tampSkuList.push({
                                    action: res.action,
                                    sku: item.sku,
                                    id: item.id,
                                    alias_sku: item.alias_sku,
                                    name: item.name,
                                    retail_price: item.retail_price,
                                    cost_price: item.cost_price,
                                    weight: item.weight,
                                    attributes: attrs,
                                });
                            }
                        });
                    });
                    newCheckData.skus = tampSkuList;
                }
                /*-------------------------sku列表end*/
                /*----------------规格参数*/
                let specification = this.checkData.specification.map(data=> {
                    if (data.type == 2) {
                        return {
                            type: data.type,
                            attribute_id: data.attribute_id,
                            attribute_value: data.attribute_value
                        }
                    } else {
                        let attr_val = [];
                        data.attribute_value.forEach(item=> {
                            if (item.selected) {
                                attr_val.push({id:item.id,value:item.value});
                            }
                        });
                        return {
                            type: data.type,
                            attribute_id: data.attribute_id,
                            attribute_value: attr_val
                        }
                    }
                });
                /*---------------------属性*/
                let attribute = [];
                this.checkData.attributes.forEach(item=> {
                    item.attributes.forEach(data=> {
                        if (data.enabled) {
                            if (data.type == 2) {
                                attribute.push({
                                    type: data.type,
                                    attribute_id: data.attribute_id,
                                    attribute_value: data.attribute_value
                                });
                            } else {
                                let args_val = [];
                                data.attribute_value.forEach(item=> {
                                    if (item.selected) {
                                        args_val.push({id:item.id,value:item.value})
                                    }
                                });
                                attribute.push({
                                    type: data.type,
                                    attribute_id: data.attribute_id,
                                    attribute_value: args_val
                                });
                            }
                        }
                    })
                });
                newCheckData.attributes = specification.concat(attribute);
                newCheckData.process_id = process_id;//-----流程id
                /*---------删除多余字段*/
                delete newCheckData.specification;
                delete newCheckData.warehouse;
                delete newCheckData.brand;
                delete newCheckData.tort;
                delete newCheckData.unit;
                delete newCheckData.package;
                delete newCheckData.category;
                if (this.public.markId === 2) {
                    this.$http(product_update, this.checkData.id, newCheckData).then(res=> {
                        this.$message({
                            type:"success",
                            showClose: true,
                            message: res.message
                        });
                        this.$emit("update");
                        this.dialog = false;
                    }).catch(code=> {
                        this.$message({message:code.message,type:'error'});
                    })
                } else {
                    this.$http(product_add, newCheckData).then(res=> {
                        this.$message({
                            type:"success",
                            showClose: true,
                            message: res.message
                        });
                        this.$emit("update");
                        this.dialog = false;
                    }).catch(code=> {
                        this.$message({message:code.message,type:'error'});
                    })
                }
            },
            get_platform_list(){
                this.$http(platform_list).then(res=>{
                    this.checkData.platform_sale=res;
//                    默认显示为必须上架
                    this.checkData.platform_sale.forEach(row=>{
                        row.value_id=1;
                    })
                }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            }

        },

        props:{
            value:{},
            public:{
                required:true,
                type:Object
            }
        },
        computed:{
        },
        components:{
            productInfo,
            supplierInfo,
            specificationInfo,
            attributesInfo,
            remarkInfo,
            pageDialog:require("../../../components/page-dialog.vue").default
        }
    }
</script>
