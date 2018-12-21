<template>
        <el-row class="c-provider-info roll-height">
            <div>
                <el-col :span="24">
                <label class="box-label">{{label}}</label>
                <el-form label-width="120px" :model="supplierForm" ref="supplierForm" :rules="rules">
                    <!--<el-form-item label="采购员：" >-->
                        <!--<el-select class="inline" v-model="supplierForm.purchaser_id" placeholder="请选择" v-if="supplierEdit">-->
                            <!--<el-option-->
                                    <!--v-for="item in purchasers"-->
                                    <!--:key="item.id"-->
                                    <!--:label="item.realname"-->
                                    <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                        <!--<span v-else>{{supplierForm.purchaser}}</span>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item  v-for="(item,index)  in supplierForm.supplier"-->
                                   <!--:key="index"-->
                                   <!--:label="item.is_default===1?'默认供应商：':'供应商：'"-->
                    <!--&gt;-->
                    <div v-for="(item,index)  in supplierForm.supplier" class="mb-sm">
                        <!--<el-row class="mb-sm">-->
                        <el-form-item label="供应商：" prop="supplier_id">
                            <span v-if="!supplierEdit">{{item.company_name}}</span>
                            <supplier v-else class="inline width-super ml-sm" v-model="item.supplier_id"></supplier>
                            <!--<el-button size="mini" type="success" v-if="item.is_default!==1&&supplierEdit" class="inline ml-lg" @click="set_provider(item,index)">设置为默认供应商</el-button>-->
                        <!--</el-row>-->
                        </el-form-item>
                        <el-table
                                :data="item.skus"
                                style="width: 100%"
                                highlight-current-row
                        >
                            <el-table-column
                                    inline-template
                                    label="图片"
                                    width="50">
                                <span><img :src="row.thumb" height="26px" width="26px"></span>
                            </el-table-column>
                            <el-table-column
                                    prop="sku"
                                    label="SKU"
                                    width="180">
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="链接"
                                    width="80">
                                <span>无字段</span>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="最新报价(CNY)"
                                    width="80">
                                <span>无字段</span>
                            </el-table-column>
                            <el-table-column
                                    prop="price"
                                    label="本次报价(CNY)"
                                    width="80">
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="区间报价"
                                    width="140">
                                <div>
                                    <div  v-for="price in row.section"  :key="price.price">
                                        <span>{{price.min_quantity}}</span>-<span>{{price.max_quantity}}</span> /
                                        <span>{{price.price}}</span>
                                    </div>
                                </div>
                            </el-table-column>
                            <el-table-column
                                    inline-template
                                    label="仓库/交货周期"
                            >
                                <div>
                                    <div  v-for="day in row.cycle"  :key="day.warehouse_name">
                                        <span>{{day.warehouse_name}}</span>/ <span>周期：{{day.delivery_days}}</span>
                                    </div>
                                </div>
                            </el-table-column>
                        </el-table>
                    <!--</el-form-item>-->
                    </div>
                </el-form>
            </el-col>
                <el-col style="margin-left:50px" :span="18">
                    <el-button  v-if="!supplierEdit" type="primary" size="mini" @click.native="edit">编辑</el-button>
                    <div v-else>
                        <el-button req-key='providerInfo' @click = "save">确定</el-button>
                        <el-button size="mini" @click.native = "cancel">取消</el-button>
                    </div>
                </el-col>
            </div>
        </el-row>
    </template>
    <style lang="stylus">
    </style>
    <script>
        import {api_get_purchase} from  "../../../api/product-library";
        import {plus,integer,phone} from '../../../define/validator_reg';
        export default{
            data(){
                let plusNumber = (rule,value,callback)=>{
                    if(value){
                        return !plus.test(value)?callback(new Error("请输入正数数字")):callback();
                    }else{
                        callback()
                    }
                };
                let checkInteger = (rule,value,callback)=>{
                    if(value){
                        return !integer.test(value)?callback(new Error("请输入非负整数")):callback();
                    }else{
                        callback()
                    }
                };
                let checkPhone = (rule,value,callback)=>{
                    if(value){
                        return !phone.test(value)?callback(new Error("号码格式有误，请重新输入！")):callback();
                    }
                }
                return{
                    purchasers:[],
                    rules:{
                        supplier_id:[
                            {required: true, message: '供应商不能为空', trigger: "blur",type:'number'}
                        ],
//                        price:[
//                            {required: true, message: "采购价不能为空",trigger: "blur"},
//                            {validator:plusNumber,trigger:"blur"}
//                        ],
//                        delivery_date:[
//                            {required: true, message: "采购交期为必填项",trgger: "change"},
//                            {validator:checkInteger,trigger:"blur"}
//                        ],
//                        min_quantity:[
//                            {required: true, message: "采购量为必填项",trgger: "blur,change"},
//                            {validator:checkInteger,trigger:"blur"}
//                        ],
//                        tel:[
//                            {validator:checkPhone,trigger:"blur"}
//                        ]
                    }
                }
            },
            created(){
                this.get_purchasers();
            },
            methods:{
//                ------------------------------  获取采购员
                get_purchasers(){
                    this.$http(api_get_purchase,{content:""}).then(res=>{
                        this.purchasers=res;
                    }).catch(code=>{
                        console.log(code)
                    })
                },
//                设置为默认供应商
                set_provider(item ,index){
                    this.supplierForm.supplier.forEach(row=>{
                        row.is_default=0
                    });
                    item.is_default=1;
                    this.supplierForm.supplier.splice(index,1);
                    this.supplierForm.supplier.unshift(item)
                },
//                ------------------------------  编辑
                edit(){
                    this.$emit("edit");
                },
//                ------------------------------  保存
                save(id){
                    this.$refs.supplierForm.validate((bool)=>{
                        if(bool){
                            this.$emit("save")
                        }else{
                            setTimeout(() => {
                                this.$reqKey('providerInfo', false);
                            }, 300)
                        }
                    })
                },
//                ------------------------------  取消
                cancel(){
                    this.$emit("cancel");
                },
            },
            props:{
                label:{
                    required:true,
                    type:String
                },
                supplierEdit:{
                    reqired:true,
                    type:Boolean,
                },
                supplierForm:{
                    reqired:true,
                    type:Object,
                }
            },
            components:{
                uiInput:require('../../../components/ui-input.vue').default,
                supplier:require('../../../api-components/supplier.vue').default,
            }
        }
    </script>
