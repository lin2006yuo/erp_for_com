<template>
        <page-dialog title="抓取平台订单"
                     v-model="addFormVisible"
                     center>
            <el-form :model="addData"
                     :rules="rules"
                     label-width="190px"
                     ref="addData"
                     style="margin-top:20px;height:140px">
                <el-form-item label="账号简称：" prop="account_id">
                    <el-col :span="12">
                        <super-select
                            storageKey="order_account"
                            v-model="addData.account_id"
                            :placeholder="'请输入帐号简称'"
                            class="mr-sm s-width-middle"
                            :is-paging="true"
                            :adjustStructure="sale_fix_result"
                            :remoteRequestHttp="remoteRequestHttp"
                        ></super-select>
                            <!--<param-account-->
                                <!--v-model="addData.account_id"-->
                                <!--type="shopeeAccount"-->
                                <!--url="get|orders/account?channel_id=8"-->
                                <!--:refresh="true"-->
                                <!--:fixResult="fixAccount"-->
                                <!--placeholder="请输入帐号简称"-->
                                <!--class="mr-sm s-width-middle">-->
                            <!--</param-account>-->
                    </el-col>
                </el-form-item>
                <el-form-item label="订单号：" prop="order_id">
                    <el-col :span="10">
                        <order-input v-model="addData.order_id"
                                     class="inline "
                                     style="width:220px"
                                     placeholder="请输入订单号,Shift+回车可以输入多个">
                        </order-input>
                    </el-col>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click.native="addFormVisible = false">取 消</el-button>
                <request-button req-key="lookFormAddYmx" @click="add_ymx">确 定</request-button>
            </div>
        </page-dialog>
</template>
<style lang="stylus">
</style>
<script>
    import {http} from '../../../../lib/http-plus';
    export default{
        data(){
            return{
                addFormVisible:this.value,
                rules:{
                    account_id:[
                        {required: true, message: '请选择账号简称', trigger: 'change',type:'number'}
                    ],
                    order_id:[
                        {required: true, message: '请输入订单号', trigger: 'blur'}
                    ],
                }
            }
        },
        created(){},
        methods:{
            remoteRequestHttp(){
                return http("get|orders/account?channel_id=8")
            },
            sale_fix_result(res){
                let data=res.account.map(row =>{
                    return{
                        label:row.label,
                        value:row.value
                    }
                });
                return {
                    count:data.length,
                    data:data
                }
            },
            fixAccount(res){
              return res.account.map(row =>{
                  return{
                      label: row.label,
                      value: row.value
                  }
              })
            },
            add_ymx(){//-------------点击保存
                this.$refs.addData.validate((bool)=>{
                    if(bool){
                        this.$emit('add_ymx');//-------事件抛出
                    }else{
                        this.$reqKey('lookFormAddYmx', false);
                    }
                });
            },
        },
        computed:{},
        watch:{
            addFormVisible(val){
              this.$emit('input',val);
            },
            value(val){
                this.addFormVisible = val;
            }
        },
        props:{
            addData:{
                required:true,
                type:Object
            },
            addEditSiteList:{
                required:true,
                type:[Array]
            },
            value:{
                type:Boolean,
                required:true
            },
        },
        components:{
            pageDialog:require('@/components/page-dialog.vue').default,
            requestButton:require('../../../../global-components/request-button').default,
            orderInput:require('../../../../components/order-input.vue').default,
            paramAccount:require('../../../../api-components/param-account.vue').default,
        }
    }
</script>
