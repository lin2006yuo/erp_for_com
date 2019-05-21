<template>
    <el-row class="p-bind-paypal">
        <page-dialog :title="`给账户：${paypaltwo.account_name} 绑定paypal`" v-model="payVisible"
                     @close="close_paypal"   :close-on-click-modal="false"  >
            <el-form :model="paypaltwo" ref="form">
                <el-form-item label="eBay销售账户：" label-width="150px">
                    <div style="text-align: left">{{paypaltwo.account_name}}</div>
                </el-form-item>
                <el-form-item  label="大额Paypal收款账户：" label-width="150px">
                    <add-paypal-account v-model="paypaltwo.max_paypal_id"></add-paypal-account>
                </el-form-item>
                <el-form-item  label="小额Paypal收款账户：" label-width="150px">
                    <add-paypal-account v-model="paypaltwo.min_paypal_id"></add-paypal-account>
                </el-form-item>
                <el-form-item label="小额收款条件：" label-width="150px">
                    <div v-if="paypaltwo.currency.length!==0" >
                    <el-row v-for="(item,index) in  paypaltwo.currency" :key="index" class="mb-xs">
                        <span>小于</span>
                        <ui-limit-number
                                class="inline width-xs"
                                v-model="item.count"
                                :limit="2">
                        </ui-limit-number>
                        <el-select v-model="item.code"
                                   filterable
                                   class="inline width-xs">
                            <el-option   v-for="pays in payments"
                                         :label="pays.label"
                                         :value="pays.value"
                                         :disabled="pays.disable"
                                         :key="pays.value"
                            ></el-option>
                        </el-select>
                        <el-button type="primary"
                                   class="inline"
                                   @click="delete_currency(index)"
                                   size="mini" v-if="paypaltwo.currency.length!==1" >删除</el-button>
                        <el-button type="primary"
                                   class="inline"
                                   @click="add_currency"
                                   size="mini"
                                   v-if="index===(paypaltwo.currency.length-1)">添加</el-button>
                    </el-row>
                    </div>
                    <el-row v-else>
                        <el-button type="primary" size="mini" @click="add_currency" > 添加</el-button>
                    </el-row>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <request-button req-key='bindMypay' @click="bind_mypay">绑 定</request-button>
                <el-button @click= " closeitem "  size="mini">取 消</el-button>
            </div>
        </page-dialog>
    </el-row>
</template>
<style lang="stylus">
</style>
<script>
    import pageDialog from "../../../../components/page-dialog.vue"
    import  selectQuery from  './select-query.vue'
    import {account_ebay_mypay,account_ebay_paypal} from '../../../../api/account-ebay'  //引入绑定账号接口
    import {api_get_currency} from "../../../../api/handwork"
    export default{
        data(){
            return{
                payVisible:false,
                payment:[],
                typeList:[
                    {label:'本地仓',value:1},
                    {label:'海外仓',value:2},
                ],
            }
        },
        created(){
        this.get_currency();
        },
        computed:{
            payments(){
              return  this.payment.map(row=>{
                    let find=this.paypaltwo.currency.find(item=>{
                        return item.code===row.value;
                    })
                    row.disable=!!find;
                    return row
                })
            }
        },
        methods:{
            delete_cur(val,index){
                val.splice(index,1);
            },
            add_more(val){
                let obj = {id:"",type:""};
                val.push(obj);
            },
            paypal_fix_result(res){
                return res.data.map(item=>{
                    return{
                        value:item.id,
                        label:item.account_name
                    }
                });
            },
            get_currency(){
              this.$http(api_get_currency).then(res=>{
                this.payment=res.map(row=>{
                    return {label:row.name,value:row.code}
                });
              }).catch(code=>{
                  console.log(code)
              })
            },
            closeitem(){
                this.payVisible = false;
            },
            delete_currency(index){
                this.paypaltwo.currency.splice(index,1)
            },
            add_currency(){
                let find = this.paypaltwo.currency.find(row=>!row.code||!row.count);
                if(!!find) return this.$message({type:"warning",message:"小额收款条件有未填项,请先补充完整"});
                this.paypaltwo.currency.push({code:"",count:''})
            },
            //绑定pay 请求数据
            bind_mypay(){
                let data=window.clone(this.paypaltwo);
                data.max_paypal_id = data.max_paypal_id.filter(row=>!!row.id);
                data.min_paypal_id = data.min_paypal_id.filter(row=>!!row.id);
                let find1 = data.max_paypal_id.find(row=>row.id&&!row.type);
                let find2 = data.min_paypal_id.find(row=>row.id&&!row.type);
                if(!!find1){
                    this.$reqKey('bindMypay', false);
                    return this.$message({type:"warning",message:"大额Paypal收款账户，数据不完整，请补充！"});
                }
                if(!!find2){
                    this.$reqKey('bindMypay', false);
                    return this.$message({type:"warning",message:"小额Paypal收款账户，数据不完整，请补充！"});
                }
                data.max_paypal_id = JSON.stringify(data.max_paypal_id);
                data.min_paypal_id = JSON.stringify(data.min_paypal_id);
                let currency={};
                let list = data.currency.filter(it=>it.count!==''&&it.code!=='');//为空的小额收款条件数据不予提交
                if(list.length>0){
                    list.forEach(row=>{
                        if(!row.code||!row.count) return;
                        currency[row.code]=row.count;
                    });
                }
                data.currency=currency;
                this.$http(account_ebay_mypay,data).then(res=>{
                    this.$message({
                        type: 'success',
                        message:res.message||res,
                    });
                    this.payVisible = false;
                    this.$emit("paypalupdata")
                }).catch(code=>{
                    this.$message({type:'error',message:code.message||code});
                }).finally(()=>{
                    setTimeout(() => {
                        this.$reqKey('bindMypay', false);
                    }, 300)
                });
            },
            close_paypal(){
                this.paychooes="USD"
            }
        },
        watch:{
            payVisible(val){
                this.$emit('input',val);
            },
            value(val){
                this.payVisible = val;
            },
        },
        props:{
            paypaltwo:{
                required:true,
                type:Object
            },
            value:{
            }
        },
        components:{
            selectQuery,
            pageDialog,
            paramAccount:require('../../../../api-components/param-account.vue').default,
            addPaypalAccount:require('./add-paypal-account.vue').default,
            uiLimitNumber:require('../../../../components/ui-limit-number.vue').default,
        }
    }
</script>
