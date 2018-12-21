<template>
    <div class="c-logistics-message">
        <span @click="click_button">
            <el-button class="mb-sm" type="primary" size="mini" @click.native="add_logistics" :disabled="isShow">请选择邮寄方式</el-button>
        </span>
        <el-row>
            <el-col :span="12">
                <el-form label-width="75px" :model="form" ref="logistics" :rules="rules">
                    <div style="display:flex">
                        <el-form-item label="选好后：" style="flex:1" :required="true">
                            <el-input class="inline width-super" v-model="shipping_name" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="估计运费：" prop="estimated_fee" style="flex:1" :required="true">
                            <el-input class="inline" v-model="form.estimated_fee" :disabled="true"></el-input>
                        </el-form-item>
                    </div>
                </el-form>
            </el-col>
        </el-row>
        <add-logistics v-model="dialog" :id="form.warehouse_id" @add="add_new_logistics" :ship-list="shipList"></add-logistics>
    </div>
</template>
<style lang="stylus">
    .c-logistics-message{
        .el-form-item__label{
            font-weight:bold;
        }
    }
</style>
<script>
    import {plus} from '../../../define/validator_reg';
    import {api_get_ship} from '../../../api/handwork';
    export default{
        data(){
            let checkNumber = (rules,value,callback)=>{
                if(value){
                    return !plus.test(value)?callback(new Error("请输入数字！")):callback()
                }else{
                    callback();
                }
            }
            return {
                dialog:false,
                shipping_name:"",
                shipList:[],
                rules:{
                    estimated_fee:[
                        {validator:checkNumber,trigger:"change"}
                    ]
                }
            }
        },
        computed:{
            isShow(){
                if(this.form.warehouse_id&&this.form.country_code&&this.form.consignee&&this.form.address&&this.form.city&&this.form.province&&this.form.tel&&this.form.country_code&&this.form.goods.length>0){
                    if(this.form.goods.findRet(row=>row.sku_quantity==='0')){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return true;
                }
            }
        },
        methods:{

            submit(){
              let flag = false;
              this.$refs.logistics.validate((b)=>{
                  if(b){
                      flag = true;
                  }
              })
                return flag;
            },
            click_button(){
                let cur = this.form.goods.find(row=>row.sku_quantity==='0');
                if(this.form.goods.length<=0||!this.form.warehouse_id||!this.form.country_code||!this.form.consignee||!this.form.address||!this.form.city||!this.form.province||!this.form.tel||!this.form.country_code){
                    return this.$message({type:"warning",message:"请完善订单商品，收货地址，仓库信息！"});
                }else if(cur){
                    this.$message({type:"warning",message:"存在订单商品数量为0，请更正！"});
                }
            },
            add_logistics(){
                this.dialog = true;
                let sku = [];
                this.form.goods.forEach((row)=>{
                    sku.push(row.sku_id);
                });

                let params = {
                    warehouse_id:this.form.warehouse_id,
                    country_code:this.form.country_code,
                    sku:sku,
                };

                this.get_shipping(params);
            },
            get_logistics(){
                console.log("get_logistics");
            },
            add_new_logistics(val){
                this.form.shipping_id = val.shipping_id;
                this.form.estimated_fee = val.cny_amount;
                this.shipping_name = val.shipping_method_name;
            },
            /*获取邮寄方式*/
            get_shipping(params){
                this.$http(api_get_ship,params).then(res=>{
                    this.shipList = res;
                    this.shipList.forEach((data)=>{
                        this.$set(data,'isCheck',false)
                    })
                }).catch(code=>{
                    console.log(code);
                })
            }
        },

        props:{
            form:{
                required:true,
                type:Object
            }
        },
        components: {
            addLogistics:require('./add-logistics.vue').default,
        }
    }
</script>