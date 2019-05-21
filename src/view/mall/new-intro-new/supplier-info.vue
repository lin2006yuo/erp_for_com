<template>
    <page class="p-supplier-info">
        <el-form :model="checkForm" :rules="rules" label-width="180px">
            <!--供应商-->
            <card label="供应商信息">
                <el-form-item label="供应商：" required>
                    <span  class="check-color" v-if="markId===1">{{checkForm.supplier.company_name}}</span>
                    <div v-else>
                        <el-input  v-model="checkForm.supplier.company_name" style="width:16%;display: inline-block;" v-if="isEdit" ></el-input>
                        <scroll-select v-model="scrollObj" @choose="choose_supplier" style="width:16%;display: inline-block; vertical-align: bottom;" textAlign="left" :remote="url" :fix-params="fix_params" v-else></scroll-select>
                        <el-button type="primary" size="mini"  @click="add_supplier" v-if="!isEdit">新增</el-button>
                        <el-button type="primary" size="mini"  @click="cancel_supplier" v-if="isEdit"> 取消</el-button>
                    </div>
                </el-form-item>
                <div>
                    <el-form-item label="采购价：" required class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.price}}</span>
                        <el-input-number v-model="checkForm.supplier.price" :min="0" style="width:150px" v-else></el-input-number>
                        <!--<el-input  type="number" v-model="checkForm.supplier.price"  min="0" style="width:200px" v-else></el-input>-->
                    </el-form-item>

                    <el-form-item label="最小起订量：" required class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.min_quantity}}</span>
                        <input class="el-input__inner" style="width:150px" v-model="checkForm.supplier.min_quantity" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" type="number" min="0" v-else>
                    </el-form-item>

                    <el-form-item label="预估交期：" required class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.delivery_days}}</span>
                        <input class="el-input__inner" style="width:150px" v-model="checkForm.supplier.delivery_days" onkeyup="this.value=this.value.replace(/\D/g,'')" onafterpaste="this.value=this.value.replace(/\D/g,'')" type="number" min="0" v-else>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="供应商地址：" class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.address}}</span>
                        <el-input v-model="checkForm.supplier.address" style="width:483px"  :disabled="!isEdit" v-else></el-input>
                    </el-form-item>

                    <el-form-item label="交期仓库：" required class="inline">
                        <el-select v-model="checkForm.supplier.warehouse_id" style="width:150px" v-if="markId===1" disabled >
                            <el-option
                                    :key="item.id"
                                    v-for="item in warehouse"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                        <el-select v-model="checkForm.supplier.warehouse_id" style="width:150px" v-else>
                            <el-option
                                    :key="item.id"
                                    v-for="item in warehouse"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <div>
                    <el-form-item label="联系人：" class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.contacts}}</span>
                        <el-input v-model="checkForm.supplier.contacts" style="width:150px" :disabled="!isEdit" v-else></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式："  class="inline">
                        <span  class="check-color" v-if="markId===1">{{checkForm.supplier.tel}}</span>
                        <el-input  v-model="checkForm.supplier.tel"  style="width:150px" :disabled="!isEdit" v-else></el-input>
                    </el-form-item>

                    <el-form-item label="结款方式："  class="inline" >
                        <el-select v-model="checkForm.supplier.balance_type" style="width:150px" v-if="markId===1" disabled>
                            <el-option
                                    :key="item.label"
                                    v-for="item in balance_type"
                                    :label="item.name"
                                    :value="item.label">
                            </el-option>
                        </el-select>
                        <el-select v-model="checkForm.supplier.balance_type" style="width:150px" :disabled="!isEdit" v-else>
                            <el-option
                                    :key="item.label"
                                    v-for="item in balance_type"
                                    :label="item.name"
                                    :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>

                <el-form-item label="供应商链接：">
                    <span  class="check-color" v-if="markId===1">{{checkForm.supplier.link}}</span>
                    <el-input v-model="checkForm.supplier.link" style="width:520px" :disabled="!isEdit" v-else></el-input>
                </el-form-item>

                <el-form-item label="当地运输方式：">
                    <span class="check-color" v-if="markId===1">{{checkForm.supplier.shipping_method_id}}</span>
                    <el-select v-model="checkForm.supplier.shipping_method_id" style="width:200px" v-else>
                        <el-option
                                :key="item.value"
                                v-for="item in transports"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </card>
        </el-form>
    </page>
