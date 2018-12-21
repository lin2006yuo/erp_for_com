<template>
    <page-dialog title="快速抓取速卖通订单"
                 v-model="show"
                 @change="open"
                 size="small"
                 :close-on-click-modal="false">
        <el-form :model="form"
                 label-width="100px"
                 ref="form"
                 :rules="rules"
                 class="c-grab-aliexpress">
            <el-form-item label="账号简称："
                          prop="account_id">
                <param-account
                        v-model="form.account_id"
                        type="shopeeAccount"
                        url="get|orders/account?channel_id=4"
                        :refresh="true"
                        :fixResult="fixAccount"
                        placeholder="请输入帐号简称"
                        class="mr-sm s-width-middle">
                </param-account>
            </el-form-item>
            <el-form-item label="订单号："
                          prop="order_id">
                <order-input v-model="form.order_id"
                             class="inline "
                             style="width:220px"
                             placeholder="请输入订单号,Shift+回车可以输入多个">
                </order-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <request-button req-key="aliexpressGrabDialog"
                            @click.native="submit">确 定
            </request-button>
            <el-button size="mini"
                       @click.native="show = false"
                       class="inline">取消</el-button>
        </div>
    </page-dialog>
</template>

<style lang="stylus">
    .c-grab-aliexpress{
        margin-top:20px;
        min-height:140px
    }
</style>

<script>
    import paramAccount from '@/api-components/param-account.vue';
    import orderInput from '@/components/order-input.vue';
    import requestButton from '@/global-components/request-button'
    export default {
        name: "grab-order-dialog",
        data() {
            return {
                show:this.value,
                rules:{
                    account_id:[{required:true,message:'请选择账号简称',trigger:'blur',type:'number'}],
                    order_id:[{required:true,message:'请输入订单号',trigger:'blur'}],
                }
            }
        },
        watch: {
            show(val){
                this.$emit('input',val);
            },
            value(val){
                this.show = val;
            },
        },
        methods: {
            open(isOpen){},
            fixAccount(res){
                return res.account.map(row =>{
                    return{label:row.label,value:row.value}
                })
            },
            submit(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.$emit('grab');
                    }else{
                        console.log(1111);
                        this.$reqKey('aliexpressGrabDialog', false);
                    }
                });
            }
        },
        props: {
            value:{},
            form:{}
        },
        components: {
            paramAccount,
            orderInput,
            requestButton
        },
    }
</script>