</template>
<style lang="stylus">
    .p-supplier-info{
        .check-color{
            color: rgb(0, 139, 206);
        }
        .card-label{
            margin-top:10px
        }
    }
</style>
<script>
    import card from '../../../components/card.vue';
    import {api_supplier,warehouse_type,api_balance_info} from '../../../api/product_create'
    export default{
        data(){
            return {
                url:'get|supplier-offer/supplier',
                isEdit:false,
                oldSupplier:{},//----保存编辑初始供应商信息
                warehouse:[],
                rules: {//------------------表单验证

                },
                transports:[],
                balance_type:[]
            }
        },
        created(){
        },
        mounted(){
            /*------------交期仓库*/
            this.$http(warehouse_type).then(res=>{
                this.warehouse=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
            //结算方式
            this.$http(api_balance_info).then(res=>{
                this.balance_type=res;
            }).catch(code=>{this.$message({message:code.message||code,type:'error'})});
        },
        methods: {
//            选择供应商
            choose_supplier(item){
                this.get_supplier(item.value);
            },
            fix_params({page,pageSize,keyword}){
                return {
                    page:page,
                    pageSize:pageSize,
                    content:keyword
                };
            },
            add_supplier(){//-------------------------新增供应商
                this.isEdit=true;
                this.oldSupplier=this.clone(this.checkForm.supplier);
                this.checkForm.supplier={//---------供应商信息需要传的参数清空
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
                };
            },
            cancel_supplier(){//----取消新增供应商时还原
                this.isEdit=false;
                this.checkForm.supplier=this.clone(this.oldSupplier);
            },
            //------------获取供应商信息
            get_supplier(val){
                this.$http(api_supplier,val).then(res=>{
                    if(res){
                        this.$set(this.checkForm.supplier,'tel',res.tel);
                        this.$set(this.checkForm.supplier,'contacts',res.contacts);
                        this.$set(this.checkForm.supplier,'address',res.address);
                        if(res.balance_type){
                            this.$set(this.checkForm.supplier,'balance_type',res.balance_type);
                        }else{
                            this.$set(this.checkForm.supplier,'balance_type',"");
                        }
                    }
                }).catch(code=>{
                    this.$message({message:code.message,type:'error'});
                })
            },
            //------------对象深度克隆
            clone(obj) {
                var o;
                if (typeof obj == "object") {
                    if (obj === null) {
                        o = null;
                    } else {
                        if (obj instanceof Array) {
                            o = [];
                            for (var i = 0, len = obj.length; i < len; i++) {
                                o.push(this.clone(obj[i]));
                            }
                        } else {
                            o = {};
                            for (var j in obj) {
                                o[j] = this.clone(obj[j]);
                            }
                        }
                    }
                } else {
                    o = obj;
                }
                return o;
            },
        },
        filters: {},
        watch: {
            /*--------------修改供应商时带出供应商的相关联系信息*/
            scrollObj(val){
                if(val.value){
                    this.get_supplier(val.value);
                }
            },
        },
        computed: {
            scrollObj:{
                get(){
                    return {
                        label: this.checkForm.supplier.company_name,
                        value: this.checkForm.supplier.supplier_id
                    }
                },
                set(val){
                    this.checkForm.supplier.company_name=val.label;
                    this.checkForm.supplier.supplier_id=val.value
                }
            }
        },
        props: {
            checkForm:{
                required:true,
                type:Object
            },
            markId:{},
        },
        components: {
            card,
            scrollSelect:require('../../../components/scroll-select.vue').default
        }
    }
</script>